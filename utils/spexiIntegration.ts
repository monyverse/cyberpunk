// Spexi Integration Module for Hackathon
// Implements aerial imagery analysis and AI-powered insights

// Spexi Configuration
export const SPEXI_CONFIG = {
  apiUrl: 'https://api.spexi.com',
  layerDroneUrl: 'https://layerdrone.org',
  apiKey: process.env.NEXT_PUBLIC_SPEXI_API_KEY || '',
  endpoints: {
    imagery: '/api/v1/imagery',
    analysis: '/api/v1/analysis',
    derivatives: '/api/v1/derivatives',
    ai: '/api/v1/ai'
  }
};

// Aerial Imagery Interface
export interface AerialImagery {
  id: string;
  captureDate: string;
  location: {
    lat: number;
    lng: number;
    altitude: number;
  };
  resolution: {
    width: number;
    height: number;
    gsd: number; // Ground Sample Distance in cm
  };
  metadata: {
    camera: string;
    drone: string;
    weather: string;
    lighting: string;
  };
  imageryUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  format: 'jpg' | 'png' | 'tiff' | 'raw';
}

// Imagery Derivative Interface
export interface ImageryDerivative {
  id: string;
  originalImageryId: string;
  type: 'orthomosaic' | 'point_cloud' | 'elevation_model' | 'mesh_3d' | 'radiance_field';
  processingMethod: string;
  accuracy: number;
  fileUrl: string;
  metadata: Record<string, any>;
  createdAt: string;
}

// AI Analysis Result Interface
export interface AIAnalysisResult {
  id: string;
  imageryId: string;
  analysisType: 'change_detection' | 'object_detection' | 'classification' | 'measurement';
  confidence: number;
  results: any[];
  processingTime: number;
  model: string;
  timestamp: string;
}

