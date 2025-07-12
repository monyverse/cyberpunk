'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export const NavbarWalletComponent = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <Box
            {...(!ready && {
              'aria-hidden': true,
              sx: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (connected) {
                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      color="warning"
                      variant="contained"
                      sx={{ borderRadius: 5, fontWeight: 600, px: 3, py: 1 }}
                    >
                      Wrong network
                    </Button>
                  );
                }
                return (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={openChainModal}
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 5, fontWeight: 600, px: 2, py: 1, display: 'flex', alignItems: 'center' }}
                      startIcon={chain.hasIcon && chain.iconUrl ? (
                        <Box component="span" sx={{ bgcolor: chain.iconBackground, width: 20, height: 20, borderRadius: '50%', overflow: 'hidden', mr: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 20, height: 20 }} />
                        </Box>
                      ) : null}
                    >
                      {chain.name}
                    </Button>
                    <Button onClick={openAccountModal} variant="contained" color="primary" sx={{ borderRadius: 5, fontWeight: 600, px: 2, py: 1 }}>
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </Button>
                  </Box>
                );
              }
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
