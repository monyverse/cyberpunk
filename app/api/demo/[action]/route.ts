import { NextRequest, NextResponse } from 'next/server';
import { seedDemoData, resetDemoData } from '@/utils/demoSeed';

export async function POST(req: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  const { searchParams } = new URL(req.url);
  const scenario = searchParams.get('scenario') || 'default';
  
  if (action === 'seed') {
    seedDemoData(scenario);
    return NextResponse.json({ status: 'ok', message: 'Demo data seeded.', scenario });
  }
  if (action === 'reset') {
    resetDemoData();
    return NextResponse.json({ status: 'ok', message: 'Demo data reset.' });
  }
  return NextResponse.json({ status: 'error', message: 'Invalid action.' }, { status: 400 });
} 