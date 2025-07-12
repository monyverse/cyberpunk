import { Agent } from '../types';

// Shared in-memory agent store (mock)
export let agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Alpha',
    type: 'onchain',
    status: 'idle',
    location: { x: 0, y: 0, z: 0 },
    strategy: 'assigner',
    level: 1,
    experience: 0,
    reputation: 0,
    skills: [
      { name: 'mapping', level: 1, experience: 0 },
      { name: 'delivery', level: 1, experience: 0 },
    ],
    logs: [],
    missionHistory: [],
  },
];

export function setAgents(newAgents: Agent[]) {
  agents = newAgents;
} 