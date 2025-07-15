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
  const newMission: DroneMission = {
    ...data,
    id: `mission-${Date.now()}`,
    status: 'pending',
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
    mission.endTime = new Date().toISOString();
    // Log mission completion
    const log: MissionLog = {
      timestamp: mission.endTime,
      event: 'Mission completed',
      details: { agentId: mission.assignedAgentId, reward: mission.reward, xp: mission.xpReward, reputation: mission.reputationReward },
    };
    mission.missionLog = mission.missionLog || [];
    mission.missionLog.push(log);
    // Update assigned agent
    if (mission.assignedAgentId) {
      const agent = agents.find((a) => a.id === mission.assignedAgentId);
      if (agent) {
        // XP and level logic
        agent.experience = (agent.experience || 0) + (mission.xpReward || 0);
        agent.reputation = (agent.reputation || 0) + (mission.reputationReward || 0);
        // Simple level up: every 100 XP = 1 level
        const newLevel = Math.floor((agent.experience || 0) / 100) + 1;
        if (!agent.level || agent.level < newLevel) agent.level = newLevel;
        // Add to mission history
        agent.missionHistory = agent.missionHistory || [];
        agent.missionHistory.push(mission.id);
        // Log agent action
        agent.logs = agent.logs || [];
        agent.logs.push({
          timestamp: mission.endTime,
          action: 'Completed mission',
          details: { missionId: mission.id, xpGained: mission.xpReward, reputationGained: mission.reputationReward },
        });
      }
    }
  }
  Object.assign(mission, updates);
  return NextResponse.json({ mission });
} 