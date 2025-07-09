"use client";

import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import DashboardCard from '../components/DashboardCard';
import {
  CloudUpload as AssetsIcon,
  Person as AvatarsIcon,
  Storage as StorageIcon,
  Verified as ProofSetsIcon,
  Flight as DroneSimIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const router = useRouter();

  const features = [
    {
      title: 'Assets',
      description: 'Manage your metaverse assets, upload new content, and organize your digital collection.',
      icon: <AssetsIcon sx={{ fontSize: 40 }} />,
      path: '/assets',
      color: 'primary.main'
    },
    {
      title: 'Avatars',
      description: 'Create and customize your cyberpunk avatar with unique characteristics and traits.',
      icon: <AvatarsIcon sx={{ fontSize: 40 }} />,
      path: '/avatars',
      color: 'secondary.main'
    },
    {
      title: 'Storage',
      description: 'Monitor your wallet balances, storage status, and manage your digital storage allowance.',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      path: '/storage',
      color: 'success.main'
    },
    {
      title: 'Proof Sets',
      description: 'View and manage your proof sets for verification and authentication.',
      icon: <ProofSetsIcon sx={{ fontSize: 40 }} />,
      path: '/proofsets',
      color: 'warning.main'
    },
    {
      title: 'Drone Sim',
      description: 'Control drones, interact with NPC agents, and manage autonomous missions.',
      icon: <DroneSimIcon sx={{ fontSize: 40 }} />,
      path: '/drone-sim',
      color: 'info.main'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Main Dashboard Card */}
      <DashboardCard />

      {/* Features Overview */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
        Explore Features
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
        gap: 3
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

      {/* Quick Stats */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Quick Stats
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3
        }}>
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
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;