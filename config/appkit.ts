import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { filecoin, filecoinCalibration, mainnet, polygon } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '865c931386843631a84e0461df3b26fa';

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined. Please set it in .env.local');
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [filecoin, filecoinCalibration, mainnet, polygon];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
}); 