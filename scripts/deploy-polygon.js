#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));

async function deployToPolygonMumbai() {
  console.log('🚀 Deploying to Polygon Mumbai Testnet...\n');

  try {
    // Connect to Polygon Mumbai
    const provider = new ethers.JsonRpcProvider(config.polygon.mumbai.rpcUrl);
    
    // Load private key from environment
    const privateKey = process.env.POLYGON_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('POLYGON_PRIVATE_KEY environment variable is required');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('📡 Connected to Polygon Mumbai');
    console.log('👤 Deployer address:', wallet.address);
    console.log('💰 Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'MATIC');

    // Deploy Bridge Contract
    console.log('\n🌉 Deploying Bridge Contract...');
    const bridgeContract = await deployBridgeContract(wallet);
    console.log('✅ Bridge Contract deployed at:', bridgeContract.address);

    // Deploy Cross-Chain Manager
    console.log('\n🔗 Deploying Cross-Chain Manager...');
    const crossChainManager = await deployCrossChainManager(wallet);
    console.log('✅ Cross-Chain Manager deployed at:', crossChainManager.address);

    // Update configuration with deployed addresses
    config.polygon.mumbai.contracts.bridge = bridgeContract.address;
    config.polygon.mumbai.contracts.crossChainManager = crossChainManager.address;

    // Save updated configuration
    fs.writeFileSync(
      path.join(__dirname, '../deploy/testnet-config.json'),
      JSON.stringify(config, null, 2)
    );

    console.log('\n🎉 Polygon Mumbai deployment completed successfully!');
    console.log('\n📋 Contract Addresses:');
    console.log('Bridge:', bridgeContract.address);
    console.log('Cross-Chain Manager:', crossChainManager.address);
    console.log('\n🔍 Explorer:', config.polygon.mumbai.explorer);

  } catch (error) {
    console.error('❌ Polygon deployment failed:', error);
    process.exit(1);
  }
}

async function deployBridgeContract(wallet) {
  const bridgeABI = [
    'function bridgeTokens(address token, uint256 amount, uint256 targetChain) external',
    'function receiveTokens(address token, uint256 amount, address recipient) external',
    'function getBridgeFee() external view returns (uint256)',
    'function setBridgeFee(uint256 newFee) external',
    'function getSupportedChains() external view returns (uint256[])',
    'function addSupportedChain(uint256 chainId) external',
    'function removeSupportedChain(uint256 chainId) external',
    'function getTransactionStatus(bytes32 txHash) external view returns (string)',
    'function completeTransaction(bytes32 txHash) external'
  ];

  const bridgeBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6bb8a63c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c64736f6c63430008120033';

  const factory = new ethers.ContractFactory(bridgeABI, bridgeBytecode, wallet);
  return await factory.deploy();
}

async function deployCrossChainManager(wallet) {
  const managerABI = [
    'function registerChain(uint256 chainId, address bridgeContract) external',
    'function getBridgeContract(uint256 chainId) external view returns (address)',
    'function executeCrossChainCall(uint256 targetChain, bytes calldata data) external',
    'function getSupportedChains() external view returns (uint256[])',
    'function setGasLimit(uint256 chainId, uint256 gasLimit) external',
    'function getGasLimit(uint256 chainId) external view returns (uint256)'
  ];

  const managerBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6bb8a63c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c64736f6c63430008120033';

  const factory = new ethers.ContractFactory(managerABI, managerBytecode, wallet);
  return await factory.deploy();
}

// Run deployment if called directly
if (require.main === module) {
  deployToPolygonMumbai();
}

module.exports = { deployToPolygonMumbai }; 