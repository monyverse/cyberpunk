// Mosaia Integration Module for Hackathon
// Integrates AI agent tooling and GitHub app for enhanced AI capabilities

// Mosaia Configuration
export const MOSAIA_CONFIG = {
  apiUrl: 'https://api.mosaia.ai',
  githubAppUrl: 'https://github.com/apps/mosaia',
  toolDiscoveryUrl: 'https://mosaia.ai/tools',
  endpoints: {
    tools: '/api/v1/tools',
    agents: '/api/v1/agents',
    datasets: '/api/v1/datasets',
    integrations: '/api/v1/integrations'
  }
};

// Mosaia Tool Interface
export interface MosaiaTool {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'transaction' | 'data' | 'voice' | 'custom';
  githubUrl: string;
  version: string;
  isActive: boolean;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    description: string;
  }[];
}

// Mosaia Agent Interface
export interface MosaiaAgent {
  id: string;
  name: string;
  description: string;
  tools: string[]; // Tool IDs
  datasets: string[]; // Dataset IDs
  status: 'active' | 'inactive' | 'training';
  createdAt: string;
  lastUsed: string;
}

// Mosaia Dataset Interface
export interface MosaiaDataset {
  id: string;
  name: string;
  description: string;
  type: 'weather' | 'financial' | 'geospatial' | 'custom';
  size: number;
  records: number;
  lastUpdated: string;
  accessLevel: 'public' | 'private' | 'restricted';
}

// Mosaia Integration Class
export class MosaiaIntegration {
  private apiKey: string;
  private githubToken: string;

  constructor(apiKey?: string, githubToken?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_MOSAIA_API_KEY || '';
    this.githubToken = githubToken || process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';
  }

  // Deploy a tool to Mosaia via GitHub App
  async deployTool(toolConfig: {
    name: string;
    description: string;
    category: string;
    githubRepo: string;
    entryPoint: string;
    parameters: any[];
  }): Promise<{ toolId: string; deploymentUrl: string }> {
    try {
      // 1. Create GitHub repository if needed
      const repoUrl = await this.createGitHubRepo(toolConfig.githubRepo);
      
      // 2. Deploy tool via Mosaia GitHub App
      const response = await fetch(`${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.tools}/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...toolConfig,
          githubUrl: repoUrl,
          autoDeploy: true
        })
      });

      if (!response.ok) {
        throw new Error(`Mosaia deployment failed: ${response.status}`);
      }

      const result = await response.json();
      return {
        toolId: result.toolId,
        deploymentUrl: result.deploymentUrl
      };
    } catch (error) {
      console.error('Error deploying tool to Mosaia:', error);
      // Return mock deployment for demo
      return {
        toolId: `tool_${Date.now()}`,
        deploymentUrl: `https://mosaia.ai/tools/${toolConfig.name}`
      };
    }
  }

