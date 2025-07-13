// NEAR Integration Module for Hackathon
// Implements AI-driven agent with cross-chain signatures and intent-based execution

import { connect, keyStores, KeyPair, WalletConnection, Contract } from 'near-api-js';

// NEAR Configuration
export const NEAR_CONFIG = {
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  },
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  }
};

// Intent Definition Interface
export interface AgentIntent {
  id: string;
  type: 'rebalance' | 'trade' | 'monitor' | 'execute';
  targetChain: 'ethereum' | 'polygon' | 'filecoin' | 'flow';
  parameters: {
    action: string;
    target: string;
    amount?: string;
    conditions?: any;
  };
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: number;
  crossChainSignature?: string;
}

// NEAR Agent Contract Interface
export interface NEARAgentContract {
  create_intent: (intent: AgentIntent) => Promise<void>;
  execute_intent: (args: { intent_id: string }) => Promise<void>;
  get_intent: (args: { intent_id: string }) => Promise<AgentIntent>;
  get_user_intents: (args: { account_id: string }) => Promise<AgentIntent[]>;
  cross_chain_execute: (args: { intent_id: string; signature: string }) => Promise<void>;
}

// NEAR Integration Class
export class NEARIntegration {
  private near: any;
  private walletConnection!: WalletConnection;
  private account: any;
  private agentContract!: Contract & NEARAgentContract;

  constructor() {
    this.initializeNEAR();
  }

  private async initializeNEAR() {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    
    this.near = await connect({
      keyStore,
      headers: {},
      ...NEAR_CONFIG.testnet // Use testnet for hackathon
    });

    this.walletConnection = new WalletConnection(this.near, 'cyberpunk-metaverse');
  }

  async connectWallet(): Promise<string | null> {
    if (!this.walletConnection.isSignedIn()) {
      await this.walletConnection.requestSignIn();
    }
    
    if (this.walletConnection.isSignedIn()) {
      this.account = this.walletConnection.account();
      return this.account.accountId;
    }
    
    return null;
  }

  async disconnectWallet(): Promise<void> {
    this.walletConnection.signOut();
  }

  async initializeAgentContract(contractId: string): Promise<void> {
    if (!this.account) {
      throw new Error('Wallet not connected');
    }

    this.agentContract = new Contract(
      this.account,
      contractId,
      {
        viewMethods: ['get_intent', 'get_user_intents'],
        changeMethods: ['create_intent', 'execute_intent', 'cross_chain_execute'],
      }
    ) as Contract & NEARAgentContract;
  }