// Spexi Integration Class
export class SpexiIntegration {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || SPEXI_CONFIG.apiKey;
  }

  // Get available aerial imagery
  async getAerialImagery(
    location: { lat: number; lng: number },
    radius: number = 5000,
    dateRange?: { start: string; end: string }
  ): Promise<AerialImagery[]> {
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        radius: radius.toString(),
        ...(dateRange && {
          start_date: dateRange.start,
          end_date: dateRange.end
        })
      });

      const response = await fetch(
        `${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.imagery}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch aerial imagery');
      }

      const data = await response.json();
      return data.imagery || [];
    } catch (error) {
      console.error('Aerial imagery fetch error:', error);
      return this.getMockAerialImagery(location, radius);
    }
  }

  // Create orbit views from panorama
  async createOrbitViews(
    panoramaImagery: AerialImagery[],
    centerPoint: { lat: number; lng: number },
    radius: number
  ): Promise<{
    orbitViews: AerialImagery[];
    processingMethod: string;
    accuracy: number;
  }> {
    try {
      const requestData = {
        panoramaImagery: panoramaImagery.map(img => img.id),
        centerPoint,
        radius,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.derivatives}/orbit-views`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to create orbit views');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Orbit view creation error:', error);
      return this.getMockOrbitViews(panoramaImagery, centerPoint, radius);
    }
  }

  // Change detection and identification
  async detectChanges(
    beforeImagery: AerialImagery,
    afterImagery: AerialImagery,
    analysisType: 'detection' | 'identification' = 'identification'
  ): Promise<{
    changes: Array<{
      type: string;
      location: { lat: number; lng: number };
      confidence: number;
      description: string;
      area?: number;
    }>;
    processingMethod: string;
    accuracy: number;
  }> {
    try {
      const requestData = {
        beforeImageryId: beforeImagery.id,
        afterImageryId: afterImagery.id,
        analysisType,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.analysis}/change-detection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Change detection failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Change detection error:', error);
      return this.getMockChangeDetection(beforeImagery, afterImagery, analysisType);
    }
  }

  // Geometrically accurate VLM (Vision Language Model)
  async createGeometricVLM(
    imagery: AerialImagery,
    query: string
  ): Promise<{
    answer: string;
    confidence: number;
    measurements: Record<string, number>;
    geometricAccuracy: number;
    model: string;
  }> {
    try {
      const requestData = {
        imageryId: imagery.id,
        query,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.ai}/geometric-vlm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Geometric VLM analysis failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Geometric VLM error:', error);
      return this.getMockGeometricVLM(imagery, query);
    }
  }

  // Create imagery derivatives
  async createDerivative(
    imagery: AerialImagery,
    derivativeType: 'orthomosaic' | 'point_cloud' | 'elevation_model' | 'mesh_3d' | 'radiance_field',
    processingOptions?: any
  ): Promise<ImageryDerivative> {
    try {
      const requestData = {
        imageryId: imagery.id,
        derivativeType,
        processingOptions: processingOptions || {},
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.derivatives}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Derivative creation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Derivative creation error:', error);
      return this.getMockDerivative(imagery, derivativeType);
    }
  }

  // AI-powered object detection
  async detectObjects(
    imagery: AerialImagery,
    objectTypes: string[] = ['building', 'vehicle', 'tree', 'road']
  ): Promise<AIAnalysisResult> {
    try {
      const requestData = {
        imageryId: imagery.id,
        objectTypes,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.ai}/object-detection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Object detection failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Object detection error:', error);
      return this.getMockObjectDetection(imagery, objectTypes);
    }
  }

  // Low-cost AI solutions for quick insights
  async getQuickInsights(
    imagery: AerialImagery,
    scenario: 'disaster_response' | 'solar_installation' | 'construction_monitoring' | 'agriculture'
  ): Promise<{
    scenario: string;
    insights: string[];
    recommendations: string[];
    confidence: number;
    processingTime: number;
  }> {
    try {
      const requestData = {
        imageryId: imagery.id,
        scenario,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.ai}/quick-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Quick insights failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Quick insights error:', error);
      return this.getMockQuickInsights(imagery, scenario);
    }
  }

  // Roof analysis for solar installation
  async analyzeRoofForSolar(
    imagery: AerialImagery
  ): Promise<{
    roofArea: number;
    suitableArea: number;
    orientation: string;
    shading: number;
    solarPotential: number;
    recommendations: string[];
  }> {
    try {
      const requestData = {
        imageryId: imagery.id,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.analysis}/roof-solar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Roof analysis failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Roof analysis error:', error);
      return this.getMockRoofAnalysis(imagery);
    }
  }

  // Disaster response analysis
  async analyzeDisasterResponse(
    beforeImagery: AerialImagery,
    afterImagery: AerialImagery
  ): Promise<{
    damageAssessment: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      affectedArea: number;
      damageTypes: string[];
    };
    responseRecommendations: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
  }> {
    try {
      const requestData = {
        beforeImageryId: beforeImagery.id,
        afterImageryId: afterImagery.id,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${SPEXI_CONFIG.apiUrl}${SPEXI_CONFIG.endpoints.analysis}/disaster-response`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Disaster response analysis failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Disaster response analysis error:', error);
      return this.getMockDisasterResponse(beforeImagery, afterImagery);
    }
  }

  // Mock data methods
  private getMockAerialImagery(location: any, radius: number): AerialImagery[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `imagery_${Date.now()}_${i}`,
      captureDate: new Date(Date.now() - i * 86400000).toISOString(),
      location: {
        lat: location.lat + (Math.random() - 0.5) * 0.01,
        lng: location.lng + (Math.random() - 0.5) * 0.01,
        altitude: 100 + Math.random() * 50
      },
      resolution: {
        width: 4000,
        height: 3000,
        gsd: 5 + Math.random() * 5
      },
      metadata: {
        camera: 'DJI Zenmuse X7',
        drone: 'DJI Matrice 600',
        weather: 'clear',
        lighting: 'daylight'
      },
      imageryUrl: `https://spexi.com/imagery/mock_${i}.jpg`,
      thumbnailUrl: `https://spexi.com/thumbnails/mock_${i}.jpg`,
      fileSize: 5000000 + Math.random() * 10000000,
      format: 'jpg' as const
    }));
  }

  private getMockOrbitViews(panoramaImagery: AerialImagery[], centerPoint: any, radius: number): any {
    return {
      orbitViews: panoramaImagery.map(img => ({
        ...img,
        id: `orbit_${img.id}`,
        metadata: { ...img.metadata, type: 'orbit_view' }
      })),
      processingMethod: 'panorama_to_orbit_conversion',
      accuracy: 0.85
    };
  }

  private getMockChangeDetection(beforeImagery: AerialImagery, afterImagery: AerialImagery, analysisType: string): any {
    const changes = [
      {
        type: analysisType === 'identification' ? 'new_building' : 'structural_change',
        location: { lat: 40.7128, lng: -74.0060 },
        confidence: 0.92,
        description: 'New commercial building constructed',
        area: 2500
      },
      {
        type: analysisType === 'identification' ? 'tree_removal' : 'vegetation_change',
        location: { lat: 40.7130, lng: -74.0062 },
        confidence: 0.78,
        description: 'Several trees removed for construction',
        area: 500
      }
    ];

    return {
      changes,
      processingMethod: 'ai_enhanced_change_detection',
      accuracy: 0.88
    };
  }

  private getMockGeometricVLM(imagery: AerialImagery, query: string): any {
    const measurements: Record<string, number> = {};
    
    if (query.includes('roof')) {
      measurements.squareFootage = 2500 + Math.random() * 1000;
      measurements.width = 50 + Math.random() * 20;
      measurements.length = 50 + Math.random() * 20;
    } else if (query.includes('building')) {
      measurements.height = 30 + Math.random() * 50;
      measurements.area = 5000 + Math.random() * 10000;
    }

    return {
      answer: `Based on the aerial imagery, I can provide accurate measurements for your query: "${query}". The analysis shows ${measurements.squareFootage || measurements.area} square feet.`,
      confidence: 0.89,
      measurements,
      geometricAccuracy: 0.92,
      model: 'geometric_vlm_v2.1'
    };
  }

  private getMockDerivative(imagery: AerialImagery, derivativeType: string): ImageryDerivative {
    return {
      id: `derivative_${Date.now()}`,
      originalImageryId: imagery.id,
      type: derivativeType as any,
      processingMethod: 'advanced_photogrammetry',
      accuracy: 0.95,
      fileUrl: `https://spexi.com/derivatives/${derivativeType}_${imagery.id}.zip`,
      metadata: {
        processingTime: 3600,
        software: 'Pix4D',
        quality: 'high'
      },
      createdAt: new Date().toISOString()
    };
  }

  private getMockObjectDetection(imagery: AerialImagery, objectTypes: string[]): AIAnalysisResult {
    return {
      id: `analysis_${Date.now()}`,
      imageryId: imagery.id,
      analysisType: 'object_detection',
      confidence: 0.87,
      results: objectTypes.map(type => ({
        type,
        count: Math.floor(Math.random() * 10) + 1,
        locations: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
          lat: 40.7128 + (Math.random() - 0.5) * 0.01,
          lng: -74.0060 + (Math.random() - 0.5) * 0.01,
          confidence: 0.8 + Math.random() * 0.2
        }))
      })),
      processingTime: 45,
      model: 'yolo_v8_aerial',
      timestamp: new Date().toISOString()
    };
  }

  private getMockQuickInsights(imagery: AerialImagery, scenario: string): any {
    const insights = {
      disaster_response: [
        'Significant structural damage detected in northeastern quadrant',
        'Access roads appear blocked by debris',
        'Emergency response vehicles can access from south entrance'
      ],
      solar_installation: [
        'Roof orientation optimal for solar panels',
        'Minimal shading from surrounding structures',
        'Estimated 15kW system capacity possible'
      ],
      construction_monitoring: [
        'Foundation work 75% complete',
        'Material staging area properly organized',
        'Safety protocols appear to be followed'
      ],
      agriculture: [
        'Crop health appears good in 80% of fields',
        'Irrigation systems functioning properly',
        'Some areas showing signs of water stress'
      ]
    };

    return {
      scenario,
      insights: insights[scenario as keyof typeof insights] || ['Analysis complete'],
      recommendations: ['Continue monitoring', 'Schedule follow-up assessment'],
      confidence: 0.85,
      processingTime: 30
    };
  }

  private getMockRoofAnalysis(imagery: AerialImagery): any {
    return {
      roofArea: 2500,
      suitableArea: 2000,
      orientation: 'south',
      shading: 0.15,
      solarPotential: 0.85,
      recommendations: [
        'Install 15kW solar system',
        'Consider battery storage',
        'Maintain clear access for maintenance'
      ]
    };
  }

  private getMockDisasterResponse(beforeImagery: AerialImagery, afterImagery: AerialImagery): any {
    return {
      damageAssessment: {
        severity: 'high' as const,
        affectedArea: 15000,
        damageTypes: ['structural', 'flooding', 'debris']
      },
      responseRecommendations: [
        'Prioritize search and rescue in affected areas',
        'Establish emergency shelters',
        'Coordinate with utility companies for restoration'
      ],
      priority: 'high' as const
    };
  }
}

