import { NextRequest, NextResponse } from 'next/server';
import { SpexiAnalysisFactory } from '../../../../utils/spexiIntegration';

export async function POST(request: NextRequest) {
  try {
    const { location, analysisType } = await request.json();

    if (!location || !location.lat || !location.lng) {
      return NextResponse.json(
        { error: 'Location with lat and lng is required' },
        { status: 400 }
      );
    }

    const spexiFactory = new SpexiAnalysisFactory();

    let result;

    if (analysisType === 'disaster') {
      // Disaster response analysis
      result = await spexiFactory.createDisasterResponseAnalysis(
        location,
        new Date().toISOString()
      );
    } else {
      // Site analysis
      result = await spexiFactory.createSiteAnalysis(location);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${analysisType || 'Site'} analysis completed successfully`
    });

  } catch (error) {
    console.error('Spexi analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform Spexi analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 