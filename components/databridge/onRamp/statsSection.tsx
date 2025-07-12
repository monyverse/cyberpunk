// components/StatsSection.tsx
import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupIcon from '@mui/icons-material/Group';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';

type BgColor = 'indigo' | 'green' | 'red' | 'yellow';

const stats: { icon: JSX.Element; bg: BgColor; label: string; value: string }[] = [
  {
    icon: <InsertDriveFileIcon sx={{ color: 'white' }} />, bg: 'indigo', label: 'Total Files', value: '20',
  },
  {
    icon: <GroupIcon sx={{ color: 'white' }} />, bg: 'green', label: 'Verified Files', value: '12',
  },
  {
    icon: <StorageIcon sx={{ color: 'white' }} />, bg: 'red', label: 'Total Storage', value: '10 GB',
  },
  {
    icon: <DnsIcon sx={{ color: 'white' }} />, bg: 'yellow', label: 'Storage Used', value: '2.1 GB',
  },
];

const bgColors: Record<BgColor, string> = {
  indigo: '#6366f1',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
};

const StatsSection = () => {
  return (
    <Box sx={{ mt: 3, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' } }}>
      {stats.map((stat) => (
        <Paper key={stat.label} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: bgColors[stat.bg], borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </Box>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {stat.value}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default StatsSection;
