"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  SwapHoriz as BridgeIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

interface BridgeHistoryItem {
  id: number;
  sourceChain: string;
  targetChain: string;
  amount: number;
  token: string;
  status: string;
  timestamp: string;
}

const BridgePage: React.FC = () => {
  const [sourceChain, setSourceChain] = useState('filecoin');
  const [targetChain, setTargetChain] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDFC');
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeHistory, setBridgeHistory] = useState<BridgeHistoryItem[]>([]);

  const { addSecuredFinanceAgent } = useAgents();

  const chains = [
    { value: 'filecoin', label: 'Filecoin' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'near', label: 'NEAR' }
  ];

  const tokens = [
    { value: 'USDFC', label: 'USDFC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'MATIC', label: 'MATIC' },
    { value: 'NEAR', label: 'NEAR' }
  ];

  const handleBridge = async () => {
    if (!amount) {
      alert('Please enter bridge amount');
      return;
    }

    setIsBridging(true);
    try {
      // Add Secured Finance agent for bridge
      await addSecuredFinanceAgent({
        name: `Bridge_${sourceChain}_${targetChain}_${Date.now()}`,
        type: 'bridge',
        capabilities: ['cross_chain', 'asset_transfer'],
        metadata: {
          sourceChain,
          targetChain,
          amount: parseFloat(amount),
          token
        }
      });

      // Add to bridge history
      const newBridge: BridgeHistoryItem = {
        id: Date.now(),
        sourceChain,
        targetChain,
        amount: parseFloat(amount),
        token,
        status: 'completed',
        timestamp: new Date().toISOString()
      };

      setBridgeHistory(prev => [newBridge, ...prev]);

      setAmount('');
      alert(`Bridge transaction completed! ${amount} ${token} bridged from ${sourceChain} to ${targetChain}`);

    } catch (error) {
      console.error('Bridge failed:', error);
      alert('Bridge transaction failed. Please try again.');
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'xl', mt: 2, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🌉 Cross-Chain Bridge
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Seamlessly transfer assets and data between different blockchain networks.
      </Typography>

      <Grid container spacing={4}>
        {/* Bridge Interface */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BridgeIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Bridge Assets
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Source Chain</InputLabel>
                <Select
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value as string)}
                  label="Source Chain"
                >
                  {chains.map(chain => (
                    <MenuItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Chain</InputLabel>
                <Select
                  value={targetChain}
                  onChange={(e) => setTargetChain(e.target.value as string)}
                  label="Target Chain"
                >
                  {chains.filter(chain => chain.value !== sourceChain).map(chain => (
                    <MenuItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Token</InputLabel>
                <Select
                  value={token}
                  onChange={(e) => setToken(e.target.value as string)}
                  label="Token"
                >
                  {tokens.map(token => (
                    <MenuItem key={token.value} value={token.value}>
                      {token.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleBridge}
                disabled={isBridging || !amount}
                fullWidth
                color="warning"
              >
                {isBridging ? 'Bridging...' : 'Bridge Assets'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Bridge Status */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bridge Status
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main">
                      {bridgeHistory.length}
                    </Typography>
                    <Typography variant="body2">
                      Completed Bridges
                    </Typography>
                  </Box>
                </Grid>
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="info.main">
                      4
                    </Typography>
                    <Typography variant="body2">
                      Connected Chains
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Recent Bridges
              </Typography>
              
              {bridgeHistory.slice(0, 5).map((bridge) => (
                <Box key={bridge.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {bridge.amount} {bridge.token}
                    </Typography>
                    <Chip label="Completed" color="success" size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {bridge.sourceChain} → {bridge.targetChain}
                  </Typography>
                </Box>
              ))}
              
              {bridgeHistory.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No bridge transactions yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Connected Chains */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connected Chains
              </Typography>
              
              <Grid container spacing={2}>
                {chains.map((chain) => (
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6} md={3} key={chain.value}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {chain.label}
                      </Typography>
                      <Chip label="Connected" color="success" size="small" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BridgePage; 