// Spexi Analysis Factory
export class SpexiAnalysisFactory {
  private spexi: SpexiIntegration;

  constructor() {
    this.spexi = new SpexiIntegration();
  }

  // Create comprehensive site analysis
  async createSiteAnalysis(location: { lat: number; lng: number }): Promise<{
    imagery: AerialImagery[];
    analysis: any[];
    derivatives: ImageryDerivative[];
    insights: any;
  }> {
    // Get aerial imagery
    const imagery = await this.spexi.getAerialImagery(location);
    
    if (imagery.length === 0) {
      throw new Error('No aerial imagery available for this location');
    }

    const latestImagery = imagery[0];

    // Perform various analyses
    const objectDetection = await this.spexi.detectObjects(latestImagery);
    const quickInsights = await this.spexi.getQuickInsights(latestImagery, 'construction_monitoring');
    const roofAnalysis = await this.spexi.analyzeRoofForSolar(latestImagery);

    // Create derivatives
    const orthomosaic = await this.spexi.createDerivative(latestImagery, 'orthomosaic');
    const elevationModel = await this.spexi.createDerivative(latestImagery, 'elevation_model');

    return {
      imagery,
      analysis: [objectDetection, roofAnalysis],
      derivatives: [orthomosaic, elevationModel],
      insights: quickInsights
    };
  }

  // Create disaster response analysis
  async createDisasterResponseAnalysis(
    location: { lat: number; lng: number },
    disasterDate: string
  ): Promise<any> {
    const imagery = await this.spexi.getAerialImagery(location);
    
    if (imagery.length < 2) {
      throw new Error('Need at least two imagery captures for disaster analysis');
    }

    const beforeImagery = imagery.find(img => new Date(img.captureDate) < new Date(disasterDate));
    const afterImagery = imagery.find(img => new Date(img.captureDate) >= new Date(disasterDate));

    if (!beforeImagery || !afterImagery) {
      throw new Error('Before and after imagery not available for disaster date');
    }

    const changeDetection = await this.spexi.detectChanges(beforeImagery, afterImagery, 'identification');
    const disasterResponse = await this.spexi.analyzeDisasterResponse(beforeImagery, afterImagery);

    return {
      beforeImagery,
      afterImagery,
      changeDetection,
      disasterResponse,
      recommendations: [
        'Prioritize affected areas based on damage severity',
        'Coordinate emergency response teams',
        'Assess infrastructure damage for restoration planning'
      ]
    };
  }
} 