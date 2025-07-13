import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Grid, IconButton, Tooltip, LinearProgress } from '@mui/material';
import { 
  Users, 
  Globe, 
  Database, 
  Gamepad2, 
  Plane, 
  Zap, 
  Shield, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

const DashboardCard: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [droneCount, setDroneCount] = useState(12);
  const [agentCount, setAgentCount] = useState(8);
  const [missionCount, setMissionCount] = useState(24);
  const [systemHealth, setSystemHealth] = useState(94);

  // Check demo mode status on component mount
  useEffect(() => {
    const checkDemoStatus = async () => {
      try {
        const response = await fetch('/api/demo/status');
        if (response.ok) {
          const data = await response.json();
          setIsDemoMode(data.isDemoMode);
        }
      } catch (error) {
        console.log('Demo status check failed:', error);
      }
    };
    
    checkDemoStatus();
  }, []);

  // Simulate live data updates
  useEffect(() => {
    if (isSimulationRunning) {
      const interval = setInterval(() => {
        setDroneCount(prev => Math.max(8, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1))));
        setAgentCount(prev => Math.max(5, Math.min(15, prev + (Math.random() > 0.7 ? 1 : -1))));
        setMissionCount(prev => Math.max(15, Math.min(35, prev + (Math.random() > 0.6 ? 1 : -1))));
        setSystemHealth(prev => Math.max(85, Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1))));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSimulationRunning]);

  const handleSimulationToggle = () => {
    setIsSimulationRunning(!isSimulationRunning);
  };

  const handleResetSimulation = () => {
    setDroneCount(12);
    setAgentCount(8);
    setMissionCount(24);
    setSystemHealth(94);
  };

  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.95) 0%, rgba(35, 44, 67, 0.95) 50%, rgba(45, 54, 77, 0.95) 100%)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(110, 193, 200, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        mb: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(110, 193, 200, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(110, 193, 200, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(189, 184, 156, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/cyberpunk-logo.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: 0
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
                fontWeight: 900,
                letterSpacing: '0.2em',
                background: 'linear-gradient(45deg, #6ec1c8 30%, #bdb89c 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(110, 193, 200, 0.5)'
          }}
        >
          CYBER<span style={{ color: '#bdb89c' }}>PUNK</span> METAVERSE
        </Typography>
            {isDemoMode && (
              <Chip
                label="DEMO MODE"
                color="secondary"
                size="small"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                  background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                  color: 'white'
                }}
              />
            )}
          </Box>
          
          {/* Simulation Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isSimulationRunning ? "Pause Simulation" : "Start Simulation"}>
              <IconButton 
                onClick={handleSimulationToggle}
                sx={{ 
                  color: isSimulationRunning ? '#ff6b35' : '#6ec1c8',
                  border: `2px solid ${isSimulationRunning ? '#ff6b35' : '#6ec1c8'}`,
                  '&:hover': {
                    background: `${isSimulationRunning ? '#ff6b35' : '#6ec1c8'}20`
                  }
                }}
              >
                {isSimulationRunning ? <Pause size={20} /> : <Play size={20} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Simulation">
              <IconButton 
                onClick={handleResetSimulation}
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
            <Tooltip title={showStats ? "Hide Stats" : "Show Stats"}>
              <IconButton 
                onClick={() => setShowStats(!showStats)}
                sx={{ 
                  color: '#6ec1c8',
                  border: '2px solid #6ec1c8',
                  '&:hover': {
                    background: '#6ec1c820'
                  }
                }}
              >
                {showStats ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          color="secondary" 
          sx={{ 
            mb: 4,
            textAlign: { xs: 'center', md: 'left' },
            fontStyle: 'italic',
            opacity: 0.9
          }}
        >
          A play-to-earn metaverse for autonomous agents and drones to help users connect with the real world
        </Typography>

        {/* Live Stats Grid */}
        {showStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                background: 'rgba(110, 193, 200, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(110, 193, 200, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #6ec1c8, #bdb89c)',
                  animation: isSimulationRunning ? 'pulse 2s infinite' : 'none'
                }
              }}>
                <Plane style={{ color: '#6ec1c8', fontSize: 32, marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#6ec1c8', fontWeight: 700, mb: 1 }}>
                  {droneCount}
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ fontWeight: 500 }}>
                  Active Drones
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(droneCount / 20) * 100} 
                  sx={{ 
                    mt: 1, 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(110, 193, 200, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #6ec1c8, #bdb89c)'
                    }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                background: 'rgba(189, 184, 156, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(189, 184, 156, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #bdb89c, #6ec1c8)',
                  animation: isSimulationRunning ? 'pulse 2s infinite' : 'none'
                }
              }}>
                <Users style={{ color: '#bdb89c', fontSize: 32, marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#bdb89c', fontWeight: 700, mb: 1 }}>
                  {agentCount}
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ fontWeight: 500 }}>
                  AI Agents
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(agentCount / 15) * 100} 
                  sx={{ 
                    mt: 1, 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(189, 184, 156, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #bdb89c, #6ec1c8)'
                    }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                background: 'rgba(255, 215, 0, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #ffd700, #ff6b35)',
                  animation: isSimulationRunning ? 'pulse 2s infinite' : 'none'
                }
              }}>
                <Target style={{ color: '#ffd700', fontSize: 32, marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700, mb: 1 }}>
                  {missionCount}
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ fontWeight: 500 }}>
                  Active Missions
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(missionCount / 35) * 100} 
                  sx={{ 
                    mt: 1, 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #ffd700, #ff6b35)'
                    }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                background: 'rgba(255, 107, 53, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255, 107, 53, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #ff6b35, #6ec1c8)',
                  animation: isSimulationRunning ? 'pulse 2s infinite' : 'none'
                }
              }}>
                <Shield style={{ color: '#ff6b35', fontSize: 32, marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#ff6b35', fontWeight: 700, mb: 1 }}>
                  {systemHealth}%
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ fontWeight: 500 }}>
                  System Health
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={systemHealth} 
                  sx={{ 
                    mt: 1, 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: systemHealth > 90 ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : 
                                systemHealth > 70 ? 'linear-gradient(90deg, #ff9800, #ffc107)' : 
                                'linear-gradient(90deg, #f44336, #ff5722)'
                    }
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Quick Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          <Button
            variant="contained"
            startIcon={<Plane />}
            sx={{
              background: 'linear-gradient(45deg, #6ec1c8, #4a9ba3)',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(110, 193, 200, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #4a9ba3, #6ec1c8)',
                boxShadow: '0 6px 20px rgba(110, 193, 200, 0.4)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Launch Drone Sim
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Users />}
            sx={{
              borderColor: '#bdb89c',
              color: '#bdb89c',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#bdb89c',
                background: 'rgba(189, 184, 156, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Manage Agents
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Target />}
            sx={{
              borderColor: '#ffd700',
              color: '#ffd700',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#ffd700',
                background: 'rgba(255, 215, 0, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Missions
          </Button>
          </Box>

        {/* Status Indicators */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 3,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          <Chip 
            icon={<Zap style={{ color: '#6ec1c8' }} />}
            label="AI-Powered Navigation" 
            size="small"
            sx={{ 
              background: 'rgba(110, 193, 200, 0.1)',
              border: '1px solid rgba(110, 193, 200, 0.3)',
              color: '#6ec1c8',
              fontWeight: 500
            }}
          />
          <Chip 
            icon={<Globe style={{ color: '#bdb89c' }} />}
            label="Multi-Chain Integration" 
            size="small"
            sx={{ 
              background: 'rgba(189, 184, 156, 0.1)',
              border: '1px solid rgba(189, 184, 156, 0.3)',
              color: '#bdb89c',
              fontWeight: 500
            }}
          />
          <Chip 
            icon={<Database style={{ color: '#ffd700' }} />}
            label="Decentralized Storage" 
            size="small"
            sx={{ 
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#ffd700',
              fontWeight: 500
            }}
          />
          <Chip 
            icon={<Gamepad2 style={{ color: '#ff6b35' }} />}
            label="Play-to-Earn" 
            size="small"
            sx={{ 
              background: 'rgba(255, 107, 53, 0.1)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              color: '#ff6b35',
              fontWeight: 500
            }}
          />
        </Box>
      </CardContent>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Card>
  );
};

export default DashboardCard; 