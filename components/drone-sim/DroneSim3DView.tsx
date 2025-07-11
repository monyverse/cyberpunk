"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment } from "@react-three/drei";
import { Physics, useBox } from "@react-three/cannon";
import { Mesh } from "three";

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

interface Agent {
  id: string;
  name: string;
  type: 'onchain' | 'offchain' | 'hybrid';
  status: 'idle' | 'active' | 'busy';
  location: Vector3;
  metadata?: any;
}

interface DroneSim3DViewProps {
  drones: Drone[];
  agents: Agent[];
  selectedDroneId: string | null;
  onDroneClick: (drone: Drone) => void;
}

function Drone3D({ drone, selected, onClick }: { drone: Drone; selected: boolean; onClick: () => void }) {
  const [ref] = useBox<Mesh>(() => ({ mass: 1, position: [drone.location.x, drone.location.y + 2, drone.location.z] }));
  return (
    <mesh ref={ref} castShadow receiveShadow onClick={onClick}>
      <boxGeometry args={[3, 1, 3]} />
      <meshStandardMaterial color={
        drone.status === 'in-mission' ? '#00ff00' :
        drone.status === 'charging' ? '#ffff00' :
        selected ? '#ff4081' : '#6ec1c8'
      } />
    </mesh>
  );
}

function Agent3D({ agent }: { agent: Agent }) {
  const [ref] = useBox<Mesh>(() => ({ mass: 1, position: [agent.location.x, agent.location.y + 2, agent.location.z], type: 'Static' }));
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial color={
        agent.type === 'onchain' ? '#ff00ff' :
        agent.type === 'hybrid' ? '#ff9800' : '#00ffff'
      } />
    </mesh>
  );
}

export default function DroneSim3DView({ drones, agents, selectedDroneId, onDroneClick }: DroneSim3DViewProps) {
  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }} shadows>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      <Physics>
        {/* Ground */}
        <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#1a2236" />
        </mesh>
        {/* 3D Drones synced with state */}
        {drones.map((drone) => (
          <Drone3D
            key={drone.id}
            drone={drone}
            selected={selectedDroneId === drone.id}
            onClick={() => onDroneClick(drone)}
          />
        ))}
        {/* 3D Agents synced with state */}
        {agents.map((agent) => (
          <Agent3D key={agent.id} agent={agent} />
        ))}
      </Physics>
      <OrbitControls />
    </Canvas>
  );
} 