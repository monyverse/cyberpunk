"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Environment, Text, Html, useGLTF, Float } from "@react-three/drei";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { Mesh, Vector3 as ThreeVector3, Color } from "three";
import * as THREE from 'three';
import type { LocalAgent } from './DroneSimDashboard';

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

interface DroneSim3DViewProps {
  drones: Drone[];
  agents: LocalAgent[];
  selectedDroneId: string | null;
  onDroneClick: (drone: Drone) => void;
  isRunning?: boolean;
}

// AI-powered drone behavior component
function DroneAI({ drone, isRunning }: { drone: Drone; isRunning?: boolean }) {
  const [ref, api] = useBox<Mesh>(() => ({ 
    mass: 1, 
    position: [drone.location.x, drone.location.y + 2, drone.location.z],
    args: [3, 1, 3]
  }));
  
  const [targetPosition, setTargetPosition] = useState([drone.location.x, drone.location.y + 2, drone.location.z]);
  const [isMoving, setIsMoving] = useState(false);

  // AI behavior logic
  useFrame((state) => {
    if (!isRunning || !ref.current) return;

    const currentPos = ref.current.position;
    const target = new ThreeVector3(...targetPosition);
    const distance = currentPos.distanceTo(target);

    if (distance > 0.5) {
      // Move towards target
      const direction = target.clone().sub(currentPos).normalize();
      const speed = 0.1;
      api.velocity.set(direction.x * speed, 0, direction.z * speed);
      setIsMoving(true);
    } else {
      // Reached target, set new random target
      if (isMoving) {
        const newTarget = [
          (Math.random() - 0.5) * 80,
          drone.location.y + 2,
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
      default: return '#6ec1c8';
    }
  };

  return (
    <mesh ref={ref} castShadow receiveShadow onClick={() => {
      // Handle drone click
      console.log('Drone clicked:', drone.id);
    }}>
      <boxGeometry args={[3, 1, 3]} />
      <meshStandardMaterial color={getDroneColor()} />
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
          whiteSpace: 'nowrap'
        }}>
          {drone.battery.toFixed(0)}%
        </div>
      </Html>
    </mesh>
  );
}

// Enhanced agent component with AI behaviors
function AgentAI({ agent, isRunning }: { agent: LocalAgent; isRunning?: boolean }) {
  const [ref, api] = useSphere<Mesh>(() => ({ 
    mass: 1, 
    position: [agent.location.x, agent.location.y + 2, agent.location.z], 
    type: 'Static',
    args: [2]
  }));
  
  const [isInteracting, setIsInteracting] = useState(false);

  // AI interaction behavior
  useFrame((state) => {
    if (!isRunning || !ref.current) return;

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
        <meshStandardMaterial color={getAgentColor()} />
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
            whiteSpace: 'nowrap'
          }}>
            🤖 {agent.strategy}
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
          textAlign: 'center'
        }}>
          {agent.name}
          <br />
          {agent.type} • {agent.strategy}
        </div>
      </Html>
    </group>
  );
}

// Cyberpunk city buildings
function CyberpunkBuildings() {
  const buildings = useMemo(() => {
    const buildingData: Array<{
      position: [number, number, number];
      size: [number, number, number];
      color: Color;
    }> = [];
    for (let i = 0; i < 15; i++) {
      buildingData.push({
        position: [
          (Math.random() - 0.5) * 160,
          0,
          (Math.random() - 0.5) * 160
        ],
        size: [
          Math.random() * 10 + 5,
          Math.random() * 30 + 10,
          Math.random() * 10 + 5
        ],
        color: new Color().setHSL(Math.random() * 0.1 + 0.05, 0.8, 0.3)
      });
    }
    return buildingData;
  }, []);

  return (
    <>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={building.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={building.size} />
          <meshStandardMaterial color={building.color} />
          
          {/* Building windows */}
          <mesh position={[0, building.size[1] / 2 - 1, 0]}>
            <boxGeometry args={[building.size[0] - 0.2, 2, building.size[2] - 0.2]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
          </mesh>
        </mesh>
      ))}
    </>
  );
}

// Charging station with particle effects
function ChargingStation() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 5,
      z: (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.02,
      vy: Math.random() * 0.02,
      vz: (Math.random() - 0.5) * 0.02
    }));
    setParticles(newParticles);
  }, []);

  useFrame(() => {
    setParticles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      z: p.z + p.vz,
      vy: p.vy - 0.001 // gravity
    })));
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main charging station */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[3, 3, 2, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Charging pad */}
      <mesh receiveShadow position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Energy particles */}
      {particles.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* Charging station label */}
      <Html position={[0, 3, 0]} center>
        <div style={{
          background: 'rgba(255,215,0,0.9)',
          color: 'black',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          ⚡ CHARGING STATION
        </div>
      </Html>
    </group>
  );
}

// Mission waypoints
function MissionWaypoints({ missions }: { missions: any[] }) {
  return (
    <>
      {missions.filter(m => m.status === 'pending' && m.target).map((mission, index) => (
        <group key={mission.id} position={[mission.target.x, 0, mission.target.z]}>
          {/* Waypoint marker */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
              <cylinderGeometry args={[1, 1, 0.2, 8]} />
              <meshStandardMaterial color="#ff006e" emissive="#ff006e" emissiveIntensity={0.3} />
            </mesh>
          </Float>
          
          {/* Mission info */}
          <Html position={[0, 3, 0]} center>
            <div style={{
              background: 'rgba(255,0,110,0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}>
              🎯 {mission.type.toUpperCase()}
              <br />
              {mission.reward} CYBER
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

// Ground with cyberpunk grid
function CyberpunkGround() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0],
    args: [200, 200]
  }));

  return (
    <group>
      {/* Main ground */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a2236" />
      </mesh>
      
      {/* Cyberpunk grid lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={i}>
          <mesh position={[0, 0.01, (i - 10) * 10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 0.1]} />
            <meshStandardMaterial color="#6ec1c8" emissive="#6ec1c8" emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[(i - 10) * 10, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 200]} />
            <meshStandardMaterial color="#6ec1c8" emissive="#6ec1c8" emissiveIntensity={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function DroneSim3DView({ 
  drones, 
  agents, 
  selectedDroneId, 
  onDroneClick,
  isRunning = false 
}: DroneSim3DViewProps) {
  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }} shadows>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 50, 0]} intensity={0.5} color="#6ec1c8" />
      <Environment preset="city" />
      
      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground */}
        <CyberpunkGround />
        
        {/* Charging station */}
        <ChargingStation />
        
        {/* Cyberpunk buildings */}
        <CyberpunkBuildings />
        
        {/* Mission waypoints */}
        <MissionWaypoints missions={[]} />
        
        {/* AI-powered drones */}
        {drones.map((drone) => (
          <DroneAI
            key={drone.id}
            drone={drone}
            isRunning={isRunning}
          />
        ))}
        
        {/* AI-powered agents */}
        {agents.map((agent) => (
          <AgentAI
            key={agent.id}
            agent={agent}
            isRunning={isRunning}
          />
        ))}
      </Physics>
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={200}
      />
      
      {/* UI Overlay */}
      <Html position={[0, 0, 0]} fullscreen>
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
          <div>🚁 Drones: {drones.length}</div>
          <div>🤖 Agents: {agents.length}</div>
          <div>⚡ Status: {isRunning ? 'RUNNING' : 'STOPPED'}</div>
        </div>
      </Html>
    </Canvas>
  );
} 