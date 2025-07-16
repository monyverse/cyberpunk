"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Storage as FilecoinIcon,
  AccountTree as NEARIcon,
  WbSunny as WeatherIcon,
  Psychology as AIIcon,
  SwapHoriz as BridgeIcon,
  Security as SecurityIcon,
  PhotoCamera as AerialIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  AutoAwesome as UltimateIcon
} from '@mui/icons-material';
import { useAgents } from '../hooks/useAgents';
import type { Agent } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const IntegrationsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isCreatingUltimate, setIsCreatingUltimate] = useState(false);
  const [ultimateDialog, setUltimateDialog] = useState(false);
  const [ultimateAgentName, setUltimateAgentName] = useState('');
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);

  const { 
    agents, 
    addFilecoinAgent, 
    addNEARAgent, 
    addWeatherXMAgent, 
    addMosaiaAgent,
    addSecuredFinanceAgent,
    addNounsAgent,
    addBioAIAgent,
    addSpexiAgent,
    addAgentUltimate
  } = useAgents();

  const integrations = [
    {
      id: 'filecoin',
      name: 'Filecoin Foundation',
      icon: <FilecoinIcon />,
      color: '#0090FF',
      prize: '$50,000',
      description: 'FVM + Programmable Storage',
      status: 'active'
    },
    {
      id: 'near',
      name: 'NEAR Foundation',
      icon: <NEARIcon />,
      color: '#00C851',
      prize: '$30,000',
      description: 'AI Agents + Cross-chain',
      status: 'active'
    },
    {
      id: 'weatherxm',
      name: 'WeatherXM',
      icon: <WeatherIcon />,
      color: '#FF6B35',
      prize: '$15,000',
      description: 'Real-time Weather Data',
      status: 'active'
    },
    {
      id: 'mosaia',
      name: 'Mosaia',
      icon: <AIIcon />,
      color: '#9C27B0',
      prize: '$20,000',
      description: 'AI Agent Tooling',
      status: 'active'
    },
    {
      id: 'secured',
      name: 'Secured Finance',
      icon: <BridgeIcon />,
      color: '#FF9800',
      prize: '$10,000',
      description: 'Cross-chain Bridges',
      status: 'active'
    },
    {
      id: 'nouns',
      name: 'Nouns',
      icon: <SecurityIcon />,
      color: '#E91E63',
      prize: '$5,000',
      description: 'ENS + IPFS Deployment',
      status: 'active'
    },
    {
      id: 'bioai',
      name: 'Bio AI',
      icon: <SecurityIcon />,
      color: '#607D8B',
      prize: '$5,000',
      description: 'DID + GDPR Compliance',
      status: 'active'
    },
    {
      id: 'spexi',
      name: 'Spexi',
      icon: <AerialIcon />,
      color: '#4CAF50',
      prize: '$5,000',
      description: 'Aerial Imagery Analysis',
      status: 'active'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const createUltimateAgent = async () => {
    if (!ultimateAgentName) {
      alert('Please enter an agent name');
      return;
    }

    setIsCreatingUltimate(true);
    try {
      // Create ultimate agent that combines all integrations
      await addAgentUltimate({
        name: ultimateAgentName,
        type: 'hybrid', // changed from 'ultimate' to valid AgentType
        status: 'active',
        location: { x: 0, y: 0, z: 0 },
        metadata: {
          integrations: integrations.map(i => i.id),
          totalPrizeValue: '$140,000+',
          timestamp: new Date().toISOString(),
          capabilities: integrations.map(i => i.id)
        }
      });

      setUltimateDialog(false);
      setUltimateAgentName('');
      alert('Ultimate agent created successfully! This agent combines all sponsor technologies.');

    } catch (error) {
      console.error('Ultimate agent creation failed:', error);
      alert('Failed to create ultimate agent. Please try again.');
    } finally {
      setIsCreatingUltimate(false);
    }
  };

  const testIntegration = async (integrationId: string) => {
    try {
      const testAgent: Omit<Agent, 'id'> = {
        name: `Test_${integrationId}_${Date.now()}`,
        type: 'hybrid', // use 'hybrid' for test agents
        status: 'active', // use allowed literal value
        location: { x: 0, y: 0, z: 0 },
        metadata: { test: true, timestamp: new Date().toISOString(), capabilities: [integrationId] }
      };

      switch (integrationId) {
        case 'filecoin':
          await addFilecoinAgent(testAgent);
          break;
        case 'near':
          await addNEARAgent(testAgent);
          break;
        case 'weatherxm':
          await addWeatherXMAgent(testAgent);
          break;
        case 'mosaia':
          await addMosaiaAgent(testAgent);
          break;
        case 'secured':
          await addSecuredFinanceAgent(testAgent);
          break;
        case 'nouns':
          await addNounsAgent(testAgent, 'test.eth');
          break;
        case 'bioai':
          await addBioAIAgent(testAgent);
          break;
        case 'spexi':
          await addSpexiAgent(testAgent, { lat: 40.7128, lng: -74.0060 });
          break;
      }

      setActiveIntegrations(prev => [...prev, integrationId]);
      alert(`${integrationId.toUpperCase()} integration tested successfully!`);

    } catch (error) {
      console.error(`${integrationId} integration test failed:`, error);
      alert(`${integrationId.toUpperCase()} integration test failed. Please try again.`);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🏆 Hackathon Integrations Dashboard
        <Chip 
          label="Total Prize: $140,000+" 
          color="success" 
          sx={{ ml: 2, fontWeight: 'bold' }}
        />
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive integration of all sponsor technologies for maximum hackathon impact.
      </Typography>

      {/* Integration Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {integrations.map((integration) => (
          <Box key={integration.id}>
            {/* @ts-expect-error MUI v7 Grid type error workaround */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: `2px solid ${integration.color}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: integration.color, mr: 2 }}>
                      {integration.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {integration.name}
                      </Typography>
                      <Chip 
                        label={integration.prize} 
                        size="small" 
                        sx={{ 
                          bgcolor: integration.color, 
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {integration.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={activeIntegrations.includes(integration.id) ? 'Active' : 'Ready'} 
                      color={activeIntegrations.includes(integration.id) ? 'success' : 'default'} 
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => testIntegration(integration.id)}
                      sx={{ 
                        borderColor: integration.color,
                        color: integration.color,
                        '&:hover': {
                          borderColor: integration.color,
                          bgcolor: `${integration.color}10`
                        }
                      }}
                    >
                      Test
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Box>
        ))}
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="integration tabs">
          <Tab label="Overview" />
          <Tab label="Active Agents" />
          <Tab label="Cross-Chain Bridge" />
          <Tab label="Ultimate Agent" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Integration Status
                </Typography>
                <List>
                  {integrations.map((integration) => (
                    <ListItem key={integration.id}>
                      <ListItemIcon>
                        {activeIntegrations.includes(integration.id) ? 
                          <CheckIcon color="success" /> : 
                          <InfoIcon color="action" />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={integration.name}
                        secondary={`${integration.description} - ${integration.prize}`}
                      />
                      <Chip 
                        label={activeIntegrations.includes(integration.id) ? 'Active' : 'Ready'} 
                        color={activeIntegrations.includes(integration.id) ? 'success' : 'default'} 
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="primary">
                        {agents.length}
                      </Typography>
                      <Typography variant="body2">
                        Total Agents
                      </Typography>
                    </Box>
                  </Grid>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="success.main">
                        {activeIntegrations.length}
                      </Typography>
                      <Typography variant="body2">
                        Active Integrations
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Active Agents Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Agents ({agents.length})
            </Typography>
            <List>
              {agents.map((agent) => (
                <React.Fragment key={agent.id}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={agent.name}
                      secondary={`Type: ${agent.type} | Capabilities: ${(agent.metadata?.capabilities || []).join(', ') || '-'}`}
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
      </TabPanel>

      {/* Cross-Chain Bridge Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BridgeIcon sx={{ mr: 1 }} />
              Cross-Chain Bridge Status
            </Typography>
            
            <Grid container spacing={2}>
              {/* @ts-expect-error MUI v7 Grid type error workaround */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Filecoin ↔ Ethereum
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bridge Status: Active
                  </Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
              </Grid>
              
              {/* @ts-expect-error MUI v7 Grid type error workaround */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    NEAR ↔ Polygon
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bridge Status: Active
                  </Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
              </Grid>
              
              {/* @ts-expect-error MUI v7 Grid type error workaround */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Multi-Chain Hub
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    All chains connected
                  </Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Ultimate Agent Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <UltimateIcon sx={{ fontSize: 40, color: 'purple', mr: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                Ultimate Agent Creator
              </Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Create an ultimate agent that combines all sponsor technologies for maximum hackathon impact.
            </Alert>
            
            <Button
              variant="contained"
              onClick={() => setUltimateDialog(true)}
              startIcon={<UltimateIcon />}
              sx={{ bgcolor: 'purple', '&:hover': { bgcolor: 'purple.dark' } }}
            >
              Create Ultimate Agent
            </Button>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Integration Status */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Integration Status
        </Typography>
        
        <Grid container spacing={2}>
          {integrations.map((integration) => (
            {/* @ts-expect-error MUI v7 Grid type error workaround */}
            <Grid item xs={12} sm={6} md={4} key={integration.id}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: integration.color, mr: 1 }}>
                      {integration.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {integration.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label="Live" 
                    color="success" 
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Ultimate Agent Dialog */}
      <Dialog open={ultimateDialog} onClose={() => setUltimateDialog(false)}>
        <DialogTitle>Create Ultimate Agent</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This agent will combine all sponsor technologies:
          </Typography>
          <List dense>
            {integrations.map((integration) => (
              <ListItem key={integration.id}>
                <ListItemIcon>
                  {integration.icon}
                </ListItemIcon>
                <ListItemText primary={integration.name} secondary={integration.description} />
              </ListItem>
            ))}
          </List>
          
          <TextField
            fullWidth
            label="Agent Name"
            value={ultimateAgentName}
            onChange={(e) => setUltimateAgentName(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Ultimate_CyberPunk_Agent"
          />
          
          {isCreatingUltimate && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress color="secondary" />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Creating ultimate agent...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUltimateDialog(false)}>Cancel</Button>
          <Button 
            onClick={createUltimateAgent} 
            variant="contained"
            disabled={isCreatingUltimate || !ultimateAgentName}
            sx={{ bgcolor: 'purple' }}
          >
            Create Ultimate Agent
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IntegrationsPage; 