  // Create AI Agent with tools
  async createAgent(agentConfig: {
    name: string;
    description: string;
    tools: string[];
    datasets?: string[];
    customPrompt?: string;
  }): Promise<MosaiaAgent> {
    try {
      const response = await fetch(`${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.agents}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentConfig)
      });

      if (!response.ok) {
        throw new Error(`Failed to create agent: ${response.status}`);
      }

      const agent = await response.json();
      return agent;
    } catch (error) {
      console.error('Error creating Mosaia agent:', error);
      return this.getMockAgent(agentConfig);
    }
  }

  // Execute agent with specific task
  async executeAgent(agentId: string, task: {
    query: string;
    context?: any;
    tools?: string[];
  }): Promise<{
    result: any;
    toolsUsed: string[];
    executionTime: number;
  }> {
    try {
      const response = await fetch(`${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.agents}/${agentId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
        throw new Error(`Agent execution failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error executing Mosaia agent:', error);
      return this.getMockExecutionResult(task);
    }
  }

  // Discover available tools
  async discoverTools(category?: string): Promise<MosaiaTool[]> {
    try {
      const url = category 
        ? `${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.tools}?category=${category}`
        : `${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.tools}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.status}`);
      }

      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error('Error discovering tools:', error);
      return this.getMockTools();
    }
  }

  // Upload custom dataset
  async uploadDataset(datasetConfig: {
    name: string;
    description: string;
    type: string;
    data: any[];
    accessLevel: 'public' | 'private' | 'restricted';
  }): Promise<MosaiaDataset> {
    try {
      const response = await fetch(`${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.datasets}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datasetConfig)
      });

      if (!response.ok) {
        throw new Error(`Failed to upload dataset: ${response.status}`);
      }

      const dataset = await response.json();
      return dataset;
    } catch (error) {
      console.error('Error uploading dataset:', error);
      return this.getMockDataset(datasetConfig);
    }
  }

  // Integrate with external platforms
  async integrateWithPlatform(platform: 'slack' | 'discord' | 'notion' | 'airtable', config: any): Promise<{
    integrationId: string;
    webhookUrl: string;
    status: 'active' | 'pending' | 'failed';
  }> {
    try {
      const response = await fetch(`${MOSAIA_CONFIG.apiUrl}${MOSAIA_CONFIG.endpoints.integrations}/${platform}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`Integration failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error integrating with platform:', error);
      return {
        integrationId: `integration_${platform}_${Date.now()}`,
        webhookUrl: `https://mosaia.ai/webhooks/${platform}`,
        status: 'active'
      };
    }
  }

  // Create specialized agents for different use cases
  async createWeatherAgent(): Promise<MosaiaAgent> {
    const weatherTools = await this.discoverTools('weather');
    const weatherDataset = await this.uploadDataset({
      name: 'WeatherXM Integration Dataset',
      description: 'Real-time weather data from WeatherXM network',
      type: 'weather',
      data: [],
      accessLevel: 'public'
    });

    return await this.createAgent({
      name: 'Weather Intelligence Agent',
      description: 'AI agent specialized in weather analysis and predictions',
      tools: weatherTools.map(tool => tool.id),
      datasets: [weatherDataset.id],
      customPrompt: `You are a weather intelligence agent. Analyze weather data and provide insights for insurance, agriculture, and risk management. Use available weather tools and datasets to provide accurate predictions and recommendations.`
    });
  }

  async createDeFiAgent(): Promise<MosaiaAgent> {
    const defiTools = await this.discoverTools('transaction');
    const financialDataset = await this.uploadDataset({
      name: 'DeFi Market Data',
      description: 'Real-time DeFi market data and analytics',
      type: 'financial',
      data: [],
      accessLevel: 'public'
    });

    return await this.createAgent({
      name: 'DeFi Trading Agent',
      description: 'AI agent for DeFi trading and portfolio management',
      tools: defiTools.map(tool => tool.id),
      datasets: [financialDataset.id],
      customPrompt: `You are a DeFi trading agent. Monitor market conditions, execute trades, and manage portfolios across multiple chains. Use available DeFi tools to optimize trading strategies and minimize risks.`
    });
  }

  async createCrossChainAgent(): Promise<MosaiaAgent> {
    const crossChainTools = await this.discoverTools('transaction');
    
    return await this.createAgent({
      name: 'Cross-Chain Bridge Agent',
      description: 'AI agent for cross-chain transactions and bridging',
      tools: crossChainTools.map(tool => tool.id),
      customPrompt: `You are a cross-chain bridge agent. Monitor gas fees, liquidity, and execute optimal cross-chain transactions. Use available bridge tools to ensure efficient and cost-effective transfers.`
    });
  }

  // Private helper methods
  private async createGitHubRepo(repoName: string): Promise<string> {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: 'Mosaia AI Tool',
          private: false,
          auto_init: true
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repo = await response.json();
      return repo.html_url;
    } catch (error) {
      console.error('Error creating GitHub repo:', error);
      return `https://github.com/cyberpunk/${repoName}`;
    }
  }

  // Mock data methods for demo
  private getMockAgent(config: any): MosaiaAgent {
    return {
      id: `agent_${Date.now()}`,
      name: config.name,
      description: config.description,
      tools: config.tools,
      datasets: config.datasets || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
  }

  private getMockExecutionResult(task: any): any {
    return {
      result: {
        answer: `AI analysis for: ${task.query}`,
        confidence: 0.85,
        sources: ['WeatherXM', 'DeFi Protocol', 'Cross-chain Bridge']
      },
      toolsUsed: ['weather_tool', 'defi_tool', 'bridge_tool'],
      executionTime: 2.5
    };
  }

  private getMockTools(): MosaiaTool[] {
    return [
      {
        id: 'weather_tool',
        name: 'WeatherXM Data Tool',
        description: 'Access real-time weather data from WeatherXM network',
        category: 'data',
        githubUrl: 'https://github.com/mosaia/weather-tool',
        version: '1.0.0',
        isActive: true,
        parameters: [
          {
            name: 'location',
            type: 'string',
            required: true,
            description: 'Location coordinates (lat,lng)'
          }
        ]
      },
      {
        id: 'defi_tool',
        name: 'DeFi Transaction Tool',
        description: 'Execute DeFi transactions across multiple chains',
        category: 'transaction',
        githubUrl: 'https://github.com/mosaia/defi-tool',
        version: '1.0.0',
        isActive: true,
        parameters: [
          {
            name: 'chain',
            type: 'string',
            required: true,
            description: 'Target blockchain'
          },
          {
            name: 'action',
            type: 'string',
            required: true,
            description: 'Transaction action (swap, stake, etc.)'
          }
        ]
      },
      {
        id: 'bridge_tool',
        name: 'Cross-Chain Bridge Tool',
        description: 'Bridge assets between different blockchains',
        category: 'transaction',
        githubUrl: 'https://github.com/mosaia/bridge-tool',
        version: '1.0.0',
        isActive: true,
        parameters: [
          {
            name: 'sourceChain',
            type: 'string',
            required: true,
            description: 'Source blockchain'
          },
          {
            name: 'targetChain',
            type: 'string',
            required: true,
            description: 'Target blockchain'
          },
          {
            name: 'amount',
            type: 'number',
            required: true,
            description: 'Amount to bridge'
          }
        ]
      }
    ];
  }

  private getMockDataset(config: any): MosaiaDataset {
    return {
      id: `dataset_${Date.now()}`,
      name: config.name,
      description: config.description,
      type: config.type as any,
      size: config.data.length * 1024, // Mock size
      records: config.data.length,
      lastUpdated: new Date().toISOString(),
      accessLevel: config.accessLevel
    };
  }
}

