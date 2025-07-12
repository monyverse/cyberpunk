// Demo seeding utility for agents and missions
import type { Agent, DroneMission } from '../types';

// In-memory demo data stores (replace with DB or persistent store as needed)
let demoAgents: Agent[] = [];
let demoMissions: DroneMission[] = [];

export async function seedDemoData() {
  demoAgents = [
    {
      id: 'agent-1',
      name: 'Neo',
      type: 'onchain',
      status: 'active',
      location: { x: 0, y: 0, z: 0 },
      strategy: 'default',
      metadata: { avatar: '🦾' },
    },
    {
      id: 'agent-2',
      name: 'Trinity',
      type: 'offchain',
      status: 'idle',
      location: { x: 10, y: 0, z: 5 },
      strategy: 'trader',
      metadata: { avatar: '🕶️' },
    },
  ];
  demoMissions = [
    {
      id: 'mission-1',
      droneId: 'drone-1',
      pilot: 'agent-1',
      description: 'Hack into the city mainframe and extract data.',
      type: 'mapping',
      status: 'pending',
      reward: 100,
      assignedAgentId: 'agent-1',
      startTime: new Date().toISOString(),
    },
    {
      id: 'mission-2',
      droneId: 'drone-2',
      pilot: 'agent-2',
      description: 'Patrol the digital perimeter for threats.',
      type: 'surveillance',
      status: 'active',
      reward: 150,
      assignedAgentId: 'agent-2',
      startTime: new Date().toISOString(),
    },
  ];
}

export async function resetDemoData() {
  demoAgents = [];
  demoMissions = [];
}

export function getDemoAgents(): Agent[] {
  return demoAgents;
}
export function getDemoMissions(): DroneMission[] {
  return demoMissions;
} 