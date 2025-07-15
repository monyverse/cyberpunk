import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  filecoin,
  filecoinCalibration,
  mainnet,
  sepolia,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  base,
  baseGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  gnosis,
  gnosisChiado,
  celo,
  celoAlfajores,
  moonbeam,
  moonbaseAlpha,
  moonriver,
  moonbeamDev,
  aurora,
  auroraTestnet
} from 'wagmi/chains';

const networks = [
  filecoinCalibration,
  filecoin,
  mainnet,
  sepolia,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  base,
  baseGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  gnosis,
  gnosisChiado,
  celo,
  celoAlfajores,
  moonbeam,
  moonbaseAlpha,
  moonriver,
  moonbeamDev,
  aurora,
  auroraTestnet
];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '865c931386843631a84e0461df3b26fa',
  metadata: {
    name: 'CyberPunk Metaverse',
    description: 'A multi-chain metaverse platform',
    url: 'https://cyberpunk-metaverse.com',
    icons: ['https://cyberpunk-metaverse.com/icon.png'],
  },
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '865c931386843631a84e0461df3b26fa',
  networks,
  metadata: {
    name: 'CyberPunk Metaverse',
    description: 'A multi-chain metaverse platform',
    url: 'https://cyberpunk-metaverse.com',
    icons: ['https://cyberpunk-metaverse.com/icon.png'],
  },
  features: {
    analytics: true,
    smartAccounts: true,
    embeddedWallets: true,
  },
}); 