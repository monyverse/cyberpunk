import { NextRequest, NextResponse } from 'next/server';

// Mock agents data
const agents: any[] = [
  {
    id: '1',
    name: 'Weather_Analyzer_001',
    type: 'weather',
    capabilities: ['weather_data', 'risk_assessment'],
    status: 'active',
    metadata: {
      location: 'New York',
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'Filecoin_Storage_001',
    type: 'filecoin',
    capabilities: ['storage', 'payment', 'bridge'],
    status: 'active',
    metadata: {
      totalStorage: '45.2GB',
      filesStored: 156
    }
  },
  {
    id: '3',
    name: 'NEAR_Agent_001',
    type: 'near',
    capabilities: ['ai_execution', 'cross_chain', 'intent_processing'],
    status: 'active',
    metadata: {
      chain: 'near',
      executions: 23
    }
  }
];

export async function GET() {
  try {
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ agents: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newAgent = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      capabilities: body.capabilities || [],
      status: 'active',
      metadata: body.metadata || {},
      createdAt: new Date().toISOString()
    };

    agents.push(newAgent);

    return NextResponse.json({ agent: newAgent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' }, 
      { status: 500 }
    );
  }
} 