// AI Utilities for Drone Simulation and Agent Behaviors
import { Agent, Drone, DroneMission } from '../types';

// Simple AI pathfinding algorithm
export function calculateOptimalPath(
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  obstacles: Array<{ x: number; y: number; z: number; radius: number }> = []
): Array<{ x: number; y: number; z: number }> {
  // A* pathfinding implementation
  const path: Array<{ x: number; y: number; z: number }> = [];
  
  // Simple direct path for now, can be enhanced with obstacle avoidance
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      z: start.z + (end.z - start.z) * t
    });
  }
  
  return path;
}

// AI-powered mission assignment
export function assignMissionToBestAgent(
  mission: DroneMission,
  agents: Agent[]
): Agent | null {
  if (agents.length === 0) return null;
  
  // Score agents based on their skills and current status
  const scoredAgents = agents
    .filter(agent => agent.status === 'idle' || agent.status === 'active')
    .map(agent => {
      let score = 0;
      
      // Base score from level and experience
      score += (agent.level || 1) * 10;
      score += (agent.experience || 0) * 0.1;
      
      // Bonus for matching strategy
      if (agent.strategy === 'assigner') score += 20;
      if (agent.strategy === 'trader' && mission.type === 'delivery') score += 15;
      if (agent.strategy === 'social' && mission.type === 'surveillance') score += 15;
      
      // Bonus for onchain agents for complex missions
      if (agent.type === 'onchain' && mission.difficulty === 'hard') score += 25;
      
      // Penalty for busy agents
      if (agent.status === 'active') score -= 10;
      
      return { agent, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scoredAgents[0]?.agent || null;
}

// AI behavior tree for autonomous agents
export class AgentBehaviorTree {
  private agent: Agent;
  private drones: Drone[];
  private missions: DroneMission[];
  
  constructor(agent: Agent, drones: Drone[], missions: DroneMission[]) {
    this.agent = agent;
    this.drones = drones;
    this.missions = missions;
  }
  
  // Main decision tree
  public decideAction(): string {
    // Check if agent should assign missions
    if (this.agent.strategy === 'assigner' && this.shouldAssignMission()) {
      return 'assign_mission';
    }
    
    // Check if agent should trade
    if (this.agent.strategy === 'trader' && this.shouldTrade()) {
      return 'trade';
    }
    
    // Check if agent should interact socially
    if (this.agent.strategy === 'social' && this.shouldSocialize()) {
      return 'socialize';
    }
    
    // Default behavior
    return 'patrol';
  }
  
  private shouldAssignMission(): boolean {
    const pendingMissions = this.missions.filter(m => m.status === 'pending');
    const idleDrones = this.drones.filter(d => d.status === 'idle');
    return pendingMissions.length > 0 && idleDrones.length > 0;
  }
  
  private shouldTrade(): boolean {
    // Simple trading logic - trade when there are multiple agents
    return Math.random() < 0.3; // 30% chance to trade
  }
  
  private shouldSocialize(): boolean {
    // Socialize when other agents are nearby
    return Math.random() < 0.4; // 40% chance to socialize
  }
}

// AI-powered drone swarm behavior
export class DroneSwarmAI {
  private _drones: Drone[];
  private _missions: DroneMission[];
  
  constructor(drones: Drone[], missions: DroneMission[]) {
    this._drones = drones;
    this._missions = missions;
  }
  
  // Getters and setters for external access
  get drones(): Drone[] { return this._drones; }
  set drones(value: Drone[]) { this._drones = value; }
  get missions(): DroneMission[] { return this._missions; }
  set missions(value: DroneMission[]) { this._missions = value; }
  
  // Calculate optimal formation for drones
  public calculateFormation(center: { x: number; y: number; z: number }, radius: number = 20): Array<{ x: number; y: number; z: number }> {
    const positions: Array<{ x: number; y: number; z: number }> = [];
    const droneCount = this.drones.length;
    
    for (let i = 0; i < droneCount; i++) {
      const angle = (i / droneCount) * 2 * Math.PI;
      positions.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + 10 + Math.sin(i) * 5, // Varying heights
        z: center.z + Math.sin(angle) * radius
      });
    }
    
    return positions;
  }
  
  // Assign missions to drone swarm
  public assignSwarmMission(mission: DroneMission): Drone[] {
    const availableDrones = this.drones.filter(d => d.status === 'idle');
    const requiredDrones = Math.min(3, availableDrones.length); // Max 3 drones per swarm
    
    return availableDrones.slice(0, requiredDrones);
  }
}

// Machine Learning utilities for behavior prediction
export class MLPredictor {
  private trainingData: Array<{
    input: { agentType: string; missionType: string; difficulty: string };
    output: { success: boolean; time: number; reward: number };
  }> = [];
  
  // Add training data
  public addTrainingData(
    agentType: string,
    missionType: string,
    difficulty: string,
    success: boolean,
    time: number,
    reward: number
  ) {
    this.trainingData.push({
      input: { agentType, missionType, difficulty },
      output: { success, time, reward }
    });
  }
  
  // Predict mission success probability
  public predictSuccess(agentType: string, missionType: string, difficulty: string): number {
    const relevantData = this.trainingData.filter(
      d => d.input.agentType === agentType && 
           d.input.missionType === missionType && 
           d.input.difficulty === difficulty
    );
    
    if (relevantData.length === 0) return 0.5; // Default 50% success rate
    
    const successCount = relevantData.filter(d => d.output.success).length;
    return successCount / relevantData.length;
  }
  
  // Predict mission completion time
  public predictTime(agentType: string, missionType: string, difficulty: string): number {
    const relevantData = this.trainingData.filter(
      d => d.input.agentType === agentType && 
           d.input.missionType === missionType && 
           d.input.difficulty === difficulty
    );
    
    if (relevantData.length === 0) return 300; // Default 5 minutes
    
    const avgTime = relevantData.reduce((sum, d) => sum + d.output.time, 0) / relevantData.length;
    return avgTime;
  }
}

// AI-powered anomaly detection
export function detectAnomalies(
  drones: Drone[],
  agents: Agent[],
  missions: DroneMission[]
): Array<{ type: string; severity: 'low' | 'medium' | 'high'; message: string }> {
  const anomalies: Array<{ type: string; severity: 'low' | 'medium' | 'high'; message: string }> = [];
  
  // Check for low battery drones
  const lowBatteryDrones = drones.filter(d => d.battery < 20);
  if (lowBatteryDrones.length > 0) {
    anomalies.push({
      type: 'low_battery',
      severity: 'medium',
      message: `${lowBatteryDrones.length} drones have low battery (< 20%)`
    });
  }
  
  // Check for stuck missions
  const stuckMissions = missions.filter(m => 
    m.status === 'active' && 
    m.startTime && 
    Date.now() - new Date(m.startTime).getTime() > 300000 // 5 minutes
  );
  if (stuckMissions.length > 0) {
    anomalies.push({
      type: 'stuck_mission',
      severity: 'high',
      message: `${stuckMissions.length} missions appear to be stuck`
    });
  }
  
  // Check for offline agents
  const offlineAgents = agents.filter(a => a.status === 'offline');
  if (offlineAgents.length > agents.length * 0.5) {
    anomalies.push({
      type: 'many_offline_agents',
      severity: 'medium',
      message: `${offlineAgents.length} agents are offline`
    });
  }
  
  return anomalies;
}

// AI-powered optimization suggestions
export function generateOptimizationSuggestions(
  drones: Drone[],
  agents: Agent[],
  missions: DroneMission[]
): Array<{ type: string; suggestion: string; impact: 'low' | 'medium' | 'high' }> {
  const suggestions: Array<{ type: string; suggestion: string; impact: 'low' | 'medium' | 'high' }> = [];
  
  // Analyze mission distribution
  const missionTypes = missions.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (missionTypes.mapping > missionTypes.delivery * 2) {
    suggestions.push({
      type: 'mission_balance',
      suggestion: 'Consider adding more delivery missions to balance workload',
      impact: 'medium'
    });
  }
  
  // Analyze agent utilization
  const activeAgents = agents.filter(a => a.status === 'active');
  const idleAgents = agents.filter(a => a.status === 'idle');
  
  if (idleAgents.length > activeAgents.length) {
    suggestions.push({
      type: 'agent_utilization',
      suggestion: 'Many agents are idle. Consider assigning more missions or adjusting strategies',
      impact: 'high'
    });
  }
  
  // Analyze drone efficiency
  const chargingDrones = drones.filter(d => d.status === 'charging');
  if (chargingDrones.length > drones.length * 0.3) {
    suggestions.push({
      type: 'charging_optimization',
      suggestion: 'Many drones are charging. Consider adding more charging stations or optimizing routes',
      impact: 'medium'
    });
  }
  
  return suggestions;
}

// Export singleton instances
export const mlPredictor = new MLPredictor();
export const droneSwarmAI = new DroneSwarmAI([], []); 