// Mosaia Tool Factory for specific use cases
export class MosaiaToolFactory {
  private mosaia: MosaiaIntegration;

  constructor() {
    this.mosaia = new MosaiaIntegration();
  }

  // Create weather monitoring tool
  async createWeatherTool(): Promise<string> {
    return await this.mosaia.deployTool({
      name: 'cyberpunk-weather-monitor',
      description: 'Real-time weather monitoring for insurance and risk assessment',
      category: 'data',
      githubRepo: 'cyberpunk-weather-tool',
      entryPoint: 'src/index.js',
      parameters: [
        { name: 'location', type: 'string', required: true, description: 'Location coordinates' },
        { name: 'metrics', type: 'array', required: false, description: 'Weather metrics to monitor' }
      ]
    }).then(result => result.toolId);
  }

  // Create DeFi trading tool
  async createDeFiTool(): Promise<string> {
    return await this.mosaia.deployTool({
      name: 'cyberpunk-defi-trader',
      description: 'Automated DeFi trading across multiple chains',
      category: 'transaction',
      githubRepo: 'cyberpunk-defi-tool',
      entryPoint: 'src/trader.js',
      parameters: [
        { name: 'chain', type: 'string', required: true, description: 'Target blockchain' },
        { name: 'action', type: 'string', required: true, description: 'Trading action' },
        { name: 'amount', type: 'number', required: true, description: 'Transaction amount' }
      ]
    }).then(result => result.toolId);
  }

  // Create cross-chain bridge tool
  async createBridgeTool(): Promise<string> {
    return await this.mosaia.deployTool({
      name: 'cyberpunk-bridge',
      description: 'Cross-chain asset bridging with optimal routing',
      category: 'transaction',
      githubRepo: 'cyberpunk-bridge-tool',
      entryPoint: 'src/bridge.js',
      parameters: [
        { name: 'sourceChain', type: 'string', required: true, description: 'Source blockchain' },
        { name: 'targetChain', type: 'string', required: true, description: 'Target blockchain' },
        { name: 'asset', type: 'string', required: true, description: 'Asset to bridge' },
        { name: 'amount', type: 'number', required: true, description: 'Amount to bridge' }
      ]
    }).then(result => result.toolId);
  }
} 