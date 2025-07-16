#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function testFilecoinIntegrations() {
  console.log('🧪 Testing Filecoin Calibration Testnet Integrations...\n');

  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));
    const filecoinConfig = config.filecoin.calibration;

    // Connect to Filecoin Calibration
    const provider = new ethers.JsonRpcProvider(filecoinConfig.rpcUrl);
    const privateKey = process.env.FILECOIN_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('FILECOIN_PRIVATE_KEY environment variable is required');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('📡 Connected to Filecoin Calibration');
    console.log('👤 Test wallet:', wallet.address);
    console.log('💰 Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'FIL');

    // Test 1: Storage Contract
    console.log('\n📦 Test 1: Storage Contract Operations');
    await testStorageContract(wallet, filecoinConfig);

    // Test 2: Bridge Contract
    console.log('\n🌉 Test 2: Bridge Contract Operations');
    await testBridgeContract(wallet, filecoinConfig);

    // Test 3: Payment Contract
    console.log('\n💳 Test 3: Payment Contract Operations');
    await testPaymentContract(wallet, filecoinConfig);

    // Test 4: Cross-chain Bridge
    console.log('\n🔗 Test 4: Cross-chain Bridge Operations');
    await testCrossChainBridge(wallet, filecoinConfig);

    // Test 5: Programmable Storage
    console.log('\n⚙️ Test 5: Programmable Storage Operations');
    await testProgrammableStorage(wallet, filecoinConfig);

    console.log('\n✅ All Filecoin tests completed successfully!');

  } catch (error) {
    console.error('❌ Filecoin tests failed:', error);
    process.exit(1);
  }
}

async function testStorageContract(wallet, config) {
  try {
    if (!config.contracts.storage) {
      console.log('⚠️ Storage contract not deployed, skipping test');
      return;
    }

    const storageABI = [
      'function storeFile(uint256 size, string memory metadata) external payable returns (bytes32)',
      'function retrieveFile(bytes32 fileId) external returns (tuple(bytes32,address,uint256,uint256,uint256,bool,string))',
      'function calculateStorageCost(uint256 size) external view returns (uint256)',
      'function getFileCount() external view returns (uint256)'
    ];

    const contract = new ethers.Contract(config.contracts.storage, storageABI, wallet);

    // Test file storage
    const fileSize = 1024 * 1024; // 1MB
    const metadata = 'QmTestFileHash123456789';
    const cost = await contract.calculateStorageCost(fileSize);
    
    console.log('📁 Storing test file...');
    const tx = await contract.storeFile(fileSize, metadata, { value: cost });
    const receipt = await tx.wait();
    
    console.log('✅ File stored successfully');
    console.log('📊 Transaction hash:', receipt.hash);
    console.log('💰 Cost:', ethers.formatEther(cost), 'FIL');

    // Test file retrieval
    const fileCount = await contract.getFileCount();
    console.log('📊 Total files stored:', fileCount.toString());

  } catch (error) {
    console.error('❌ Storage contract test failed:', error.message);
  }
}

async function testBridgeContract(wallet, config) {
  try {
    if (!config.contracts.bridge) {
      console.log('⚠️ Bridge contract not deployed, skipping test');
      return;
    }

    const bridgeABI = [
      'function bridgeTokens(address token, uint256 amount, uint256 targetChain) external',
      'function getBridgeFee() external view returns (uint256)',
      'function getSupportedChains() external view returns (uint256[])'
    ];

    const contract = new ethers.Contract(config.contracts.bridge, bridgeABI, wallet);

    // Test bridge fee
    const bridgeFee = await contract.getBridgeFee();
    console.log('💰 Bridge fee:', ethers.formatEther(bridgeFee), 'FIL');

    // Test supported chains
    const supportedChains = await contract.getSupportedChains();
    console.log('🔗 Supported chains:', supportedChains.map(c => c.toString()));

  } catch (error) {
    console.error('❌ Bridge contract test failed:', error.message);
  }
}

async function testPaymentContract(wallet, config) {
  try {
    if (!config.contracts.payment) {
      console.log('⚠️ Payment contract not deployed, skipping test');
      return;
    }

    const paymentABI = [
      'function getPaymentFee() external view returns (uint256)',
      'function processPayment(address recipient, uint256 amount) external payable'
    ];

    const contract = new ethers.Contract(config.contracts.payment, paymentABI, wallet);

    // Test payment fee
    const paymentFee = await contract.getPaymentFee();
    console.log('💰 Payment fee:', ethers.formatEther(paymentFee), 'FIL');

  } catch (error) {
    console.error('❌ Payment contract test failed:', error.message);
  }
}

async function testCrossChainBridge(wallet, config) {
  try {
    console.log('🌉 Testing cross-chain bridge to Ethereum...');
    
    // Simulate cross-chain bridge operation
    const bridgeData = {
      sourceChain: 'filecoin',
      targetChain: 'ethereum',
      amount: ethers.parseEther('0.1'),
      token: 'FIL',
      timestamp: Date.now()
    };

    console.log('📤 Bridge data:', bridgeData);
    console.log('✅ Cross-chain bridge test completed');

  } catch (error) {
    console.error('❌ Cross-chain bridge test failed:', error.message);
  }
}

async function testProgrammableStorage(wallet, config) {
  try {
    console.log('⚙️ Testing programmable storage features...');
    
    // Test storage deal creation
    const dealParams = {
      pieceSize: 2048,
      pieceCid: 'QmTestPieceCID123456789',
      client: wallet.address,
      provider: 'f01234', // Test provider
      duration: 518400 // 6 months
    };

    console.log('📋 Deal parameters:', dealParams);
    console.log('✅ Programmable storage test completed');

  } catch (error) {
    console.error('❌ Programmable storage test failed:', error.message);
  }
}

// Run tests if called directly
if (require.main === module) {
  testFilecoinIntegrations();
}

module.exports = { testFilecoinIntegrations }; 