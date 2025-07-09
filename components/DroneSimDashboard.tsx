 'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDrones } from '../hooks/useDrones';
import { useAgents } from '../hooks/useAgents';
import { Drone, DroneMission, Vector3, CHARGING_STATION, Agent } from '../types';
import * as THREE from 'three';
import * as fcl from "@onflow/fcl";
import { assignMissionOnChain, interactWithAgentOnChain } from "@/utils/flowAgent";

// FCL config for Flow testnet
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xAgentNPC", "0x90ba9bdcb25f0aeb");

// Helper to move drone toward a target
function moveToward(current: Vector3, target: Vector3, step: number): Vector3 {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const dz = target.z - current.z;
  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
  if (dist < step) return { ...target };
  return {
    x: current.x + (dx / dist) * step,
    y: current.y + (dy / dist) * step,
    z: current.z + (dz / dist) * step,
  };
}

// Helper to create a simple drone mesh (box body + 4 spinning propeller arms)
function createDroneMesh(drone: Drone, isFlying: boolean): THREE.Group {
  const group = new THREE.Group();
  // Body
  const bodyGeom = new THREE.BoxGeometry(3, 1, 3);
  const bodyMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  group.add(body);
  // Arms (propellers)
  const armGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
  const armMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const arms: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Mesh(armGeom, armMat);
    arm.position.set(
      Math.cos((i * Math.PI) / 2) * 2,
      0.5,
      Math.sin((i * Math.PI) / 2) * 2
    );
    arm.rotation.x = Math.PI / 2;
    group.add(arm);
    arms.push(arm);
  }
  // Color overlay by status
  let overlayColor = 0x00ff00;
  if (drone.status === 'charging') overlayColor = 0xffff00;
  if (drone.status === 'offline') overlayColor = 0xff0000;
  if (drone.status === 'in-mission') overlayColor = 0x00aaff;
  const overlayMat = new THREE.MeshBasicMaterial({ color: overlayColor, transparent: true, opacity: 0.3 });
  const overlay = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), overlayMat);
  group.add(overlay);
  // Attach arms to group for animation
  (group as any)._arms = arms;
  return group;
}

const missionTypeOptions = [
  { value: 'mapping', label: 'Mapping', color: 0x00ff00 },
  { value: 'delivery', label: 'Delivery', color: 0xffa500 },
  { value: 'surveillance', label: 'Surveillance', color: 0x0000ff },
  { value: 'custom', label: 'Custom', color: 0xff00ff },
];

const agentColors: Record<string, number> = {
  onchain: 0xff00ff,
  offchain: 0x00ffff,
  hybrid: 0xffa500,
};

