import { NextRequest, NextResponse } from 'next/server';
import { DroneMission, MissionLog, Agent } from '../../types';
import { agents } from '../../utils/agentStore';

// In-memory mission store (mock)
let missions: DroneMission[] = [
  {
    id: 'mission-1',
    droneId: 'drone-1',
    pilot: 'user-1',
    description: 'Map sector A',
    type: 'mapping',
    status: 'pending',
    reward: 100,
    difficulty: 'easy',
    xpReward: 10,
    reputationReward: 1,
    missionLog: [],
    metadata: {},
  },
];

export async function GET() {
  return NextResponse.json({ missions });
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
  const mission = missions.find((m) => m.id === id);
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