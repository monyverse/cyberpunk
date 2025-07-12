import { NextRequest, NextResponse } from 'next/server';
import { Agent } from '../../types';
import { agents, setAgents } from '../../utils/agentStore';

export async function GET() {
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newAgent: Agent = {
    ...data,
    id: `agent-${Date.now()}`,
    status: 'idle',
    level: 1,
    experience: 0,
    reputation: 0,
    skills: [],
    logs: [],
    missionHistory: [],
  };
  agents.push(newAgent);
  return NextResponse.json({ agent: newAgent });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...updates } = data;
  const agent = agents.find((a) => a.id === id);
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  Object.assign(agent, updates);
  return NextResponse.json({ agent });
} 