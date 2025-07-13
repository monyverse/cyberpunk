import { useState, useEffect } from 'react';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import { useAvatar } from '../hooks/useAvatar';
import { useAccount } from 'wagmi';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Storage as StorageIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Wallet as WalletIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface AvatarCreatorProps {
  onAvatarCreated?: (url: string) => void;
  initialAvatarUrl?: string;
}

export default function AvatarCreatorComponent({ onAvatarCreated, initialAvatarUrl }: AvatarCreatorProps) {
  const [showCreator, setShowCreator] = useState(!initialAvatarUrl);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || '');
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [avatarDescription, setAvatarDescription] = useState('');
  
  const { address, isConnected } = useAccount();
  const { avatar, loading, error, storeAvatar, hasAvatar } = useAvatar();

  const handleAvatarExported = ({ url }: { url: string }) => {
    setAvatarUrl(url);
    setShowCreator(false);
    onAvatarCreated?.(url);
    setShowMetadataDialog(true);
  };

  const handleStoreAvatar = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const result = await storeAvatar(avatarUrl, {
      name: avatarName || 'CyberPunk Avatar',
      description: avatarDescription || 'A futuristic avatar for the metaverse',
      traits: {
        platform: 'readyplayerme',
        style: 'cyberpunk',
        createdAt: new Date().toISOString()
      }
    });

    if (result) {
      setShowMetadataDialog(false);
    }
  };

  const handleEditAvatar = () => {
    setShowCreator(true);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      p: 3
    }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #00ff41, #ff006e)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              Avatar Creator
            </Typography>
            <Typography variant="h6" sx={{ color: '#888', mb: 3 }}>
              Create your digital identity in the metaverse
            </Typography>
            
            {/* Wallet Status */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip
                icon={isConnected ? <SuccessIcon /> : <ErrorIcon />}
                label={isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
              />
              {isConnected && (
                <Chip
                  icon={<WalletIcon />}
                  label={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 0, minHeight: '600px' }}>
              {showCreator ? (
                <Box sx={{ position: 'relative', height: '600px' }}>
                  <AvatarCreator
                    subdomain="cyberpunk-1y2xpj"
                    onAvatarExported={handleAvatarExported}
                    frameInitializer={undefined}
                  />
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '600px',
                  p: 4
                }}>
                  {avatarUrl ? (
                    <>
                      <Typography variant="h5" sx={{ mb: 3, color: '#00ff41' }}>
                        Avatar Created Successfully!
                      </Typography>
                      <Box sx={{ 
                        width: 200, 
                        height: 200, 
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #00ff41, #ff006e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        <Typography variant="h4">🎭</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditAvatar}
                        sx={{ 
                          background: 'linear-gradient(45deg, #00ff41, #ff006e)',
                          mb: 2
                        }}
                      >
                        Edit Avatar
                      </Button>
                    </>
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      No avatar created yet
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Avatar Status */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#00ff41' }}>
                  Avatar Status
                </Typography>
                
                {loading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress size={20} />
                    <Typography>Processing...</Typography>
                  </Box>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {hasAvatar && avatar && (
                  <Box>
                    <Chip
                      icon={<SuccessIcon />}
                      label="Stored on Filecoin/IPFS"
                      color="success"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {avatar.metadata.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>IPFS Hash:</strong> {avatar.ipfsHash?.slice(0, 10)}...
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Stored:</strong> {new Date(avatar.storedAt || '').toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {!hasAvatar && !loading && (
                  <Typography variant="body2" color="text.secondary">
                    No avatar stored yet
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Filecoin Integration Info */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#ff006e' }}>
                  <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Filecoin Storage
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your avatar is securely stored on Filecoin/IPFS using Pinata's decentralized storage network.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Decentralized" size="small" color="primary" />
                  <Chip label="Immutable" size="small" color="secondary" />
                  <Chip label="Censorship Resistant" size="small" color="info" />
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#ffd700' }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    fullWidth
                    disabled={!hasAvatar}
                    sx={{ borderColor: '#00ff41', color: '#00ff41' }}
                  >
                    View in Metaverse
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    fullWidth
                    onClick={() => window.location.reload()}
                    sx={{ borderColor: '#ff006e', color: '#ff006e' }}
                  >
                    Refresh
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Metadata Dialog */}
      <Dialog 
        open={showMetadataDialog} 
        onClose={() => setShowMetadataDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #00ff41, #ff006e)',
          color: 'white'
        }}>
          Store Avatar on Filecoin/IPFS
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Your avatar will be stored securely on the decentralized Filecoin network via IPFS.
          </Typography>
          
          <TextField
            fullWidth
            label="Avatar Name"
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter a name for your avatar"
          />
          
          <TextField
            fullWidth
            label="Description"
            value={avatarDescription}
            onChange={(e) => setAvatarDescription(e.target.value)}
            multiline
            rows={3}
            placeholder="Describe your avatar"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowMetadataDialog(false)}
            sx={{ color: '#888' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStoreAvatar}
            variant="contained"
            disabled={loading}
            sx={{ 
              background: 'linear-gradient(45deg, #00ff41, #ff006e)'
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Store on Filecoin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 