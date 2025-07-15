"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Psychology as AgentIcon,
  SwapHoriz as BridgeIcon,
  Info as InfoIcon,
  AccountTree as NEARIcon,
  AutoAwesome as IntentIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

interface Agent {
  id: number;
  name: string;
  type: string;
  capabilities: string[];
  status: string;
  balance: string;
  created: string;
  executions: number;
}

const NEARAgentsPage: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('weather_analyzer');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [intentDialog, setIntentDialog] = useState(false);
  const [intentType, setIntentType] = useState('weather_analysis');
  const [intentParams, setIntentParams] = useState('');
  const [targetChain, setTargetChain] = useState('filecoin');
  const [bridgeDialog, setBridgeDialog] = useState(false);
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [bridgeTarget, setBridgeTarget] = useState('ethereum');

  const { addNEARAgent, addHybridAgent } = useAgents();

  const agentTypes = [
    { value: 'weather_analyzer', label: 'Weather Analyzer' },
    { value: 'risk_assessor', label: 'Risk Assessor' },
    { value: 'data_processor', label: 'Data Processor' },
    { value: 'cross_chain_executor', label: 'Cross-chain Executor' }
  ];

  const capabilityOptions = [
    'weather_data_analysis',
    'risk_assessment',
    'cross_chain_execution',
    'intent_processing',
    'data_fetching',
    'ai_inference'
  ];

  const handleCapabilityToggle = (capability: string) => {
    setCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const handleCreateAgent = async () => {
    if (!agentName || capabilities.length === 0) {
      alert('Please fill in agent name and select capabilities');
      return;
    }

    setIsCreating(true);
    setCreateProgress(0);

    try {
      // Simulate agent creation progress
      const interval = setInterval(() => {
        setCreateProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add NEAR agent
      await addNEARAgent({
        name: agentName,
        type: agentType,
        capabilities,
        metadata: {
          chain: 'near',
          accountId: 'cyberpunk.testnet',
          balance: '10 NEAR'
        }
      });

      // Add to agents list
      const newAgent: Agent = {
        id: Date.now(),
        name: agentName,
        type: agentType,
        capabilities,
        status: 'active',
        balance: '10 NEAR',
        created: new Date().toISOString(),
        executions: 0
      };

      setAgents(prev => [...prev, newAgent]);

      setTimeout(() => {
        setIsCreating(false);
        setCreateProgress(0);
        setAgentName('');
        setCapabilities([]);
        alert('AI Agent created successfully on NEAR!');
      }, 2000);

    } catch (error) {
      console.error('Agent creation failed:', error);
      setIsCreating(false);
      setCreateProgress(0);
    }
  };

  const handleExecuteIntent = async () => {
    if (!selectedAgent || !intentParams) {
      alert('Please select an agent and provide intent parameters');
      return;
    }

    try {
      // Simulate intent execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update agent execution count
      setAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, executions: agent.executions + 1 }
          : agent
      ));

      setIntentDialog(false);
      setIntentParams('');
      alert(`Intent executed successfully! Agent ${selectedAgent.name} processed the request.`);

    } catch (error) {
      console.error('Intent execution failed:', error);
      alert('Intent execution failed. Please try again.');
    }
  };

  const handleBridge = async () => {
    if (!bridgeAmount) {
      alert('Please enter bridge amount');
      return;
    }

    try {
      // Add hybrid agent for cross-chain bridge
      await addHybridAgent({
        name: `NEAR_Bridge_${Date.now()}`,
        type: 'hybrid',
        capabilities: ['near', bridgeTarget, 'bridge'],
        metadata: {
          sourceChain: 'near',
          targetChain: bridgeTarget,
          amount: parseFloat(bridgeAmount)
        }
      });

      setBridgeDialog(false);
      setBridgeAmount('');
      alert(`Bridge transaction initiated from NEAR to ${bridgeTarget}!`);

    } catch (error) {
      console.error('Bridge failed:', error);
      alert('Bridge transaction failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🔗 NEAR AI Agents
        <Chip 
          label="NEAR Foundation - $30,000 Prize" 
          color="success" 
          sx={{ ml: 2 }}
        />
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        AI-driven agents with cross-chain signatures and intent-based execution on NEAR blockchain.
      </Typography>

      <Grid container spacing={4}>
        {/* Agent Creation */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AgentIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Create AI Agent
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Agent Name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="WeatherAnalyzer_001"
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Agent Type</InputLabel>
                  <Select
                    value={agentType}
                    onChange={(e) => setAgentType(e.target.value)}
                    label="Agent Type"
                  >
                    {agentTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle2" gutterBottom>
                  Capabilities
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {capabilityOptions.map(capability => (
                    <Chip
                      key={capability}
                      label={capability.replace(/_/g, ' ')}
                      onClick={() => handleCapabilityToggle(capability)}
                      color={capabilities.includes(capability) ? 'primary' : 'default'}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>

                {isCreating && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Creating agent on NEAR... {createProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={createProgress} />
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={handleCreateAgent}
                  disabled={isCreating || !agentName || capabilities.length === 0}
                  fullWidth
                  sx={{ mb: 2 }}
                  color="success"
                >
                  {isCreating ? 'Creating...' : 'Create AI Agent'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setBridgeDialog(true)}
                  fullWidth
                  startIcon={<BridgeIcon />}
                  color="success"
                >
                  Bridge to Other Chains
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Agent Management */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <NEARIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Agent Management
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="success.main">
                        {agents.length}
                      </Typography>
                      <Typography variant="body2">
                        Active Agents
                      </Typography>
                    </Box>
                  </Grid>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="primary">
                        {agents.reduce((acc, agent) => acc + agent.executions, 0)}
                      </Typography>
                      <Typography variant="body2">
                        Total Executions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Your Agents
                </Typography>
                
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {agents.map((agent) => (
                    <React.Fragment key={agent.id}>
                      <ListItem 
                        button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setIntentDialog(true);
                        }}
                      >
                        <ListItemIcon>
                          <AgentIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={agent.name}
                          secondary={`${agent.type} - ${agent.executions} executions`}
                        />
                        <Chip label="Active" color="success" size="small" />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {agents.length === 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="No agents created yet" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Intent Execution */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <IntentIcon sx={{ mr: 1 }} />
                  Intent-Based Execution
                </Typography>
                
                <Grid container spacing={2}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Weather Analysis
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Analyze weather data and assess risks
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Cross-chain Bridge
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Execute cross-chain transactions
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Data Processing
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Process and analyze large datasets
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Grid>

      {/* Intent Dialog */}
      <Dialog open={intentDialog} onClose={() => setIntentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Execute Intent</DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Agent: {selectedAgent.name} ({selectedAgent.type})
            </Typography>
          )}
          
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Intent Type</InputLabel>
            <Select
              value={intentType}
              onChange={(e) => setIntentType(e.target.value)}
              label="Intent Type"
            >
              <MenuItem value="weather_analysis">Weather Analysis</MenuItem>
              <MenuItem value="risk_assessment">Risk Assessment</MenuItem>
              <MenuItem value="data_processing">Data Processing</MenuItem>
              <MenuItem value="cross_chain_bridge">Cross-chain Bridge</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Target Chain</InputLabel>
            <Select
              value={targetChain}
              onChange={(e) => setTargetChain(e.target.value)}
              label="Target Chain"
            >
              <MenuItem value="filecoin">Filecoin</MenuItem>
              <MenuItem value="ethereum">Ethereum</MenuItem>
              <MenuItem value="polygon">Polygon</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Intent Parameters (JSON)"
            value={intentParams}
            onChange={(e) => setIntentParams(e.target.value)}
            multiline
            rows={3}
            placeholder='{"location": "New York", "timeframe": "24h", "riskThreshold": 0.7}'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIntentDialog(false)}>Cancel</Button>
          <Button onClick={handleExecuteIntent} variant="contained" color="success">
            Execute Intent
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bridge Dialog */}
      <Dialog open={bridgeDialog} onClose={() => setBridgeDialog(false)}>
        <DialogTitle>Bridge from NEAR</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Target Chain</InputLabel>
            <Select
              value={bridgeTarget}
              onChange={(e) => setBridgeTarget(e.target.value)}
              label="Target Chain"
            >
              <MenuItem value="ethereum">Ethereum</MenuItem>
              <MenuItem value="polygon">Polygon</MenuItem>
              <MenuItem value="filecoin">Filecoin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Bridge Amount (NEAR)"
            value={bridgeAmount}
            onChange={(e) => setBridgeAmount(e.target.value)}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBridgeDialog(false)}>Cancel</Button>
          <Button onClick={handleBridge} variant="contained" color="success">
            Bridge Assets
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NEARAgentsPage; 