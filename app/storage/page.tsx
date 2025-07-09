"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Storage as StorageIcon,
  Token as TokenIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const StoragePage: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isFlowConnected, setIsFlowConnected] = useState(false);

  // Mock data - replace with actual wallet/blockchain data
  const walletData = {
    balances: {
      tUSDFC: 1250.50,
      tFIL: 45.75,
      ETH: 2.34,
      MATIC: 150.00
    },
    storage: {
      used: 45.2,
      total: 100,
      allowance: 75.5
    },
    status: {
      wallet: 'connected',
      storage: 'active',
      allowance: 'sufficient'
    }
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
  };

  const handleConnectFlow = () => {
    setIsFlowConnected(true);
  };

  const handleGetTokens = (token: string) => {
    console.log(`Getting ${token} tokens...`);
    // Implement actual token faucet logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'sufficient':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'insufficient':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'sufficient':
        return <CheckCircleIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
      case 'insufficient':
        return <ErrorIcon />;
      default:
        return <WarningIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Storage Management
      </Typography>

      {/* Connection Status */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WalletIcon /> Wallet Connection
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  icon={getStatusIcon(walletData.status.wallet)}
                  label={`Wallet: ${walletData.status.wallet}`}
                  color={getStatusColor(walletData.status.wallet) as any}
                />
                {!isWalletConnected && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  icon={getStatusIcon(isFlowConnected ? 'connected' : 'error')}
                  label={`Flow: ${isFlowConnected ? 'connected' : 'disconnected'}`}
                  color={getStatusColor(isFlowConnected ? 'connected' : 'error') as any}
                />
                {!isFlowConnected && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleConnectFlow}
                  >
                    Connect Flow
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon /> Storage Status
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Used Storage</Typography>
                <Typography variant="body2">{walletData.storage.used}GB / {walletData.storage.total}GB</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(walletData.storage.used / walletData.storage.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={getStatusIcon(walletData.status.storage)}
                label={`Storage: ${walletData.status.storage}`}
                color={getStatusColor(walletData.status.storage) as any}
              />
              <Chip
                icon={getStatusIcon(walletData.status.allowance)}
                label={`Allowance: ${walletData.status.allowance}`}
                color={getStatusColor(walletData.status.allowance) as any}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Wallet Balances */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TokenIcon /> Wallet Balances
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3
          }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TokenIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="tUSDFC"
                  secondary={`${walletData.balances.tUSDFC} USDFC`}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleGetTokens('tUSDFC')}
                >
                  Get tUSDFC
                </Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TokenIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="tFIL"
                  secondary={`${walletData.balances.tFIL} FIL`}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleGetTokens('tFIL')}
                >
                  Get tFIL
                </Button>
              </ListItem>
            </List>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <TokenIcon />
                </ListItemIcon>
                <ListItemText
                  primary="ETH"
                  secondary={`${walletData.balances.ETH} ETH`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TokenIcon />
                </ListItemIcon>
                <ListItemText
                  primary="MATIC"
                  secondary={`${walletData.balances.MATIC} MATIC`}
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Storage Details */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Storage Details
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3
          }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {walletData.storage.used}GB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Used Storage
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" gutterBottom>
                {walletData.storage.total}GB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Storage
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {walletData.storage.allowance}GB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Allowance
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StoragePage; 