import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Box, Typography } from '@mui/material';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Assets', href: '/?tab=metaverse' },
  { label: 'Avatar', href: '/?tab=avatar' },
  { label: 'Storage', href: '/?tab=storage' },
  { label: 'Proof Sets', href: '/?tab=proof-set' },
  { label: 'Drone Sim', href: '/?tab=drone-sim' },
];

export default function Sidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
          CYBER<span style={{ color: '#bdb89c' }}>PUNK</span>
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}