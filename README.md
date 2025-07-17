# 🚀 CyberPunk Metaverse 

![UI Preview](app/public/ui.png)


## 🌟 Features

### **Multi-Chain Support**
- **Filecoin** - Decentralized storage with FVM smart contracts
- **NEAR** - AI-driven agents with intent-based execution
- **Ethereum** - Cross-chain bridges and DeFi integration
- **Polygon** - Scalable transactions and NFT support
- **Flow** - Gaming and metaverse assets

### **AI-Powered Agents**
- **Hybrid Architecture** - On-chain + off-chain capabilities
- **Weather Integration** - Real-time risk assessment
- **Cross-Chain Execution** - Seamless multi-blockchain operations
- **GDPR Compliance** - Privacy-first design with DIDs

### **Advanced Integrations**
- **ENS + IPFS** - Decentralized frontend hosting
- **MCP Solver Nodes** - Decentralized data processing
- **Aerial Imagery** - AI-powered analysis and insights
- **Harvard Dataverse** - Research data integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or RainbowKit wallet
- Testnet tokens (Filecoin Calibration, NEAR testnet)

### Installation

```bash
# Clone the repository
git clone https://github.com/monyverse/cyberpunk-metaverse.git
cd cyberpunk-metaverse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables

```bash
# Filecoin
NEXT_PUBLIC_FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
NEXT_PUBLIC_FILECOIN_PRIVATE_KEY=your_private_key

# NEAR
NEXT_PUBLIC_NEAR_RPC_URL=https://rpc.testnet.near.org
NEXT_PUBLIC_NEAR_PRIVATE_KEY=your_private_key

# WeatherXM
NEXT_PUBLIC_WEATHERXM_API_KEY=your_api_key

# Mosaia
NEXT_PUBLIC_MOSAIA_API_KEY=your_api_key

# Nouns
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key

# Bio AI
NEXT_PUBLIC_BIO_AI_API_KEY=your_api_key

# Reppo
NEXT_PUBLIC_REPPO_API_KEY=your_api_key

# Spexi
NEXT_PUBLIC_SPEXI_API_KEY=your_api_key
```

## 🏗️ Architecture

### **Frontend (Next.js 15)**
```
app/
├── page.tsx                 # Main dashboard
├── databridge/             # Filecoin storage & bridges
├── drone-sim/              # WeatherXM integration
├── near-agent/             # NEAR AI agents
├── api/                    # Backend API routes
│   ├── agents/             # Agent management
│   ├── filecoin/           # Filecoin integration
│   ├── bridge/             # Cross-chain bridges
│   ├── nouns/              # Nouns deployment
│   ├── bio-ai/             # Bio AI DID system
│   ├── reppo/              # Reppo MCP solvers
│   └── spexi/              # Spexi imagery analysis
```

### **Smart Contracts**
```
near_intent_contracts/      # NEAR Rust contracts
AgentNPC/                   # Flow blockchain contracts
deploy/                     # Deployment scripts
```

### **Integration Modules**
```
utils/
├── filecoinIntegration.ts  # Filecoin FVM + storage
├── nearIntegration.ts      # NEAR AI agents
├── weatherXMIntegration.ts # Weather data + risk
├── mosaiaIntegration.ts    # AI agent tooling
├── nounsIntegration.ts     # ENS + IPFS deployment
├── bioAIIntegration.ts     # DID + GDPR compliance
├── reppoIntegration.ts     # MCP solver nodes
└── spexiIntegration.ts     # Aerial imagery analysis
```

## 🔧 Sponsor Integrations

### **1. Filecoin Foundation**
**Features:**
- FVM smart contracts for programmable storage
- USDFC payments for storage services
- Cross-chain bridges (Ethereum ↔ Filecoin)
- Decentralized file management

**Usage:**
```typescript
import { FilecoinIntegration } from './utils/filecoinIntegration';

