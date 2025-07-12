import { NextRequest, NextResponse } from 'next/server';
import { seedDemoData, resetDemoData } from '../../utils/demoSeed';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scenario = searchParams.get('scenario') || 'default';
  const reset = searchParams.get('reset') === '1';
  if (reset) {
    resetDemoData();
    return NextResponse.json({ ok: true, reset: true });
  }
  seedDemoData(scenario);
  return NextResponse.json({ ok: true, scenario });
} 