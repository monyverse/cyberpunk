# 🎮 Demo Environment Setup Guide

## 🎯 Overview
This guide sets up a complete demo environment for showcasing all 8 sponsor integrations to hackathon judges.

## 🚀 Quick Demo Setup

### **1. Pre-Demo Checklist**

#### **Technical Requirements:**
- [ ] High-speed internet connection
- [ ] Modern browser (Chrome/Firefox/Safari)
- [ ] MetaMask or RainbowKit wallet extension
- [ ] Testnet tokens (Filecoin Calibration, NEAR testnet)
- [ ] Screen recording software (OBS Studio recommended)
- [ ] External microphone for clear audio

#### **Environment Setup:**
- [ ] All contracts deployed to testnets
- [ ] Test accounts funded with tokens
- [ ] Sample data prepared
- [ ] Browser tabs organized
- [ ] Backup demo scenarios ready

### **2. Demo Account Setup**

#### **Filecoin Calibration Testnet:**
```bash
# Get test FIL from faucet
curl -X POST https://faucet.calibration.fildev.network/send \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_FILECOIN_ADDRESS"}'
```

#### **NEAR Testnet:**
```bash
# Create test account
near create-account cyberpunk.testnet --masterAccount testnet
# Fund with test NEAR
near send testnet cyberpunk.testnet 10
```

#### **Ethereum Sepolia:**
```bash
# Get test ETH from faucet
# Visit: https://sepoliafaucet.com
```

### **3. Demo Data Preparation**

#### **Sample Agent Data:**
```json
{
  "name": "CyberPunk Agent Alpha",
  "type": "hybrid",
  "capabilities": [
    "filecoin_storage",
    "near_execution",
    "weather_analysis",
    "ai_tooling",
    "nouns_deployment",
    "did_management",
    "mcp_solving",
    "aerial_analysis"
  ],
  "preferences": {
    "risk_tolerance": "medium",
    "storage_provider": "filecoin",
    "ai_model": "gpt-4"
  }
}
```

#### **Sample Weather Data:**
```json
{
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "city": "New York"
  },
  "weather": {
    "temperature": 22,
    "humidity": 65,
    "wind_speed": 15,
    "conditions": "partly_cloudy"
  },
  "risk_assessment": {
    "drone_flight": "low_risk",
    "outdoor_activity": "safe",
    "recommendations": ["proceed_with_caution"]
  }
}
```

## 🎬 Demo Scenarios

### **Scenario 1: Complete Integration Flow (10 minutes)**

#### **Step 1: Project Introduction (1 min)**
```
"Welcome to CyberPunk Metaverse - the world's first comprehensive 
multi-sponsor Web3 integration platform. Today I'll demonstrate how 
we've integrated 8 major hackathon sponsors into a unified experience."
```

#### **Step 2: Filecoin Integration (2 min)**
- Navigate to `/databridge`
- Show FVM contract deployment
- Demonstrate USDFC payment
- Show cross-chain bridge transaction

#### **Step 3: NEAR Integration (2 min)**
- Create AI agent with NEAR capabilities
- Show intent-based execution
- Demonstrate cross-chain signatures

#### **Step 4: WeatherXM Integration (1 min)**
- Navigate to drone simulation
- Show real-time weather data
- Demonstrate risk assessment

#### **Step 5: Mosaia Integration (1 min)**
- Show AI agent tooling
- Demonstrate GitHub integration
- Show agent collaboration

#### **Step 6: Nouns Integration (1 min)**
- Deploy frontend to IPFS
- Show ENS record setting
- Display decentralized settings

#### **Step 7: Bio AI Integration (1 min)**
- Create DID for application
- Show GDPR compliance features
- Demonstrate data portability

#### **Step 8: Reppo Integration (1 min)**
- Register MCP solver node
- Process DeFi data RFD
- Show NBA statistics analysis

### **Scenario 2: Ultimate Integration Demo (5 minutes)**

#### **Step 1: Hybrid Agent Creation (2 min)**
```
"Now let's create the ultimate hybrid agent that leverages all 
8 sponsor technologies simultaneously."
```

- Create agent with all integrations
- Show multi-sponsor data flow
- Demonstrate cross-chain collaboration

#### **Step 2: Real-World Use Case (3 min)**
```
"Let's simulate a real-world scenario: disaster response with 
aerial imagery, weather analysis, and cross-chain coordination."
```