const DroneSimDashboard: React.FC = () => {
  const { drones, missions, addDrone, addMission, assignMission, updateTelemetry, updateDrone, updateMission } = useDrones();
  const { agents, addAgent, updateAgent, performAction, tickAgents } = useAgents();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const droneMeshesRef = useRef<Record<string, THREE.Group>>({});
  const pathLinesRef = useRef<Record<string, THREE.Line>>({});
  // Track mission targets for each drone
  const [missionTargets, setMissionTargets] = useState<Record<string, Vector3>>({});
  const [missionForm, setMissionForm] = useState({
    type: 'mapping',
    description: '',
    reward: 10,
    targetX: 20,
    targetZ: 20,
  });
  const [user, setUser] = useState<{addr?: string} | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // FCL user subscription
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  // FCL transaction helpers
 // const assignMissionOnChain = async (droneAddress: string, missionId: string) => {
 //   setTxStatus("Assigning mission on-chain...");
  //  try {
   //   const txId = await fcl.mutate({
   //     cadence: `
    //      import AgentNPC from 0xAgentNPC
      //    transaction(drone: Address, missionId: String) {
      //      prepare(signer: AuthAccount) {
      //        let agent <- AgentNPC.createAgent()
       //       agent.assignMission(owner: signer.address, drone: drone, missionId: missionId)
        //      destroy agent
     //       }
    //      }
    //    `,
     //   args: (arg, t) => [arg(droneAddress, t.Address), arg(missionId, t.String)],
     //   proposer: fcl.currentUser().authorization,
     //   payer: fcl.currentUser().authorization,
     //   authorizations: [fcl.currentUser().authorization],
   //     limit: 100,
   //   });
   //   setTxStatus("Transaction sent: " + txId);
   //   fcl.tx(txId).subscribe(res => {
  //      if (res.status === 4) setTxStatus("Transaction sealed!");
  //    });
 //   } catch (e) {
 //     setTxStatus("Error: " + (e as Error).message);
   // }
  //};

  // Listen for contract events (optional, for real-time UI updates)
  useEffect(() => {
    const unsub1 = fcl.events("A.90ba9bdcb25f0aeb.AgentNPC.MissionAssigned").subscribe(event => {
      setTxStatus("Mission assigned on-chain: " + JSON.stringify(event));
    });
    const unsub2 = fcl.events("A.90ba9bdcb25f0aeb.AgentNPC.AgentInteracted").subscribe(event => {
      setTxStatus("Agent interaction on-chain: " + JSON.stringify(event));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add charging station
    const charger = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 32),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    charger.position.set(CHARGING_STATION.x, 1, CHARGING_STATION.z);
    scene.add(charger);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update drone meshes and path lines when drones or missions change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Remove old drone meshes
    Object.values(droneMeshesRef.current).forEach(mesh => scene.remove(mesh));
    droneMeshesRef.current = {};
    // Remove old path lines
    Object.values(pathLinesRef.current).forEach(line => scene.remove(line));
    pathLinesRef.current = {};
    // Add new drone meshes and path lines
    drones.forEach(drone => {
      const isFlying = drone.status === 'in-mission';
      const group = createDroneMesh(drone, isFlying);
      group.position.set(drone.location.x, drone.location.y + 2, drone.location.z);
      scene.add(group);
      droneMeshesRef.current[drone.id] = group;
      // Draw path to target if in-mission or returning to charge
      const mission = missions.find(m => m.id === drone.lastMissionId);
      let target: Vector3 | undefined = undefined;
      if (drone.status === 'in-mission' && mission && mission.target) target = mission.target;
      if (drone.status === 'charging') target = CHARGING_STATION;
      if (target) {
        const points = [
          new THREE.Vector3(drone.location.x, drone.location.y + 2, drone.location.z),
          new THREE.Vector3(target.x, 2, target.z),
        ];
        const pathGeom = new THREE.BufferGeometry().setFromPoints(points);
        const pathMat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(pathGeom, pathMat);
        scene.add(line);
        pathLinesRef.current[drone.id] = line;
      }
    });
  }, [drones, missions]);

  // Add propeller spin animation in the main animation loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      // Spin propeller arms for flying drones
      Object.entries(droneMeshesRef.current).forEach(([id, group]) => {
        const drone = drones.find(d => d.id === id);
        if (!drone) return;
        const isFlying = drone.status === 'in-mission';
        const arms = (group as any)._arms as THREE.Mesh[];
        if (arms) {
          arms.forEach((arm, i) => {
            if (isFlying) {
              arm.rotation.z += 0.3 + i * 0.05;
            }
          });
        }
      });
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [drones]);

  // Add agent meshes to the scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Remove old agent meshes
    scene.children.filter(obj => obj.userData.agentId).forEach(obj => scene.remove(obj));
    // Add new agent meshes
    agents.forEach(agent => {
      const color = agentColors[agent.type] || 0xffffff;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      mesh.position.set(agent.location.x, agent.location.y + 2.5, agent.location.z);
      mesh.userData.agentId = agent.id;
      scene.add(mesh);
    });
  }, [agents]);

  // Agent movement simulation (optional: random walk for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      agents.forEach(agent => {
        if (agent.status === 'active') {
          // Move agent randomly
          const dx = Math.random() * 4 - 2;
          const dz = Math.random() * 4 - 2;
          updateAgent(agent.id, {
            location: {
              x: agent.location.x + dx,
              y: agent.location.y,
              z: agent.location.z + dz,
            },
          });
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [agents, updateAgent]);

  // Realistic drone movement, battery, failure, charging, collision avoidance
  useEffect(() => {
    const interval = setInterval(() => {
      drones.forEach(drone => {
        // Collision avoidance: check for other drones within 5 units
        if (drone.status === 'in-mission' || drone.status === 'charging') {
          drones.forEach(other => {
            if (other.id !== drone.id && Math.abs(drone.location.x - other.location.x) < 5 && Math.abs(drone.location.z - other.location.z) < 5) {
              // Move slightly away
              updateTelemetry(drone.id, {
                timestamp: new Date().toISOString(),
                location: { ...drone.location, x: drone.location.x + 2 },
                altitude: 2,
                speed: 1,
                heading: 0,
                battery: drone.battery,
              });
            }
          });
        }
        // In-mission movement
        if (drone.status === 'in-mission' && drone.lastMissionId) {
          const mission = missions.find(m => m.id === drone.lastMissionId);
          if (!mission || !mission.target) return;
          // Simulate speed and battery drain by mission type
          let speed = 2, batteryDrain = 0.2, altitude = 2;
          if (mission.type === 'delivery') { speed = 3; batteryDrain = 0.4; altitude = 4; }
          if (mission.type === 'surveillance') { speed = 1.5; batteryDrain = 0.15; altitude = 8; }
          if (mission.type === 'custom') { speed = 2.5; batteryDrain = 0.3; altitude = 3; }
          const newLoc = moveToward(drone.location, mission.target, speed);
          updateTelemetry(drone.id, {
            timestamp: new Date().toISOString(),
            location: newLoc,
            altitude,
            speed,
            heading: 0,
            battery: Math.max(0, drone.battery - batteryDrain),
          });
          // If reached target, complete mission
          if (Math.abs(newLoc.x - mission.target.x) < 1 && Math.abs(newLoc.z - mission.target.z) < 1) {
            updateDrone(drone.id, { status: 'idle', lastMissionId: undefined });
            updateMission(mission.id, { status: 'completed', endTime: new Date().toISOString() });
            setMissionTargets(prev => {
              const copy = { ...prev };
              delete copy[drone.id];
              return copy;
            });
          } else if (drone.battery < 10) {
            // If battery low, go to charging
            updateDrone(drone.id, { status: 'charging' });
            updateMission(mission.id, { status: 'failed', endTime: new Date().toISOString() });
          }
        }
        // Charging logic
        if (drone.status === 'charging') {
          const atCharger = Math.abs(drone.location.x - CHARGING_STATION.x) < 1 && Math.abs(drone.location.z - CHARGING_STATION.z) < 1;
          if (!atCharger) {
            // Move toward charging station
            const newLoc = moveToward(drone.location, CHARGING_STATION, 2);
            updateTelemetry(drone.id, {
              timestamp: new Date().toISOString(),
              location: newLoc,
              altitude: 2,
              speed: 2,
              heading: 0,
              battery: drone.battery,
            });
          } else {
            // Recharge
            if (drone.battery < 100) {
              updateDrone(drone.id, { battery: Math.min(100, drone.battery + 2) });
            } else {
              updateDrone(drone.id, { status: 'idle' });
            }
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [drones, missions, updateTelemetry, updateDrone, updateMission]);

  // Mission creation form handlers
  const handleMissionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMissionForm({ ...missionForm, [e.target.name]: e.target.value });
  };
  const handleAddMission = () => {
    addMission({
      droneId: '',
      pilot: 'user_wallet',
      description: missionForm.description || `${missionForm.type} mission`,
      type: missionForm.type as DroneMission['type'],
      reward: Number(missionForm.reward),
      target: { x: Number(missionForm.targetX), y: 0, z: Number(missionForm.targetZ) },
    });
  };
  const handleAddDrone = () => {
    addDrone({
      owner: 'user_wallet',
      model: 'SimDrone X',
      status: 'idle',
      location: { x: 0, y: 0, z: 0 },
      battery: 100,
      isSimulated: true,
    });
  };
  const handleAssignMission = (drone: Drone, mission: DroneMission) => {
    assignMission(drone.id, mission.id);
    setMissionTargets(prev => ({ ...prev, [drone.id]: mission.target! }));
  };

  // UI handlers for agents
  const handleAddAgent = () => {
    addAgent({
      name: `Agent ${agents.length + 1}`,
      type: 'onchain',
      status: 'idle',
      location: { x: Math.random() * 80 - 40, y: 0, z: Math.random() * 80 - 40 },
    });
  };
  const handleMoveAgent = (agent: Agent) => {
    performAction(agent.id, {
      type: 'move',
      timestamp: new Date().toISOString(),
      details: { to: { x: agent.location.x + 10, y: 0, z: agent.location.z + 10 } },
    });
    updateAgent(agent.id, {
      status: 'active',
      location: { x: agent.location.x + 10, y: 0, z: agent.location.z + 10 },
    });
  };

  // Assign a pending mission to a drone by an agent
  const handleAgentAssignMission = async (agent: Agent, drone: Drone, mission: DroneMission) => {
    if (agent.type === 'onchain' && user) {
      setTxStatus("Assigning mission on-chain...");
      try {
        const txId = await assignMissionOnChain(drone.id, mission.id);
        setTxStatus("Transaction sent: " + txId);
        fcl.tx(txId).subscribe(res => {
          if (res.status === 4) setTxStatus("Transaction sealed!");
        });
      } catch (e) {
        setTxStatus("Error: " + (e as Error).message);
      }
    }
    performAction(agent.id, {
      type: 'assign-mission',
      targetId: drone.id,
      timestamp: new Date().toISOString(),
      details: { missionId: mission.id },
    });
    assignMission(drone.id, mission.id);
    updateAgent(agent.id, {
      status: 'active',
      metadata: {
        ...agent.metadata,
        lastAssigned: { droneId: drone.id, missionId: mission.id, time: new Date().toISOString() },
      },
    });
  };

  // Agent interacts with another agent
  const handleAgentInteract = async (agent: Agent, target: Agent) => {
    if (agent.type === 'onchain' && user) {
      setTxStatus("Interacting on-chain...");
      try {
        const txId = await interactWithAgentOnChain(target.id, `Agent ${agent.name} interacted with ${target.name}`);
        setTxStatus("Transaction sent: " + txId);
        fcl.tx(txId).subscribe(res => {
          if (res.status === 4) setTxStatus("Transaction sealed!");
        });
      } catch (e) {
        setTxStatus("Error: " + (e as Error).message);
      }
    }
    performAction(agent.id, {
      type: 'interact',
      targetId: target.id,
      timestamp: new Date().toISOString(),
      details: { message: `Agent ${agent.name} interacted with ${target.name}` },
    });
    updateAgent(agent.id, {
      status: 'active',
      metadata: {
        ...agent.metadata,
        lastInteraction: { with: target.id, time: new Date().toISOString() },
      },
    });
  };

  // Autonomous agent AI tick: let agents act every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      tickAgents(drones, missions, agents);
    }, 5000);
    return () => clearInterval(interval);
  }, [tickAgents, drones, missions, agents]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row p-4 gap-4 bg-gray-900 text-white">
        <button onClick={handleAddDrone} className="bg-blue-600 px-4 py-2 rounded">Add Drone</button>
        <button onClick={handleAddAgent} className="bg-purple-600 px-4 py-2 rounded">Add Agent NPC</button>
        <button onClick={() => fcl.authenticate()} className="bg-green-700 px-4 py-2 rounded">{user && user.addr ? `Logged in: ${user.addr}` : 'Login with Flow'}</button>
        {txStatus && <span className="ml-4 text-yellow-300">{txStatus}</span>}
        <div className="flex flex-row gap-2 items-center">
          <select name="type" value={missionForm.type} onChange={handleMissionFormChange} className="bg-gray-700 px-2 py-1 rounded">
            {missionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input name="description" placeholder="Description" value={missionForm.description} onChange={handleMissionFormChange} className="bg-gray-700 px-2 py-1 rounded" />
          <input name="reward" type="number" min="1" value={missionForm.reward} onChange={handleMissionFormChange} className="bg-gray-700 px-2 py-1 rounded w-20" />
          <input name="targetX" type="number" value={missionForm.targetX} onChange={handleMissionFormChange} className="bg-gray-700 px-2 py-1 rounded w-20" placeholder="Target X" />
          <input name="targetZ" type="number" value={missionForm.targetZ} onChange={handleMissionFormChange} className="bg-gray-700 px-2 py-1 rounded w-20" placeholder="Target Z" />
          <button onClick={handleAddMission} className="bg-green-600 px-4 py-2 rounded">Add Mission</button>
        </div>
      </div>
      <div className="flex flex-row flex-1">
        <div className="w-1/4 p-4 bg-gray-800 text-white overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Drones</h2>
          <ul>
            {drones.map(drone => (
              <li key={drone.id} className="mb-2">
                <div className="font-semibold">{drone.model} ({drone.status})</div>
                <div>Battery: {drone.battery.toFixed(1)}%</div>
                <div>Location: ({drone.location.x.toFixed(1)}, {drone.location.y.toFixed(1)}, {drone.location.z.toFixed(1)})</div>
                <div>Simulated: {drone.isSimulated ? 'Yes' : 'No'}</div>
                <div>Last Mission: {drone.lastMissionId || 'None'}</div>
                <div className="mt-1">
                  <span className="text-xs">Assign Mission:</span>
                  {missions.filter(m => m.status === 'pending').map(mission => (
                    <button key={mission.id} onClick={() => handleAssignMission(drone, mission)} className="ml-2 bg-yellow-600 px-2 py-1 rounded text-xs">{mission.description}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-bold mt-4 mb-2">Missions</h2>
          <ul>
            {missions.map(mission => (
              <li key={mission.id} className="mb-2">
                <div className="font-semibold">{mission.description} ({mission.type})</div>
                <div>Status: {mission.status}</div>
                <div>Reward: {mission.reward}</div>
                <div>Pilot: {mission.pilot}</div>
                <div>Drone: {mission.droneId || 'Unassigned'}</div>
                {mission.target && <div>Target: ({mission.target.x}, {mission.target.y}, {mission.target.z})</div>}
                {mission.status === 'completed' && mission.endTime && (
                  <div className="text-xs text-green-400">Completed at {new Date(mission.endTime).toLocaleTimeString()}</div>
                )}
                {mission.status === 'failed' && mission.endTime && (
                  <div className="text-xs text-red-400">Failed at {new Date(mission.endTime).toLocaleTimeString()}</div>
                )}
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-bold mt-4 mb-2">Agents</h2>
          <ul>
            {agents.map(agent => (
              <li key={agent.id} className="mb-2">
                <div className="font-semibold">{agent.name} ({agent.type})</div>
                <div>Status: {agent.status}</div>
                <div>Location: ({agent.location.x.toFixed(1)}, {agent.location.y.toFixed(1)}, {agent.location.z.toFixed(1)})</div>
                <button onClick={() => handleMoveAgent(agent)} className="bg-purple-700 px-2 py-1 rounded text-xs mt-1">Move Agent</button>
                {/* Assign mission to drone */}
                {drones.length > 0 && missions.some(m => m.status === 'pending') && (
                  <div className="mt-1">
                    <span className="text-xs">Assign Mission:</span>
                    {drones.map(drone => (
                      missions.filter(m => m.status === 'pending').map(mission => (
                        <button key={drone.id + mission.id} onClick={() => handleAgentAssignMission(agent, drone, mission)} className="ml-2 bg-yellow-700 px-2 py-1 rounded text-xs">{`To ${drone.model}: ${mission.description}`}</button>
                      ))
                    ))}
                  </div>
                )}
                {/* Interact with other agents */}
                {agents.length > 1 && (
                  <div className="mt-1">
                    <span className="text-xs">Interact:</span>
                    {agents.filter(a => a.id !== agent.id).map(target => (
                      <button key={target.id} onClick={() => handleAgentInteract(agent, target)} className="ml-2 bg-pink-700 px-2 py-1 rounded text-xs">{`With ${target.name}`}</button>
                    ))}
                  </div>
                )}
                {/* Show last actions */}
                {agent.metadata?.lastAssigned && (
                  <div className="text-xs text-blue-300 mt-1">Assigned {agent.metadata.lastAssigned.missionId} to {agent.metadata.lastAssigned.droneId} at {new Date(agent.metadata.lastAssigned.time).toLocaleTimeString()}</div>
                )}
                {agent.metadata?.lastInteraction && (
                  <div className="text-xs text-pink-300 mt-1">Interacted with {agent.metadata.lastInteraction.with} at {new Date(agent.metadata.lastInteraction.time).toLocaleTimeString()}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 relative" ref={mountRef} style={{ minHeight: 600, background: '#111' }} />
      </div>
    </div>
  );
};

export default DroneSimDashboard; 