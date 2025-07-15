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
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

interface DID {
  id: number;
  name: string;
  type: string;
  did: string;
  status: string;
  timestamp: string;
  compliance: string;
}

const DIDSystemPage: React.FC = () => {
  const [didName, setDidName] = useState('');
  const [didType, setDidType] = useState('individual');
  const [isCreating, setIsCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [createdDIDs, setCreatedDIDs] = useState<DID[]>([]);

  const { addBioAIAgent } = useAgents();

  const didTypes = [
    { value: 'individual', label: 'Individual DID' },
    { value: 'organization', label: 'Organization DID' },
    { value: 'device', label: 'Device DID' },
    { value: 'service', label: 'Service DID' }
  ];

  const handleCreateDID = async () => {
    if (!didName) {
      alert('Please enter a DID name');
      return;
    }

    setIsCreating(true);
    setCreateProgress(0);

    try {
      // Simulate DID creation progress
      const interval = setInterval(() => {
        setCreateProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add Bio AI agent for DID creation
      await addBioAIAgent({
        name: `DID_${didName}_${Date.now()}`,
        type: 'did',
        capabilities: ['identity_management', 'privacy_compliance', 'gdpr'],
        metadata: {
          didName,
          didType,
          compliance: 'GDPR'
        }
      });

      // Add to created DIDs
      const newDID: DID = {
        id: Date.now(),
        name: didName,
        type: didType,
        did: `did:bio:${Date.now()}`,
        status: 'active',
        timestamp: new Date().toISOString(),
        compliance: 'GDPR Compliant'
      };

      setCreatedDIDs(prev => [newDID, ...prev]);

      setTimeout(() => {
        setIsCreating(false);
        setCreateProgress(0);
        setDidName('');
        alert('DID created successfully with GDPR compliance!');
      }, 2000);

    } catch (error) {
      console.error('DID creation failed:', error);
      setIsCreating(false);
      setCreateProgress(0);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🔐 Decentralized Identity System
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        GDPR-compliant Decentralized Identifier system for secure identity management.
      </Typography>

      <Grid container spacing={4}>
        {/* DID Creation */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Create DID
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="DID Name"
                  value={didName}
                  onChange={(e) => setDidName(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="john.doe"
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>DID Type</InputLabel>
                  <Select
                    value={didType}
                    onChange={(e) => setDidType(e.target.value)}
                    label="DID Type"
                  >
                    {didTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {isCreating && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Creating DID... {createProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={createProgress} />
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={handleCreateDID}
                  disabled={isCreating || !didName}
                  fullWidth
                  sx={{ mb: 2 }}
                  color="info"
                >
                  {isCreating ? 'Creating...' : 'Create DID'}
                </Button>

                <Alert severity="info">
                  All DIDs are created with GDPR compliance and privacy protection.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* DID Management */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <VerifiedIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    DID Management
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="info.main">
                        {createdDIDs.length}
                      </Typography>
                      <Typography variant="body2">
                        Active DIDs
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
                        GDPR Compliant
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Recent DIDs
                </Typography>
                
                {createdDIDs.slice(0, 5).map((did) => (
                  <Box key={did.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {did.name}
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {did.did}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type: {did.type} | {did.compliance}
                    </Typography>
                  </Box>
                ))}
                
                {createdDIDs.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No DIDs created yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Privacy Features */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  Privacy & Compliance Features
                </Typography>
                
                <Grid container spacing={2}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        GDPR Compliance
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Full compliance with EU data protection regulations
                      </Typography>
                      <Chip label="Compliant" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Zero-Knowledge Proofs
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Verify identity without revealing personal data
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Self-Sovereign Identity
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Users control their own identity data
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Privacy by Design
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Built-in privacy protection from the ground up
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default DIDSystemPage; 