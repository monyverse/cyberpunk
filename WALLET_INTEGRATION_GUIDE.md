# ⚠️ DEPRECATION NOTICE

**The legacy wallet integration (useMultiChainWallet, useNearWallet, MultiChainWalletConnect, Web3Providers) has been removed. Please use AppKit for all wallet management and integration. See the new integration guide or AppKit documentation for details.**

# 🔗 Multi-Chain Wallet Integration Guide

## 🎯 Overview

This guide explains the comprehensive multi-chain wallet integration for the CyberPunk Metaverse application, supporting Filecoin, NEAR, Flow, Ethereum, Polygon, and other blockchains.

## 🏗️ Architecture

### **Wallet Providers**
- **RainbowKit** - Primary wallet connection UI and EVM chain support
- **Wagmi** - React hooks for Ethereum and EVM-compatible chains
- **NEAR API JS** - Native NEAR Protocol integration
- **Flow SDK** - Flow blockchain integration (via RainbowKit)

### **Supported Blockchains**
1. **Filecoin** (Mainnet & Calibration Testnet)
2. **Ethereum** (Mainnet & Sepolia Testnet)
3. **Polygon** (Mainnet & Mumbai Testnet)
4. **NEAR** (Mainnet & Testnet)
5. **Flow** (Mainnet & Testnet)
6. **Arbitrum** (Mainnet)
7. **Optimism** (Mainnet)

## 🚀 Setup Instructions

### 1. **Environment Configuration**

Add these variables to your `.env.local`:

```bash
# WalletConnect Configuration (REQUIRED)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Filecoin Configuration
NEXT_PUBLIC_FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
FILECOIN_PRIVATE_KEY=your_filecoin_private_key_here

# NEAR Configuration
NEXT_PUBLIC_NEAR_RPC_URL=https://rpc.testnet.near.org
NEAR_PRIVATE_KEY=your_near_private_key_here
NEXT_PUBLIC_NEAR_ACCOUNT_ID=cyberpunk.testnet

# Ethereum Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_project_id
ETHEREUM_PRIVATE_KEY=your_ethereum_private_key_here

# Polygon Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.infura.io/v3/your_project_id
POLYGON_PRIVATE_KEY=your_polygon_private_key_here
```

### 2. **WalletConnect Project Setup**

1. **Create WalletConnect Project:**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up and create a new project
   - Copy your Project ID
   - Add it to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

2. **Configure Project Settings:**
   - Add your domain to allowed origins
   - Configure redirect URLs
   - Set up notification preferences

### 3. **Install Dependencies**

```bash
# Core wallet dependencies
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query

# NEAR integration
npm install near-api-js

# Flow integration (handled by RainbowKit)
# No additional installation needed
```

## 🔧 Configuration Details

### **RainbowKit Configuration**

The `Web3Providers.tsx` file configures:

```typescript
const wagmiConfig = createConfig({
  chains: [
    // Filecoin chains
    filecoinCalibration,
    filecoin,
    // Ethereum chains
    mainnet,
    sepolia,
    // Polygon chains
    polygon,
    polygonMumbai,
    // Layer 2 chains
    arbitrum,
    optimism,
  ],
  connectors: [
    // Standard EVM wallets
    injected(),
    metaMask(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: 'CyberPunk Metaverse',
        description: 'Multi-chain metaverse platform',
        url: 'https://cyberpunk-metaverse.com',
        icons: ['https://cyberpunk-metaverse.com/icon.png']
      }
    }),
    coinbaseWallet({ 
      appName: 'CyberPunk Metaverse',
      appLogoUrl: 'https://cyberpunk-metaverse.com/logo.png'
    }),
    safe(),
    rainbowWallet(),
    trustWallet(),
    ledgerWallet(),
    okxWallet(),
    phantomWallet(),
    flowWallet(),
  ],
  transports: {
    [filecoin.id]: http(process.env.NEXT_PUBLIC_FILECOIN_RPC_URL),
    [filecoinCalibration.id]: http(process.env.NEXT_PUBLIC_FILECOIN_RPC_URL),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
  },
});
```

### **NEAR Integration**

The `useNearWallet.ts` hook provides:

```typescript
const {
  isConnected,
  account,
  connectWallet,
  disconnectWallet,
  sendTokens,
  callContract,
  getBalance,
} = useNearWallet('testnet');
```

