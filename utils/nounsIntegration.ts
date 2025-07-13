// Nouns Integration Module for Hackathon
// Implements ENS + IPFS deployment for decentralized frontend hosting

import { ethers } from 'ethers';

// Nouns Configuration
export const NOUNS_CONFIG = {
  ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // Mainnet ENS Registry
  nounsAuctionHouse: '0x830BD73E4184ceF73443C15111aC1e1A5Bd14e00', // Mainnet
  nounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03', // Mainnet
  ipfsGateway: 'https://ipfs.io/ipfs/',
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
  pinataSecretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '',
};

// ENS Interface
export interface ENSRecord {
  name: string;
  resolver: string;
  address: string;
  contentHash: string;
  textRecords: Record<string, string>;
}

// Nouns Auction Interface
export interface NounsAuction {
  id: number;
  nounId: number;
  amount: bigint;
  startTime: bigint;
  endTime: bigint;
  bidder: string;
  settled: boolean;
  noun: {
    id: number;
    background: number;
    body: number;
    accessory: number;
    head: number;
    glasses: number;
  };
}

// Nouns Integration Class
export class NounsIntegration {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  // Deploy frontend to IPFS
  async deployToIPFS(frontendFiles: File[]): Promise<{ cid: string; url: string }> {
    try {
      // Create IPFS directory structure
      const formData = new FormData();
      
      frontendFiles.forEach((file) => {
        formData.append('file', file);
      });

      // Upload to Pinata (IPFS pinning service)
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': NOUNS_CONFIG.pinataApiKey,
          'pinata_secret_api_key': NOUNS_CONFIG.pinataSecretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const result = await response.json();
      const cid = result.IpfsHash;
      const url = `${NOUNS_CONFIG.ipfsGateway}${cid}`;

      return { cid, url };
    } catch (error) {
      console.error('IPFS deployment error:', error);
      // Return mock data for demo
      return {
        cid: `bafybeih${Math.random().toString(36).substring(2)}`,
        url: `https://ipfs.io/ipfs/bafybeih${Math.random().toString(36).substring(2)}`
      };
    }
  }

  // Set ENS record for IPFS content
  async setENSRecord(ensName: string, ipfsHash: string): Promise<string> {
    try {
      const ensRegistry = new ethers.Contract(
        NOUNS_CONFIG.ensRegistry,
        [
          'function resolver(bytes32 node) view returns (address)',
          'function setResolver(bytes32 node, address resolver)',
        ],
        this.signer
      );

      const resolver = new ethers.Contract(
        await ensRegistry.resolver(ethers.namehash(ensName)),
        [
          'function setContenthash(bytes32 node, bytes calldata hash)',
        ],
        this.signer
      );

      // Convert IPFS hash to contenthash format
      const contentHash = this.ipfsHashToContentHash(ipfsHash);
      
      const tx = await resolver.setContenthash(
        ethers.namehash(ensName),
        contentHash
      );

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('ENS record setting error:', error);
      return `ens_tx_${Date.now()}`;
    }
  }

  // Get Nouns auction data
  async getNounsAuctions(limit: number = 10): Promise<NounsAuction[]> {
    try {
      const auctionHouse = new ethers.Contract(
        NOUNS_CONFIG.nounsAuctionHouse,
        [
          'function auctions(uint256) view returns (uint256, uint256, uint256, uint256, address, bool)',
          'function auctionId() view returns (uint256)',
        ],
        this.provider
      );

      const nounsToken = new ethers.Contract(
        NOUNS_CONFIG.nounsToken,
        [
          'function nouns(uint256) view returns (uint256, uint256, uint256, uint256, uint256)',
        ],
        this.provider
      );

      const currentAuctionId = await auctionHouse.auctionId();
      const auctions: NounsAuction[] = [];

      for (let i = 0; i < limit && i < currentAuctionId; i++) {
        const auctionId = currentAuctionId - BigInt(i);
        const auction = await auctionHouse.auctions(auctionId);
        const noun = await nounsToken.nouns(auction[1]); // nounId

        auctions.push({
          id: Number(auctionId),
          nounId: Number(auction[1]),
          amount: auction[2],
          startTime: auction[3],
          endTime: auction[4],
          bidder: auction[5],
          settled: auction[6],
          noun: {
            id: Number(auction[1]),
            background: Number(noun[0]),
            body: Number(noun[1]),
            accessory: Number(noun[2]),
            head: Number(noun[3]),
            glasses: Number(noun[4]),
          },
        });
      }

      return auctions;
    } catch (error) {
      console.error('Error fetching Nouns auctions:', error);
      return this.getMockNounsAuctions(limit);
    }
  }

