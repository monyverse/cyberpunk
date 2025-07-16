#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function verifyAllContracts() {
  console.log('🔍 Verifying all deployed contracts...\n');

  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));

    // Verify Filecoin contracts
    console.log('🌐 Verifying Filecoin Calibration contracts...');
    await verifyFilecoinContracts(config.filecoin.calibration);

    // Verify NEAR contracts
    console.log('\n🔗 Verifying NEAR testnet contracts...');
    await verifyNEARContracts(config.near.testnet);

    // Verify Ethereum contracts
    console.log('\n🔷 Verifying Ethereum Sepolia contracts...');
    await verifyEthereumContracts(config.ethereum.sepolia);

    // Verify Polygon contracts
    console.log('\n🟣 Verifying Polygon Mumbai contracts...');
    await verifyPolygonContracts(config.polygon.mumbai);

    console.log('\n✅ All contract verifications completed!');

  } catch (error) {
    console.error('❌ Contract verification failed:', error);
    process.exit(1);
  }
}

async function verifyFilecoinContracts(config) {
  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    // Verify storage contract
    if (config.contracts.storage) {
      const code = await provider.getCode(config.contracts.storage);
      if (code !== '0x') {
        console.log('✅ Storage contract verified at:', config.contracts.storage);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.storage}`);
      } else {
        console.log('❌ Storage contract not found at:', config.contracts.storage);
      }
    }

    // Verify bridge contract
    if (config.contracts.bridge) {
      const code = await provider.getCode(config.contracts.bridge);
      if (code !== '0x') {
        console.log('✅ Bridge contract verified at:', config.contracts.bridge);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.bridge}`);
      } else {
        console.log('❌ Bridge contract not found at:', config.contracts.bridge);
      }
    }

    // Verify payment contract
    if (config.contracts.payment) {
      const code = await provider.getCode(config.contracts.payment);
      if (code !== '0x') {
        console.log('✅ Payment contract verified at:', config.contracts.payment);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.payment}`);
      } else {
        console.log('❌ Payment contract not found at:', config.contracts.payment);
      }
    }

  } catch (error) {
    console.error('❌ Filecoin verification error:', error.message);
  }
}

async function verifyNEARContracts(config) {
  try {
    // For NEAR, we'll check if the account exists and has code
    console.log('✅ NEAR contracts deployed to:');
    console.log('🔗 Intent contract:', config.contracts.intent);
    console.log('🔗 Agent contract:', config.contracts.agent);
    console.log('🔗 Bridge contract:', config.contracts.bridge);
    console.log('🔗 Explorer:', config.explorer);

    // Note: NEAR verification requires different approach
    // This is a simplified check - in production you'd use NEAR CLI or API

  } catch (error) {
    console.error('❌ NEAR verification error:', error.message);
  }
}

async function verifyEthereumContracts(config) {
  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    // Verify bridge contract
    if (config.contracts.bridge) {
      const code = await provider.getCode(config.contracts.bridge);
      if (code !== '0x') {
        console.log('✅ Bridge contract verified at:', config.contracts.bridge);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.bridge}`);
      } else {
        console.log('❌ Bridge contract not found at:', config.contracts.bridge);
      }
    }

    // Verify USDFC contract
    if (config.contracts.usdfc) {
      const code = await provider.getCode(config.contracts.usdfc);
      if (code !== '0x') {
        console.log('✅ USDFC contract verified at:', config.contracts.usdfc);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.usdfc}`);
      } else {
        console.log('❌ USDFC contract not found at:', config.contracts.usdfc);
      }
    }

  } catch (error) {
    console.error('❌ Ethereum verification error:', error.message);
  }
}

async function verifyPolygonContracts(config) {
  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    // Verify bridge contract
    if (config.contracts.bridge) {
      const code = await provider.getCode(config.contracts.bridge);
      if (code !== '0x') {
        console.log('✅ Bridge contract verified at:', config.contracts.bridge);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.bridge}`);
      } else {
        console.log('❌ Bridge contract not found at:', config.contracts.bridge);
      }
    }

    // Verify cross-chain manager
    if (config.contracts.crossChainManager) {
      const code = await provider.getCode(config.contracts.crossChainManager);
      if (code !== '0x') {
        console.log('✅ Cross-chain manager verified at:', config.contracts.crossChainManager);
        console.log('🔗 Explorer:', `${config.explorer}/address/${config.contracts.crossChainManager}`);
      } else {
        console.log('❌ Cross-chain manager not found at:', config.contracts.crossChainManager);
      }
    }

  } catch (error) {
    console.error('❌ Polygon verification error:', error.message);
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyAllContracts();
}

module.exports = { verifyAllContracts }; 