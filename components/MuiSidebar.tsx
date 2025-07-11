"use client";

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Verified as VerifiedIcon,
  Flight as FlightIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface MuiSidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Assets', icon: <CloudUploadIcon />, path: '/assets' },
  { text: 'Avatars', icon: <PersonIcon />, path: '/avatars' },
  { text: 'Storage', icon: <StorageIcon />, path: '/storage' },
  { text: 'Proof Sets', icon: <VerifiedIcon />, path: '/proofsets' },
  { text: 'Drone Sim', icon: <FlightIcon />, path: '/drone-sim' },
];

const MuiSidebar: React.FC<MuiSidebarProps> = ({ open, onClose, isMobile }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 240, height: '100%', bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          CYBER<span style={{ color: theme.palette.secondary.main }}>PUNK</span>
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              bgcolor: 'background.paper'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default MuiSidebar; 