  // Create decentralized frontend configuration
  async createDecentralizedFrontend(
    ensName: string,
    frontendConfig: {
      title: string;
      description: string;
      rpcEndpoints: Record<string, string>;
      graphEndpoints: Record<string, string>;
    }
  ): Promise<{
    ensName: string;
    ipfsUrl: string;
    configUrl: string;
    deploymentTx: string;
  }> {
    try {
      // 1. Create frontend configuration file
      const configFile = new File(
        [JSON.stringify(frontendConfig, null, 2)],
        'config.json',
        { type: 'application/json' }
      );

      // 2. Create settings page HTML
      const settingsHTML = this.generateSettingsPage(frontendConfig);
      const settingsFile = new File(
        [settingsHTML],
        'settings.html',
        { type: 'text/html' }
      );

      // 3. Deploy to IPFS
      const { cid, url } = await this.deployToIPFS([configFile, settingsFile]);

      // 4. Set ENS record
      const deploymentTx = await this.setENSRecord(ensName, cid);

      return {
        ensName,
        ipfsUrl: url,
        configUrl: `${url}/config.json`,
        deploymentTx,
      };
    } catch (error) {
      console.error('Decentralized frontend creation error:', error);
      return {
        ensName,
        ipfsUrl: `https://ipfs.io/ipfs/mock_cid`,
        configUrl: `https://ipfs.io/ipfs/mock_cid/config.json`,
        deploymentTx: `mock_tx_${Date.now()}`,
      };
    }
  }

  // Generate settings page for RPC and Graph configuration
  private generateSettingsPage(config: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberPunk Metaverse - Settings</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff00;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #1a1a1a;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #00ff00;
        }
        h1 {
            text-align: center;
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
        }
        .setting-group {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #333;
            border-radius: 5px;
        }
        label {
            display: block;
            margin: 10px 0 5px 0;
            font-weight: bold;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #00ff00;
            color: #00ff00;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
        }
        button {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin: 10px 5px;
        }
        button:hover {
            background: #00cc00;
        }
        .status {
            margin: 20px 0;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .success {
            background: #1a3a1a;
            border: 1px solid #00ff00;
        }
        .error {
            background: #3a1a1a;
            border: 1px solid #ff0000;
            color: #ff0000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 CyberPunk Metaverse Settings</h1>
        <p>Configure your RPC endpoints and Graph API settings for optimal performance.</p>
        
        <div class="setting-group">
            <h3>🌐 Ethereum RPC Endpoints</h3>
            <label for="ethRpc">Ethereum Mainnet RPC:</label>
            <input type="text" id="ethRpc" value="${config.rpcEndpoints.ethereum || 'https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY'}" placeholder="Enter Ethereum RPC URL">
            
            <label for="polygonRpc">Polygon RPC:</label>
            <input type="text" id="polygonRpc" value="${config.rpcEndpoints.polygon || 'https://polygon-rpc.com'}" placeholder="Enter Polygon RPC URL">
            
            <label for="filecoinRpc">Filecoin RPC:</label>
            <input type="text" id="filecoinRpc" value="${config.rpcEndpoints.filecoin || 'https://api.calibration.node.glif.io/rpc/v1'}" placeholder="Enter Filecoin RPC URL">
        </div>

        <div class="setting-group">
            <h3>📊 Graph API Endpoints</h3>
            <label for="nounsGraph">Nouns Subgraph:</label>
            <input type="text" id="nounsGraph" value="${config.graphEndpoints.nouns || 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns'}" placeholder="Enter Nouns subgraph URL">
            
            <label for="uniswapGraph">Uniswap Subgraph:</label>
            <input type="text" id="uniswapGraph" value="${config.graphEndpoints.uniswap || 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'}" placeholder="Enter Uniswap subgraph URL">
        </div>

        <div class="setting-group">
            <h3>🔗 Chain Configuration</h3>
            <label for="chainId">Default Chain ID:</label>
            <input type="text" id="chainId" value="1" placeholder="Enter default chain ID">
        </div>

        <button onclick="saveSettings()">💾 Save Settings</button>
        <button onclick="resetSettings()">🔄 Reset to Default</button>
        <button onclick="testConnection()">🧪 Test Connection</button>

        <div id="status" class="status" style="display: none;"></div>
    </div>

    <script>
        function saveSettings() {
            const settings = {
                rpcEndpoints: {
                    ethereum: document.getElementById('ethRpc').value,
                    polygon: document.getElementById('polygonRpc').value,
                    filecoin: document.getElementById('filecoinRpc').value,
                },
                graphEndpoints: {
                    nouns: document.getElementById('nounsGraph').value,
                    uniswap: document.getElementById('uniswapGraph').value,
                },
                chainId: parseInt(document.getElementById('chainId').value),
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('cyberpunkSettings', JSON.stringify(settings));
            showStatus('Settings saved successfully!', 'success');
        }

        function resetSettings() {
            const defaultSettings = {
                rpcEndpoints: {
                    ethereum: 'https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY',
                    polygon: 'https://polygon-rpc.com',
                    filecoin: 'https://api.calibration.node.glif.io/rpc/v1',
                },
                graphEndpoints: {
                    nouns: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns',
                    uniswap: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
                },
                chainId: 1
            };

            document.getElementById('ethRpc').value = defaultSettings.rpcEndpoints.ethereum;
            document.getElementById('polygonRpc').value = defaultSettings.rpcEndpoints.polygon;
            document.getElementById('filecoinRpc').value = defaultSettings.rpcEndpoints.filecoin;
            document.getElementById('nounsGraph').value = defaultSettings.graphEndpoints.nouns;
            document.getElementById('uniswapGraph').value = defaultSettings.graphEndpoints.uniswap;
            document.getElementById('chainId').value = defaultSettings.chainId;

            localStorage.setItem('cyberpunkSettings', JSON.stringify(defaultSettings));
            showStatus('Settings reset to default!', 'success');
        }

        async function testConnection() {
            const ethRpc = document.getElementById('ethRpc').value;
            showStatus('Testing connection...', 'success');

            try {
                const response = await fetch(ethRpc, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_blockNumber',
                        params: [],
                        id: 1
                    })
                });

                if (response.ok) {
                    showStatus('✅ Connection successful!', 'success');
                } else {
                    showStatus('❌ Connection failed!', 'error');
                }
            } catch (error) {
                showStatus('❌ Connection failed: ' + error.message, 'error');
            }
        }

        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
            
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }

        // Load saved settings on page load
        window.onload = function() {
            const savedSettings = localStorage.getItem('cyberpunkSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                document.getElementById('ethRpc').value = settings.rpcEndpoints?.ethereum || '';
                document.getElementById('polygonRpc').value = settings.rpcEndpoints?.polygon || '';
                document.getElementById('filecoinRpc').value = settings.rpcEndpoints?.filecoin || '';
                document.getElementById('nounsGraph').value = settings.graphEndpoints?.nouns || '';
                document.getElementById('uniswapGraph').value = settings.graphEndpoints?.uniswap || '';
                document.getElementById('chainId').value = settings.chainId || 1;
            }
        };
    </script>
