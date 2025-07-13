// Filecoin Integration Module for Hackathon
// Integrates FVM, USDFC, and Programmable Storage

import { ethers } from 'ethers';

// Filecoin Calibration Testnet Configuration
export const FILECOIN_CONFIG = {
  calibrationTestnet: {
    rpcUrl: 'https://api.calibration.node.glif.io/rpc/v1',
    chainId: 314159,
    contractAddresses: {
      usdfc: '0x2B9d8C5584B05E4B7C8C5E5E5E5E5E5E5E5E5E5E5', // Replace with actual USDFC contract
      storageManager: '0x3B9d8C5584B05E4B7C8C5E5E5E5E5E5E5E5E5E5E5', // Replace with actual contract
    }
  }
};

// USDFC Integration for payments
export class USDFCIntegration {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async getBalance(address: string): Promise<bigint> {
    // Get USDFC balance
    const contract = new ethers.Contract(
      FILECOIN_CONFIG.calibrationTestnet.contractAddresses.usdfc,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    return await contract.balanceOf(address);
  }

  async payForStorage(amount: bigint, storageId: string): Promise<string> {
    // Pay for storage using USDFC
    const contract = new ethers.Contract(
      FILECOIN_CONFIG.calibrationTestnet.contractAddresses.usdfc,
      ['function transfer(address,uint256) returns (bool)'],
      this.signer
    );
    
    const tx = await contract.transfer(
      FILECOIN_CONFIG.calibrationTestnet.contractAddresses.storageManager,
      amount
    );
    return tx.hash;
  }
}

// Programmable Storage Integration
export class ProgrammableStorage {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async storeData(data: any, paymentAmount: bigint): Promise<{cid: string, txHash: string}> {
    try {
      // 1. Upload data to IPFS
      const response = await fetch('/api/filecoin/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to store data on IPFS');
      }
      
      const result = await response.json();
      const cid = result.cid;

      // 2. Pay for storage using USDFC
      const usdfc = new USDFCIntegration(this.provider, this.signer);
      const txHash = await usdfc.payForStorage(paymentAmount, cid);

      return { cid, txHash };
    } catch (error) {
      console.error('Error in programmable storage:', error);
      throw error;
    }
  }

  async retrieveData(cid: string): Promise<any> {
    try {
      const response = await fetch(`/api/filecoin/store?cid=${cid}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }
}

// FVM Smart Contract Integration
export class FVMSmartContracts {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async deployStorageContract(): Promise<string> {
    // Deploy a custom storage contract on FVM
    const contractABI = [
      'function storeData(string cid, uint256 price) public',
      'function retrieveData(string cid) public view returns (bytes memory)',
      'function getStoragePrice(string cid) public view returns (uint256)'
    ];
    
    const contractBytecode = '0x...'; // Replace with actual bytecode
    
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, this.signer);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    
    return await contract.getAddress();
  }

  async storeDataOnChain(cid: string, price: bigint): Promise<string> {
    // Store data reference on FVM
    const contract = new ethers.Contract(
      FILECOIN_CONFIG.calibrationTestnet.contractAddresses.storageManager,
      ['function storeData(string,uint256)'],
      this.signer
    );
    
    const tx = await contract.storeData(cid, price);
    return tx.hash;
  }
}

// Cross-chain Bridge Integration
export class CrossChainBridge {
  async bridgeToEthereum(data: any): Promise<string> {
    // Bridge data to Ethereum for cross-chain functionality
    try {
      const response = await fetch('/api/bridge/ethereum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Bridge failed');
      }
      
      const result = await response.json();
      return result.txHash;
    } catch (error) {
      console.error('Bridge error:', error);
      throw error;
    }
  }

  async bridgeToPolygon(data: any): Promise<string> {
    // Bridge data to Polygon
    try {
      const response = await fetch('/api/bridge/polygon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Bridge failed');
      }
      
      const result = await response.json();
      return result.txHash;
    } catch (error) {
      console.error('Bridge error:', error);
      throw error;
    }
  }
}

// Main Filecoin Integration Class
export class FilecoinIntegration {
  private usdfc: USDFCIntegration;
  private storage: ProgrammableStorage;
  private fvm: FVMSmartContracts;
  private bridge: CrossChainBridge;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.usdfc = new USDFCIntegration(provider, signer);
    this.storage = new ProgrammableStorage(provider, signer);
    this.fvm = new FVMSmartContracts(provider, signer);
    this.bridge = new CrossChainBridge();
  }

  async storeAgentData(agentData: any): Promise<{cid: string, txHash: string, bridgeTx?: string}> {
    // Complete Filecoin integration for agent data
    const paymentAmount = ethers.parseEther('0.1'); // 0.1 USDFC
    
    // 1. Store on Filecoin
    const { cid, txHash } = await this.storage.storeData(agentData, paymentAmount);
    
    // 2. Store reference on FVM
    const fvmTx = await this.fvm.storeDataOnChain(cid, paymentAmount);
    
    // 3. Bridge to other chains (optional)
    let bridgeTx;
    try {
      bridgeTx = await this.bridge.bridgeToEthereum({ cid, agentData });
    } catch (error) {
      console.log('Bridge failed, continuing without cross-chain...');
    }
    
    return { cid, txHash: fvmTx, bridgeTx };
  }

  async getUSDFCBalance(address: string): Promise<bigint> {
    return await this.usdfc.getBalance(address);
  }

  async retrieveAgentData(cid: string): Promise<any> {
    return await this.storage.retrieveData(cid);
  }
} 