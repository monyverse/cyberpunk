
# CyberPunk WildNet Metaverse

CyberPunk: WildNet is an AR-driven PLAY-to-EARN real-world metaverse game that lets players remotely control drones to explore wildlife zones, discover virtual collectibles, interact with AI NPCs, contribute real conservation data, and earn crypto rewards.


## 🌆 Overview

CyberPunk WildNet is a next-generation metaverse that showcases:
- **Avatar Creation & Customization**: Create unique cyberpunk avatars with customizable appearances
- **Metaverse Asset Management**: Upload, store, and manage digital assets on Filecoin
- **Decentralized Storage**: Secure file storage using Filecoin Synapse with USDFC payments
- **Blockchain Integration**: Seamless wallet connection and blockchain-based asset ownership
- **Cyberpunk Aesthetic**: Immersive neon-lit interface with futuristic UI elements

## CONTRACTS

FILECOIN CONTRACTS [VIEW](/Docs/filecoin-contracts.md)

FLOW CONTRACTS [VIEW](/Docs/flow-contracts.md)

NEAR CONTRACTS [VIEW](/Docs/near-contracts.md)

## 🚀 Features

### Avatar System
- Customizable cyberpunk avatars with skin tones, hair styles, and cybernetic enhancements
- Persistent avatar data stored on Filecoin
- Level progression and reputation system

### Asset Management
- Upload and manage metaverse assets (avatars, buildings, vehicles, weapons, clothing, textures, audio, scripts)
- Categorized asset storage with Filecoin CID tracking
- Real-time storage statistics and capacity monitoring

### Filecoin Integration
- Connect to Filecoin networks (Mainnet/Calibration)
- Deposit funds to Synapse contracts using USDFC token
- Upload files to Filecoin through Synapse with proof of data possession
- View and manage proof sets for uploaded content

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Blockchain**: Filecoin Synapse SDK, Wagmi, RainbowKit
- **Storage**: Filecoin IPFS, USDFC payments
- **3D Graphics**: Three.js, React Three Fiber (ready for future expansion)

## 📋 Prerequisites

- Node.js 18+ and npm
- A web3 wallet (like MetaMask)
- Basic understanding of React and TypeScript
- Get some tFIL tokens on Filecoin Calibration testnet [link to faucet](https://faucet.calibnet.chainsafe-fil.io/funds.html)
- Get some USDFC tokens on Filecoin Calibration testnet [link to faucet](https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc)

## 🚀 Getting Started

1. Clone this repository:
---
```bash
git clone https://github.com/monyverse/cyberpunk
cd cyberpunk
```
---

2. Install dependencies:
---
```bash
npm install
```
---

3. Run the development server:
---
```bash
npm run dev
```
---

Open [http://localhost:3000](http://localhost:3000) to enter the CyberPunk Metaverse.

## 🎮 How to Use

### 1. Connect Your Wallet
- Click "Connect Wallet" to link your Web3 wallet
- Ensure you're connected to Filecoin Calibration network
- Make sure you have USDFC tokens for storage payments

### 2. Create Your Avatar
- Navigate to the "Create Avatar" tab
- Customize your cyberpunk appearance
- Choose skin tone, hair style, hair color, and cybernetic eye color
- Enter your avatar name and create your digital identity

### 3. Manage Metaverse Assets
- Upload digital assets (3D models, textures, audio, etc.)
- Organize assets by category (avatars, buildings, vehicles, etc.)
- Monitor storage usage and Filecoin CID references
- Delete or manage existing assets

### 4. Storage Management
- Deposit USDFC to Synapse contracts for storage payments
- Monitor storage capacity and persistence periods
- View proof sets and file verification status

## Analytics Dashboard

The app includes a modern Analytics Dashboard at `/analytics`:
- **Live stats**: See total agents, active agents, total missions, and completed missions in real time.
- **MUI-based UI**: Clean, responsive layout using Material UI components.
- **Ready for expansion**: Placeholders for charts and advanced analytics (e.g., mission completion over time, agent activity, etc.).

**How to use:**
- Navigate to `/analytics` in your browser after starting the app.
- The dashboard will automatically update as agents and missions are created or completed.

## 🏗️ Architecture

### Core Components
- **AvatarCreator**: Cyberpunk avatar customization interface
- **MetaverseAssetManager**: Asset upload and management system
- **StorageManager**: Filecoin storage and payment management
- **FileUploader**: File upload to Filecoin with progress tracking
- **ViewProofSets**: Proof set verification and management

### Hooks & Utilities
- **useMetaverse**: Avatar and world state management
- **useMetaverseAssets**: Asset storage and Filecoin integration
- **useBalances**: USDFC and FIL balance tracking
- **usePayment**: Synapse payment processing
- **useFileUpload**: File upload to Filecoin

### Metaverse Settings
Adjust world parameters and game mechanics:

---
```ts
metaverse: {
  maxPlayers: 1000,
  worldSize: { width: 10000, height: 1000, depth: 10000 },
  gameMechanics: {
    currency: "CYBER",
    maxInventorySlots: 50,
    tradingEnabled: true,
    pvpEnabled: true
  }
}
```
---

