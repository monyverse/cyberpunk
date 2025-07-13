"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet as WalletIcon,
  Login as LoginIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as DemoIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface MuiNavbarProps {
  onMenuClick: () => void;
}

const MuiNavbar: React.FC<MuiNavbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [networkAnchorEl, setNetworkAnchorEl] = useState<null | HTMLElement>(null);
  const [currentNetwork, setCurrentNetwork] = useState('Filecoin Calibration');
  const [showEvmToast, setShowEvmToast] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoNotification, setDemoNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // WAGMI hooks for EVM/Filecoin
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectEVMWallet } = useDisconnect();

  // Helper: determine which network is active
  const getActiveNetwork = () => {
    return currentNetwork;
  };

  const handleNetworkClick = (event: React.MouseEvent<HTMLElement>) => {
    setNetworkAnchorEl(event.currentTarget);
  };

  const handleNetworkSelect = (network: string): void => {
    setCurrentNetwork(network);
    setNetworkAnchorEl(null);
    if (network === 'Flow Testnet') {
      // RainbowKit will handle Flow wallet connection automatically
      setShowEvmToast(true);
    } else if (network === 'Near') {
      // No provider logic yet, just update UI
    } else if (network === 'Filecoin Mainnet' || network === 'Filecoin Calibration') {
      setShowEvmToast(true);
    }
  };

  const handleDemoModeToggle = async () => {
    try {
      if (!isDemoMode) {
        // Seed demo data
        const response = await fetch('/api/demo/seed', { method: 'POST' });
        if (response.ok) {
          setIsDemoMode(true);
          setDemoNotification({ message: 'Demo data seeded successfully!', type: 'success' });
        } else {
          setDemoNotification({ message: 'Failed to seed demo data', type: 'error' });
        }
      } else {
        // Reset demo data
        const response = await fetch('/api/demo/reset', { method: 'POST' });
        if (response.ok) {
          setIsDemoMode(false);
          setDemoNotification({ message: 'Demo data reset successfully!', type: 'success' });
        } else {
          setDemoNotification({ message: 'Failed to reset demo data', type: 'error' });
        }
      }
    } catch (error) {
      setDemoNotification({ message: 'Demo mode operation failed', type: 'error' });
    }
  };

  const networks = [
    { name: 'Filecoin Mainnet', chainId: 'filecoin' },
    { name: 'Filecoin Calibration', chainId: 'filecoinCalibration' },
    { name: 'Flow Testnet', chainId: 'testnet' },
    { name: 'Near', chainId: 'testnet' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'primary.main'
          }}
        >
          CYBER<span style={{ color: theme.palette.secondary.main }}>PUNK</span>
        </Typography>

        {/* Network Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Button
            onClick={handleNetworkClick}
            endIcon={<ExpandMoreIcon />}
            sx={{ 
              color: 'text.primary',
              textTransform: 'none',
              minWidth: 'auto'
            }}
          >
            <Chip
              label={getActiveNetwork()}
              size="small"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600
              }}
            />
          </Button>
          <Menu
            anchorEl={networkAnchorEl}
            open={Boolean(networkAnchorEl)}
            onClose={() => setNetworkAnchorEl(null)}
            PaperProps={{
              sx: { bgcolor: 'background.paper', border: 1, borderColor: 'divider' }
            }}
          >
            {networks.map((network, index) => (
              <MenuItem 
                key={`${network.chainId}-${network.name}-${index}`}
                onClick={() => handleNetworkSelect(network.name)}
                selected={getActiveNetwork() === network.name}
              >
                {network.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Demo Mode Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Tooltip title={isDemoMode ? "Reset Demo Data" : "Seed Demo Data"} arrow>
            <FormControlLabel
              control={
                <Switch
                  checked={isDemoMode}
                  onChange={handleDemoModeToggle}
                  color="secondary"
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DemoIcon sx={{ fontSize: 16, color: isDemoMode ? 'secondary.main' : 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: isDemoMode ? 'secondary.main' : 'text.secondary' }}>
                    Demo
                  </Typography>
                </Box>
              }
              sx={{ 
                mr: 0,
                '& .MuiFormControlLabel-label': { fontSize: '0.75rem' }
              }}
            />
          </Tooltip>
        </Box>

        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* RainbowKit Wallet (supports EVM, Flow, and other chains) */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              if (!ready || !account || !chain) {
                return (
                  <Button
                    variant="outlined"
                    startIcon={<WalletIcon />}
                    onClick={openConnectModal}
                    sx={{
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<WalletIcon />}
                    onClick={openAccountModal}
                    sx={{
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    {account.displayName}
                  </Button>
                  <Tooltip title="Disconnect Wallet" arrow>
                    <IconButton
                      size="small"
                      onClick={() => disconnectEVMWallet()}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'error.contrastText'
                        }
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              );
            }}
          </ConnectButton.Custom>
        </Box>
      </Toolbar>
      <Snackbar
        open={showEvmToast}
        autoHideDuration={4000}
        onClose={() => setShowEvmToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowEvmToast(false)} severity="info" sx={{ width: '100%' }}>
          Please use your wallet modal (e.g. MetaMask, RainbowKit) to switch networks.
        </Alert>
      </Snackbar>
      
      {/* Demo Mode Notification */}
      <Snackbar
        open={!!demoNotification}
        autoHideDuration={4000}
        onClose={() => setDemoNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setDemoNotification(null)} 
          severity={demoNotification?.type || 'info'} 
          sx={{ width: '100%' }}
        >
          {demoNotification?.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default MuiNavbar; 