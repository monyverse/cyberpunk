import { NextRequest, NextResponse } from 'next/server';
import { Agent } from '../../types';
import { agents } from '../../utils/agentStore';

export async function GET() {
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name and type' },
        { status: 400 }
      );
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: data.name,
      type: data.type,
      status: 'idle',
      location: data.location || { x: 0, y: 0, z: 0 },
      strategy: data.strategy || 'default',
      level: data.level || 1,
      experience: data.experience || 0,
      reputation: data.reputation || 0,
      skills: data.skills || [],
      logs: data.logs || [],
      missionHistory: data.missionHistory || [],
      metadata: data.metadata || {},
    };
    
    agents.push(newAgent);
    console.log('Agent created successfully:', newAgent);
    return NextResponse.json({ agent: newAgent });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...updates } = data;
  const agent = agents.find((a) => a.id === id);
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  Object.assign(agent, updates);
  return NextResponse.json({ agent });
} 