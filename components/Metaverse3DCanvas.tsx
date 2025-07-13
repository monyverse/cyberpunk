"use client";

import React, { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky, Environment, Html, Stars } from "@react-three/drei";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { Vector3, Mesh, Color } from "three";
import { Agent, Drone, DroneMission } from '../types';

interface Metaverse3DCanvasProps {
  agents: Agent[];
  drones: Drone[];
  missions: DroneMission[];
  isRunning: boolean;
  isLoading: boolean;
}

// Loading indicator component (outside Canvas)
function LoadingIndicator() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        color: '#6ec1c8',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        border: '2px solid #6ec1c8'
      }}>
        Loading Metaverse...
      </div>
    </div>
  );
}

// 3D Scene Component - All 3D components go inside this
function MetaverseScene({ 
  agents, 
  drones, 
  missions, 
  isRunning 
}: { 
  agents: Agent[]; 
  drones: Drone[]; 
  missions: DroneMission[]; 
  isRunning: boolean; 
}) {
  // Enhanced drone component with AI behavior
  function DroneAI({ drone, isRunning }: { drone: Drone; isRunning: boolean }) {
    // Default position if location is missing
    const defaultPosition = [0, 2, 0] as [number, number, number];
    const dronePosition = drone.location ? [
      drone.location.x || 0,
      (drone.location.y || 0) + 2,
      drone.location.z || 0
    ] as [number, number, number] : defaultPosition;

    const [ref, api] = useBox<Mesh>(() => ({ 
      mass: 1, 
      position: dronePosition,
      args: [3, 1, 3]
    }));
    
    const [targetPosition, setTargetPosition] = useState(dronePosition);
    const [isMoving, setIsMoving] = useState(false);
    const [rotation, setRotation] = useState(0);

    // AI behavior logic
    useFrame((state) => {
      if (!isRunning || !ref.current) return;

      const currentPos = ref.current.position;
      const target = new Vector3(...targetPosition);
      const distance = currentPos.distanceTo(target);

      if (distance > 0.5) {
        // Move towards target
        const direction = target.clone().sub(currentPos).normalize();
        const speed = 0.1;
        api.velocity.set(direction.x * speed, 0, direction.z * speed);
        
        // Update rotation to face movement direction
        const angle = Math.atan2(direction.x, direction.z);
        setRotation(angle);
        ref.current.rotation.y = angle;
        
        setIsMoving(true);
      } else {
        // Reached target, set new random target
        if (isMoving) {
          const newTarget: [number, number, number] = [
            (Math.random() - 0.5) * 80,
            (drone.location?.y || 0) + 2,
            (Math.random() - 0.5) * 80
          ];
          setTargetPosition(newTarget);
          setIsMoving(false);
        }
        api.velocity.set(0, 0, 0);
      }
    });

    const getDroneColor = () => {
      switch (drone.status) {
        case 'in-mission': return '#00ff00';
        case 'charging': return '#ffff00';
        case 'offline': return '#666666';
        case 'maintenance': return '#ff6b35';
        default: return '#6ec1c8';
      }
    };

    return (
      <group>
        <mesh ref={ref} castShadow receiveShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color={getDroneColor()} />
        </mesh>
        
        {/* Drone propellers */}
        <group position={[0, 0.6, 0]}>
          <mesh position={[-1.2, 0, -1.2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[1.2, 0, -1.2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[-1.2, 0, 1.2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[1.2, 0, 1.2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
        
        {/* Battery indicator */}
        <Html position={[0, 2, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            border: `2px solid ${getDroneColor()}`
          }}>
            {(drone.battery || 0).toFixed(0)}%
          </div>
        </Html>
        
        {/* Status indicator */}
        <Html position={[0, 3, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: getDroneColor(),
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase'
          }}>
            {drone.status || 'unknown'}
          </div>
        </Html>
      </group>
    );
  }

  // Enhanced agent component with AI behaviors
  function AgentAI({ agent, isRunning }: { agent: Agent; isRunning: boolean }) {
    // Default position if location is missing
    const defaultPosition = [0, 2, 0] as [number, number, number];
    const agentPosition = agent.location ? [
      agent.location.x || 0,
      (agent.location.y || 0) + 2,
      agent.location.z || 0
    ] as [number, number, number] : defaultPosition;

    const [ref, api] = useSphere<Mesh>(() => ({ 
      mass: 1, 
      position: agentPosition,
      type: 'Static',
      args: [2]
    }));
    
    const [isInteracting, setIsInteracting] = useState(false);
    const [pulseIntensity, setPulseIntensity] = useState(0);

    // AI interaction behavior
    useFrame((state) => {
      if (!isRunning || !ref.current) return;

      // Pulse effect
      setPulseIntensity(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5);

      // Periodic interaction simulation
      if (Math.random() < 0.001) {
        setIsInteracting(true);
        setTimeout(() => setIsInteracting(false), 2000);
      }
    });

    const getAgentColor = () => {
      switch (agent.type) {
        case 'onchain': return '#ff00ff';
        case 'hybrid': return '#ff9800';
        default: return '#00ffff';
      }
    };

    return (
      <group>
        <mesh ref={ref} castShadow receiveShadow>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial 
            color={getAgentColor()} 
            emissive={getAgentColor()}
            emissiveIntensity={pulseIntensity * 0.3}
          />
        </mesh>
        
        {/* Agent interaction indicator */}
        {isInteracting && (
          <Html position={[0, 4, 0]} center>
            <div style={{
              background: 'rgba(255,255,0,0.9)',
              color: 'black',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              fontWeight: 'bold'
            }}>
              🤖 {agent.strategy || 'Processing'}
            </div>
          </Html>
        )}
        
        {/* Agent info */}
        <Html position={[0, -3, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            border: `1px solid ${getAgentColor()}`
          }}>
            {agent.name || 'Unknown Agent'}
            <br />
            {agent.type || 'unknown'} • {agent.strategy || 'default'}
          </div>
        </Html>
      </group>
    );
  }

  // Mission waypoints visualization
  function MissionWaypoints({ missions }: { missions: DroneMission[] }) {
    const activeMissions = missions.filter(m => m.status === 'active');
    
    return (
      <group>
        {activeMissions.map((mission, index) => (
          <group key={mission.id}>
            {/* Mission start point */}
            <mesh position={[mission.target?.x || 0, 0.5, mission.target?.z || 0]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
            </mesh>
            
            {/* Mission path line */}
            {mission.target && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      0, 0.5, 0,
                      mission.target.x, 0.5, mission.target.z
                    ])}
                    itemSize={3}
                    args={[new Float32Array([
                      0, 0.5, 0,
                      mission.target.x, 0.5, mission.target.z
                    ]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#ffd700" />
              </line>
            )}
            
            {/* Mission info */}
            <Html position={[mission.target?.x || 0, 2, mission.target?.z || 0]} center>
              <div style={{
                background: 'rgba(255,215,0,0.9)',
                color: 'black',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
                fontWeight: 'bold'
              }}>
                🎯 {mission.type}
              </div>
            </Html>
          </group>
        ))}
      </group>
    );
  }

  // Cyberpunk city buildings
  function CyberpunkBuildings() {
    const buildings = useMemo(() => {
      const buildingData = [];
      for (let i = 0; i < 20; i++) {
        buildingData.push({
          position: [
            (Math.random() - 0.5) * 100,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 100
          ] as [number, number, number],
          size: [
            Math.random() * 8 + 4,
            Math.random() * 30 + 10,
            Math.random() * 8 + 4
          ] as [number, number, number],
          color: new Color().setHSL(Math.random() * 0.1 + 0.1, 0.3, Math.random() * 0.2 + 0.1)
        });
      }
      return buildingData;
    }, []);

    return (
      <group>
        {buildings.map((building, index) => (
          <mesh key={index} position={building.position} castShadow receiveShadow>
            <boxGeometry args={building.size} />
            <meshStandardMaterial color={building.color} />
            
            {/* Building windows */}
            <mesh position={[0, 0, building.size[2] / 2 + 0.01]}>
              <planeGeometry args={[building.size[0] * 0.8, building.size[1] * 0.8]} />
              <meshStandardMaterial 
                color="#ffff00" 
                emissive="#ffff00" 
                emissiveIntensity={Math.random() * 0.5}
              />
            </mesh>
          </mesh>
        ))}
      </group>
    );
  }

  // Cyberpunk ground with grid
  function CyberpunkGround() {
    const [ref] = usePlane<Mesh>(() => ({ 
      rotation: [-Math.PI / 2, 0, 0], 
      position: [0, 0, 0],
      type: 'Static'
    }));

    return (
      <group>
        {/* Main ground */}
        <mesh ref={ref} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        
        {/* Grid lines */}
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <group key={i}>
              <mesh position={[0, 0.01, (i - 10) * 10]}>
                <planeGeometry args={[200, 0.1]} />
                <meshStandardMaterial color="#6ec1c8" opacity={0.3} transparent />
              </mesh>
              <mesh position={[(i - 10) * 10, 0.01, 0]}>
                <planeGeometry args={[0.1, 200]} />
                <meshStandardMaterial color="#6ec1c8" opacity={0.3} transparent />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    );
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#6ec1c8" />
      
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
      
      {/* Physics world */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground */}
        <CyberpunkGround />
        
        {/* Buildings */}
        <CyberpunkBuildings />
        
        {/* Drones */}
        {drones.filter(drone => drone && drone.id).map((drone) => (
          <DroneAI key={drone.id} drone={drone} isRunning={isRunning} />
        ))}
        
        {/* Agents */}
        {agents.filter(agent => agent && agent.id).map((agent) => (
          <AgentAI key={agent.id} agent={agent} isRunning={isRunning} />
        ))}
        
        {/* Mission waypoints */}
        <MissionWaypoints missions={missions} />
      </Physics>
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={100}
      />
      
      {/* UI Overlay */}
      <Html position={[-15, 15, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          border: '1px solid #6ec1c8'
        }}>
          <div>Drones: {drones.length}</div>
          <div>Agents: {agents.length}</div>
          <div>Missions: {missions.filter(m => m.status === 'active').length}</div>
          <div>Status: {isRunning ? 'Running' : 'Paused'}</div>
        </div>
      </Html>
    </>
  );
}

// Main 3D Canvas component
export default function Metaverse3DCanvas({ 
  agents, 
  drones, 
  missions, 
  isRunning, 
  isLoading 
}: Metaverse3DCanvasProps) {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [20, 20, 20], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' }}
      >
        <MetaverseScene 
          agents={agents} 
          drones={drones} 
          missions={missions} 
          isRunning={isRunning} 
        />
      </Canvas>
    </div>
  );
} 