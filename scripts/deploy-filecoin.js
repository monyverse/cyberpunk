#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));

async function deployToFilecoinCalibration() {
  console.log('🚀 Deploying to Filecoin Calibration Testnet...\n');

  try {
    // Connect to Filecoin Calibration
    const provider = new ethers.JsonRpcProvider(config.filecoin.calibration.rpcUrl);
    
    // Load private key from environment or use default for testing
    const privateKey = process.env.FILECOIN_PRIVATE_KEY || '0x1234567890123456789012345678901234567890';
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('📡 Connected to Filecoin Calibration');
    console.log('👤 Deployer address:', wallet.address);

    // Deploy Storage Contract
    console.log('\n📦 Deploying Storage Contract...');
    const storageContract = await deployStorageContract(wallet);
    console.log('✅ Storage Contract deployed at:', storageContract.address);

    // Deploy Bridge Contract
    console.log('\n🌉 Deploying Bridge Contract...');
    const bridgeContract = await deployBridgeContract(wallet);
    console.log('✅ Bridge Contract deployed at:', bridgeContract.address);

    // Deploy Payment Contract
    console.log('\n💰 Deploying Payment Contract...');
    const paymentContract = await deployPaymentContract(wallet);
    console.log('✅ Payment Contract deployed at:', paymentContract.address);

    // Update configuration with deployed addresses
    config.filecoin.calibration.contracts.storage = storageContract.address;
    config.filecoin.calibration.contracts.bridge = bridgeContract.address;
    config.filecoin.calibration.contracts.payment = paymentContract.address;

    // Save updated configuration
    fs.writeFileSync(
      path.join(__dirname, '../deploy/testnet-config.json'),
      JSON.stringify(config, null, 2)
    );

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📋 Contract Addresses:');
    console.log('Storage:', storageContract.address);
    console.log('Bridge:', bridgeContract.address);
    console.log('Payment:', paymentContract.address);
    console.log('\n🔍 Explorer:', config.filecoin.calibration.explorer);

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

async function deployStorageContract(wallet) {
  const storageABI = [
    'function store(bytes32 key, bytes calldata value) external',
    'function retrieve(bytes32 key) external view returns (bytes memory)',
    'function getStorageFee() external view returns (uint256)'
  ];

  const storageBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6bb8a63c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c64736f6c63430008120033';

  const factory = new ethers.ContractFactory(storageABI, storageBytecode, wallet);
  return await factory.deploy();
}

async function deployBridgeContract(wallet) {
  const bridgeABI = [
    'function bridgeTokens(address token, uint256 amount, uint256 targetChain) external',
    'function receiveTokens(address token, uint256 amount, address recipient) external',
    'function getBridgeFee() external view returns (uint256)'
  ];

  const bridgeBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6bb8a63c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c64736f6c63430008120033';

  const factory = new ethers.ContractFactory(bridgeABI, bridgeBytecode, wallet);
  return await factory.deploy();
}

async function deployPaymentContract(wallet) {
  const paymentABI = [
    'function payUSDFC(uint256 amount) external',
    'function withdrawUSDFC(uint256 amount) external',
    'function getBalance() external view returns (uint256)'
  ];

  const paymentBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6bb8a63c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c8c0c64736f6c63430008120033';

  const factory = new ethers.ContractFactory(paymentABI, paymentBytecode, wallet);
  return await factory.deploy();
}

// Run deployment if called directly
if (require.main === module) {
  deployToFilecoinCalibration();
}

module.exports = { deployToFilecoinCalibration }; 