### **Multi-Chain Wallet Hook**

The `useMultiChainWallet.ts` hook unifies all wallets:

```typescript
const {
  state,
  isAnyWalletConnected,
  activeWallet,
  connectedWallets,
  allAddresses,
  connectWallet,
  disconnectWallet,
  switchToBlockchain,
} = useMultiChainWallet();
```

## 🎨 UI Components

### **MultiChainWalletConnect Component**

Features:
- **Unified Interface**: Single component for all blockchains
- **Wallet Status**: Shows connection status for each blockchain
- **Easy Switching**: Switch between connected wallets
- **Error Handling**: Displays connection errors
- **Responsive Design**: Works on mobile and desktop

### **Usage in Components**

```tsx
import { MultiChainWalletConnect } from './MultiChainWalletConnect';
import { useMultiChainWallet } from '../hooks/useMultiChainWallet';

function MyComponent() {
  const { isAnyWalletConnected, activeWallet, connectWallet } = useMultiChainWallet();

  return (
    <div>
      <MultiChainWalletConnect />
      
      {isAnyWalletConnected && (
        <div>Active wallet: {activeWallet}</div>
      )}
    </div>
  );
}
```

## 🔄 Wallet Connection Flow

### **EVM Wallets (via RainbowKit)**
1. User clicks "Connect EVM Wallet"
2. RainbowKit modal opens
3. User selects wallet (MetaMask, WalletConnect, etc.)
4. Wallet connects and returns account info
5. Component updates with wallet status

### **NEAR Wallet**
1. User clicks "Connect NEAR Wallet"
2. NEAR wallet modal opens
3. User authorizes the application
4. Wallet connection established
5. Account info retrieved and displayed

### **Flow Wallet**
1. User clicks "Connect Flow Wallet"
2. Flow wallet modal opens (via RainbowKit)
3. User selects Flow wallet
4. Connection established
5. Account info displayed

## 🛠️ Troubleshooting

### **Common Issues**

1. **WalletConnect Modal Not Opening**
   - Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
   - Verify domain is allowed in WalletConnect Cloud
   - Clear browser cache and try again

2. **NEAR Wallet Connection Fails**
   - Check NEAR RPC URL is accessible
   - Verify account exists on testnet/mainnet
   - Check browser console for errors

3. **RainbowKit Not Showing All Wallets**
   - Ensure all connectors are properly configured
   - Check if wallet extensions are installed
   - Verify network connectivity

4. **Hydration Errors**
   - Ensure providers are wrapped in client components
   - Use `suppressHydrationWarning` in layout
   - Check for SSR/CSR mismatches

### **Debug Commands**

```bash
# Check environment variables
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Test NEAR connection
curl -X POST https://rpc.testnet.near.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"status","id":"dontcare","params":[]}'

# Test Filecoin connection
curl -X POST https://api.calibration.node.glif.io/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"Filecoin.ChainHead","params":[],"id":1}'
```

## 🔒 Security Considerations

### **Environment Variables**
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate keys regularly

### **Wallet Security**
- Use hardware wallets for production
- Implement proper key management
- Test thoroughly on testnets

### **Network Security**
- Verify RPC endpoints are secure
- Use HTTPS for all connections
- Implement rate limiting

## 🚀 Production Deployment

### **Environment Setup**
1. Set production environment variables
2. Configure production RPC endpoints
3. Update WalletConnect project settings
4. Test all wallet connections

### **Monitoring**
- Monitor wallet connection success rates
- Track user wallet preferences
- Log connection errors for debugging

### **Backup Plans**
- Implement fallback RPC endpoints
- Have alternative wallet connection methods
- Maintain offline wallet support

## 📚 Additional Resources

- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Wagmi Documentation](https://wagmi.sh/)
- [NEAR Documentation](https://docs.near.org/)
- [Flow Documentation](https://docs.onflow.org/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)

## 🎯 Next Steps

1. **Test All Wallets**: Verify each blockchain wallet works
2. **Add More Chains**: Extend support for additional blockchains
3. **Improve UX**: Add wallet-specific features and optimizations
4. **Security Audit**: Review wallet integration security
5. **Performance**: Optimize wallet connection performance 