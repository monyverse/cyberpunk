import { NextResponse } from 'next/server';
import { getDemoStatus } from '@/utils/seedDemo';

export async function GET() {
  try {
    const status = getDemoStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting demo status:', error);
    return NextResponse.json(
      { error: 'Failed to get demo status' },
      { status: 500 }
    );
  }
} 