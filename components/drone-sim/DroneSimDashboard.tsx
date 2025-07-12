"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Flight as FlightIcon,
  Assignment as MissionIcon,
  Person as AgentIcon,
  Login as LoginIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import * as THREE from 'three';
import * as fcl from "@onflow/fcl";
import DroneSim3DView from './DroneSim3DView';
import { assignMissionOnChain, interactWithAgentOnChain } from '@/utils/flowAgent';
import { useAgents } from '@/hooks/useAgents';
import { useMissions } from '@/hooks/useDrones';

// FCL config for Flow testnet
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xAgentNPC", "0x90ba9bdcb25f0aeb");

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Drone {
  id: string;
  model: string;
  status: 'idle' | 'in-mission' | 'charging' | 'offline';
  location: Vector3;
  battery: number;
  isSimulated: boolean;
  lastMissionId?: string;
}

interface Mission {
  id: string;
  droneId: string;
  pilot: string;
  description: string;
  type: 'mapping' | 'delivery' | 'surveillance' | 'custom';
  reward: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  target?: Vector3;
  startTime?: string;
  endTime?: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'onchain' | 'offchain' | 'hybrid';
  status: 'idle' | 'active' | 'offline';
  location: Vector3;
  strategy?: 'default' | 'assigner' | 'trader' | 'social';
  metadata?: any;
}

const CHARGING_STATION: Vector3 = { x: 0, y: 0, z: 0 };

