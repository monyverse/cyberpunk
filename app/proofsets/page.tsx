"use client";

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
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
import { useProofsets } from "@/hooks/useProofsets";

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
  const { data, isLoading, error } = useProofsets();
  const proofSets = data?.proofsets || [];

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

  // Actions can be implemented as mutations if they call an API
  // const viewProofMutation = useMutation({ ... })
  // const downloadProofMutation = useMutation({ ... })
  // const shareProofMutation = useMutation({ ... })

  const handleViewProof = (proofId: string) => {
    // Implement proof viewing logic or mutation
    console.log(`Viewing proof: ${proofId}`);
  };

  const handleDownloadProof = (proofId: string) => {
    // Implement proof download logic or mutation
    console.log(`Downloading proof: ${proofId}`);
  };

  const handleShareProof = (proofId: string) => {
    // Implement proof sharing logic or mutation
    console.log(`Sharing proof: ${proofId}`);
  };

  const stats = {
    total: proofSets.length,
    // Example: count live, managed, and with details
    live: proofSets.filter(p => p.isLive).length,
    managed: proofSets.filter(p => p.isManaged).length,
    withDetails: proofSets.filter(p => p.details).length
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Proof Sets
      </Typography>

      {/* Statistics */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {stats.total.toString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Proof Sets
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success" gutterBottom>
              {stats.live.toString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning" gutterBottom>
              {stats.managed.toString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managed
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info" gutterBottom>
              {stats.withDetails.toString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              With Details
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Proof Sets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VerifiedIcon /> Proof Sets
          </Typography>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{(error as Error).message}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ProofSet ID</TableCell>
                    <TableCell>Metadata</TableCell>
                    <TableCell>Live</TableCell>
                    <TableCell>Managed</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proofSets.map((proof) => (
                    <TableRow key={proof.pdpVerifierProofSetId} hover>
                      <TableCell>{proof.pdpVerifierProofSetId}</TableCell>
                      <TableCell>{proof.metadata}</TableCell>
                      <TableCell>{proof.isLive ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{proof.isManaged ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{proof.provider?.pdpUrl || '-'}</TableCell>
                      <TableCell>
                        {proof.details ? (
                          <Box>
                            <Typography variant="caption">Roots: {proof.details.roots.length}</Typography>
                            <br />
                            <Typography variant="caption">Next Epoch: {proof.details.nextChallengeEpoch}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">No details</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Proof">
                          <IconButton onClick={() => handleViewProof(proof.pdpVerifierProofSetId)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Proof">
                          <IconButton onClick={() => handleDownloadProof(proof.pdpVerifierProofSetId)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share Proof">
                          <IconButton onClick={() => handleShareProof(proof.pdpVerifierProofSetId)}>
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewProofSets; 