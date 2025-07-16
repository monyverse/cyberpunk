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
  Alert,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Psychology as AIIcon,
  GitHub as GitHubIcon,
  Code as CodeIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAgents } from '../../hooks/useAgents';

interface Tool {
  id: number;
  name: string;
  type: string;
  status: string;
  timestamp: string;
  githubRepo: string;
  mcpNodes: number;
}

const AIToolingPage: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [toolType, setToolType] = useState('weather_tool');
  const [isCreating, setIsCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [createdTools, setCreatedTools] = useState<Tool[]>([]);

  const { addMosaiaAgent } = useAgents();

  const toolTypes = [
    { value: 'weather_tool', label: 'Weather Analysis Tool' },
    { value: 'defi_tool', label: 'DeFi Integration Tool' },
    { value: 'bridge_tool', label: 'Cross-Chain Bridge Tool' },
    { value: 'data_tool', label: 'Data Processing Tool' }
  ];

  const handleCreateTool = async () => {
    if (!agentName) {
      alert('Please enter a tool name');
      return;
    }

    setIsCreating(true);
    setCreateProgress(0);

    try {
      // Simulate tool creation progress
      const interval = setInterval(() => {
        setCreateProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Add Mosaia agent for AI tooling
      await addMosaiaAgent({
        name: agentName,
        type: 'offchain',
        status: 'active',
        location: { x: 0, y: 0, z: 0 },
        metadata: {
          toolType,
          githubRepo: `https://github.com/mosaia/${agentName}`,
          mcpNodes: 3,
          capabilities: ['ai_processing', 'github_integration', 'mcp_solver']
        }
      });

      // Add to created tools
      const newTool: Tool = {
        id: Date.now(),
        name: agentName,
        type: toolType,
        status: 'active',
        timestamp: new Date().toISOString(),
        githubRepo: `https://github.com/mosaia/${agentName}`,
        mcpNodes: 3
      };

      setCreatedTools(prev => [newTool, ...prev]);

      setTimeout(() => {
        setIsCreating(false);
        setCreateProgress(0);
        setAgentName('');
        alert('AI tool created successfully with GitHub integration!');
      }, 2000);

    } catch (error) {
      console.error('Tool creation failed:', error);
      setIsCreating(false);
      setCreateProgress(0);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        🤖 AI Tooling Platform
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Advanced AI capabilities with GitHub integration and MCP solver nodes for intelligent processing.
      </Typography>

      <Grid container spacing={4}>
        {/* Tool Creation */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AIIcon sx={{ fontSize: 40, color: 'purple', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Create AI Tool
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Tool Name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="weather_analyzer"
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Tool Type</InputLabel>
                  <Select
                    value={toolType}
                    onChange={(e) => setToolType(e.target.value)}
                    label="Tool Type"
                  >
                    {toolTypes.map(tool => (
                      <MenuItem key={tool.value} value={tool.value}>
                        {tool.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {isCreating && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Creating AI tool... {createProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={createProgress} />
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={handleCreateTool}
                  disabled={isCreating || !agentName}
                  fullWidth
                  sx={{ mb: 2 }}
                  color="secondary"
                >
                  {isCreating ? 'Creating...' : 'Create AI Tool'}
                </Button>

                <Alert severity="info">
                  Tools are automatically integrated with GitHub and MCP solver nodes.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* Tool Management */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <GitHubIcon sx={{ fontSize: 40, color: 'purple', mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Tool Management
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'purple.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="purple">
                        {createdTools.length}
                      </Typography>
                      <Typography variant="body2">
                        Active Tools
                      </Typography>
                    </Box>
                  </Grid>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="h4" color="success.main">
                        12
                      </Typography>
                      <Typography variant="body2">
                        MCP Nodes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Recent Tools
                </Typography>
                
                {createdTools.slice(0, 5).map((tool) => (
                  <Box key={tool.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {tool.name}
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Type: {tool.type.replace('_', ' ')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MCP Nodes: {tool.mcpNodes} | GitHub: {tool.githubRepo}
                    </Typography>
                  </Box>
                ))}
                
                {createdTools.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No tools created yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* AI Capabilities */}
        <Box>
          {/* @ts-expect-error MUI v7 Grid type error workaround */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  AI Capabilities & Features
                </Typography>
                
                <Grid container spacing={2}>
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        GitHub Integration
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Automatic repository creation and code management
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        MCP Solver Nodes
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Distributed problem-solving across multiple nodes
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Intelligent Processing
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Advanced AI algorithms for data analysis
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Grid>
                  
                  {/* @ts-expect-error MUI v7 Grid type error workaround */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        RFD Processing
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Real-time data processing and analysis
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default AIToolingPage; 