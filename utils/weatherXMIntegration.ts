// WeatherXM Integration Module for Hackathon
// Integrates real-time weather data for insurance and risk applications

// WeatherXM API Configuration
export const WEATHERXM_CONFIG = {
  apiUrl: 'https://api.weatherxm.network',
  apiKey: process.env.NEXT_PUBLIC_WEATHERXM_API_KEY || '',
  endpoints: {
    stations: '/api/v1/stations',
    measurements: '/api/v1/measurements',
    forecasts: '/api/v1/forecasts',
    alerts: '/api/v1/alerts'
  }
};

// Weather Data Interfaces
export interface WeatherStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  owner: string;
  status: 'online' | 'offline';
  lastUpdate: string;
}

export interface WeatherMeasurement {
  stationId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  rainfall: number;
  solarRadiation: number;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'flood' | 'drought' | 'heat' | 'cold';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    radius: number;
  };
  description: string;
  startTime: string;
  endTime: string;
}

// Insurance Risk Assessment Interface
export interface RiskAssessment {
  location: {
    lat: number;
    lng: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    stormProbability: number;
  };
  recommendations: string[];
  insurancePremium: number;
}

// WeatherXM Integration Class
export class WeatherXMIntegration {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || WEATHERXM_CONFIG.apiKey;
  }

  // Get nearby weather stations
  async getNearbyStations(lat: number, lng: number, radius: number = 50): Promise<WeatherStation[]> {
    try {
      const response = await fetch(
        `${WEATHERXM_CONFIG.apiUrl}${WEATHERXM_CONFIG.endpoints.stations}?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status}`);
      }

      const data = await response.json();
      return data.stations || [];
    } catch (error) {
      console.error('Error fetching weather stations:', error);
      // Return mock data for demo
      return this.getMockStations(lat, lng);
    }
  }

  // Get current weather measurements
  async getCurrentWeather(stationId: string): Promise<WeatherMeasurement | null> {
    try {
      const response = await fetch(
        `${WEATHERXM_CONFIG.apiUrl}${WEATHERXM_CONFIG.endpoints.measurements}?station_id=${stationId}&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status}`);
      }

      const data = await response.json();
      return data.measurements?.[0] || null;
    } catch (error) {
      console.error('Error fetching weather measurements:', error);
      return this.getMockMeasurement(stationId);
    }
  }

  // Get weather forecast
  async getWeatherForecast(lat: number, lng: number, days: number = 7): Promise<any[]> {
    try {
      const response = await fetch(
        `${WEATHERXM_CONFIG.apiUrl}${WEATHERXM_CONFIG.endpoints.forecasts}?lat=${lat}&lng=${lng}&days=${days}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status}`);
      }

      const data = await response.json();
      return data.forecasts || [];
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getMockForecast(days);
    }
  }

  // Get weather alerts
  async getWeatherAlerts(lat: number, lng: number, radius: number = 100): Promise<WeatherAlert[]> {
    try {
      const response = await fetch(
        `${WEATHERXM_CONFIG.apiUrl}${WEATHERXM_CONFIG.endpoints.alerts}?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status}`);
      }

      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return this.getMockAlerts(lat, lng);
    }
  }

  // Risk Assessment for Insurance
  async assessRisk(lat: number, lng: number): Promise<RiskAssessment> {
    try {
      // Get current weather and forecast
      const stations = await this.getNearbyStations(lat, lng, 25);
      const alerts = await this.getWeatherAlerts(lat, lng, 50);
      const forecast = await this.getWeatherForecast(lat, lng, 3);

      if (stations.length === 0) {
        throw new Error('No weather stations found nearby');
      }

      const currentWeather = await this.getCurrentWeather(stations[0].id);
      if (!currentWeather) {
        throw new Error('Unable to get current weather data');
      }

      // Calculate risk factors
      const riskFactors = this.calculateRiskFactors(currentWeather, forecast, alerts);
      const riskLevel = this.determineRiskLevel(riskFactors);
      const recommendations = this.generateRecommendations(riskFactors, riskLevel);
      const insurancePremium = this.calculateInsurancePremium(riskLevel, riskFactors);

      return {
        location: { lat, lng },
        riskLevel,
        factors: riskFactors,
        recommendations,
        insurancePremium
      };
    } catch (error) {
      console.error('Error in risk assessment:', error);
      return this.getMockRiskAssessment(lat, lng);
    }
  }

  // Parametric Insurance Contract
  async createParametricInsurance(
    location: { lat: number; lng: number },
    coverage: {
      type: 'crop' | 'property' | 'business';
      amount: number;
      duration: number; // days
    },
    triggers: {
      temperature?: { min: number; max: number };
      rainfall?: { min: number; max: number };
      windSpeed?: { min: number; max: number };
    }
  ): Promise<{
    contractId: string;
    premium: number;
    payout: number;
    conditions: any;
  }> {
    const riskAssessment = await this.assessRisk(location.lat, location.lng);
    
    // Calculate premium based on risk and coverage
    const basePremium = coverage.amount * 0.02; // 2% base rate
    const riskMultiplier = this.getRiskMultiplier(riskAssessment.riskLevel);
    const premium = basePremium * riskMultiplier;

    // Calculate potential payout
    const payout = coverage.amount * 0.8; // 80% of coverage amount

    const contractId = `insurance_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      contractId,
      premium,
      payout,
      conditions: {
        location,
        coverage,
        triggers,
        riskAssessment: riskAssessment.riskLevel
      }
    };
  }

  // Monitor insurance contract conditions
  async monitorInsuranceContract(contractId: string, conditions: any): Promise<{
    triggered: boolean;
    payout: number;
    reason: string;
  }> {
    const { location, triggers } = conditions;
    const currentWeather = await this.getCurrentWeather(location.stationId);

    if (!currentWeather) {
      return { triggered: false, payout: 0, reason: 'No weather data available' };
    }

    // Check trigger conditions
    let triggered = false;
    let reason = '';

    if (triggers.temperature) {
      if (currentWeather.temperature < triggers.temperature.min || 
          currentWeather.temperature > triggers.temperature.max) {
        triggered = true;
        reason = `Temperature outside range: ${currentWeather.temperature}°C`;
      }
    }

    if (triggers.rainfall && currentWeather.rainfall > triggers.rainfall.max) {
      triggered = true;
      reason = `Excessive rainfall: ${currentWeather.rainfall}mm`;
    }

    if (triggers.windSpeed && currentWeather.windSpeed > triggers.windSpeed.max) {
      triggered = true;
      reason = `High wind speed: ${currentWeather.windSpeed} km/h`;
    }

    return {
      triggered,
      payout: triggered ? conditions.coverage.amount * 0.8 : 0,
      reason
    };
  }

  // Private helper methods
  private calculateRiskFactors(
    currentWeather: WeatherMeasurement,
    forecast: any[],
    alerts: WeatherAlert[]
  ): any {
    const tempRisk = this.calculateTemperatureRisk(currentWeather.temperature);
    const humidityRisk = this.calculateHumidityRisk(currentWeather.humidity);
    const windRisk = this.calculateWindRisk(currentWeather.windSpeed);
    const rainfallRisk = this.calculateRainfallRisk(currentWeather.rainfall);
    const stormRisk = this.calculateStormRisk(alerts, forecast);

    return {
      temperature: tempRisk,
      humidity: humidityRisk,
      windSpeed: windRisk,
      rainfall: rainfallRisk,
      stormProbability: stormRisk
    };
  }

  private determineRiskLevel(factors: any): 'low' | 'medium' | 'high' | 'critical' {
    const totalRisk = Object.values(factors).reduce((sum: number, factor: any) => sum + factor, 0);
    const avgRisk = totalRisk / Object.keys(factors).length;

    if (avgRisk < 0.3) return 'low';
    if (avgRisk < 0.6) return 'medium';
    if (avgRisk < 0.8) return 'high';
    return 'critical';
  }

  private generateRecommendations(factors: any, riskLevel: string): string[] {
    const recommendations: string[] = [];

    if (factors.temperature > 0.7) {
      recommendations.push('Consider temperature monitoring systems');
    }
    if (factors.rainfall > 0.6) {
      recommendations.push('Implement flood protection measures');
    }
    if (factors.windSpeed > 0.5) {
      recommendations.push('Secure loose objects and structures');
    }
    if (factors.stormProbability > 0.4) {
      recommendations.push('Prepare emergency response plan');
    }

    return recommendations;
  }

  private calculateInsurancePremium(riskLevel: string, factors: any): number {
    const basePremium = 1000; // Base premium in USD
    const riskMultipliers = {
      low: 0.8,
      medium: 1.0,
      high: 1.5,
      critical: 2.5
    };

    return basePremium * riskMultipliers[riskLevel as keyof typeof riskMultipliers];
  }

  private getRiskMultiplier(riskLevel: string): number {
    const multipliers = {
      low: 0.8,
      medium: 1.0,
      high: 1.5,
      critical: 2.5
    };
    return multipliers[riskLevel as keyof typeof multipliers];
  }

  // Mock data methods for demo
  private getMockStations(lat: number, lng: number): WeatherStation[] {
    return [
      {
        id: 'station_001',
        name: 'CyberPunk Weather Station',
        location: { lat: lat + 0.001, lng: lng + 0.001, address: 'CyberPunk District' },
        owner: 'cyberpunk.testnet',
        status: 'online',
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  private getMockMeasurement(stationId: string): WeatherMeasurement {
    return {
      stationId,
      timestamp: new Date().toISOString(),
      temperature: 22.5,
      humidity: 65,
      pressure: 1013.25,
      windSpeed: 12.5,
      windDirection: 180,
      rainfall: 0,
      solarRadiation: 850
    };
  }

  private getMockForecast(days: number): any[] {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      temperature: { min: 18, max: 25 },
      humidity: 60 + Math.random() * 20,
      windSpeed: 10 + Math.random() * 15,
      rainfall: Math.random() * 5
    }));
  }

  private getMockAlerts(lat: number, lng: number): WeatherAlert[] {
    return [];
  }

  private getMockRiskAssessment(lat: number, lng: number): RiskAssessment {
    return {
      location: { lat, lng },
      riskLevel: 'low',
      factors: {
        temperature: 0.2,
        humidity: 0.3,
        windSpeed: 0.1,
        rainfall: 0.0,
        stormProbability: 0.1
      },
      recommendations: ['Monitor weather conditions regularly'],
      insurancePremium: 800
    };
  }

  // Risk calculation helpers
  private calculateTemperatureRisk(temp: number): number {
    if (temp < -10 || temp > 40) return 0.9;
    if (temp < 0 || temp > 35) return 0.6;
    if (temp < 10 || temp > 30) return 0.3;
    return 0.1;
  }

  private calculateHumidityRisk(humidity: number): number {
    if (humidity > 90 || humidity < 20) return 0.7;
    if (humidity > 80 || humidity < 30) return 0.4;
    return 0.2;
  }

  private calculateWindRisk(windSpeed: number): number {
    if (windSpeed > 50) return 0.9;
    if (windSpeed > 30) return 0.7;
    if (windSpeed > 20) return 0.5;
    if (windSpeed > 10) return 0.3;
    return 0.1;
  }

  private calculateRainfallRisk(rainfall: number): number {
    if (rainfall > 50) return 0.9;
    if (rainfall > 25) return 0.7;
    if (rainfall > 10) return 0.5;
    if (rainfall > 5) return 0.3;
    return 0.1;
  }

  private calculateStormRisk(alerts: WeatherAlert[], forecast: any[]): number {
    const stormAlerts = alerts.filter(alert => alert.type === 'storm');
    const highWindForecast = forecast.filter(f => f.windSpeed > 30);
    
    if (stormAlerts.length > 0) return 0.8;
    if (highWindForecast.length > 0) return 0.6;
    return 0.2;
  }
} 