export type AgentRequest = {
  // Define the expected request shape here
  input: string;
  params?: Record<string, any>;
};

export type AgentResponse = {
  // Define the expected response shape here
  result: string;
  data?: any;
  error?: string;
}; 