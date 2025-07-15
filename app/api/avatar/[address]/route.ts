import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Get avatar from in-memory store (in real app, use database)
    if (!(global as unknown as Map<string, string>).has(address)) {
      (global as unknown as Map<string, string>).set(address, address);
    }
    const avatar = (global as unknown as Map<string, string>).get(address);

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar
    });

  } catch (error) {
    console.error('Error retrieving avatar:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve avatar' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Remove avatar from in-memory store
    if (!(global as unknown as Map<string, string>).has(address)) {
      (global as unknown as Map<string, string>).set(address, address);
    }
    const deleted = (global as unknown as Map<string, string>).delete(address);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Avatar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting avatar:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
} 