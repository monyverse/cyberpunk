#!/usr/bin/env node

const { connect, keyStores, KeyPair } = require('near-api-js');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));

async function deployToNEARTestnet() {
  console.log('🚀 Deploying to NEAR Testnet...\n');

  try {
    // Setup NEAR connection
    const keyStore = new keyStores.InMemoryKeyStore();
    const privateKey = process.env.NEAR_PRIVATE_KEY || 'ed25519:1234567890123456789012345678901234567890';
    const keyPair = KeyPair.fromString(privateKey);
    
    await keyStore.setKey('testnet', 'cyberpunk.testnet', keyPair);

    const nearConnection = await connect({
      networkId: 'testnet',
      keyStore: keyStore,
      nodeUrl: config.near.testnet.rpcUrl,
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: config.near.testnet.explorer
    });

    const account = await nearConnection.account('cyberpunk.testnet');
    console.log('📡 Connected to NEAR Testnet');
    console.log('👤 Account:', account.accountId);

    // Deploy Intent Contract
    console.log('\n🎯 Deploying Intent Contract...');
    const intentContract = await deployIntentContract(account);
    console.log('✅ Intent Contract deployed');

    // Deploy Agent Contract
    console.log('\n🤖 Deploying Agent Contract...');
    const agentContract = await deployAgentContract(account);
    console.log('✅ Agent Contract deployed');

    // Deploy Bridge Contract
    console.log('\n🌉 Deploying Bridge Contract...');
    const bridgeContract = await deployBridgeContract(account);
    console.log('✅ Bridge Contract deployed');

    console.log('\n🎉 NEAR deployment completed successfully!');
    console.log('\n📋 Contract Addresses:');
    console.log('Intent:', config.near.testnet.contracts.intent);
    console.log('Agent:', config.near.testnet.contracts.agent);
    console.log('Bridge:', config.near.testnet.contracts.bridge);
    console.log('\n🔍 Explorer:', config.near.testnet.explorer);

  } catch (error) {
    console.error('❌ NEAR deployment failed:', error);
    process.exit(1);
  }
}

async function deployIntentContract(account) {
  const intentWasm = fs.readFileSync(path.join(__dirname, '../near_intent_contracts/target/wasm32-unknown-unknown/release/intent_contract.wasm'));
  
  const result = await account.deployContract(intentWasm);
  console.log('Intent contract deployment result:', result);
  
  return result;
}

async function deployAgentContract(account) {
  const agentWasm = fs.readFileSync(path.join(__dirname, '../near_intent_contracts/target/wasm32-unknown-unknown/release/agent_contract.wasm'));
  
  const result = await account.deployContract(agentWasm);
  console.log('Agent contract deployment result:', result);
  
  return result;
}

async function deployBridgeContract(account) {
  const bridgeWasm = fs.readFileSync(path.join(__dirname, '../near_intent_contracts/target/wasm32-unknown-unknown/release/bridge_contract.wasm'));
  
  const result = await account.deployContract(bridgeWasm);
  console.log('Bridge contract deployment result:', result);
  
  return result;
}

// Run deployment if called directly
if (require.main === module) {
  deployToNEARTestnet();
}

module.exports = { deployToNEARTestnet }; 