const DroneSimDashboard: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState<{addr?: string} | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();

  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [droneInfoSnackbar, setDroneInfoSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });

  // Mission form state
  const [missionForm, setMissionForm] = useState({
    type: 'mapping',
    description: '',
    reward: 10,
    targetX: 20,
    targetZ: 20,
  });

  // Use React Query hooks for agents and missions
  const {
    agents,
    isLoading: agentsLoading,
    addAgent,
    updateAgent,
    performAction,
  } = useAgents();
  const {
    missions,
    isLoading: missionsLoading,
    addMission,
    updateMission,
  } = useMissions();

  // FCL user subscription
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a2236);
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ color: 0x2a3441 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add charging station
    const charger = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
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
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update scene with drones and agents
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear existing objects
    scene.children = scene.children.filter(child => 
      child.userData.type === 'ground' || child.userData.type === 'charger'
    );

    // Add drone meshes
    drones.forEach(drone => {
      const droneMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 3),
        new THREE.MeshBasicMaterial({ 
          color: drone.status === 'in-mission' ? 0x00ff00 : 
                 drone.status === 'charging' ? 0xffff00 : 0x666666 
        })
      );
      droneMesh.position.set(drone.location.x, drone.location.y + 2, drone.location.z);
      droneMesh.userData = { type: 'drone', id: drone.id };
      scene.add(droneMesh);
    });

    // Add agent meshes
    agents.forEach(agent => {
      const agentMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2, 16, 16),
        new THREE.MeshBasicMaterial({ 
          color: agent.type === 'onchain' ? 0xff00ff : 
                 agent.type === 'hybrid' ? 0xffa500 : 0x00ffff 
        })
      );
      agentMesh.position.set(agent.location.x, agent.location.y + 2, agent.location.z);
      agentMesh.userData = { type: 'agent', id: agent.id };
      scene.add(agentMesh);
    });
  }, [drones, agents]);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Update drone positions and battery
      setDrones(prevDrones => 
        prevDrones.map(drone => {
          if (drone.status === 'in-mission') {
            const mission = missions.find(m => m.id === drone.lastMissionId);
            if (mission?.target) {
              // Move toward target
              const dx = mission.target.x - drone.location.x;
              const dz = mission.target.z - drone.location.z;
              const distance = Math.sqrt(dx * dx + dz * dz);
              
              if (distance > 1) {
                const newX = drone.location.x + (dx / distance) * 2;
                const newZ = drone.location.z + (dz / distance) * 2;
                return {
                  ...drone,
                  location: { ...drone.location, x: newX, z: newZ },
                  battery: Math.max(0, drone.battery - 0.5)
                };
              } else {
                // Mission completed
                if (drone.lastMissionId) {
                  updateMission(drone.lastMissionId, { status: 'completed' });
                }
                return { ...drone, status: 'idle' as const, lastMissionId: undefined };
              }
            }
          }
          return drone;
        })
      );

      // Enhanced autonomous agent logic
      agents.forEach(agent => {
        if (agent.status === 'idle' && Math.random() < 0.3) {
          if (agent.strategy === 'assigner') {
            // Assigner: assign missions
            const availableMissions = missions.filter(m => m.status === 'pending');
            const availableDrones = drones.filter(d => d.status === 'idle');
            if (availableMissions.length > 0 && availableDrones.length > 0) {
              const mission = availableMissions[0];
              const drone = availableDrones[0];
              updateMission(mission.id, { droneId: drone.id, status: 'active', assignedAgentId: agent.id });
              setDrones(prev => prev.map(d => 
                d.id === drone.id ? { ...d, status: 'in-mission' as const, lastMissionId: mission.id } : d
              ));
              setNotification({
                message: `${agent.name} (assigner) assigned mission "${mission.description}" to ${drone.model}`,
                type: 'info'
              });
            }
          } else if (agent.strategy === 'trader' || agent.strategy === 'social') {
            // Trader/social: interact with another agent
            const otherAgents = agents.filter(a => a.id !== agent.id);
            if (otherAgents.length > 0) {
              const target = otherAgents[Math.floor(Math.random() * otherAgents.length)];
              setNotification({
                message: `${agent.name} (${agent.strategy}) interacted with ${target.name}`,
                type: 'info'
              });
              // Optionally, call on-chain interaction here for onchain agents
            }
          }
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, missions, drones, agents]);

  // Event listeners for on-chain transactions
  useEffect(() => {
    const unsub1 = fcl.events("A.90ba9bdcb25f0aeb.AgentNPC.MissionAssigned").subscribe(event => {
      setNotification({
        message: `Mission assigned on-chain: ${JSON.stringify(event)}`,
        type: 'success'
      });
    });
    
    const unsub2 = fcl.events("A.90ba9bdcb25f0aeb.AgentNPC.AgentInteracted").subscribe(event => {
      setNotification({
        message: `Agent interaction on-chain: ${JSON.stringify(event)}`,
        type: 'success'
      });
    });
    
    return () => { unsub1(); unsub2(); };
  }, []);

  // Handlers
  const handleAddDrone = () => {
    const newDrone: Drone = {
      id: `drone_${Date.now()}`,
      model: 'SimDrone X',
      status: 'idle',
      location: { x: Math.random() * 40 - 20, y: 0, z: Math.random() * 40 - 20 },
      battery: 100,
      isSimulated: true,
    };
    setDrones(prev => [...prev, newDrone]);
    setNotification({ message: 'Drone added successfully', type: 'success' });
  };

  const handleAddMission = async () => {
    const newMission = {
      droneId: '',
      pilot: user?.addr || 'user_wallet',
      description: missionForm.description || `${missionForm.type} mission`,
      type: missionForm.type as Mission['type'],
      reward: missionForm.reward,
      status: 'pending' as const,
      target: { x: missionForm.targetX, y: 0, z: missionForm.targetZ },
    };
    await addMission(newMission);
    setMissionForm({ type: 'mapping', description: '', reward: 10, targetX: 20, targetZ: 20 });
    setNotification({ message: 'Mission created successfully', type: 'success' });
  };

  const handleAddAgent = async (type: Agent['type']) => {
    const strategies: Agent['strategy'][] = ['assigner', 'trader', 'social'];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const newAgent = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent ${agents.length + 1}`,
      type,
      status: 'idle' as const,
      location: { x: Math.random() * 80 - 40, y: 0, z: Math.random() * 80 - 40 },
      strategy,
    };
    await addAgent(newAgent);
    setNotification({ message: `${type} agent (${strategy}) added successfully`, type: 'success' });
  };

  const handleAssignMission = async (droneId: string, missionId: string) => {
    // Find an onchain agent
    const onchainAgent = agents.find(a => a.type === 'onchain');
    if (!user?.addr) {
      setNotification({ message: 'Please login with Flow to assign on-chain mission.', type: 'error' });
      return;
    }
    setDrones(prev => prev.map(d =>
      d.id === droneId ? { ...d, status: 'in-mission' as const, lastMissionId: missionId } : d
    ));
    await updateMission(missionId, { droneId, status: 'active', assignedAgentId: onchainAgent?.id });
    setNotification({ message: 'Assigning mission on-chain...', type: 'info' });
    try {
      if (onchainAgent) {
        const txId = await assignMissionOnChain(droneId, missionId);
        setTxStatus(`Mission assigned on-chain! Tx: ${txId}`);
      } else {
        setNotification({ message: 'No onchain agent available, assigned locally.', type: 'info' });
      }
    } catch (err) {
      setNotification({ message: 'On-chain mission assignment failed.', type: 'error' });
    }
  };

  const handleAgentInteract = async (agent1: Agent, agent2: Agent) => {
    setNotification({ message: `${agent1.name} interacting with ${agent2.name}...`, type: 'info' });
    if (agent1.type === 'onchain' && user?.addr) {
      try {
        const txId = await interactWithAgentOnChain(agent2.id, 'Hello from agent!');
        setTxStatus(`Agent interaction on-chain! Tx: ${txId}`);
      } catch (err) {
        setNotification({ message: 'On-chain agent interaction failed.', type: 'error' });
      }
    } else {
      setNotification({ message: `${agent1.name} interacted with ${agent2.name} (local)`, type: 'info' });
    }
  };

  const handleLoginWithFlow = async () => {
    try {
      await fcl.authenticate();
      setNotification({ message: 'Successfully logged in with Flow', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to login with Flow', type: 'error' });
    }
  };

  const handleStartSimulation = () => setIsRunning(true);
  const handleStopSimulation = () => setIsRunning(false);
  const handleResetSimulation = () => {
    setIsRunning(false);
    setDrones([]);
    // setMissions([]); // Removed as per edit hint
    // setAgents([]); // Removed as per edit hint
    setNotification({ message: 'Simulation reset', type: 'info' });
  };

  // When rendering or using agents, use:
  const activeAgents = (agents as any[]).filter(a => a.status !== 'offline' && a.strategy !== 'default');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' }, gap: 2, minHeight: 600 }}>
      {/* 3D Scene */}
      <Box sx={{ width: '100%', height: 400, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
        <DroneSim3DView
          drones={drones}
          agents={agents}
          selectedDroneId={selectedDroneId}
          onDroneClick={(drone) => {
            setSelectedDroneId(drone.id);
            setDroneInfoSnackbar({ open: true, message: `${drone.model} | Battery: ${drone.battery.toFixed(1)}% | Status: ${drone.status}` });
          }}
        />
      </Box>

      {/* Control Panel */}
      <Box>
        <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper', overflow: 'auto' }}>
          {/* Flow Login */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoginIcon /> Flow Authentication
            </Typography>
            {user?.addr ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={`Flow: ${user.addr.slice(0, 8)}...`}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600, mb: 1 }}
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleLoginWithFlow}
                fullWidth
              >
                Login with Flow
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Simulation Controls */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Simulation Controls</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleStartSimulation}
                disabled={isRunning}
                size="small"
              >
                Start
              </Button>
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={handleStopSimulation}
                disabled={!isRunning}
                size="small"
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetSimulation}
                size="small"
              >
                Reset
              </Button>
            </Box>
            <Chip
              label={isRunning ? 'Running' : 'Stopped'}
              color={isRunning ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Add Drones */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightIcon /> Drones
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddDrone}
              fullWidth
              size="small"
            >
              Add Drone
            </Button>
            <List dense>
              {drones.map((drone) => (
                <ListItem key={drone.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <FlightIcon color={drone.status === 'in-mission' ? 'success' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={drone.model}
                    secondary={`${drone.status} • Battery: ${drone.battery.toFixed(1)}%`}
                  />
                  <Chip
                    label={drone.status}
                    color={drone.status === 'in-mission' ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Add Missions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MissionIcon /> Missions
            </Typography>
            
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={missionForm.type}
                label="Type"
                onChange={(e) => setMissionForm({ ...missionForm, type: e.target.value })}
              >
                <MenuItem value="mapping">Mapping</MenuItem>
                <MenuItem value="delivery">Delivery</MenuItem>
                <MenuItem value="surveillance">Surveillance</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={missionForm.description}
              onChange={(e) => setMissionForm({ ...missionForm, description: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />

            <TextField
              label="Reward"
              type="number"
              value={missionForm.reward}
              onChange={(e) => setMissionForm({ ...missionForm, reward: Number(e.target.value) })}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Target X"
                type="number"
                value={missionForm.targetX}
                onChange={(e) => setMissionForm({ ...missionForm, targetX: Number(e.target.value) })}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Target Z"
                type="number"
                value={missionForm.targetZ}
                onChange={(e) => setMissionForm({ ...missionForm, targetZ: Number(e.target.value) })}
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddMission}
              fullWidth
              size="small"
            >
              Add Mission
            </Button>

            <List dense>
              {missions.map((mission) => (
                <ListItem key={mission.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={mission.description}
                    secondary={`${mission.type} • ${mission.reward} reward • ${mission.status}`}
                  />
                  <Chip
                    label={mission.status}
                    color={mission.status === 'completed' ? 'success' : 
                           mission.status === 'failed' ? 'error' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Add Agents */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AgentIcon /> Agents
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddAgent('onchain')}
                size="small"
                sx={{ flex: 1 }}
              >
                Onchain
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddAgent('offchain')}
                size="small"
                sx={{ flex: 1 }}
              >
                Offchain
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddAgent('hybrid')}
                size="small"
                sx={{ flex: 1 }}
              >
                Hybrid
              </Button>
            </Box>

            <List dense>
              {agents.map((agent) => (
                <ListItem key={agent.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <AgentIcon color={agent.type === 'onchain' ? 'secondary' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={agent.name}
                    secondary={`${agent.type} • ${agent.status} • ${agent.strategy}`}
                  />
                  <Chip
                    label={agent.type}
                    color={agent.type === 'onchain' ? 'secondary' : 'default'}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setNotification({ message: `Agent ${agent.name} synced to chain! (dummy)`, type: 'info' })}
                  >
                    Sync to Chain
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Mission Assignment */}
          {missions.filter(m => m.status === 'pending').length > 0 && drones.filter(d => d.status === 'idle').length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Assign Missions</Typography>
                {missions.filter(m => m.status === 'pending').map(mission => (
                  <Box key={mission.id} sx={{ mb: 1 }}>
                    <Typography variant="body2" gutterBottom>{mission.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {drones.filter(d => d.status === 'idle').map(drone => (
                        <Button
                          key={drone.id}
                          variant="outlined"
                          size="small"
                          onClick={() => handleAssignMission(drone.id, mission.id)}
                        >
                          Assign to {drone.model}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Agent Interactions */}
          {agents.length > 1 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Agent Interactions</Typography>
                {agents.map(agent1 => 
                  agents.filter(agent2 => agent2.id !== agent1.id).map(agent2 => (
                    <Button
                      key={`${agent1.id}-${agent2.id}`}
                      variant="outlined"
                      size="small"
                      onClick={() => handleAgentInteract(agent1, agent2)}
                      sx={{ mr: 1, mb: 1 }}
                    >
                      {agent1.name} ↔ {agent2.name}
                    </Button>
                  ))
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type} 
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      {/* Transaction Status */}
      {txStatus && (
        <Snackbar
          open={!!txStatus}
          autoHideDuration={8000}
          onClose={() => setTxStatus(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="info" sx={{ width: '100%' }}>
            {(() => {
              const match = txStatus.match(/Tx: ([0-9a-fA-F]{64})/);
              if (match) {
                const txId = match[1];
                return <>
                  {txStatus.replace(`Tx: ${txId}`, '')}
                  <a
                    href={`https://testnet.flowscan.org/transaction/${txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#6ec1c8', marginLeft: 8, textDecoration: 'underline' }}
                  >
                    View on Flow Explorer
                  </a>
                </>;
              }
              return txStatus;
            })()}
          </Alert>
        </Snackbar>
      )}

      {/* Drone Info Snackbar */}
      <Snackbar
        open={droneInfoSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setDroneInfoSnackbar({ ...droneInfoSnackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setDroneInfoSnackbar({ ...droneInfoSnackbar, open: false })} severity="info" sx={{ width: '100%' }}>
          {droneInfoSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DroneSimDashboard; 