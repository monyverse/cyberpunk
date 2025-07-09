import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet as WalletIcon,
  Login as LoginIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface MuiNavbarProps {
  onMenuClick: () => void;
}

const MuiNavbar: React.FC<MuiNavbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [networkAnchorEl, setNetworkAnchorEl] = useState<null | HTMLElement>(null);
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  
  // Mock wallet state - replace with actual wallet connection logic
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('Flow Testnet');
  const [walletAddress, setWalletAddress] = useState('');

  const networks = [
    { name: 'Flow Testnet', chainId: 'testnet' },
    { name: 'Flow Mainnet', chainId: 'mainnet' },
    { name: 'Ethereum', chainId: 'ethereum' },
    { name: 'Polygon', chainId: 'polygon' }
  ];

  const handleNetworkClick = (event: React.MouseEvent<HTMLElement>) => {
    setNetworkAnchorEl(event.currentTarget);
  };

  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    setWalletAnchorEl(event.currentTarget);
  };

  const handleNetworkSelect = (network: string) => {
    setCurrentNetwork(network);
    setNetworkAnchorEl(null);
  };

  const handleWalletClose = () => {
    setWalletAnchorEl(null);
  };

  const handleNetworkClose = () => {
    setNetworkAnchorEl(null);
  };

  const connectWallet = () => {
    // Mock wallet connection - replace with actual implementation
    setIsWalletConnected(true);
    setWalletAddress('0x1234...5678');
    handleWalletClose();
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    handleWalletClose();
  };

  const loginWithFlow = () => {
    // Mock Flow login - replace with actual FCL implementation
    console.log('Login with Flow clicked');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'primary.main'
          }}
        >
          CYBER<span style={{ color: theme.palette.secondary.main }}>PUNK</span>
        </Typography>

        {/* Network Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Button
            onClick={handleNetworkClick}
            endIcon={<ExpandMoreIcon />}
            sx={{ 
              color: 'text.primary',
              textTransform: 'none',
              minWidth: 'auto'
            }}
          >
            <Chip
              label={currentNetwork}
              size="small"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600
              }}
            />
          </Button>
          <Menu
            anchorEl={networkAnchorEl}
            open={Boolean(networkAnchorEl)}
            onClose={handleNetworkClose}
            PaperProps={{
              sx: { bgcolor: 'background.paper', border: 1, borderColor: 'divider' }
            }}
          >
            {networks.map((network) => (
              <MenuItem 
                key={network.chainId}
                onClick={() => handleNetworkSelect(network.name)}
                selected={currentNetwork === network.name}
              >
                {network.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isWalletConnected ? (
            <>
              <Chip
                icon={<CheckCircleIcon />}
                label={`${walletAddress}`}
                color="success"
                variant="outlined"
                onClick={handleWalletClick}
                sx={{ fontWeight: 600 }}
              />
              <Menu
                anchorEl={walletAnchorEl}
                open={Boolean(walletAnchorEl)}
                onClose={handleWalletClose}
                PaperProps={{
                  sx: { bgcolor: 'background.paper', border: 1, borderColor: 'divider' }
                }}
              >
                <MenuItem onClick={disconnectWallet}>
                  Disconnect Wallet
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<WalletIcon />}
                onClick={handleWalletClick}
                sx={{ 
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              >
                Connect Wallet
              </Button>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={loginWithFlow}
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Login with Flow
              </Button>
              <Menu
                anchorEl={walletAnchorEl}
                open={Boolean(walletAnchorEl)}
                onClose={handleWalletClose}
                PaperProps={{
                  sx: { bgcolor: 'background.paper', border: 1, borderColor: 'divider' }
                }}
              >
                <MenuItem onClick={connectWallet}>
                  Connect MetaMask
                </MenuItem>
                <MenuItem onClick={connectWallet}>
                  Connect WalletConnect
                </MenuItem>
                <MenuItem onClick={connectWallet}>
                  Connect Coinbase Wallet
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MuiNavbar; 