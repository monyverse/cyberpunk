#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupAllTestnets() {
  console.log('🚀 Setting up all testnets for CyberPunk Metaverse...\n');

  try {
    // Check environment variables
    console.log('📋 Checking environment variables...');
    const requiredEnvVars = [
      'FILECOIN_PRIVATE_KEY',
      'NEAR_PRIVATE_KEY', 
      'ETHEREUM_PRIVATE_KEY',
      'POLYGON_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
      console.log('\n📝 Please set up your .env.local file with the following variables:');
      console.log('FILECOIN_PRIVATE_KEY=your_filecoin_private_key');
      console.log('NEAR_PRIVATE_KEY=your_near_private_key');
      console.log('ETHEREUM_PRIVATE_KEY=your_ethereum_private_key');
      console.log('POLYGON_PRIVATE_KEY=your_polygon_private_key');
      process.exit(1);
    }

    console.log('✅ All environment variables are set\n');

    // 1. Deploy to Filecoin Calibration
    console.log('🌐 Step 1: Deploying to Filecoin Calibration Testnet...');
    try {
      execSync('npm run deploy:filecoin', { stdio: 'inherit' });
      console.log('✅ Filecoin deployment completed\n');
    } catch (error) {
      console.error('❌ Filecoin deployment failed:', error.message);
      throw error;
    }

    // 2. Deploy to NEAR Testnet
    console.log('🔗 Step 2: Deploying to NEAR Testnet...');
    try {
      execSync('npm run deploy:near', { stdio: 'inherit' });
      console.log('✅ NEAR deployment completed\n');
    } catch (error) {
      console.error('❌ NEAR deployment failed:', error.message);
      throw error;
    }

    // 3. Deploy to Ethereum Sepolia
    console.log('🔷 Step 3: Deploying to Ethereum Sepolia Testnet...');
    try {
      execSync('npm run deploy:ethereum', { stdio: 'inherit' });
      console.log('✅ Ethereum deployment completed\n');
    } catch (error) {
      console.error('❌ Ethereum deployment failed:', error.message);
      throw error;
    }

    // 4. Deploy to Polygon Mumbai
    console.log('🟣 Step 4: Deploying to Polygon Mumbai Testnet...');
    try {
      execSync('npm run deploy:polygon', { stdio: 'inherit' });
      console.log('✅ Polygon deployment completed\n');
    } catch (error) {
      console.error('❌ Polygon deployment failed:', error.message);
      throw error;
    }

    // 5. Verify all contracts
    console.log('🔍 Step 5: Verifying all contracts...');
    try {
      execSync('npm run verify:contracts', { stdio: 'inherit' });
      console.log('✅ Contract verification completed\n');
    } catch (error) {
      console.error('❌ Contract verification failed:', error.message);
      throw error;
    }

    // 6. Test all integrations
    console.log('🧪 Step 6: Testing all integrations...');
    try {
      execSync('npm run test:all', { stdio: 'inherit' });
      console.log('✅ Integration tests completed\n');
    } catch (error) {
      console.error('❌ Integration tests failed:', error.message);
      throw error;
    }

    // 7. Test cross-chain bridges
    console.log('🌉 Step 7: Testing cross-chain bridges...');
    try {
      execSync('npm run test:bridges', { stdio: 'inherit' });
      console.log('✅ Bridge tests completed\n');
    } catch (error) {
      console.error('❌ Bridge tests failed:', error.message);
      throw error;
    }

    // 8. Generate deployment report
    console.log('📊 Step 8: Generating deployment report...');
    generateDeploymentReport();

    console.log('🎉 All testnets setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Test the integrations in the browser');
    console.log('3. Record demo videos using the demo script');
    console.log('4. Prepare for hackathon presentation');

  } catch (error) {
    console.error('❌ Testnet setup failed:', error.message);
    process.exit(1);
  }
}

function generateDeploymentReport() {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/testnet-config.json'), 'utf8'));
    
    const report = {
      timestamp: new Date().toISOString(),
      status: 'success',
      deployments: {
        filecoin: {
          network: 'Calibration Testnet',
          contracts: config.filecoin.calibration.contracts,
          explorer: config.filecoin.calibration.explorer,
          faucet: config.filecoin.calibration.faucet
        },
        near: {
          network: 'Testnet',
          contracts: config.near.testnet.contracts,
          explorer: config.near.testnet.explorer,
          faucet: config.near.testnet.faucet
        },
        ethereum: {
          network: 'Sepolia Testnet',
          contracts: config.ethereum.sepolia.contracts,
          explorer: config.ethereum.sepolia.explorer,
          faucet: config.ethereum.sepolia.faucet
        },
        polygon: {
          network: 'Mumbai Testnet',
          contracts: config.polygon.mumbai.contracts,
          explorer: config.polygon.mumbai.explorer,
          faucet: config.polygon.mumbai.faucet
        }
      },
      sponsorIntegrations: [
        'Filecoin Foundation - FVM + Programmable Storage',
        'NEAR Foundation - AI Agents + Cross-chain',
        'WeatherXM - Real-time Weather Data',
        'Mosaia - AI Agent Tooling',
        'Nouns - ENS + IPFS Deployment',
        'Bio AI - DID + GDPR Compliance',
        'Reppo - MCP Solver Nodes',
        'Spexi - Aerial Imagery Analysis'
      ],
      totalPrizeValue: '$140,000+'
    };

    fs.writeFileSync(
      path.join(__dirname, '../deploy/deployment-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('📄 Deployment report generated: deploy/deployment-report.json');
  } catch (error) {
    console.error('❌ Failed to generate deployment report:', error.message);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupAllTestnets();
}

module.exports = { setupAllTestnets }; 