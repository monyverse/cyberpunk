import { NextRequest, NextResponse } from 'next/server';
import { ReppoSolverFactory } from '../../../../utils/reppoIntegration';

export async function POST(request: NextRequest) {
  try {
    const { nodeConfig, rfdData } = await request.json();

    const reppoFactory = new ReppoSolverFactory();

    let result;

    if (nodeConfig) {
      // Register solver node
      result = await reppoFactory.createDeFiSolver();
    } else if (rfdData) {
      // Process RFD
      result = await reppoFactory.processDeFiMarketData(
        rfdData.token || 'ETH',
        rfdData.metrics || ['price', 'volume']
      );
    } else {
      return NextResponse.json(
        { error: 'Either nodeConfig or rfdData is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: rfdData ? 'RFD processed successfully' : 'Solver node registered successfully'
    });

  } catch (error) {
    console.error('Reppo solver error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process Reppo request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 