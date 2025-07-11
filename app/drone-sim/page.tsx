"use client";

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DroneSimDashboard from '@/components/drone-sim//DroneSimDashboard';

const DroneSimPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Drone Simulation & Agent Interaction
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <DroneSimDashboard />
      </Box>
    </Container>
  );
};

export default DroneSimPage; 