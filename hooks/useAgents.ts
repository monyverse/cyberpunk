import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentAction, Drone, DroneMission } from '../types';

export interface UseAgentsReturn {
  agents: Agent[];
  addAgent: (agent: Omit<Agent, 'id'>) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  performAction: (id: string, action: AgentAction) => void;
  tickAgents: (drones: Drone[], missions: DroneMission[], agents: Agent[]) => void;
}

const AGENTS_KEY = 'metaverse_agents';

export function useAgents(): UseAgentsReturn {
  const [agents, setAgents] = useState<Agent[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAgents = localStorage.getItem(AGENTS_KEY);
    if (savedAgents) setAgents(JSON.parse(savedAgents));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
  }, [agents]);

  const addAgent = (agent: Omit<Agent, 'id'>): Agent => {
    const newAgent: Agent = {
      ...agent,
      id: `agent_${Date.now()}`,
      strategy: agent.strategy || 'default',
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const performAction = (id: string, action: AgentAction) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, lastAction: action, status: 'active' } : a));
  };

  // Autonomous agent AI tick
  const tickAgents = useCallback((drones: Drone[], missions: DroneMission[], agentsList: Agent[]) => {
    setAgents(prevAgents => prevAgents.map(agent => {
      // Only act if agent is idle
      if (agent.status !== 'idle') return agent;
      // Example strategies
      if (agent.strategy === 'trader') {
        // Try to trade with another agent
        const other = agentsList.find(a => a.id !== agent.id);
        if (other) {
          return {
            ...agent,
            lastAction: {
              type: 'trade',
              targetId: other.id,
              timestamp: new Date().toISOString(),
              details: { offer: 'Trade offer details' },
            },
            status: 'active',
            metadata: {
              ...agent.metadata,
              lastTrade: { with: other.id, time: new Date().toISOString() },
            },
          };
        }
      } else if (agent.strategy === 'assigner' || agent.strategy === 'default') {
        // Assign a pending mission to an idle drone
        const mission = missions.find(m => m.status === 'pending');
        const drone = drones.find(d => d.status === 'idle');
        if (mission && drone) {
          return {
            ...agent,
            lastAction: {
              type: 'assign-mission',
              targetId: drone.id,
              timestamp: new Date().toISOString(),
              details: { missionId: mission.id },
            },
            status: 'active',
            metadata: {
              ...agent.metadata,
              lastAssigned: { droneId: drone.id, missionId: mission.id, time: new Date().toISOString() },
            },
          };
        }
      } else if (agent.strategy === 'social') {
        // Interact with another agent
        const other = agentsList.find(a => a.id !== agent.id);
        if (other) {
          return {
            ...agent,
            lastAction: {
              type: 'interact',
              targetId: other.id,
              timestamp: new Date().toISOString(),
              details: { message: `Agent ${agent.name} interacted with ${other.name}` },
            },
            status: 'active',
            metadata: {
              ...agent.metadata,
              lastInteraction: { with: other.id, time: new Date().toISOString() },
            },
          };
        }
      }
      // Default: do nothing
      return agent;
    }));
  }, []);

  return {
    agents,
    addAgent,
    updateAgent,
    removeAgent,
    performAction,
    tickAgents,
  };
} 