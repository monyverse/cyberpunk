"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Grid, Card, CardContent, Chip, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import DashboardCard from '../components/DashboardCard';
import Metaverse3DCanvas from '../components/Metaverse3DCanvas';
import { useAgents } from '../hooks/useAgents';
import { useDrones } from '../hooks/useDrones';
import {
  Plane,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Target,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  // Connect to real data
  const { agents, isLoading: agentsLoading } = useAgents();
  const { drones, missions } = useDrones();
  const dronesLoading = false; // useDrones doesn't have isLoading yet

  // Update simulation data when active
  useEffect(() => {
    if (isSimulationActive) {
      const interval = setInterval(() => {
        // setSimulationData(prev => ({
        //   ...prev,
        //   activeDrones: drones?.length || prev.activeDrones,
        //   completedMissions: missions?.filter(m => m.status === 'completed').length || prev.completedMissions,
        //   aiAgents: agents?.length || prev.aiAgents,
        //   systemEfficiency: Math.max(85, Math.min(99, prev.systemEfficiency + (Math.random() > 0.5 ? 1 : -1))),
        //   batteryLevels: prev.batteryLevels.map(bat => Math.max(20, Math.min(100, bat + (Math.random() > 0.5 ? 2 : -2))))
        // }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isSimulationActive, drones, missions, agents]);

  const quickActions = [
    {
      title: '3D Drone Control',
      description: 'Immersive 3D environment with real-time drone control and AI navigation',
      icon: <Plane size={40} color="#6ec1c8" />,
      action: () => router.push('/drone-sim'),
      color: '#6ec1c8',
      features: ['Real-time 3D visualization', 'AI-powered navigation', 'Weather integration']
    },
    {
      title: 'Mission Control',
      description: 'Manage autonomous drone missions with advanced AI coordination',
      icon: <Target size={40} color="#ffd700" />,
      action: () => router.push('/near-agent'),
      color: '#ffd700',
      features: ['Mission planning', 'AI coordination', 'Real-time tracking']
    },
    {
      title: 'AI Agents',
      description: 'Interact with intelligent agents across multiple blockchain networks',
      icon: <Users size={40} color="#bdb89c" />,
      action: () => router.push('/near-agents'),
      color: '#bdb89c',
      features: ['Cross-chain agents', 'Smart contracts', 'Automated trading']
    }
  ];

  return (
    <Box sx={{ maxWidth: 'xl', mt: 2, mx: 'auto' }}>
      {/* Enhanced Dashboard Card */}
      <DashboardCard />

      {/* Immersive Drone Simulation Section */}
      <Box sx={{ mt: 6, mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 4 
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: 'linear-gradient(45deg, #6ec1c8, #bdb89c)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            <Plane size={40} />
            Immersive Drone Simulation
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isSimulationActive ? "Pause Simulation" : "Start Simulation"}>
              <IconButton 
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                sx={{ 
                  color: isSimulationActive ? '#ff6b35' : '#6ec1c8',
                  border: `2px solid ${isSimulationActive ? '#ff6b35' : '#6ec1c8'}`,
                  '&:hover': {
                    background: `${isSimulationActive ? '#ff6b35' : '#6ec1c8'}20`
                  }
                }}
              >
                {isSimulationActive ? <Pause size={20} /> : <Play size={20} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Simulation">
              <IconButton 
                onClick={() => {
                  // setIsSimulationActive(false);
                  // setTimeout(() => setIsSimulationActive(true), 100);
                }}
                sx={{ 
                  color: '#bdb89c',
                  border: '2px solid #bdb89c',
                  '&:hover': {
                    background: '#bdb89c20'
                  }
                }}
              >
                <RotateCcw size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title={showAdvancedControls ? "Hide Advanced Controls" : "Show Advanced Controls"}>
              <IconButton 
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                sx={{ 
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                  '&:hover': {
                    background: '#ffd70020'
                  }
                }}
              >
                {showAdvancedControls ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Live 3D Metaverse Canvas */}
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              height: 500,
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(110, 193, 200, 0.3)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Enhanced 3D Canvas with real data */}
              <Metaverse3DCanvas 
                agents={agents || []}
                drones={drones || []}
                missions={missions || []}
                isRunning={isSimulationActive}
                isLoading={agentsLoading || dronesLoading}
              />
            </Card>
          </Grid>

          {/* Real-time Stats */}
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              height: 500,
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(110, 193, 200, 0.3)',
              borderRadius: 3,
              overflow: 'auto'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#6ec1c8', fontWeight: 600 }}>
                  🎮 Live Simulation Stats
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Drones
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#00ff00', fontWeight: 'bold' }}>
                    {drones?.filter(d => d.status === 'in-mission').length || 0}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    AI Agents
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ff00ff', fontWeight: 'bold' }}>
                    {agents?.length || 0}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Missions
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                    {missions?.filter(m => m.status === 'active').length || 0}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    System Status
                  </Typography>
                  <Chip 
                    label={isSimulationActive ? 'Running' : 'Paused'}
                    color={isSimulationActive ? 'success' : 'warning'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                {/* Simulation Controls */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setIsSimulationActive(!isSimulationActive)}
                    startIcon={isSimulationActive ? <Pause /> : <Play />}
                    sx={{ 
                      background: isSimulationActive ? '#ff6b35' : '#00ff00',
                      '&:hover': { background: isSimulationActive ? '#e55a2b' : '#00cc00' }
                    }}
                  >
                    {isSimulationActive ? 'Pause' : 'Start'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      // setIsSimulationActive(false);
                      // setTimeout(() => setIsSimulationActive(true), 100);
                    }}
                    startIcon={<RotateCcw />}
                    sx={{ borderColor: '#6ec1c8', color: '#6ec1c8' }}
                  >
                    Reset
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions Grid */}
      <Box sx={{ mt: 6, mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'linear-gradient(45deg, #ffd700, #bdb89c)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          <Zap size={40} />
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            {/* @ts-expect-error MUI v7 Grid type error workaround */}
            <Grid item key={index} xs={12} md={4}>
              <Card 
                sx={{ 
                  height: 200,
                  background: `linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)`,
                  border: `2px solid ${action.color}40`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: action.color,
                    boxShadow: `0 8px 32px ${action.color}40`
                  }
                }}
                onClick={action.action}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  p: 3
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    {action.icon}
                    <Typography variant="h6" sx={{ mt: 2, color: 'white', fontWeight: 600 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#bdb89c' }}>
                      {action.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {action.features.map((feature, featureIndex) => (
                      <Chip
                        key={featureIndex}
                        label={feature}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          background: `${action.color}20`,
                          color: action.color,
                          border: `1px solid ${action.color}40`,
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* System Status Overview */}
      <Box sx={{ mt: 6, mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'linear-gradient(45deg, #bdb89c, #6ec1c8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          <TrendingUp size={40} />
          System Status
        </Typography>

        <Grid container spacing={3}>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(0, 255, 0, 0.3)',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Target size={40} style={{ color: '#00ff00', marginRight: 8 }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#00ff00', fontWeight: 'bold', mb: 1 }}>
                  {drones?.filter(d => d.status === 'in-mission').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Drones
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(255, 0, 255, 0.3)',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Users size={40} style={{ color: '#ff00ff', marginRight: 8 }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#ff00ff', fontWeight: 'bold', mb: 1 }}>
                  {agents?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI Agents
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Zap size={40} style={{ color: '#ffd700', marginRight: 8 }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 'bold', mb: 1 }}>
                  {missions?.filter(m => m.status === 'active').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Missions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
              border: '2px solid rgba(110, 193, 200, 0.3)',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <TrendingUp size={40} style={{ color: '#6ec1c8', marginRight: 8 }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#6ec1c8', fontWeight: 'bold', mb: 1 }}>
                  {isSimulationActive ? 'ON' : 'OFF'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System Status
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;