"use client";

import React, { useState } from 'react';
import {
  Toolbar,
  IconButton,
  Box,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon, SportsEsports as GameFiIcon, People as AvatarsIcon, ViewInAr as XRIcon, Build as ToolsIcon, Brightness4, Brightness7
} from '@mui/icons-material';
import { AppKitWalletConnect } from './AppKitWalletConnect';
import Image from 'next/image';
import Link from 'next/link';

interface MuiNavbarProps {
  onMenuClick: () => void;
}

const navLinks = [
  { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: 20 }} /> },
  { label: 'Avatars', href: '/avatars', icon: <AvatarsIcon sx={{ fontSize: 20 }} /> },
  { label: 'XR', href: '/xr', icon: <XRIcon sx={{ fontSize: 20 }} /> },
  { label: 'Marketplace', href: '/marketplace', icon: <GameFiIcon sx={{ fontSize: 20 }} /> },
  { label: 'Tools', href: '/tools', icon: <ToolsIcon sx={{ fontSize: 20 }} /> },
];

export default function MuiNavbar({ onMenuClick }: MuiNavbarProps) {
  const theme = useTheme();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoNotification, setDemoNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleCloseNotification = () => {
    setDemoNotification(null);
  };

  return (
    <>
      {/* Animated neon glassmorphism header with floating particles */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 1300,
          background: 'rgba(10, 10, 30, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '2px solid',
          borderImage: 'linear-gradient(90deg, #00ffea, #ff00ea, #00ffea) 1',
          boxShadow: '0 4px 32px 0 rgba(0,255,255,0.08)',
          overflow: 'visible',
        }}
      >
        {/* Floating particles (CSS only) */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {[...Array(18)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 98}%`,
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                borderRadius: '50%',
                background: `linear-gradient(135deg, #00ffea 0%, #ff00ea 100%)`,
                opacity: 0.18 + Math.random() * 0.18,
                filter: 'blur(2px)',
                animation: `floatY 6s ease-in-out infinite alternate ${i * 0.3}s`,
              }}
            />
          ))}
        </Box>
        <Toolbar sx={{ position: 'relative', zIndex: 1, minHeight: 72 }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Animated Logo */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', mr: 2 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/cyberpunk-logo.svg"
                alt="CyberPunk Metaverse Logo"
                width={48}
                height={48}
                priority
                style={{
                  display: 'block',
                  filter: 'drop-shadow(0 0 12px #00ffea) drop-shadow(0 0 24px #ff00ea)',
                  animation: 'pulseGlow 2.5s infinite alternate',
                }}
              />
            </Link>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: 1,
                    background: 'rgba(0,0,0,0.12)',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 0 0 #00ffea',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #00ffea 0%, #ff00ea 100%)',
                      color: '#0a0a1e',
                      boxShadow: '0 0 12px 2px #00ffea',
                      transform: 'translateY(-2px) scale(1.05)',
                    },
                  }}
                >
                  {link.icon}
                  {link.label}
                </Box>
              </Link>
            ))}
          </Box>

          {/* Wallet Connect & Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AppKitWalletConnect />
            <IconButton sx={{ color: '#00ffea', ml: 1 }}>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </Box>
      {/* Demo Mode Notification (unchanged) */}
      <Snackbar
        open={!!demoNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={demoNotification?.type} 
          sx={{ width: '100%' }}
        >
          {demoNotification?.message}
        </Alert>
      </Snackbar>
      {/* Neon/animated CSS keyframes */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 0 8px #00ffea) drop-shadow(0 0 16px #ff00ea); }
          100% { filter: drop-shadow(0 0 24px #00ffea) drop-shadow(0 0 48px #ff00ea); }
        }
        @keyframes floatY {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
      `}</style>
    </>
  );
} 