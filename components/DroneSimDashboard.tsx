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
  status: 'idle' | 'active' | 'busy';
  location: Vector3;
  metadata?: any;
}

const CHARGING_STATION: Vector3 = { x: 0, y: 0, z: 0 };

const DroneSimDashboard: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState<{addr?: string} | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();

  // Mission form state
  const [missionForm, setMissionForm] = useState({
    type: 'mapping',
    description: '',
    reward: 10,
    targetX: 20,
    targetZ: 20,
  });

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
                setMissions(prev => prev.map(m => 
                  m.id === mission.id ? { ...m, status: 'completed' as const } : m
                ));
                return { ...drone, status: 'idle' as const, lastMissionId: undefined };
              }
            }
          }
          return drone;
        })
      );

      // Autonomous agent logic
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.status === 'idle' && Math.random() < 0.3) {
            // Agent decides to take action
            const availableMissions = missions.filter(m => m.status === 'pending');
            const availableDrones = drones.filter(d => d.status === 'idle');
            
            if (availableMissions.length > 0 && availableDrones.length > 0) {
              const mission = availableMissions[0];
              const drone = availableDrones[0];
              
              // Assign mission
              setMissions(prev => prev.map(m => 
                m.id === mission.id ? { ...m, droneId: drone.id, status: 'in-progress' as const } : m
              ));
              
              setDrones(prev => prev.map(d => 
                d.id === drone.id ? { ...d, status: 'in-mission' as const, lastMissionId: mission.id } : d
              ));

              setNotification({
                message: `${agent.name} assigned mission "${mission.description}" to ${drone.model}`,
                type: 'info'
              });

              return { ...agent, status: 'active' as const };
            }
          }
          return agent;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, missions, drones]);

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

  const handleAddMission = () => {
    const newMission: Mission = {
      id: `mission_${Date.now()}`,
      droneId: '',
      pilot: user?.addr || 'user_wallet',
      description: missionForm.description || `${missionForm.type} mission`,
      type: missionForm.type as Mission['type'],
      reward: missionForm.reward,
      status: 'pending',
      target: { x: missionForm.targetX, y: 0, z: missionForm.targetZ },
    };
    setMissions(prev => [...prev, newMission]);
    setMissionForm({ type: 'mapping', description: '', reward: 10, targetX: 20, targetZ: 20 });
    setNotification({ message: 'Mission created successfully', type: 'success' });
  };

  const handleAddAgent = (type: Agent['type']) => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent ${agents.length + 1}`,
      type,
      status: 'idle',
      location: { x: Math.random() * 80 - 40, y: 0, z: Math.random() * 80 - 40 },
    };
    setAgents(prev => [...prev, newAgent]);
    setNotification({ message: `${type} agent added successfully`, type: 'success' });
  };

  const handleAssignMission = (droneId: string, missionId: string) => {
    setDrones(prev => prev.map(d => 
      d.id === droneId ? { ...d, status: 'in-mission' as const, lastMissionId: missionId } : d
    ));
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, droneId, status: 'in-progress' as const } : m
    ));
    setNotification({ message: 'Mission assigned successfully', type: 'success' });
  };

  const handleAgentInteract = (agent1: Agent, agent2: Agent) => {
    setNotification({ 
      message: `${agent1.name} interacted with ${agent2.name}`, 
      type: 'info' 
    });
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
    setMissions([]);
    setAgents([]);
    setNotification({ message: 'Simulation reset', type: 'info' });
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' }, gap: 2, minHeight: 600 }}>
      {/* 3D Scene */}
      <Box>
        <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Drone Simulation & Agent Interaction
          </Typography>
          <Box
            ref={mountRef}
            sx={{
              width: '100%',
              height: 400,
              bgcolor: 'grey.900',
              borderRadius: 1,
              position: 'relative',
            }}
          />
        </Paper>
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
                label={`Connected: ${user.addr.slice(0, 8)}...`}
                color="success"
                variant="outlined"
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
                    secondary={`${agent.type} • ${agent.status}`}
                  />
                  <Chip
                    label={agent.type}
                    color={agent.type === 'onchain' ? 'secondary' : 'default'}
                    size="small"
                  />
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
          autoHideDuration={6000}
          onClose={() => setTxStatus(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="info" sx={{ width: '100%' }}>
            {txStatus}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DroneSimDashboard; 