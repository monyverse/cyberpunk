import { NextRequest, NextResponse } from 'next/server';
import { BioAIApplicationFactory } from '../../../../utils/bioAIIntegration';

export async function POST(request: NextRequest) {
  try {
    const { applicationConfig } = await request.json();

    if (!applicationConfig) {
      return NextResponse.json(
        { error: 'Application configuration is required' },
        { status: 400 }
      );
    }

    const bioAIFactory = new BioAIApplicationFactory();

    // Create AI application with DID integration
    const result = await bioAIFactory.createCulturalHeritageAI();

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Bio AI application created successfully with DID integration'
    });

  } catch (error) {
    console.error('Bio AI DID creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create Bio AI application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 