- Upload disaster area imagery
- Show weather risk assessment
- Demonstrate multi-agent coordination
- Show cross-chain data sharing

## 🎥 Recording Setup

### **Screen Recording Configuration:**
- **Resolution:** 1920x1080
- **Frame Rate:** 30 FPS
- **Audio:** External microphone, 48kHz
- **Software:** OBS Studio or similar

### **Browser Tab Organization:**
1. **Main Dashboard** - Project overview
2. **Filecoin Bridge** - Storage and payments
3. **NEAR Agents** - AI agent management
4. **Drone Simulation** - Weather integration
5. **Agent Tools** - Mosaia integration
6. **Nouns Deployment** - ENS + IPFS
7. **Bio AI Dashboard** - DID management
8. **Reppo Solvers** - MCP node management
9. **Spexi Analysis** - Aerial imagery
10. **Contract Explorer** - Testnet transactions

### **Audio Script:**
```
"Welcome to CyberPunk Metaverse. I'm [Your Name], and today I'll 
demonstrate how we've integrated 8 major hackathon sponsors into 
a unified Web3 platform.

Our platform combines Filecoin's decentralized storage, NEAR's 
AI agents, WeatherXM's real-time data, Mosaia's AI tooling, 
Nouns' decentralized hosting, Bio AI's privacy compliance, 
Reppo's data processing, and Spexi's aerial analysis.

Let's start with the Filecoin Foundation integration..."
```

## 🔧 Technical Demo Setup

### **Pre-Demo Testing:**
```bash
# Test all integrations
npm run test:all

# Verify contract deployments
npm run verify:contracts

# Check API endpoints
npm run test:api

# Validate cross-chain bridges
npm run test:bridges
```

### **Demo Environment Variables:**
```bash
# Demo-specific configuration
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_ACCOUNTS=true
NEXT_PUBLIC_SHOW_SPONSOR_LOGS=true
NEXT_PUBLIC_DEMO_DATA=true
```

### **Backup Scenarios:**
1. **Network Issues** - Pre-recorded video segments
2. **Contract Failures** - Mock data fallbacks
3. **API Timeouts** - Cached responses
4. **Wallet Issues** - Multiple wallet options

## 📊 Demo Metrics

### **Success Indicators:**
- All 8 integrations working
- Cross-chain transactions successful
- AI agents responding within 2 seconds
- Weather data updating in real-time
- No technical errors during demo

### **Performance Benchmarks:**
- Page load time: <3 seconds
- Contract interaction: <30 seconds
- Cross-chain bridge: <2 minutes
- AI analysis: <5 seconds
- Image processing: <10 seconds

## 🎯 Demo Script Templates

### **Opening Script:**
```
"Good [morning/afternoon], hackathon judges and sponsor representatives. 
I'm excited to present CyberPunk Metaverse, a groundbreaking multi-sponsor 
integration platform that demonstrates the future of Web3 collaboration.

Our project integrates 8 major sponsors: Filecoin Foundation, NEAR Foundation, 
WeatherXM, Mosaia, Nouns, Bio AI, Reppo, and Spexi. This represents a total 
potential prize value of over $140,000, making it one of the most comprehensive 
hackathon submissions.

Let me show you how these technologies work together to create a seamless 
metaverse experience..."
```

### **Closing Script:**
```
"Thank you for your attention. As you've seen, CyberPunk Metaverse 
successfully integrates all 8 sponsor technologies into a unified platform 
that demonstrates real-world utility and innovation.

Our platform showcases:
- Multi-chain interoperability
- AI-powered decision making
- Privacy-compliant data handling
- Decentralized infrastructure
- Real-time environmental analysis

This represents the future of Web3 - where multiple technologies work 
together to create something greater than the sum of their parts.

I'm happy to answer any questions about our implementation or discuss 
potential partnerships with the sponsor organizations."
```

## 🚀 Post-Demo Actions

### **Immediate:**
- [ ] Collect judge feedback
- [ ] Record Q&A session
- [ ] Document technical questions
- [ ] Share contact information

### **Follow-up:**
- [ ] Send thank you emails
- [ ] Provide technical documentation
- [ ] Schedule follow-up meetings
- [ ] Prepare partnership proposals

### **Long-term:**
- [ ] Deploy to mainnet
- [ ] Scale infrastructure
- [ ] Build community
- [ ] Pursue partnerships

---

**Demo Environment Ready! 🎮** 