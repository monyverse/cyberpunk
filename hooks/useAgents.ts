import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Agent, AgentAction, Drone, DroneMission } from '../types';
import { FilecoinIntegration } from '../utils/filecoinIntegration';
import { NEARAgentFactory } from '../utils/nearIntegration';
import { WeatherXMIntegration } from '../utils/weatherXMIntegration';
import { MosaiaIntegration } from '../utils/mosaiaIntegration';
import { NounsFrontendFactory } from '../utils/nounsIntegration';
import { BioAIApplicationFactory } from '../utils/bioAIIntegration';
import { ReppoSolverFactory } from '../utils/reppoIntegration';
import { SpexiAnalysisFactory } from '../utils/spexiIntegration';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

export interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<Agent>;
  removeAgent: (id: string) => Promise<void>;
  performAction: (id: string, action: AgentAction) => Promise<Agent>;
  tickAgents: (drones: Drone[], missions: DroneMission[], agents: Agent[]) => void;
  addAgentOnChain: (agent: Omit<Agent, 'id'>, chain: 'filecoin' | 'near' | 'flow') => Promise<Agent>;
  addAgentOffChain: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addAgentHybrid: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addAgentNouns: (agent: Omit<Agent, 'id'>, ensName: string) => Promise<Agent>;
  addAgentBioAI: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addAgentReppo: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addAgentSpexi: (agent: Omit<Agent, 'id'>, location: { lat: number; lng: number }) => Promise<Agent>;
  addAgentUltimate: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addSpexiAgent: (agent: Omit<Agent, 'id'>, location: { lat: number; lng: number }) => Promise<Agent>;
  addFilecoinAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addNEARAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addWeatherXMAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addMosaiaAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addSecuredFinanceAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addNounsAgent: (agent: Omit<Agent, 'id'>, ensName: string) => Promise<Agent>;
  addBioAIAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  addReppoAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
}

