import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Agent, AgentAction, Drone, DroneMission } from '../types';

export interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<Agent>;
  removeAgent: (id: string) => Promise<void>;
  performAction: (id: string, action: AgentAction) => Promise<Agent>;
  tickAgents: (drones: Drone[], missions: DroneMission[], agents: Agent[]) => void;
}

export function useAgents(): UseAgentsReturn {
  const queryClient = useQueryClient();

  // Fetch agents
  const { data, isLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch('/api/agents');
      const json = await res.json();
      return json.agents;
    },
  });

  // Add agent
  const addMutation = useMutation({
    mutationFn: async (agent: Omit<Agent, 'id'>) => {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      const json = await res.json();
      return json.agent as Agent;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Update agent
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Agent> }) => {
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      return json.agent as Agent;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Remove agent (simulate by setting status to 'offline')
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await updateMutation.mutateAsync({ id, updates: { status: 'offline' } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });

  // Perform action (update lastAction and status)
  const performAction = async (id: string, action: AgentAction) => {
    return updateMutation.mutateAsync({ id, updates: { lastAction: action, status: 'active' } });
  };

  // Autonomous agent AI tick (no-op for now, can be implemented as needed)
  const tickAgents = () => {};

  return {
    agents: data || [],
    isLoading,
    addAgent: (agent) => addMutation.mutateAsync(agent),
    updateAgent: (id, updates) => updateMutation.mutateAsync({ id, updates }),
    removeAgent: (id) => removeMutation.mutateAsync(id),
    performAction,
    tickAgents,
  };
} 