"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

interface Asset {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'failed';
}

const MetaverseAssetManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Cyberpunk Avatar 1',
      type: 'avatar',
      size: '2.5 MB',
      uploadedAt: '2024-01-15',
      status: 'uploaded'
    },
    {
      id: '2',
      name: 'Drone Model',
      type: '3d-model',
      size: '15.2 MB',
      uploadedAt: '2024-01-14',
      status: 'uploaded'
    },
    {
      id: '3',
      name: 'Background Music',
      type: 'audio',
      size: '8.7 MB',
      uploadedAt: '2024-01-13',
      status: 'processing'
    }
  ]);

  const storageStats = {
    used: 45.2,
    total: 100,
    images: 12,
    videos: 8,
    audio: 5,
    documents: 3
  };

  const assetCategories = [
    { label: 'All Assets', icon: <StorageIcon /> },
    { label: 'Avatars', icon: <PersonIcon /> },
    { label: 'Images', icon: <ImageIcon /> },
    { label: 'Videos', icon: <VideoIcon /> },
    { label: 'Audio', icon: <AudioIcon /> },
    { label: 'Documents', icon: <DocumentIcon /> }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = (file: File) => {
    console.log('Uploading file:', file.name);
    // Implement file upload logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Metaverse Asset Manager
      </Typography>

      {/* Storage Statistics */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Storage Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Used Storage</Typography>
                <Typography variant="body2">{storageStats.used}GB / {storageStats.total}GB</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(storageStats.used / storageStats.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: 2
            }}>
              <Typography variant="body2" color="text.secondary">Images: {storageStats.images}</Typography>
              <Typography variant="body2" color="text.secondary">Videos: {storageStats.videos}</Typography>
              <Typography variant="body2" color="text.secondary">Audio: {storageStats.audio}</Typography>
              <Typography variant="body2" color="text.secondary">Documents: {storageStats.documents}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                component="label"
                sx={{ justifyContent: 'flex-start' }}
              >
                Upload New Asset
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach(handleFileUpload);
                    }
                  }}
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Create Avatar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Asset Categories */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {assetCategories.map((category, index) => (
            <Tab
              key={index}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Assets List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {assetCategories[activeTab].label}
          </Typography>
          <List>
            {assets.map((asset) => (
              <ListItem key={asset.id} divider>
                <ListItemAvatar>
                  <Avatar>
                    {asset.type === 'avatar' && <PersonIcon />}
                    {asset.type === '3d-model' && <ImageIcon />}
                    {asset.type === 'audio' && <AudioIcon />}
                    {asset.type === 'video' && <VideoIcon />}
                    {asset.type === 'document' && <DocumentIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={asset.name}
                  secondary={`${asset.size} • Uploaded ${asset.uploadedAt}`}
                />
                <Chip
                  label={asset.status}
                  color={getStatusColor(asset.status) as any}
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

export default MetaverseAssetManager; 