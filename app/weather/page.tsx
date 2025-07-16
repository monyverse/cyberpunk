"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  WbSunny as WeatherIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

const WeatherPage: React.FC = () => {
  const [location, setLocation] = useState('New York');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [riskLevel, setRiskLevel] = useState('low');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [riskThreshold, setRiskThreshold] = useState(0.7);

  const { addWeatherXMAgent } = useAgents();

  const locations = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
  ];

  const timeframes = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' }
  ];

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      // Simulate WeatherXM API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWeatherData = {
        location,
        temperature: Math.round(15 + Math.random() * 20),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 25),
        pressure: Math.round(1000 + Math.random() * 50),
        visibility: Math.round(5 + Math.random() * 15),
        timestamp: new Date().toISOString(),
        conditions: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Storm'][Math.floor(Math.random() * 5)]
      };

      setWeatherData(mockWeatherData);
      
      // Add to history
      setWeatherHistory(prev => [mockWeatherData, ...prev.slice(0, 9)]);
      
      // Calculate risk level
      const risk = calculateRiskLevel(mockWeatherData);
      setRiskLevel(risk);

      // Add WeatherXM agent
      await addWeatherXMAgent({
        name: `Weather_${location}_${Date.now()}`,
        type: 'offchain',
        status: 'active',
        location: { x: 0, y: 0, z: 0 },
        metadata: {
          location,
          riskLevel: risk,
          dataSource: 'WeatherXM',
          timestamp: mockWeatherData.timestamp,
          capabilities: ['weather_data', 'risk_assessment', 'real_time_monitoring']
        }
      });

    } catch (error) {
      console.error('Weather data fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRiskLevel = (data: any) => {
    let riskScore = 0;
    
    // Temperature risk
    if (data.temperature > 35 || data.temperature < -10) riskScore += 0.3;
    
    // Wind risk
    if (data.windSpeed > 20) riskScore += 0.3;
    
    // Visibility risk
    if (data.visibility < 5) riskScore += 0.2;
    
    // Pressure risk
    if (data.pressure < 1000 || data.pressure > 1030) riskScore += 0.2;
    
    if (riskScore > 0.7) return 'high';
    if (riskScore > 0.4) return 'medium';
    return 'low';
  };

  const handleRiskAssessment = async () => {
    try {
      // Add hybrid agent for risk assessment
      await addWeatherXMAgent({
        name: `Risk_Assessment_${Date.now()}`,
        type: 'offchain',
        status: 'active',
        location: { x: 0, y: 0, z: 0 },
        metadata: {
          location,
          riskLevel,
          threshold: riskThreshold,
          timeframe: selectedTimeframe,
          capabilities: ['weather', 'risk_assessment', 'ai_analysis']
        }
      });

      alert(`Risk assessment completed for ${location}. Risk level: ${riskLevel.toUpperCase()}`);
    } catch (error) {
      console.error('Risk assessment failed:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location, fetchWeatherData]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🌤️ Weather Data Integration
        <Chip 
          label="WeatherXM - $15,000 Prize" 
          color="warning" 
          sx={{ ml: 2 }}
        />
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time weather data integration for risk assessment and environmental monitoring in the metaverse.
      </Typography>

      <Grid container spacing={4}>
        {/* Weather Data Display */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WeatherIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Current Weather Data
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        label="Location"
                      >
                        {locations.map(loc => (
                          <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      onClick={fetchWeatherData}
                      disabled={isLoading}
                      fullWidth
                      color="warning"
                    >
                      {isLoading ? 'Fetching...' : 'Refresh Data'}
                    </Button>
                  </Grid>
                </Grid>

                {isLoading && (
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress color="warning" />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Fetching weather data from WeatherXM...
                    </Typography>
                  </Box>
                )}

                {weatherData && (
                  <Grid container spacing={3}>
                    {/* @ts-expect-error MUI v7 Grid type error workaround */}
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="h4" color="warning.main">
                          {weatherData.temperature}°C
                        </Typography>
                        <Typography variant="body2">
                          Temperature
                        </Typography>
                      </Box>
                    </Grid>
                    {/* @ts-expect-error MUI v7 Grid type error workaround */}
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="h4" color="info.main">
                          {weatherData.humidity}%
                        </Typography>
                        <Typography variant="body2">
                          Humidity
                        </Typography>
                      </Box>
                    </Grid>
                    {/* @ts-expect-error MUI v7 Grid type error workaround */}
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                        <Typography variant="h4" color="primary">
                          {weatherData.windSpeed} km/h
                        </Typography>
                        <Typography variant="body2">
                          Wind Speed
                        </Typography>
                      </Box>
                    </Grid>
                    {/* @ts-expect-error MUI v7 Grid type error workaround */}
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="h4" color="success.main">
                          {weatherData.pressure} hPa
                        </Typography>
                        <Typography variant="body2">
                          Pressure
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {weatherData && (
                  <Alert 
                    severity={getRiskColor(riskLevel) as any} 
                    sx={{ mt: 3 }}
                    icon={<WarningIcon />}
                  >
                    Risk Level: <strong>{riskLevel.toUpperCase()}</strong> - 
                    {riskLevel === 'high' && ' High risk conditions detected. Take precautions.'}
                    {riskLevel === 'medium' && ' Moderate risk conditions. Monitor closely.'}
                    {riskLevel === 'low' && ' Low risk conditions. Normal operations.'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Risk Assessment */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Risk Assessment
                  </Typography>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    label="Timeframe"
                  >
                    {timeframes.map(tf => (
                      <MenuItem key={tf.value} value={tf.value}>{tf.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Risk Threshold"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  onClick={handleRiskAssessment}
                  fullWidth
                  color="error"
                  sx={{ mb: 3 }}
                >
                  Assess Risk
                </Button>

                <Typography variant="h6" gutterBottom>
                  Risk Factors
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Temperature extremes" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="High wind speeds" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Low visibility" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Pressure anomalies" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Weather History */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendIcon sx={{ mr: 1 }} />
                  Weather History
                </Typography>
                
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {weatherHistory.map((data, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${data.location} - ${data.temperature}°C`}
                          secondary={`${data.conditions} | Wind: ${data.windSpeed} km/h | ${new Date(data.timestamp).toLocaleString()}`}
                        />
                        <Chip 
                          label={calculateRiskLevel(data)} 
                          color={getRiskColor(calculateRiskLevel(data)) as any} 
                          size="small" 
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {weatherHistory.length === 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="No weather history available" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default WeatherPage; 