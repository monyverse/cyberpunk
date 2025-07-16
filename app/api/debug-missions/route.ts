import { NextResponse } from 'next/server';
import { missions } from '../../../utils/demoSeed';
import { agents } from '../../../utils/agentStore';

export async function GET() {
  const completedMissions = missions.filter(m => m.status === 'completed');
  const pendingMissions = missions.filter(m => m.status === 'pending');
  const activeMissions = missions.filter(m => m.status === 'active');
  
  return NextResponse.json({
    totalMissions: missions.length,
    completedMissions: completedMissions.length,
    pendingMissions: pendingMissions.length,
    activeMissions: activeMissions.length,
    allMissions: missions,
    completedMissionsWithEndTime: completedMissions.filter(m => m.endTime),
    agents: agents.length,
    demoData: {
      missions,
      agents
    }
  });
} 