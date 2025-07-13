"use client";

import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Chip, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import DashboardCard from '../components/DashboardCard';
import {
  CloudUpload as AssetsIcon,
  Person as AvatarsIcon,
  Storage as StorageIcon,
  Verified as ProofSetsIcon,
  Flight as DroneSimIcon,
  WbSunny as WeatherIcon,
  Psychology as AIIcon,
  Language as BridgeIcon,
  Security as SecurityIcon,
  PhotoCamera as AerialIcon,
  Storage as FilecoinIcon,
  AccountTree as NEARIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const router = useRouter();

  const features = [
    {
      title: 'Assets',
      description: 'Manage your metaverse assets, upload new content, and organize your digital collection.',
      icon: <AssetsIcon sx={{ fontSize: 40 }} />,
      path: '/assets',
      color: 'primary.main',
      sponsor: null
    },
    {
      title: 'Avatars',
      description: 'Create and customize your cyberpunk avatar with unique characteristics and traits.',
      icon: <AvatarsIcon sx={{ fontSize: 40 }} />,
      path: '/avatars',
      color: 'secondary.main',
      sponsor: null
    },
    {
      title: 'Storage',
      description: 'Monitor your wallet balances, storage status, and manage your digital storage allowance.',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      path: '/storage',
      color: 'success.main',
      sponsor: null
    },
    {
      title: 'Proof Sets',
      description: 'View and manage your proof sets for verification and authentication.',
      icon: <ProofSetsIcon sx={{ fontSize: 40 }} />,
      path: '/proofsets',
      color: 'warning.main',
      sponsor: null
    },
    {
      title: 'Drone Sim',
      description: 'Control drones, interact with NPC agents, and manage autonomous missions.',
      icon: <DroneSimIcon sx={{ fontSize: 40 }} />,
      path: '/drone-sim',
      color: 'info.main',
      sponsor: null
    }
  ];

  const sponsorFeatures = [
    {
      title: 'Filecoin Storage',
      description: 'Decentralized storage with FVM smart contracts, USDFC payments, and programmable storage.',
      icon: <FilecoinIcon sx={{ fontSize: 40 }} />,
      path: '/filecoin',
      color: '#0090FF',
      sponsor: 'Filecoin Foundation',
      prize: '$50,000'
    },
    {
      title: 'NEAR Agents',
      description: 'AI-driven agents with cross-chain signatures and intent-based execution on NEAR.',
      icon: <NEARIcon sx={{ fontSize: 40 }} />,
      path: '/near-agents',
      color: '#00C851',
      sponsor: 'NEAR Foundation',
      prize: '$30,000'
    },
    {
      title: 'Weather Data',
      description: 'Real-time weather data integration for risk assessment and environmental monitoring.',
      icon: <WeatherIcon sx={{ fontSize: 40 }} />,
      path: '/weather',
      color: '#FF6B35',
      sponsor: 'WeatherXM',
      prize: '$15,000'
    },
    {
      title: 'AI Tooling',
      description: 'Advanced AI agent tooling with GitHub integration and MCP solver nodes.',
      icon: <AIIcon sx={{ fontSize: 40 }} />,
      path: '/ai-tooling',
      color: '#9C27B0',
      sponsor: 'Mosaia',
      prize: '$20,000'
    },
    {
      title: 'Cross-Chain Bridge',
      description: 'Seamless asset and data transfer between Ethereum, Polygon, and other chains.',
      icon: <BridgeIcon sx={{ fontSize: 40 }} />,
      path: '/bridge',
      color: '#FF9800',
      sponsor: 'Secured Finance',
      prize: '$10,000'
    },
    {
      title: 'ENS + IPFS',
      description: 'Decentralized frontend hosting with ENS domains and IPFS deployment.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      path: '/ens-ipfs',
      color: '#E91E63',
      sponsor: 'Nouns',
      prize: '$5,000'
    },
    {
      title: 'DID System',
      description: 'GDPR-compliant Decentralized Identifier system for secure identity management.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      path: '/did-system',
      color: '#607D8B',
      sponsor: 'Bio AI',
      prize: '$5,000'
    },
    {
      title: 'Aerial Analysis',
      description: 'AI-powered aerial imagery analysis for environmental and urban planning.',
      icon: <AerialIcon sx={{ fontSize: 40 }} />,
      path: '/aerial',
      color: '#4CAF50',
      sponsor: 'Spexi',
      prize: '$5,000'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Main Dashboard Card */}
      <DashboardCard />

      {/* Core Features */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
        Core Features
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
        gap: 3,
        mb: 6
      }}>
        {features.map((feature) => (
          <Card 
            key={feature.title}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: feature.color, mr: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" fontWeight={600}>
                  {feature.title}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                {feature.description}
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => router.push(feature.path)}
                sx={{ 
                  alignSelf: 'flex-start',
                  bgcolor: feature.color,
                  '&:hover': {
                    bgcolor: feature.color,
                    opacity: 0.9
                  }
                }}
              >
                Open {feature.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Sponsor Integrations */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        🏆 Hackathon Sponsor Integrations
        <Chip 
          label="Total Prize: $140,000+" 
          color="success" 
          size="small" 
          sx={{ ml: 2, fontWeight: 'bold' }}
        />
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 6
      }}>
        {sponsorFeatures.map((feature) => (
          <Card 
            key={feature.title}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: `2px solid ${feature.color}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 8,
                borderColor: feature.color
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: feature.color, mr: 2 }}>
                  {feature.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Chip 
                    label={feature.sponsor} 
                    size="small" 
                    sx={{ 
                      bgcolor: feature.color, 
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {feature.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={`Prize: ${feature.prize}`} 
                  color="warning" 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              
              <Button
                variant="outlined"
                onClick={() => router.push(feature.path)}
                sx={{ 
                  alignSelf: 'flex-start',
                  borderColor: feature.color,
                  color: feature.color,
                  '&:hover': {
                    borderColor: feature.color,
                    bgcolor: `${feature.color}10`
                  }
                }}
              >
                Try {feature.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Quick Stats
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Drones
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary" gutterBottom>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  NPC Agents
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" gutterBottom>
                  45.2GB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Storage Used
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" gutterBottom>
                  156
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proof Sets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Integration Status */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Integration Status
        </Typography>
        
        <Grid container spacing={2}>
          {sponsorFeatures.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: feature.color, mr: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label="Live" 
                    color="success" 
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;