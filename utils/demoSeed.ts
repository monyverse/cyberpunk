import { agents, setAgents } from './agentStore';
import { DroneMission, Agent } from '../types';

// In-memory mission store (mock, to be imported in API route)
let missions: DroneMission[] = [];
export function setMissions(newMissions: DroneMission[]) {
  missions = newMissions;
}
export { missions };

export function seedDemoData(scenario: string = 'default') {
  let agentSeed: Agent[] = [];
  let missionSeed: DroneMission[] = [];
  switch (scenario) {
    case 'empty':
      agentSeed = [];
      missionSeed = [];
      break;
    case 'all-completed':
      agentSeed = [
        { id: 'agent-1', name: 'Alpha', type: 'onchain', status: 'active', location: { x: 0, y: 0, z: 0 }, strategy: 'assigner', level: 2, experience: 120, reputation: 5, skills: [], logs: [], missionHistory: ['mission-1', 'mission-2'] },
      ];
      missionSeed = [
        { id: 'mission-1', droneId: 'drone-1', pilot: 'user-1', description: 'Map sector A', type: 'mapping', status: 'completed', reward: 100, difficulty: 'easy', xpReward: 10, reputationReward: 1, missionLog: [], metadata: {}, endTime: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'mission-2', droneId: 'drone-2', pilot: 'user-2', description: 'Deliver package B', type: 'delivery', status: 'completed', reward: 80, difficulty: 'medium', xpReward: 15, reputationReward: 2, missionLog: [], metadata: {}, endTime: new Date(Date.now() - 86400000).toISOString() },
      ];
      break;
    case 'all-pending':
      agentSeed = [
        { id: 'agent-1', name: 'Alpha', type: 'onchain', status: 'idle', location: { x: 0, y: 0, z: 0 }, strategy: 'assigner', level: 1, experience: 0, reputation: 0, skills: [], logs: [], missionHistory: [] },
      ];
      missionSeed = [
        { id: 'mission-1', droneId: '', pilot: 'user-1', description: 'Map sector A', type: 'mapping', status: 'pending', reward: 100, difficulty: 'easy', xpReward: 10, reputationReward: 1, missionLog: [], metadata: {} },
        { id: 'mission-2', droneId: '', pilot: 'user-2', description: 'Deliver package B', type: 'delivery', status: 'pending', reward: 80, difficulty: 'medium', xpReward: 15, reputationReward: 2, missionLog: [], metadata: {} },
      ];
      break;
    case 'busy':
      agentSeed = [
        { id: 'agent-1', name: 'Alpha', type: 'onchain', status: 'active', location: { x: 0, y: 0, z: 0 }, strategy: 'assigner', level: 2, experience: 120, reputation: 5, skills: [], logs: [], missionHistory: ['mission-1'] },
        { id: 'agent-2', name: 'Beta', type: 'offchain', status: 'active', location: { x: 10, y: 0, z: 10 }, strategy: 'trader', level: 1, experience: 30, reputation: 2, skills: [], logs: [], missionHistory: ['mission-2'] },
      ];
      missionSeed = [
        { id: 'mission-1', droneId: 'drone-1', pilot: 'user-1', description: 'Map sector A', type: 'mapping', status: 'active', reward: 100, difficulty: 'easy', xpReward: 10, reputationReward: 1, missionLog: [], metadata: {} },
        { id: 'mission-2', droneId: 'drone-2', pilot: 'user-2', description: 'Deliver package B', type: 'delivery', status: 'active', reward: 80, difficulty: 'medium', xpReward: 15, reputationReward: 2, missionLog: [], metadata: {} },
      ];
      break;
    default:
      agentSeed = [
        { id: 'agent-1', name: 'Alpha', type: 'onchain', status: 'active', location: { x: 0, y: 0, z: 0 }, strategy: 'assigner', level: 2, experience: 120, reputation: 5, skills: [], logs: [], missionHistory: ['mission-1', 'mission-2'] },
        { id: 'agent-2', name: 'Beta', type: 'offchain', status: 'idle', location: { x: 10, y: 0, z: 10 }, strategy: 'trader', level: 1, experience: 30, reputation: 2, skills: [], logs: [], missionHistory: ['mission-3'] },
        { id: 'agent-3', name: 'Gamma', type: 'hybrid', status: 'active', location: { x: -10, y: 0, z: -10 }, strategy: 'social', level: 1, experience: 10, reputation: 1, skills: [], logs: [], missionHistory: [] },
      ];
      missionSeed = [
        { id: 'mission-1', droneId: 'drone-1', pilot: 'user-1', description: 'Map sector A', type: 'mapping', status: 'completed', reward: 100, difficulty: 'easy', xpReward: 10, reputationReward: 1, missionLog: [], metadata: {}, endTime: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'mission-2', droneId: 'drone-2', pilot: 'user-2', description: 'Deliver package B', type: 'delivery', status: 'completed', reward: 80, difficulty: 'medium', xpReward: 15, reputationReward: 2, missionLog: [], metadata: {}, endTime: new Date(Date.now() - 86400000).toISOString() },
        { id: 'mission-3', droneId: 'drone-3', pilot: 'user-3', description: 'Surveillance C', type: 'surveillance', status: 'active', reward: 120, difficulty: 'hard', xpReward: 20, reputationReward: 3, missionLog: [], metadata: {} },
        { id: 'mission-4', droneId: '', pilot: 'user-4', description: 'Custom mission D', type: 'custom', status: 'pending', reward: 50, difficulty: 'easy', xpReward: 5, reputationReward: 1, missionLog: [], metadata: {} },
      ];
  }
  setAgents(agentSeed);
  setMissions(missionSeed);
}

export function resetDemoData() {
  setAgents([]);
  setMissions([]);
} 