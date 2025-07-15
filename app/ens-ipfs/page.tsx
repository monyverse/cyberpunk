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
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  CloudUpload as UploadIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

interface DeployedSite {
  id: number;
  ensName: string;
  ipfsHash: string;
  status: string;
  timestamp: string;
  url: string;
}

const ENSIPFSPage: React.FC = () => {
  const [ensName, setEnsName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployedSites, setDeployedSites] = useState<DeployedSite[]>([]);

  const { addNounsAgent } = useAgents();

  const handleDeploy = async () => {
    if (!ensName || !ipfsHash) {
      alert('Please fill in all fields');
      return;
    }

    setIsDeploying(true);
    setDeployProgress(0);

    try {
      // Simulate deployment progress
      const interval = setInterval(() => {
        setDeployProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add Nouns agent for ENS + IPFS deployment
      await addNounsAgent({
        name: `ENS_${ensName}_${Date.now()}`,
        type: 'nouns',
        capabilities: ['ens', 'ipfs', 'deployment'],
        metadata: {
          ensName,
          ipfsHash,
          deploymentType: 'frontend'
        }
      }, ensName);

      // Add to deployed sites
      const newSite: DeployedSite = {
        id: Date.now(),
        ensName,
        ipfsHash,
        status: 'deployed',
        timestamp: new Date().toISOString(),
        url: `https://${ensName}.eth.link`
      };

      setDeployedSites(prev => [newSite, ...prev]);

      setTimeout(() => {
        setIsDeploying(false);
        setDeployProgress(0);
        setEnsName('');
        setIpfsHash('');
        alert('Site deployed successfully to ENS + IPFS!');
      }, 2000);

    } catch (error) {
      console.error('Deployment failed:', error);
      setIsDeploying(false);
      setDeployProgress(0);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🌐 ENS + IPFS Deployment
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Deploy decentralized frontends with ENS domains and IPFS hosting.
      </Typography>

      <Grid container spacing={4}>
        {/* Deployment Interface */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <UploadIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Deploy Frontend
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="ENS Name"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="myapp.eth"
              />

              <TextField
                fullWidth
                label="IPFS Hash"
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="QmYourIPFSHash..."
              />

              {isDeploying && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Deploying to ENS + IPFS... {deployProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={deployProgress} />
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleDeploy}
                disabled={isDeploying || !ensName || !ipfsHash}
                fullWidth
                sx={{ mb: 2 }}
                color="error"
              >
                {isDeploying ? 'Deploying...' : 'Deploy to ENS + IPFS'}
              </Button>

              <Alert severity="info">
                Your site will be accessible at: {ensName ? `https://${ensName}.eth.link` : 'https://[ens-name].eth.link'}
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Deployment Stats */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Deployment Statistics
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="error.main">
                      {deployedSites.length}
                    </Typography>
                    <Typography variant="body2">
                      Sites Deployed
                    </Typography>
                  </Box>
                </Grid>
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main">
                      100%
                    </Typography>
                    <Typography variant="body2">
                      Uptime
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Recent Deployments
              </Typography>
              
              {deployedSites.slice(0, 5).map((site) => (
                <Box key={site.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      {site.ensName}
                    </Typography>
                    <Chip label="Deployed" color="success" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    IPFS: {site.ipfsHash}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {site.url}
                  </Typography>
                </Box>
              ))}
              
              {deployedSites.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No sites deployed yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ENS + IPFS Features */}
        {/* @ts-expect-error MUI v7 Grid type error workaround */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                Decentralized Hosting Features
              </Typography>
              
              <Grid container spacing={2}>
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ENS Domains
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Human-readable domain names on Ethereum
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
                
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      IPFS Hosting
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Decentralized content addressing
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
                
                {/* @ts-expect-error MUI v7 Grid type error workaround */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Censorship Resistant
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No single point of failure
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ENSIPFSPage; 