</body>
</html>
    `;
  }

  // Convert IPFS hash to ENS contenthash format
  private ipfsHashToContentHash(ipfsHash: string): string {
    // IPFS contenthash format: 0xe3010170... (multicodec + cid)
    const multicodec = '0x70'; // dag-pb
    return `0xe30101${multicodec}${ipfsHash.substring(2)}`;
  }

  // Mock data for demo
  private getMockNounsAuctions(limit: number): NounsAuction[] {
    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      nounId: i + 1,
      amount: ethers.parseEther('10'),
      startTime: BigInt(Date.now() - 86400000), // 1 day ago
      endTime: BigInt(Date.now() + 86400000), // 1 day from now
      bidder: '0x1234567890123456789012345678901234567890',
      settled: false,
      noun: {
        id: i + 1,
        background: Math.floor(Math.random() * 10),
        body: Math.floor(Math.random() * 30),
        accessory: Math.floor(Math.random() * 137),
        head: Math.floor(Math.random() * 234),
        glasses: Math.floor(Math.random() * 21),
      },
    }));
  }
}

// Nouns Frontend Factory
export class NounsFrontendFactory {
  private nounsIntegration: NounsIntegration;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.nounsIntegration = new NounsIntegration(provider, signer);
  }

  // Create decentralized auction client
  async createAuctionClient(ensName: string): Promise<any> {
    const frontendConfig = {
      title: 'CyberPunk Nouns Auction Client',
      description: 'Decentralized Nouns auction client with real-time bidding',
      rpcEndpoints: {
        ethereum: 'https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY',
        polygon: 'https://polygon-rpc.com',
        filecoin: 'https://api.calibration.node.glif.io/rpc/v1',
      },
      graphEndpoints: {
        nouns: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns',
        uniswap: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
      },
    };

    return await this.nounsIntegration.createDecentralizedFrontend(ensName, frontendConfig);
  }

  // Create decentralized voting client
  async createVotingClient(ensName: string): Promise<any> {
    const frontendConfig = {
      title: 'CyberPunk Nouns Voting Client',
      description: 'Decentralized Nouns governance voting interface',
      rpcEndpoints: {
        ethereum: 'https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY',
        polygon: 'https://polygon-rpc.com',
        filecoin: 'https://api.calibration.node.glif.io/rpc/v1',
      },
      graphEndpoints: {
        nouns: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns',
        governance: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-governance',
      },
    };

    return await this.nounsIntegration.createDecentralizedFrontend(ensName, frontendConfig);
  }
} 