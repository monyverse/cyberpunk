'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const WalletConnect = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (!mounted) {
          // Prevent rendering until RainbowKit finishes mounting (avoids SSR issues)
          return null;
        }
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
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="contained" color="primary" sx={{ borderRadius: 5, fontWeight: 600, px: 3, py: 1 }}>
                    Connect Wallet
                  </Button>
                );
              }
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
                  <Link href="/onRamp" passHref legacyBehavior>
                    <Button variant="contained" color="success" sx={{ borderRadius: 5, fontWeight: 600, px: 3, py: 1 }}>
                      Launch dApp
                    </Button>
                  </Link>
                </Box>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