const filecoin = new FilecoinIntegration(provider, signer);
const result = await filecoin.storeAgentData(agentData);
```

### **2. NEAR Foundation**
**Features:**
- AI-driven agents with intent-based execution
- Cross-chain signature verification
- Rust smart contracts for performance
- Account-based architecture

**Usage:**
```typescript
import { NEARAgentFactory } from './utils/nearIntegration';

const nearFactory = new NEARAgentFactory();
const agentId = await nearFactory.createRebalancerBot(userId, preferences);
```

### **3. WeatherXM**
**Features:**
- Real-time weather data integration
- Risk assessment for outdoor activities
- Weather-based decision making
- Historical weather analysis

**Usage:**
```typescript
import { WeatherXMIntegration } from './utils/weatherXMIntegration';

const weather = new WeatherXMIntegration();
const risk = await weather.assessRisk(lat, lng);
```

### **4. Mosaia**
**Features:**
- AI agent tooling and GitHub integration
- Custom prompt engineering
- Agent collaboration workflows
- Code generation and management

**Usage:**
```typescript
import { MosaiaIntegration } from './utils/mosaiaIntegration';

const mosaia = new MosaiaIntegration();
const agent = await mosaia.createAgent(config);
```

### **5. Nouns**
**Features:**
- ENS + IPFS deployment for decentralized frontends
- Decentralized auction and voting clients
- Configurable RPC endpoints
- On-chain governance integration

**Usage:**
```typescript
import { NounsFrontendFactory } from './utils/nounsIntegration';

const nounsFactory = new NounsFrontendFactory(provider, signer);
const result = await nounsFactory.createAuctionClient('cyberpunk.eth');
```

### **6. Bio AI**
**Features:**
- GDPR-compliant Decentralized Identifiers (DIDs)
- Verifiable credentials
- Harvard Dataverse integration
- Data portability and erasure rights

**Usage:**
```typescript
import { BioAIApplicationFactory } from './utils/bioAIIntegration';

const bioAI = new BioAIApplicationFactory();
const app = await bioAI.createCulturalHeritageAI();
```

### **7. Reppo**
**Features:**
- MCP solver nodes for decentralized data processing
- RFD (Request for Data) network
- DeFi, sports, and IoT data analysis
- Incentive mechanisms for data providers

**Usage:**
```typescript
import { ReppoSolverFactory } from './utils/reppoIntegration';

const reppo = new ReppoSolverFactory();
const solver = await reppo.createDeFiSolver();
```

### **8. Spexi**
**Features:**
- AI-powered aerial imagery analysis
- Geometric Vision Language Model (VLM)
- Disaster response and site analysis
- Roof analysis for solar installation

**Usage:**
```typescript
import { SpexiAnalysisFactory } from './utils/spexiIntegration';

const spexi = new SpexiAnalysisFactory();
const analysis = await spexi.createSiteAnalysis(location);
```

## 🚀 Deployment

### **Testnet Deployment**

```bash
# Deploy to Filecoin Calibration
npm run deploy:filecoin

# Deploy to NEAR testnet
npm run deploy:near

# Deploy to Ethereum Sepolia
npm run deploy:ethereum

# Deploy to Polygon Mumbai
npm run deploy:polygon
```

### **Production Deployment**

```bash
# Build the application
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Deploy smart contracts to mainnet
npm run deploy:mainnet
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Test specific sponsor integration
npm run test:filecoin
npm run test:near
npm run test:weatherxm
```


## 🔗 Links

- [Live Demo](https://cyberpunk-metaverse.vercel.app)
- [Technical Documentation](https://docs.cyberpunk-metaverse.com)
- [API Reference](https://api.cyberpunk-metaverse.com)
- [Contract Addresses](https://contracts.cyberpunk-metaverse.com)
- [Sponsor Integrations](https://integrations.cyberpunk-metaverse.com)

---

**Built with ❤️ for the Web3 community and hackathon sponsors**
