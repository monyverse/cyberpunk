
# CyberPunk WildNet Metaverse

CyberPunk: WildNet is an AR-driven PLAY-to-EARN real-world metaverse game that lets players remotely control drones to explore wildlife zones, discover virtual collectibles, interact with AI NPCs, contribute real conservation data, and earn crypto rewards.


## 🌆 Overview

CyberPunk WildNet is a next-generation metaverse that showcases:
- **Avatar Creation & Customization**: Create unique cyberpunk avatars with customizable appearances
- **Metaverse Asset Management**: Upload, store, and manage digital assets on Filecoin
- **Decentralized Storage**: Secure file storage using Filecoin Synapse with USDFC payments
- **Blockchain Integration**: Seamless wallet connection and blockchain-based asset ownership
- **Cyberpunk Aesthetic**: Immersive neon-lit interface with futuristic UI elements

FILECOIN CONTRACTS[View](/Docs/filecoin-contracts.md)

FLOW CONTRACTS[AgentNPC CONTRACTS](/Docs/flow-contracts.md) 

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

### Cyberpunk Theme
- Neon green and pink color scheme
- Holographic UI elements with glow effects
- Futuristic typography and animations
- Responsive design optimized for all devices

## 🛠️ Technology Stack

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
git clone https://github.com/yourusername/cyberpunk-metaverse
cd cyberpunk-metaverse
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

### Configuration
- **Metaverse Settings**: World size, player limits, game mechanics
- **Theme Configuration**: Cyberpunk color scheme and UI elements
- **Storage Settings**: Capacity, persistence, CDN options

## 🎨 Customization

### Theme Configuration
The cyberpunk theme can be customized in `config.ts`:

---
```ts
theme: {
  primaryColor: "#00ff41", // Matrix green
  secondaryColor: "#ff006e", // Neon pink
  accentColor: "#ffd700", // Gold
  backgroundColor: "#0a0a0a", // Dark background
  textColor: "#ffffff", // White text
  neonGlow: true,
  particleEffects: true,
  holographicUI: true
}
```
---

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

## 🔗 Learn More

- [Filecoin Synapse SDK](https://github.com/FilOzone/synapse-sdk)
- [USDFC Token Documentation](https://docs.secured.finance/usdfc-stablecoin/getting-started)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Areas for contribution:

- Additional avatar customization options
- New asset categories and management features
- Enhanced 3D visualization components
- Additional cyberpunk UI themes
- Game mechanics and quest systems
- Multiplayer functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built on the foundation of the Filecoin Synapse dApp
- Inspired by cyberpunk aesthetics and blockchain technology
- Powered by the Filecoin ecosystem and USDFC stablecoin
