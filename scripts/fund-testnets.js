#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function showTestnetFundingInfo() {
  console.log('💰 Testnet Funding Information\n');

  const fundingInfo = {
    filecoin: {
      network: 'Filecoin Calibration Testnet',
      faucet: 'https://faucet.calibration.fildev.network/',
      tokens: 'tFIL (Test Filecoin)',
      instructions: [
        '1. Visit the Calibration faucet',
        '2. Enter your wallet address',
        '3. Request test tokens',
        '4. Wait for confirmation (usually 1-2 minutes)'
      ]
    },
    near: {
      network: 'NEAR Testnet',
      faucet: 'https://wallet.testnet.near.org/',
      tokens: 'NEAR',
      instructions: [
        '1. Create a NEAR testnet account',
        '2. Visit the NEAR wallet',
        '3. Use the faucet to get test NEAR',
        '4. Each account gets 200 NEAR initially'
      ]
    },
    ethereum: {
      network: 'Ethereum Sepolia Testnet',
      faucet: 'https://sepoliafaucet.com/',
      tokens: 'ETH',
      instructions: [
        '1. Visit Sepolia faucet',
        '2. Connect your wallet',
        '3. Request test ETH',
        '4. Wait for confirmation'
      ]
    },
    polygon: {
      network: 'Polygon Mumbai Testnet',
      faucet: 'https://faucet.polygon.technology/',
      tokens: 'MATIC',
      instructions: [
        '1. Visit Polygon faucet',
        '2. Select Mumbai testnet',
        '3. Enter your wallet address',
        '4. Request test MATIC'
      ]
    }
  };

  Object.entries(fundingInfo).forEach(([network, info]) => {
    console.log(`🌐 ${info.network}`);
    console.log(`💰 Tokens: ${info.tokens}`);
    console.log(`🔗 Faucet: ${info.faucet}`);
    console.log('📋 Instructions:');
    info.instructions.forEach(instruction => {
      console.log(`   ${instruction}`);
    });
    console.log('');
  });

  console.log('💡 Tips:');
  console.log('- Keep your private keys secure');
  console.log('- Use different wallets for each testnet');
  console.log('- Test with small amounts first');
  console.log('- Monitor transaction confirmations');
}

// Run if called directly
if (require.main === module) {
  showTestnetFundingInfo();
}

module.exports = { showTestnetFundingInfo }; 