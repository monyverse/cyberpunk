"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface ProofSet {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'failed';
  createdAt: string;
  size: string;
  hash: string;
  description: string;
}

const ViewProofSets: React.FC = () => {
  const [proofSets, setProofSets] = useState<ProofSet[]>([
    {
      id: '1',
      name: 'Drone Mission Proof',
      type: 'Mission Verification',
      status: 'verified',
      createdAt: '2024-01-15 14:30',
      size: '2.5 MB',
      hash: '0x1234567890abcdef...',
      description: 'Proof of successful drone mission completion'
    },
    {
      id: '2',
      name: 'Asset Ownership',
      type: 'Ownership Verification',
      status: 'verified',
      createdAt: '2024-01-14 09:15',
      size: '1.8 MB',
      hash: '0xabcdef1234567890...',
      description: 'Proof of digital asset ownership'
    },
    {
      id: '3',
      name: 'Agent Interaction',
      type: 'Interaction Log',
      status: 'pending',
      createdAt: '2024-01-13 16:45',
      size: '3.2 MB',
      hash: '0x7890abcdef123456...',
      description: 'Proof of NPC agent interaction'
    },
    {
      id: '4',
      name: 'Storage Transaction',
      type: 'Transaction Proof',
      status: 'failed',
      createdAt: '2024-01-12 11:20',
      size: '1.1 MB',
      hash: '0x4567890abcdef123...',
      description: 'Proof of storage transaction'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircleIcon />;
      case 'pending': return <WarningIcon />;
      case 'failed': return <ErrorIcon />;
      default: return <WarningIcon />;
    }
  };

  const handleViewProof = (proofId: string) => {
    console.log(`Viewing proof: ${proofId}`);
    // Implement proof viewing logic
  };

  const handleDownloadProof = (proofId: string) => {
    console.log(`Downloading proof: ${proofId}`);
    // Implement proof download logic
  };

  const handleShareProof = (proofId: string) => {
    console.log(`Sharing proof: ${proofId}`);
    // Implement proof sharing logic
  };

  const stats = {
    total: proofSets.length,
    verified: proofSets.filter(p => p.status === 'verified').length,
    pending: proofSets.filter(p => p.status === 'pending').length,
    failed: proofSets.filter(p => p.status === 'failed').length
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Proof Sets
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Proof Sets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats.verified}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" gutterBottom>
                {stats.failed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Failed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Proof Sets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VerifiedIcon /> Proof Sets
          </Typography>
          
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Hash</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proofSets.map((proof) => (
                  <TableRow key={proof.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {proof.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {proof.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={proof.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(proof.status)}
                        label={proof.status}
                        color={getStatusColor(proof.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {proof.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {proof.size}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {proof.hash}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Proof">
                          <IconButton
                            size="small"
                            onClick={() => handleViewProof(proof.id)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadProof(proof.id)}
                            color="secondary"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton
                            size="small"
                            onClick={() => handleShareProof(proof.id)}
                            color="info"
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          
          <List>
            {proofSets.slice(0, 3).map((proof) => (
              <ListItem key={proof.id} divider>
                <ListItemIcon>
                  <VerifiedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={proof.name}
                  secondary={`${proof.type} • ${proof.createdAt} • ${proof.status}`}
                />
                <Chip
                  label={proof.status}
                  color={getStatusColor(proof.status) as any}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewProofSets; 