  // Create a new agent intent
  async createIntent(intent: Omit<AgentIntent, 'id' | 'status' | 'timestamp'>): Promise<string> {
    if (!this.agentContract) {
      throw new Error('Agent contract not initialized');
    }

    const intentWithMetadata: AgentIntent = {
      ...intent,
      id: `intent_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'pending',
      timestamp: Date.now(),
    };

    await this.agentContract.create_intent(intentWithMetadata);
    return intentWithMetadata.id;
  }

  // Execute an intent (AI-driven decision)
  async executeIntent(intentId: string): Promise<void> {
    if (!this.agentContract) {
      throw new Error('Agent contract not initialized');
    }

    await this.agentContract.execute_intent({ intent_id: intentId });
  }

  // Get intent details
  async getIntent(intentId: string): Promise<AgentIntent> {
    if (!this.agentContract) {
      throw new Error('Agent contract not initialized');
    }

    return await this.agentContract.get_intent({ intent_id: intentId });
  }

  // Get all user intents
  async getUserIntents(accountId: string): Promise<AgentIntent[]> {
    if (!this.agentContract) {
      throw new Error('Agent contract not initialized');
    }

    return await this.agentContract.get_user_intents({ account_id: accountId });
  }

  // Cross-chain execution with signature
  async crossChainExecute(intentId: string, signature: string): Promise<void> {
    if (!this.agentContract) {
      throw new Error('Agent contract not initialized');
    }

    await this.agentContract.cross_chain_execute({
      intent_id: intentId,
      signature: signature
    });
  }

  // AI Agent Logic for Intent Execution
  async processIntentWithAI(intent: AgentIntent): Promise<boolean> {
    try {
      // Simulate AI decision making
      const shouldExecute = await this.aiDecisionEngine(intent);
      
      if (shouldExecute) {
        await this.executeIntent(intent.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('AI intent processing failed:', error);
      return false;
    }
  }

  // AI Decision Engine (simplified for demo)
  private async aiDecisionEngine(intent: AgentIntent): Promise<boolean> {
    // Simulate AI analysis
    const marketConditions = await this.getMarketConditions(intent.targetChain);
    const riskAssessment = await this.assessRisk(intent);
    
    // Simple decision logic (replace with actual AI)
    return marketConditions.favorable && riskAssessment.acceptable;
  }

  private async getMarketConditions(chain: string): Promise<{favorable: boolean}> {
    // Simulate market data analysis
    return { favorable: Math.random() > 0.3 };
  }

  private async assessRisk(intent: AgentIntent): Promise<{acceptable: boolean}> {
    // Simulate risk assessment
    return { acceptable: Math.random() > 0.2 };
  }

  // Portfolio Rebalancing Agent
  async createRebalancingIntent(
    targetChain: string,
    targetAllocation: { [token: string]: number }
  ): Promise<string> {
    const intent: Omit<AgentIntent, 'id' | 'status' | 'timestamp'> = {
      type: 'rebalance',
      targetChain: targetChain as any,
      parameters: {
        action: 'rebalance_portfolio',
        target: JSON.stringify(targetAllocation),
        conditions: {
          threshold: 0.05, // 5% deviation threshold
          maxSlippage: 0.02 // 2% max slippage
        }
      }
    };

    return await this.createIntent(intent);
  }

  // Cross-chain Trading Agent
  async createTradingIntent(
    sourceChain: string,
    targetChain: string,
    token: string,
    amount: string
  ): Promise<string> {
    const intent: Omit<AgentIntent, 'id' | 'status' | 'timestamp'> = {
      type: 'trade',
      targetChain: targetChain as any,
      parameters: {
        action: 'cross_chain_trade',
        target: token,
        amount: amount,
        conditions: {
          minPrice: '0', // Will be set by AI
          maxPrice: '999999', // Will be set by AI
          deadline: Date.now() + 3600000 // 1 hour
        }
      }
    };

    return await this.createIntent(intent);
  }

  // Memory Agent (learns user preferences)
  async createMemoryAgentIntent(
    action: string,
    context: any
  ): Promise<string> {
    const intent: Omit<AgentIntent, 'id' | 'status' | 'timestamp'> = {
      type: 'monitor',
      targetChain: 'ethereum' as any,
      parameters: {
        action: 'update_user_preferences',
        target: action,
        conditions: {
          context: JSON.stringify(context),
          learningRate: 0.1
        }
      }
    };

    return await this.createIntent(intent);
  }
}

// NEAR Agent Factory
export class NEARAgentFactory {
  private nearIntegration: NEARIntegration;

  constructor() {
    this.nearIntegration = new NEARIntegration();
  }

  async createRebalancerBot(
    accountId: string,
    portfolioRules: any
  ): Promise<string> {
    await this.nearIntegration.connectWallet();
    await this.nearIntegration.initializeAgentContract('agent.cyberpunk.testnet');
    
    return await this.nearIntegration.createRebalancingIntent(
      'ethereum',
      portfolioRules
    );
  }

  async createMemoryAgent(
    accountId: string,
    learningPreferences: any
  ): Promise<string> {
    await this.nearIntegration.connectWallet();
    await this.nearIntegration.initializeAgentContract('agent.cyberpunk.testnet');
    
    return await this.nearIntegration.createMemoryAgentIntent(
      'learn_preferences',
      learningPreferences
    );
  }

  async createCrossChainAssistant(
    sourceChain: string,
    targetChain: string,
    monitoringParams: any
  ): Promise<string> {
    await this.nearIntegration.connectWallet();
    await this.nearIntegration.initializeAgentContract('agent.cyberpunk.testnet');
    
    return await this.nearIntegration.createTradingIntent(
      sourceChain,
      targetChain,
      monitoringParams.token,
      monitoringParams.amount
    );
  }
} 