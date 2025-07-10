"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Storage as StorageIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAccount } from 'wagmi';

interface StorageMetrics {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  allowance: number;
  balance: number;
}

const StoragePage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [metrics, setMetrics] = useState<StorageMetrics>({
    totalStorage: 1000,
    usedStorage: 250,
    availableStorage: 750,
    allowance: 100,
    balance: 50
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        usedStorage: Math.floor(Math.random() * 300) + 200
      }));
      setMessage({ type: 'success', text: 'Storage metrics updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to refresh metrics' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAllowance = async () => {
    setLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMetrics(prev => ({ ...prev, allowance: prev.allowance + 50 }));
      setMessage({ type: 'success', text: 'Allowance increased successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to increase allowance' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTokens = async () => {
    setLoading(true);
    try {
      // Simulate faucet request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMetrics(prev => ({ ...prev, balance: prev.balance + 25 }));
      setMessage({ type: 'success', text: 'Tokens received from faucet!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to request tokens' });
    } finally {
      setLoading(false);
    }
  };

  const getStoragePercentage = () => {
    return (metrics.usedStorage / metrics.totalStorage) * 100;
  };

  const getStorageColor = (percentage: number) => {
    if (percentage < 50) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Storage Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Wallet Connection Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WalletIcon color="primary" />
            <Box>
              <Typography variant="h6">
                {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isConnected && address ? `Address: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Please connect your wallet'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Storage Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {/* Storage Status */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <StorageIcon color="primary" />
              <Typography variant="h6">Storage Status</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Used Storage</Typography>
                <Typography variant="body2">{metrics.usedStorage} GB / {metrics.totalStorage} GB</Typography>
              </Box>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: 'grey.200', 
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    width: `${getStoragePercentage()}%`,
                    height: '100%',
                    bgcolor: `${getStorageColor(getStoragePercentage())}.main`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Available: {metrics.availableStorage} GB
            </Typography>
          </CardContent>
        </Card>

        {/* Token Balance */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <MoneyIcon color="primary" />
              <Typography variant="h6">Token Balance</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {metrics.balance} FIL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available for storage payments
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRequestTokens}
                disabled={loading}
              >
                Request Tokens
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Allowance Management */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">Storage Allowance</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body1">
              Current Allowance: <strong>{metrics.allowance} FIL</strong>
            </Typography>
            <Chip 
              label={metrics.allowance > 0 ? 'Active' : 'Inactive'} 
              color={metrics.allowance > 0 ? 'success' : 'error'} 
              size="small" 
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Allowance permits the storage contract to spend your tokens for storage operations.
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleRequestAllowance}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            Increase Allowance (+50 FIL)
          </Button>
        </CardContent>
      </Card>

      {/* Recent Storage Operations */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Operations</Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <UploadIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="File Upload"
                secondary="cyberpunk_avatar_001.glb • 2.5 MB • 2 hours ago"
              />
              <Chip label="Success" color="success" size="small" />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <DownloadIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="File Download"
                secondary="mission_data_2024.json • 1.8 MB • 5 hours ago"
              />
              <Chip label="Success" color="success" size="small" />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Storage Warning"
                secondary="Storage usage approaching limit • 1 day ago"
              />
              <Chip label="Warning" color="warning" size="small" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StoragePage; 