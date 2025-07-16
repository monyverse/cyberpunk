import { NextRequest, NextResponse } from 'next/server';
import { DroneMission, MissionLog } from '../../../types';
import { agents } from '../../../utils/agentStore';
import { missions as demoMissions } from '../../../utils/demoSeed';

// In-memory mission store (mock)
const missions = [
  {
    id: '1',
    title: 'Data Collection Mission',
    description: 'Collect environmental data from specified coordinates',
    status: 'active',
    reward: 100,
    location: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2', 
    title: 'Surveillance Mission',
    description: 'Monitor area for suspicious activity',
    status: 'completed',
    reward: 150,
    location: { lat: 34.0522, lng: -118.2437 }
  }
];

export async function GET() {
  // Check if we have demo missions and use them instead
  const missionsToReturn = demoMissions.length > 0 ? demoMissions : missions;
  
  return NextResponse.json({ missions: missionsToReturn });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Map DroneMission to the expected mission structure for the missions array
  const newMission = {
    id: `mission-${Date.now()}`,
    title: data.title || data.description || 'Untitled Mission',
    description: data.description || '',
    status: 'pending',
    reward: data.reward || 0,
    location: data.location || { lat: 0, lng: 0 },
    // Optionally include DroneMission-specific fields if needed
    ...data,
    missionLog: [],
  };
  missions.push(newMission);
  return NextResponse.json({ mission: newMission });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...updates } = data;
  
  // Check demo missions first, then fallback to regular missions
  const allMissions = [...demoMissions, ...missions];
  const mission = allMissions.find((m) => m.id === id);
  
  if (!mission) return NextResponse.json({ error: 'Mission not found' }, { status: 404 });

  // If status is being set to 'completed', update agent XP, logs, etc.
  if (updates.status === 'completed' && mission.status !== 'completed') {
    mission.status = 'completed';
    // Only set endTime if it exists on the mission
    if ('endTime' in mission) {
      (mission as any).endTime = new Date().toISOString();
    }
    // Log mission completion
    const log: MissionLog = {
      timestamp: (mission as any).endTime || new Date().toISOString(),
      event: 'Mission completed',
      details: {
        agentId: 'assignedAgentId' in mission ? (mission as any).assignedAgentId : undefined,
        reward: 'xpReward' in mission ? (mission as any).xpReward : mission.reward,
        xp: 'xpReward' in mission ? (mission as any).xpReward : undefined,
        reputation: 'reputationReward' in mission ? (mission as any).reputationReward : undefined,
      },
    };
    if ('missionLog' in mission && Array.isArray((mission as any).missionLog)) {
      (mission as any).missionLog.push(log);
    }
    // Update assigned agent
    if ('assignedAgentId' in mission && (mission as any).assignedAgentId) {
      const agent = agents.find((a) => a.id === (mission as any).assignedAgentId);
      if (agent) {
        // XP and level logic
        agent.experience = (agent.experience || 0) + (mission as any).xpReward || 0;
        agent.reputation = (agent.reputation || 0) + (mission as any).reputationReward || 0;
        // Simple level up: every 100 XP = 1 level
        const newLevel = Math.floor((agent.experience || 0) / 100) + 1;
        if (!agent.level || agent.level < newLevel) agent.level = newLevel;
        // Add to mission history
        agent.missionHistory = agent.missionHistory || [];
        agent.missionHistory.push(mission.id);
        // Log agent action
        agent.logs = agent.logs || [];
        agent.logs.push({
          timestamp: (mission as any).endTime || new Date().toISOString(),
          action: 'Completed mission',
          details: {
            missionId: mission.id,
            xpGained: (mission as any).xpReward,
            reputationGained: (mission as any).reputationReward,
          },
        });
      }
    }
  }
  Object.assign(mission, updates);
  return NextResponse.json({ mission });
} 