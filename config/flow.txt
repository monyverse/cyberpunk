import * as fcl from "@onflow/fcl";

// Flow network configuration
export const FLOW_CONFIG = {
  // Testnet configuration
  testnet: {
    accessNode: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    contractAddress: "0xAgentNPC", // Replace with actual deployed contract address
  },
  // Mainnet configuration
  mainnet: {
    accessNode: "https://rest-mainnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/authn",
    contractAddress: "0xAgentNPC", // Replace with actual deployed contract address
  }
};

// Initialize Flow client
export function initializeFlow(network: 'testnet' | 'mainnet' = 'testnet') {
  const config = FLOW_CONFIG[network];
  
  fcl.config({
    "accessNode.api": config.accessNode,
    "discovery.wallet": config.discoveryWallet,
    "discovery.wallet.method": "POP/RPC",
    "fcl.network": network,
  });
  
  return config;
}

// Get current Flow configuration
export function getFlowConfig() {
  const network = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';
  return FLOW_CONFIG[network];
}

// Contract addresses
export const CONTRACT_ADDRESSES = {
  AGENT_NPC: process.env.FLOW_AGENT_NPC_CONTRACT || "0xAgentNPC",
  // Add other contracts as needed
};

// Flow transaction templates
export const FLOW_TRANSACTIONS = {
  CREATE_AGENT: `
    import AgentNPC from ${CONTRACT_ADDRESSES.AGENT_NPC}
    
    transaction(agentName: String, agentType: String) {
      prepare(signer: AuthAccount) {
        let agent <- AgentNPC.createAgent()
        // Store agent metadata in account storage
        signer.account.storage.save(agentName, to: /storage/AgentNames)
        signer.account.storage.save(agentType, to: /storage/AgentTypes)
      }
    }
  `,
  
  ASSIGN_MISSION: `
    import AgentNPC from ${CONTRACT_ADDRESSES.AGENT_NPC}
    
    transaction(drone: Address, missionId: String) {
      prepare(signer: AuthAccount) {
        let agent <- AgentNPC.createAgent()
        agent.assignMission(owner: signer.address, drone: drone, missionId: missionId)
        destroy agent
      }
    }
  `,
  
  INTERACT_WITH_AGENT: `
    import AgentNPC from ${CONTRACT_ADDRESSES.AGENT_NPC}
    
    transaction(target: Address, message: String) {
      prepare(signer: AuthAccount) {
        let agent <- AgentNPC.createAgent()
        agent.interactWith(owner: signer.address, target: target, message: message)
        destroy agent
      }
    }
  `
};

// Flow script templates
export const FLOW_SCRIPTS = {
  GET_AGENT_STATS: `
    import AgentNPC from ${CONTRACT_ADDRESSES.AGENT_NPC}
    
    pub fun main(agentId: UInt64): {String: AnyStruct}? {
      // This would need to be implemented based on your contract structure
      return nil
    }
  `,
  
  GET_TOTAL_AGENTS: `
    import AgentNPC from ${CONTRACT_ADDRESSES.AGENT_NPC}
    
    pub fun main(): UInt64 {
      return AgentNPC.getTotalAgents()
    }
  `
}; 