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
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet as WalletIcon,
  Login as LoginIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import { useFlowUser } from '@/hooks/useFlowUser';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface MuiNavbarProps {
  onMenuClick: () => void;
}

const MuiNavbar: React.FC<MuiNavbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [networkAnchorEl, setNetworkAnchorEl] = useState<null | HTMLElement>(null);
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  const [currentNetwork, setCurrentNetwork] = useState('Filecoin Calibration');
  const [showEvmToast, setShowEvmToast] = useState(false);

  // WAGMI hooks for EVM/Filecoin
  const { address, isConnected } = useAccount();

  // Flow hooks
  const flow = useFlowUser();

  // Helper: determine which network is active
  const getActiveNetwork = () => {
    if (flow && flow.addr) return 'Flow Testnet';
    // For EVM, just show the selected network (local state)
    return currentNetwork;
  };

  const handleNetworkClick = (event: React.MouseEvent<HTMLElement>) => {
    setNetworkAnchorEl(event.currentTarget);
  };

  const handleNetworkSelect = (network: string): void => {
    setCurrentNetwork(network);
    setNetworkAnchorEl(null);
    if (network === 'Flow Testnet') {
      flow.connect();
    } else if (network === 'Near') {
      // No provider logic yet, just update UI
    } else if (network === 'Filecoin Mainnet' || network === 'Filecoin Calibration') {
      setShowEvmToast(true);
    }
  };

  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    setWalletAnchorEl(event.currentTarget);
  };

  const handleWalletClose = () => {
    setWalletAnchorEl(null);
  };

  const handleNetworkClose = () => {
    setNetworkAnchorEl(null);
  };

  const connectWallet = () => {
    // Use RainbowKit modal or similar in real app
    // For now, just close menu
    handleWalletClose();
  };

  const disconnectWallet = () => {
    // No direct disconnect in wagmi, but you can reset connectors if needed
    handleWalletClose();
  };

  const loginWithFlow = () => {
    flow.connect();
    handleWalletClose();
  };

  const logoutFlow = () => {
    flow.disconnect();
    handleWalletClose();
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

        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* EVM Wallet (RainbowKit) */}
          <ConnectButton
            showBalance={false}
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
            chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
            label="EVM Wallet"
          />
          {/* Flow Wallet */}
          {flow && flow.addr ? (
            <Tooltip title={flow.addr} arrow>
              <Chip
                icon={<CheckCircleIcon />}
                label={`Flow: ${flow.addr.slice(0, 6)}...${flow.addr.slice(-4)}`}
                color="success"
                variant="outlined"
                onClick={handleWalletClick}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Connect Flow Wallet" arrow>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={loginWithFlow}
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Login with Flow
              </Button>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
      <Snackbar
        open={showEvmToast}
        autoHideDuration={4000}
        onClose={() => setShowEvmToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowEvmToast(false)} severity="info" sx={{ width: '100%' }}>
          Please use your wallet modal (e.g. MetaMask, RainbowKit) to switch EVM networks.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default MuiNavbar; 