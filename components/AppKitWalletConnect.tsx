'use client';

import React from 'react';
import { useAppKitWallet } from '../hooks/useAppKitWallet';
import {
  Box,
  Button,
  Chip,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Link as LinkIcon,
  LinkOff as DisconnectIcon,
  SwapHoriz as SwitchIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  CurrencyExchange as BalanceIcon,
  NetworkCheck as NetworkIcon,
} from '@mui/icons-material';

export const AppKitWalletConnect: React.FC = () => {
  const {
    state,
    isConnected,
    address,
    chainId,
    chainName,
    balance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    openAccountModal,
    openNetworkModal,
  } = useAppKitWallet();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatAddress = (address: string | null) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0';
    const num = parseFloat(balance);
    return num > 0.001 ? num.toFixed(4) : '< 0.001';
  };

  const getChainIcon = (chainId: number | null) => {
    // You can add chain-specific icons here
    return <NetworkIcon />;
  };

  const getChainColor = (chainId: number | null) => {
    // Chain-specific colors
    switch (chainId) {
      case 1: return '#627EEA'; // Ethereum
      case 137: return '#8247E5'; // Polygon
      case 42161: return '#28A0F0'; // Arbitrum
      case 314: return '#0090FF'; // Filecoin
      case 314159: return '#0090FF'; // Filecoin Calibration
      default: return '#666';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Connecting...
        </Typography>
      </Box>
    );
  }

  if (!isConnected) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<WalletIcon />}
          onClick={connectWallet}
          sx={{
            background: 'linear-gradient(45deg, #00ff41, #ff006e)',
            '&:hover': {
              background: 'linear-gradient(45deg, #00cc33, #cc0052)',
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Connect Wallet
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ maxWidth: 300 }}>
          {error}
        </Alert>
      )}

      {/* Network Badge */}
      <Tooltip title={`Connected to ${chainName || 'Unknown Network'}`}>
        <Chip
          icon={getChainIcon(chainId)}
          label={chainName || 'Unknown'}
          size="small"
          sx={{
            backgroundColor: getChainColor(chainId),
            color: 'white',
            '& .MuiChip-icon': { color: 'white' },
          }}
        />
      </Tooltip>

      {/* Balance Display */}
      <Tooltip title="Wallet Balance">
        <Chip
          icon={<BalanceIcon />}
          label={`${formatBalance(balance)} ${chainName === 'Filecoin' ? 'FIL' : 'ETH'}`}
          size="small"
          variant="outlined"
        />
      </Tooltip>

      {/* Wallet Menu */}
      <Box>
        <Button
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '12px',
            textTransform: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: getChainColor(chainId),
              fontSize: '0.875rem',
            }}
          >
            {address ? address.slice(2, 4).toUpperCase() : '??'}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatAddress(address)}
          </Typography>
          <ConnectedIcon sx={{ color: '#00ff41', fontSize: 16 }} />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Wallet Connected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatAddress(address)}
            </Typography>
          </Box>

          {/* Menu Items */}
          <MenuItem onClick={openAccountModal}>
            <ListItemIcon>
              <AccountIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Account Details" />
          </MenuItem>

          <MenuItem onClick={openNetworkModal}>
            <ListItemIcon>
              <SwitchIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Switch Network" />
          </MenuItem>

          <Divider />

          <MenuItem onClick={disconnectWallet}>
            <ListItemIcon>
              <DisconnectIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Disconnect Wallet" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AppKitWalletConnect; 