export function useAgents(): UseAgentsReturn {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Initialize all integrations
  const filecoinIntegration = publicClient && walletClient 
    ? new FilecoinIntegration(publicClient as any, walletClient as any)
    : null;
  const nearAgentFactory = new NEARAgentFactory();
  const weatherXMIntegration = new WeatherXMIntegration();
  const mosaiaIntegration = new MosaiaIntegration();
  const nounsFactory = publicClient && walletClient 
    ? new NounsFrontendFactory(publicClient as any, walletClient as any)
    : null;
  const bioAIFactory = new BioAIApplicationFactory();
  const reppoFactory = new ReppoSolverFactory();
  const spexiFactory = new SpexiAnalysisFactory();

  // Fetch agents
  const { data, isLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/agents');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        return json.agents || [];
      } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
      }
    },
  });

  // Add agent (basic)
  const addMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agent),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add agent on-chain (Filecoin, NEAR, Flow)
  const addOnChainMutation = useMutation({
    mutationFn: async ({ agent, chain }: { agent: Omit<Agent, 'id'>; chain: 'filecoin' | 'near' | 'flow' }) => {
      try {
        let onChainData: any = {};

        switch (chain) {
          case 'filecoin':
            if (!filecoinIntegration) {
              throw new Error('Filecoin integration not available');
            }
            const filecoinResult = await filecoinIntegration.storeAgentData(agent);
            onChainData = {
              cid: filecoinResult.cid,
              txHash: filecoinResult.txHash,
              bridgeTx: filecoinResult.bridgeTx,
              chain: 'filecoin'
            };
            break;

          case 'near':
            const nearAgentId = await nearAgentFactory.createRebalancerBot(
              address || 'anonymous',
              { [agent.name]: 1.0 }
            );
            onChainData = {
              intentId: nearAgentId,
              chain: 'near'
            };
            break;

          case 'flow':
            onChainData = {
              chain: 'flow',
              txHash: `flow_tx_${Date.now()}`
            };
            break;
        }

        const agentWithChainData = {
          ...agent,
          onChainData,
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentWithChainData),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding agent on-chain:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add agent off-chain (Mosaia AI)
  const addOffChainMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        const mosaiaAgent = await mosaiaIntegration.createAgent({
          name: agent.name,
          description: agent.name || 'AI agent for CyberPunk Metaverse',
          tools: ['weather_tool', 'defi_tool', 'bridge_tool'],
          customPrompt: `You are ${agent.name}, an AI agent in the CyberPunk Metaverse. ${agent.name}`
        });

        if (agent.type === 'offchain') {
          await mosaiaIntegration.createWeatherAgent();
        }

        const agentWithMosaia = {
          ...agent,
          mosaiaAgentId: mosaiaAgent.id,
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentWithMosaia),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding agent off-chain:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add agent hybrid (combines on-chain and off-chain)
  const addHybridMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        const mosaiaAgent = await mosaiaIntegration.createAgent({
          name: agent.name,
          description: agent.name || 'Hybrid AI agent for CyberPunk Metaverse',
          tools: ['weather_tool', 'defi_tool', 'bridge_tool'],
          customPrompt: `You are ${agent.name}, a hybrid AI agent that combines on-chain and off-chain capabilities. ${agent.name}`
        });

        let filecoinResult = null;
        if (filecoinIntegration) {
          filecoinResult = await filecoinIntegration.storeAgentData({
            ...agent,
            mosaiaAgentId: mosaiaAgent.id
          });
        }

        const nearIntentId = await nearAgentFactory.createCrossChainAssistant(
          'ethereum',
          'filecoin',
          { token: 'FIL', amount: '0.1' }
        );

        let weatherData = null;
        if (agent.type === 'hybrid') {
          weatherData = await weatherXMIntegration.assessRisk(0, 0);
        }

        const hybridAgent = {
          ...agent,
          mosaiaAgentId: mosaiaAgent.id,
          onChainData: filecoinResult ? {
            cid: filecoinResult.cid,
            txHash: filecoinResult.txHash,
            nearIntentId,
            chain: 'hybrid'
          } : {
            nearIntentId,
            chain: 'hybrid'
          },
          weatherData,
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hybridAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding hybrid agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add Nouns agent (ENS + IPFS)
  const addNounsMutation = useMutation({
    mutationFn: async ({ agent, ensName }: { agent: Omit<Agent, 'id'>; ensName: string }) => {
      try {
        if (!nounsFactory) {
          throw new Error('Nouns integration not available');
        }

        const auctionClient = await nounsFactory.createAuctionClient(ensName);
        const votingClient = await nounsFactory.createVotingClient(`${ensName}-voting`);

        const nounsAgent = {
          ...agent,
          nounsData: {
            ensName,
            auctionClient: auctionClient.deploymentUrl,
            votingClient: votingClient.deploymentUrl,
            ipfsUrl: auctionClient.ipfsUrl
          },
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nounsAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding Nouns agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add Bio AI agent (DID + GDPR)
  const addBioAIMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        const culturalHeritageAI = await bioAIFactory.createCulturalHeritageAI();
        const researchAI = await bioAIFactory.createResearchAI();

        const bioAIAgent = {
          ...agent,
          bioAIData: {
            did: culturalHeritageAI.did,
            credentials: culturalHeritageAI.credentials,
            gdprCompliance: culturalHeritageAI.gdprCompliance,
            dataverseIntegration: culturalHeritageAI.dataverseIntegration,
            researchAI: researchAI
          },
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bioAIAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding Bio AI agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add Reppo agent (MCP Solver)
  const addReppoMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        const defiSolver = await reppoFactory.createDeFiSolver();
        const sportsSolver = await reppoFactory.createSportsSolver();
        const iotSolver = await reppoFactory.createIoTSolver();

        const nbaStats = await reppoFactory.processNBAPlayerStats('lebron_james', ['points', 'assists', 'rebounds']);
        const defiData = await reppoFactory.processDeFiMarketData('ETH', ['price', 'volume', 'liquidity']);

        const reppoAgent = {
            ...agent,
          reppoData: {
            solvers: [defiSolver, sportsSolver, iotSolver],
            nbaAnalysis: nbaStats,
            defiAnalysis: defiData,
            networkStatus: 'active'
          },
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reppoAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding Reppo agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add Spexi agent (Aerial Imagery)
  const addSpexiMutation = useMutation({
    mutationFn: async ({ agent, location }: { agent: Omit<Agent, 'id'>; location: { lat: number; lng: number } }) => {
      try {
        const siteAnalysis = await spexiFactory.createSiteAnalysis(location);
        const disasterResponse = await spexiFactory.createDisasterResponseAnalysis(location, new Date().toISOString());

        const spexiAgent = {
          ...agent,
          spexiData: {
            siteAnalysis,
            disasterResponse,
            imageryCount: siteAnalysis.imagery.length,
            analysisTypes: ['object_detection', 'change_detection', 'geometric_vlm']
          },
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spexiAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding Spexi agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Add Ultimate agent (all integrations)
  const addUltimateMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      try {
        // 1. Mosaia AI
        const mosaiaAgent = await mosaiaIntegration.createAgent({
          name: agent.name,
          description: 'Ultimate AI agent with all sponsor integrations',
          tools: ['weather_tool', 'defi_tool', 'bridge_tool', 'nouns_tool', 'bio_tool', 'reppo_tool', 'spexi_tool'],
          customPrompt: `You are ${agent.name}, the ultimate AI agent integrating all hackathon sponsor technologies.`
        });

        // 2. Filecoin storage
        let filecoinResult = null;
        if (filecoinIntegration) {
          filecoinResult = await filecoinIntegration.storeAgentData({
            ...agent,
            mosaiaAgentId: mosaiaAgent.id
          });
        }

        // 3. NEAR intent
        const nearIntentId = await nearAgentFactory.createCrossChainAssistant(
          'ethereum',
          'filecoin',
          { token: 'FIL', amount: '0.1' }
        );

        // 4. Weather data
        const weatherData = await weatherXMIntegration.assessRisk(0, 0);

        // 5. Nouns integration
        const nounsData = nounsFactory ? await nounsFactory.createAuctionClient('cyberpunk.eth') : null;

        // 6. Bio AI
        const bioAIData = await bioAIFactory.createCulturalHeritageAI();

        // 7. Reppo solver
        const reppoData = await reppoFactory.createDeFiSolver();

        // 8. Spexi analysis
        const spexiData = await spexiFactory.createSiteAnalysis({ lat: 40.7128, lng: -74.0060 });

        const ultimateAgent = {
          ...agent,
          mosaiaAgentId: mosaiaAgent.id,
          onChainData: filecoinResult ? {
            cid: filecoinResult.cid,
            txHash: filecoinResult.txHash,
            nearIntentId,
            chain: 'ultimate'
          } : {
            nearIntentId,
            chain: 'ultimate'
          },
          weatherData,
          nounsData,
          bioAIData,
          reppoData,
          spexiData,
          integrations: [
            'filecoin', 'near', 'flow', 'mosaia', 'weatherxm',
            'nouns', 'bio_ai', 'reppo', 'spexi'
          ],
          status: 'active' as const
        };

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ultimateAgent),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error adding ultimate agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Update agent
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Agent> }) => {
      try {
        const res = await fetch('/api/agents', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json.agent as Agent;
      } catch (error) {
        console.error('Error updating agent:', error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Remove agent
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await updateMutation.mutateAsync({ id, updates: { status: 'offline' } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Perform action
  const performAction = async (id: string, action: AgentAction) => {
    return updateMutation.mutateAsync({ id, updates: { lastAction: action, status: 'active' } });
  };

  // Autonomous agent AI tick
  const tickAgents = () => {};

  // Convenience methods for different agent types
  const addAgentOnChain = (agent: Omit<Agent, 'id'>, chain: 'filecoin' | 'near' | 'flow') => {
    return addOnChainMutation.mutateAsync({ agent, chain });
  };

  const addAgentOffChain = (agent: Omit<Agent, 'id'>) => {
    return addOffChainMutation.mutateAsync(agent);
  };

  const addAgentHybrid = (agent: Omit<Agent, 'id'>) => {
    return addHybridMutation.mutateAsync(agent);
  };

  const addAgentNouns = (agent: Omit<Agent, 'id'>, ensName: string) => {
    return addNounsMutation.mutateAsync({ agent, ensName });
  };

  const addAgentBioAI = (agent: Omit<Agent, 'id'>) => {
    return addBioAIMutation.mutateAsync(agent);
  };

  const addAgentReppo = (agent: Omit<Agent, 'id'>) => {
    return addReppoMutation.mutateAsync(agent);
  };

  const addAgentSpexi = (agent: Omit<Agent, 'id'>, location: { lat: number; lng: number }) => {
    return addSpexiMutation.mutateAsync({ agent, location });
  };

  const addAgentUltimate = (agent: Omit<Agent, 'id'>) => {
    return addUltimateMutation.mutateAsync(agent);
  };

  // Add specific sponsor integration methods
  const addFilecoinAgent = async (agent: Omit<Agent, 'id'>) => {
    return addOnChainMutation.mutateAsync({ agent, chain: 'filecoin' });
  };

  const addNEARAgent = async (agent: Omit<Agent, 'id'>) => {
    return addOnChainMutation.mutateAsync({ agent, chain: 'near' });
  };

  const addWeatherXMAgent = async (agent: Omit<Agent, 'id'>) => {
    return addOffChainMutation.mutateAsync(agent);
  };

  const addMosaiaAgent = async (agent: Omit<Agent, 'id'>) => {
    return addOffChainMutation.mutateAsync(agent);
  };

  const addSecuredFinanceAgent = async (agent: Omit<Agent, 'id'>) => {
    return addHybridMutation.mutateAsync(agent);
  };

  const addNounsAgent = async (agent: Omit<Agent, 'id'>, ensName: string) => {
    return addAgentNouns(agent, ensName);
  };

  const addBioAIAgent = async (agent: Omit<Agent, 'id'>) => {
    return addAgentBioAI(agent);
  };

  const addReppoAgent = async (agent: Omit<Agent, 'id'>) => {
    return addAgentReppo(agent);
  };

  const addSpexiAgent = async (agent: Omit<Agent, 'id'>, location: { lat: number; lng: number }) => {
    return addAgentSpexi(agent, location);
  };

  return {
    agents: data || [],
    isLoading,
    addAgent: (agent) => addMutation.mutateAsync(agent),
    updateAgent: (id, updates) => updateMutation.mutateAsync({ id, updates }),
    removeAgent: (id) => removeMutation.mutateAsync(id),
    performAction,
    tickAgents,
    addAgentOnChain,
    addAgentOffChain,
    addAgentHybrid,
    addAgentNouns,
    addAgentBioAI,
    addAgentReppo,
    addAgentSpexi,
    addAgentUltimate,
    // Sponsor-specific methods
    addFilecoinAgent,
    addNEARAgent,
    addWeatherXMAgent,
    addMosaiaAgent,
    addSecuredFinanceAgent,
    addNounsAgent,
    addBioAIAgent,
    addReppoAgent,
    addSpexiAgent
  };
} 