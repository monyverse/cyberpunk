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

// Placeholder for Flow and NEAR (non-EVM) - AppKit support is coming soon
// import { flowMainnet, flowTestnet, nearMainnet, nearTestnet } from 'appkit/networks' (future)

const networks = [
  filecoinCalibration, // Filecoin testnet
  filecoin,           // Filecoin mainnet
  mainnet,            // Ethereum mainnet
  sepolia,            // Ethereum Sepolia testnet
  goerli,             // Ethereum Goerli testnet
  polygon,            // Polygon mainnet
  polygonMumbai,      // Polygon Mumbai testnet
  arbitrum,           // Arbitrum mainnet
  arbitrumGoerli,     // Arbitrum Goerli testnet
  optimism,           // Optimism mainnet
  optimismGoerli,     // Optimism Goerli testnet
  base,               // Base mainnet
  baseGoerli,         // Base Goerli testnet
  avalanche,          // Avalanche mainnet

  // Add more EVM chains as needed
  // Flow and NEAR support will be added when AppKit supports them natively
];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '65c931386843631a84e0461df3b26fa',
  metadata: {
    name: 'CyberPunk Metaverse',
    description: 'A multi-chain metaverse platform',
    url: 'https://cyberpunk-metaverse.com',
    icons: ['https://cyberpunk-metaverse.com/icon.png'],
  },
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '65c931386843631a84e0461df3b26fa',
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
  // When AppKit supports Flow/NEAR natively, add their adapters here
}); 