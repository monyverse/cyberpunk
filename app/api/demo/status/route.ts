import { NextResponse } from 'next/server';
import { missions } from '@/utils/demoSeed';
import { agents } from '@/utils/agentStore';

export async function GET() {
  try {
    const status = {
      isDemoMode: agents.length > 0 || missions.length > 0,
      agentCount: agents.length,
      missionCount: missions.length
    };
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting demo status:', error);
    return NextResponse.json(
      { error: 'Failed to get demo status' },
      { status: 500 }
    );
  }
} 