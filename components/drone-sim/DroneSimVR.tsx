"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { OrbitControls, Sky, Environment, Text } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Mesh } from "three";
import type { LocalAgent } from './DroneSimDashboard';
import { Interactive } from '@react-three/xr';

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

interface DroneSimVRProps {
  drones: Drone[];
  agents: LocalAgent[];
  onDroneClick: (drone: Drone) => void;
  isRunning?: boolean;
}

// VR Drone component
function VRDrone({ drone, onDroneClick }: { drone: Drone; onDroneClick: (drone: Drone) => void }) {
  const [ref] = useBox<Mesh>(() => ({ 
    mass: 1, 
    position: [drone.location.x, drone.location.y + 2, drone.location.z],
    args: [3, 1, 3]
  }));

  const getDroneColor = () => {
    switch (drone.status) {
      case 'in-mission': return '#00ff00';
      case 'charging': return '#ffff00';
      case 'offline': return '#666666';
      default: return '#6ec1c8';
    }
  };

  return (
    <Interactive onSelect={() => onDroneClick(drone)}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color={getDroneColor()} />
      </mesh>
    </Interactive>
  );
}

// VR Agent component
function VRAgent({ agent }: { agent: LocalAgent }) {
  const [ref] = useBox<Mesh>(() => ({ 
    mass: 1, 
    position: [agent.location.x, agent.location.y + 2, agent.location.z], 
    type: 'Static',
    args: [2, 2, 2]
  }));

  const getAgentColor = () => {
    switch (agent.type) {
      case 'onchain': return '#ff00ff';
      case 'hybrid': return '#ff9800';
      default: return '#00ffff';
    }
  };

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={getAgentColor()} />
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {agent.name}
      </Text>
    </mesh>
  );
}

// VR Ground
function VRGround() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0],
    args: [100, 100]
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a2236" />
    </mesh>
  );
}

// VR UI Component
function VRUI() {
  const { session } = useXR();
  
  if (!session) return null;
  
  return (
    <Text
      position={[0, 2, -3]}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      VR Drone Simulation Active
    </Text>
  );
}

export default function DroneSimVR({ 
  drones, 
  agents, 
  onDroneClick,
  isRunning = false 
}: DroneSimVRProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Physics gravity={[0, -9.81, 0]}>
          <VRGround />
          
          {/* VR Drones */}
          {drones.map((drone) => (
            <VRDrone
              key={drone.id}
              drone={drone}
              onDroneClick={onDroneClick}
            />
          ))}
          
          {/* VR Agents */}
          {agents.map((agent) => (
            <VRAgent key={agent.id} agent={agent} />
          ))}
        </Physics>
        
        <VRUI />
        
        <OrbitControls />
      </Canvas>
      
      {/* VR Status */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div>🎮 VR Mode: Ready</div>
        <div>🚁 Drones: {drones.length}</div>
        <div>🤖 Agents: {agents.length}</div>
      </div>
    </div>
  );
} 