import { NextRequest, NextResponse } from 'next/server';
import { seedDemoData, resetDemoData } from '@/utils/seedDemo';

export async function POST(req: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (action === 'seed') {
    await seedDemoData();
    return NextResponse.json({ status: 'ok', message: 'Demo data seeded.' });
  }
  if (action === 'reset') {
    await resetDemoData();
    return NextResponse.json({ status: 'ok', message: 'Demo data reset.' });
  }
  return NextResponse.json({ status: 'error', message: 'Invalid action.' }, { status: 400 });
} 