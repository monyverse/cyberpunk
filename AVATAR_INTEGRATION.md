# CyberPunk Avatar Integration Guide

## Overview

This integration combines Ready Player Me avatar creation with Filecoin/IPFS storage and NFT minting capabilities. Users can create, store, and mint their avatars as NFTs on the Filecoin network.

## Features

### 🎭 Ready Player Me Integration
- **Avatar Creation**: Full 3D avatar creation using Ready Player Me's platform
- **Custom Subdomain**: Uses `cyberpunk-1y2xpj.readyplayer.me` for branded experience
- **Real-time Preview**: Instant preview of created avatars
- **Edit Capability**: Users can edit their avatars anytime

### 🌐 Filecoin/IPFS Storage
- **Decentralized Storage**: Avatars stored on Filecoin via IPFS
- **Pinata Integration**: Professional IPFS pinning service
- **Metadata Storage**: Avatar metadata stored separately on IPFS
- **Censorship Resistant**: True ownership of digital assets

### 🪙 NFT Minting
- **On-chain Avatars**: Mint avatars as NFTs on Filecoin
- **Metadata Standards**: ERC-721 compatible metadata
- **Wallet Integration**: Seamless wallet connection and transaction signing

## Setup Instructions

### 1. Environment Configuration

Add these variables to your `.env.local` file:

```bash
# Pinata Filecoin/IPFS Integration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
PINATA_JWT=your_pinata_jwt_token_here

# Filecoin Configuration
NEXT_PUBLIC_FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
FILECOIN_PRIVATE_KEY=your_filecoin_private_key_here
```

### 2. Pinata Setup

1. Create a Pinata account at [pinata.cloud](https://pinata.cloud)
2. Generate API keys in your dashboard
3. Add the keys to your environment variables

### 3. Filecoin Wallet Setup

1. Create a Filecoin wallet (recommended: MetaMask with Filecoin network)
2. Get testnet FIL from [faucet](https://faucet.calibration.filfox.info)
3. Add your private key to environment variables

## API Endpoints

### Store Avatar
```http
POST /api/avatar/store
Content-Type: application/json

{
  "walletAddress": "0x...",
  "avatarUrl": "https://...",
  "metadata": {
    "name": "CyberPunk Avatar",
    "description": "A futuristic avatar",
    "traits": {
      "platform": "readyplayerme",
      "style": "cyberpunk",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Avatar
```http
GET /api/avatar/{walletAddress}
```

### Mint NFT
```http
POST /api/avatar/mint-nft
Content-Type: application/json

{
  "walletAddress": "0x...",
  "avatarId": "avatar_123"
}
```

## Component Usage

### AvatarCreator Component

```tsx
import AvatarCreatorComponent from '../components/AvatarCreator';

function MyPage() {
  const handleAvatarCreated = (url: string) => {
    console.log('Avatar created:', url);
    // Handle avatar creation
  };

  return (
    <AvatarCreatorComponent
      onAvatarCreated={handleAvatarCreated}
      initialAvatarUrl="https://..."
    />
  );
}
```

### useAvatar Hook

```tsx
import { useAvatar } from '../hooks/useAvatar';

function AvatarManager() {
  const { 
    avatar, 
    loading, 
    error, 
    hasAvatar, 
    storeAvatar, 
    mintNFT 
  } = useAvatar();

  const handleStore = async () => {
    const success = await storeAvatar(avatarUrl, metadata);
    if (success) {
      console.log('Avatar stored successfully');
    }
  };

  const handleMint = async () => {
    const success = await mintNFT();
    if (success) {
      console.log('NFT minted successfully');
    }
  };

  return (
    <div>
      {hasAvatar && (
        <div>
          <p>Avatar: {avatar?.metadata.name}</p>
          <p>IPFS Hash: {avatar?.ipfsHash}</p>
          <button onClick={handleMint}>Mint NFT</button>
        </div>
      )}
    </div>
  );
}
```

## Filecoin Integration Details

### Storage Flow
1. **Avatar Creation**: User creates avatar in Ready Player Me
2. **File Download**: System downloads the GLB file from Ready Player Me
3. **IPFS Upload**: File uploaded to IPFS via Pinata
4. **Metadata Creation**: Avatar metadata created with IPFS references
5. **Metadata Upload**: Metadata uploaded to IPFS
6. **Database Storage**: Avatar record stored with IPFS hashes

### NFT Minting Flow
1. **Contract Interaction**: Smart contract called on Filecoin
2. **Token Minting**: New NFT token created
3. **Metadata Association**: Token linked to IPFS metadata
4. **Transaction Recording**: Transaction hash and token ID stored

## Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate keys regularly

### Filecoin Security
- Use hardware wallets for production
- Implement proper key management
- Test thoroughly on testnet before mainnet

### IPFS Security
- Verify file integrity after upload
- Implement access controls if needed
- Monitor pinning status

## Troubleshooting

### Common Issues

1. **Pinata Upload Fails**
   - Check API key permissions
   - Verify file size limits
   - Ensure proper authentication

2. **Filecoin Transaction Fails**
   - Check wallet balance
   - Verify network configuration
   - Ensure gas estimation is correct

3. **Avatar Not Loading**
   - Check IPFS gateway availability
   - Verify file hash integrity
   - Check network connectivity

### Debug Endpoints

```http
GET /api/debug-missions
```
Shows current avatar storage status and debugging information.

## Future Enhancements

### Planned Features
- **Batch Minting**: Mint multiple avatars at once
- **Avatar Marketplace**: Trade avatars as NFTs
- **Cross-chain Support**: Mint on multiple blockchains
- **Advanced Metadata**: More detailed avatar attributes
- **Social Features**: Share avatars on social media

### Technical Improvements
- **Database Integration**: Replace in-memory storage with proper database
- **Caching Layer**: Implement IPFS caching for better performance
- **Web3 Integration**: Direct wallet integration for transactions
- **Analytics**: Track avatar usage and storage metrics

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check environment configuration
4. Verify network connectivity
5. Contact development team

## License

This integration is part of the CyberPunk Metaverse project and follows the same licensing terms. 