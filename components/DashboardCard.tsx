import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Users, Globe, Database, Gamepad2 } from 'lucide-react';
import { config } from '../config';

const DashboardCard: React.FC = () => {
  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, rgba(26, 34, 54, 0.9) 0%, rgba(35, 44, 67, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(110, 193, 200, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        mb: 4
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
          opacity: 0.1,
          zIndex: 0
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: '#6ec1c8',
            textAlign: { xs: 'center', md: 'left' },
            mb: 1
          }}
        >
          CYBER<span style={{ color: '#bdb89c' }}>PUNK</span> METAVERSE
        </Typography>
        <Typography 
          variant="h6" 
          color="secondary" 
          sx={{ 
            mb: 3,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          A play-to-earn metaverse for autonomous agents and drones to help users connect with the real world
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 4,
          mt: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Users style={{ color: '#6ec1c8', fontSize: 32 }} />
            <Typography variant="h4" color="primary">{config.metaverse.maxPlayers}</Typography>
            <Typography variant="body2" color="secondary">Max Players</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Globe style={{ color: '#bdb89c', fontSize: 32 }} />
            <Typography variant="h4" color="secondary">{config.metaverse.worldSize.width / 1000}k</Typography>
            <Typography variant="body2" color="secondary">World Size (m)</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Database style={{ color: '#ffd700', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: '#ffd700' }}>{config.storageCapacity}GB</Typography>
            <Typography variant="body2" color="secondary">Storage</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Gamepad2 style={{ color: '#6ec1c8', fontSize: 32 }} />
            <Typography variant="h4" color="primary">{config.metaverse.gameMechanics.currency}</Typography>
            <Typography variant="body2" color="secondary">Currency</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard; 