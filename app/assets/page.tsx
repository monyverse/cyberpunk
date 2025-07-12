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
import { useMetaverseAssets } from '@/hooks/useMetaverseAssets';

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
  const {
    assets,
    isLoadingAssets,
    uploadAsset,
    storage,
    isLoadingStorage,
    error,
    clearError
  } = useMetaverseAssets();

  const assetCategories = [
    { label: 'All Assets', icon: <StorageIcon /> },
    { label: 'Avatars', icon: <PersonIcon /> },
    { label: 'Buildings', icon: <StorageIcon /> },
    { label: 'Vehicles', icon: <StorageIcon /> },
    { label: 'Weapons', icon: <StorageIcon /> },
    { label: 'Clothing', icon: <StorageIcon /> },
    { label: 'Textures', icon: <ImageIcon /> },
    { label: 'Audio', icon: <AudioIcon /> },
    { label: 'Scripts', icon: <DocumentIcon /> }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadAsset(file, 'generic');
    } catch (e) {
      // handle error if needed
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // Map tab index to asset type string as used in FilecoinAsset
  const tabTypeMap = [
    null, // 0: All Assets
    'avatars',
    'buildings',
    'vehicles',
    'weapons',
    'clothing',
    'textures',
    'audio',
    'scripts'
  ];

  const filteredAssets = activeTab === 0
    ? assets
    : assets.filter(asset => asset.type === tabTypeMap[activeTab]);

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
            {isLoadingStorage ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : storage ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Used Storage</Typography>
                    <Typography variant="body2">{(storage.totalUsed / (1024 * 1024 * 1024)).toFixed(2)}GB / {(storage.totalCapacity / (1024 * 1024 * 1024)).toFixed(2)}GB</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(storage.totalUsed / storage.totalCapacity) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2
                }}>
                  {Object.entries(storage.categories).map(([cat, val]) => (
                    <Typography key={cat} variant="body2" color="text.secondary">{cat}: {(val / (1024 * 1024 * 1024)).toFixed(2)}GB</Typography>
                  ))}
                </Box>
              </>
            ) : null}
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
                // Optionally, you can add a loading state here
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
          {isLoadingAssets ? (
            <LinearProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {filteredAssets.map((asset) => (
                <ListItem key={asset.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      {asset.type === 'avatars' && <PersonIcon />}
                      {asset.type === 'buildings' && <StorageIcon />}
                      {asset.type === 'vehicles' && <StorageIcon />}
                      {asset.type === 'weapons' && <StorageIcon />}
                      {asset.type === 'clothing' && <StorageIcon />}
                      {asset.type === 'textures' && <ImageIcon />}
                      {asset.type === 'audio' && <AudioIcon />}
                      {asset.type === 'scripts' && <DocumentIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={asset.name}
                    secondary={`${asset.size} • Uploaded ${asset.uploadedAt}`}
                  />
                  {/* No status field on FilecoinAsset, so skip status chip */}
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default MetaverseAssetManager; 