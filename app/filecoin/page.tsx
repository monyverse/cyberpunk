"use client";

import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Storage as StorageIcon,
  AttachMoney as MoneyIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  SwapHoriz as BridgeIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

const FilecoinPage: React.FC = () => {
  const [fileSize, setFileSize] = useState('');
  const [metadata, setMetadata] = useState('');
  const [storageCost, setStorageCost] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [storedFiles, setStoredFiles] = useState<any[]>([]);
  const [bridgeDialog, setBridgeDialog] = useState(false);
  const [bridgeTarget, setBridgeTarget] = useState('ethereum');
  const [bridgeAmount, setBridgeAmount] = useState('');

  const { addFilecoinAgent, addHybridAgent } = useAgents();

  // Calculate storage cost
  useEffect(() => {
    if (fileSize) {
      const sizeInGB = parseInt(fileSize) / (1024 * 1024 * 1024);
      const cost = Math.max(sizeInGB * 0.1, 0.01); // 0.1 USDFC per GB, minimum 0.01
      setStorageCost(cost);
    }
  }, [fileSize]);

  const handleFileUpload = async () => {
    if (!fileSize || !metadata) {
      alert('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add Filecoin agent
      await addFilecoinAgent({
        name: `Filecoin_${Date.now()}`,
        type: 'filecoin',
        capabilities: ['storage', 'payment', 'bridge'],
        metadata: {
          fileSize: parseInt(fileSize),
          metadata,
          cost: storageCost
        }
      });

      // Add to stored files
      const newFile = {
        id: Date.now(),
        size: fileSize,
        metadata,
        cost: storageCost,
        timestamp: new Date().toISOString(),
        status: 'stored'
      };

      setStoredFiles(prev => [...prev, newFile]);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setFileSize('');
        setMetadata('');
        setShowPaymentDialog(true);
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePayment = async () => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPaymentDialog(false);
      setPaymentAmount('');
      
      // Show success message
      alert('Payment successful! File stored on Filecoin network.');
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleBridge = async () => {
    if (!bridgeAmount) {
      alert('Please enter bridge amount');
      return;
    }

    try {
      // Add hybrid agent for cross-chain bridge
      await addHybridAgent({
        name: `Bridge_${Date.now()}`,
        type: 'hybrid',
        capabilities: ['filecoin', 'ethereum', 'bridge'],
        metadata: {
          sourceChain: 'filecoin',
          targetChain: bridgeTarget,
          amount: parseFloat(bridgeAmount)
        }
      });

      setBridgeDialog(false);
      setBridgeAmount('');
      alert(`Bridge transaction initiated to ${bridgeTarget}!`);

    } catch (error) {
      console.error('Bridge failed:', error);
      alert('Bridge transaction failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🌐 Filecoin Integration
        <Chip 
          label="Filecoin Foundation - $50,000 Prize" 
          color="primary" 
          sx={{ ml: 2 }}
        />
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Decentralized storage with FVM smart contracts, USDFC payments, and programmable storage capabilities.
      </Typography>

      <Grid container spacing={4}>
        {/* File Upload Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Store File on Filecoin
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="File Size (bytes)"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                placeholder="1073741824"
              />

              <TextField
                fullWidth
                label="Metadata (IPFS Hash)"
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="QmYourIPFSHash..."
              />

              {storageCost > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Storage Cost: {storageCost.toFixed(4)} USDFC
                </Alert>
              )}

              {isUploading && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploading to Filecoin... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleFileUpload}
                disabled={isUploading || !fileSize || !metadata}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isUploading ? 'Uploading...' : 'Upload to Filecoin'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => setBridgeDialog(true)}
                fullWidth
                startIcon={<BridgeIcon />}
              >
                Bridge to Other Chains
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StorageIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Storage Statistics
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="primary">
                      {storedFiles.length}
                    </Typography>
                    <Typography variant="body2">
                      Files Stored
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main">
                      {(storedFiles.reduce((acc, file) => acc + file.cost, 0)).toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      USDFC Spent
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Recent Files
              </Typography>
              
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {storedFiles.slice(-5).reverse().map((file) => (
                  <React.Fragment key={file.id}>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB`}
                        secondary={`${file.metadata} - ${file.cost.toFixed(4)} USDFC`}
                      />
                      <Chip label="Stored" color="success" size="small" />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {storedFiles.length === 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary="No files stored yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* FVM Smart Contracts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ mr: 1 }} />
                FVM Smart Contracts
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Storage Contract
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Deployed on Calibration Testnet
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Contract
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      USDFC Payment Processing
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Bridge Contract
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Cross-chain Asset Transfer
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Storage Cost: {storageCost.toFixed(4)} USDFC
          </Typography>
          <TextField
            fullWidth
            label="Payment Amount (USDFC)"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            type="number"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained">
            Pay with USDFC
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bridge Dialog */}
      <Dialog open={bridgeDialog} onClose={() => setBridgeDialog(false)}>
        <DialogTitle>Bridge to Other Chains</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Target Chain"
            value={bridgeTarget}
            onChange={(e) => setBridgeTarget(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="near">NEAR</option>
          </TextField>
          <TextField
            fullWidth
            label="Bridge Amount (USDFC)"
            value={bridgeAmount}
            onChange={(e) => setBridgeAmount(e.target.value)}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBridgeDialog(false)}>Cancel</Button>
          <Button onClick={handleBridge} variant="contained">
            Bridge Assets
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FilecoinPage; 