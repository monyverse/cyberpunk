"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Alert,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  PhotoCamera as AerialIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

const AerialPage: React.FC = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [analysisType, setAnalysisType] = useState('environmental');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  const { addSpexiAgent } = useAgents();

  const analysisTypes = [
    { value: 'environmental', label: 'Environmental Analysis' },
    { value: 'urban_planning', label: 'Urban Planning' },
    { value: 'agriculture', label: 'Agricultural Monitoring' },
    { value: 'infrastructure', label: 'Infrastructure Assessment' }
  ];

  const handleAnalysis = async () => {
    if (!latitude || !longitude) {
      alert('Please enter coordinates');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add Spexi agent for aerial analysis
      await addSpexiAgent({
        name: `Aerial_${analysisType}_${Date.now()}`,
        type: 'hybrid' as const,
        status: 'active' as const,
        location: { x: parseFloat(latitude), y: 0, z: parseFloat(longitude) },
        metadata: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          analysisType,
          capabilities: ['aerial_imaging', 'ai_analysis', 'environmental_monitoring']
        }
      }, { lat: parseFloat(latitude), lng: parseFloat(longitude) });

      // Add to analysis results
      const newResult = {
        id: Date.now(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        analysisType,
        status: 'completed',
        timestamp: new Date().toISOString(),
        insights: generateMockInsights(analysisType)
      };

      setAnalysisResults(prev => [newResult, ...prev]);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
        setLatitude('');
        setLongitude('');
        alert('Aerial analysis completed successfully!');
      }, 2000);

    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const generateMockInsights = (type: string) => {
    const insights = {
      environmental: [
        'Vegetation cover: 65%',
        'Water bodies detected: 3',
        'Air quality index: Good',
        'Carbon sequestration potential: High'
      ],
      urban_planning: [
        'Building density: Medium',
        'Green spaces: 12%',
        'Traffic patterns: Optimized',
        'Development potential: High'
      ],
      agriculture: [
        'Crop health: Excellent',
        'Irrigation coverage: 85%',
        'Soil moisture: Optimal',
        'Yield prediction: Above average'
      ],
      infrastructure: [
        'Road network: Well-maintained',
        'Power lines: No issues detected',
        'Water systems: Functional',
        'Maintenance needed: Low priority'
      ]
    };
    return insights[type as keyof typeof insights] || [];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        📸 Aerial Analysis
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        AI-powered aerial imagery analysis for environmental and urban planning insights.
      </Typography>

      <Grid spacing={4}>
        {/* Analysis Interface */}
        <Grid component="div" xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AerialIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Aerial Analysis
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                placeholder="40.7128"
              />

              <TextField
                fullWidth
                label="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                placeholder="-74.0060"
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Analysis Type</InputLabel>
                <Select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  label="Analysis Type"
                >
                  {analysisTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isAnalyzing && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Analyzing aerial imagery... {analysisProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={analysisProgress} />
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleAnalysis}
                disabled={isAnalyzing || !latitude || !longitude}
                fullWidth
                sx={{ mb: 2 }}
                color="success"
              >
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </Button>

              <Alert severity="info">
                Analysis will provide detailed insights about the specified location using AI-powered aerial imagery processing.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Stats */}
        <Grid component="div" xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Analysis Statistics
                </Typography>
              </Box>

              <Grid spacing={2} sx={{ mb: 3 }}>
                <Grid component="div" xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main">
                      {analysisResults.length}
                    </Typography>
                    <Typography variant="body2">
                      Analyses Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid component="div" xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="info.main">
                      4
                    </Typography>
                    <Typography variant="body2">
                      Analysis Types
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Recent Analyses
              </Typography>
              
              {analysisResults.slice(0, 5).map((result) => (
                <Box key={result.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      {result.analysisType.replace('_', ' ')}
                    </Typography>
                    <Chip label="Completed" color="success" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {result.latitude}, {result.longitude}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              
              {analysisResults.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No analyses completed yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Features */}
        <Grid component="div" xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1 }} />
                Analysis Capabilities
              </Typography>
              
              <Grid spacing={2}>
                <Grid component="div" xs={12} md={3}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Environmental Monitoring
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Track vegetation, water bodies, and air quality
                    </Typography>
                    <Chip label="Available" color="success" size="small" />
                  </Box>
                </Grid>
                
                <Grid component="div" xs={12} md={3}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Urban Planning
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Analyze building density and infrastructure
                    </Typography>
                    <Chip label="Available" color="success" size="small" />
                  </Box>
                </Grid>
                
                <Grid component="div" xs={12} md={3}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Agricultural Monitoring
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Assess crop health and irrigation systems
                    </Typography>
                    <Chip label="Available" color="success" size="small" />
                  </Box>
                </Grid>
                
                <Grid component="div" xs={12} md={3}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Infrastructure Assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Evaluate roads, power lines, and utilities
                    </Typography>
                    <Chip label="Available" color="success" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AerialPage; 