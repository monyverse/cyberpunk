'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Divider, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useAgents } from '@/hooks/useAgents';
import { useMissions } from '@/hooks/useDrones';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DroneMission } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

function groupMissionsByDay(missions: DroneMission[]): { date: string; count: number }[] {
  const counts: Record<string, number> = {};
  missions.forEach((m: DroneMission) => {
    if (m.status === 'completed' && m.endTime) {
      const day = new Date(m.endTime).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

const AnalyticsPage: React.FC = () => {
  const { agents, isLoading: agentsLoading } = useAgents();
  const { missions, isLoading: missionsLoading } = useMissions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get('demo') === '1';
  const [scenario, setScenario] = useState('default');

  const completedMissions = missions.filter(m => m.status === 'completed');
  const activeAgents = agents.filter(a => a.status === 'active');
  const missionCompletionsByDay = groupMissionsByDay(missions);

  const handleSeedDemo = async () => {
    await fetch(`/api/demo-seed?scenario=${scenario}`, { method: 'POST' });
    router.refresh();
  };
  const handleResetDemo = async () => {
    await fetch('/api/demo-seed?reset=1', { method: 'POST' });
    router.refresh();
  };

  return (
    <Box sx={{ p: 4 }}>
      {isDemo && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl size="small">
            <InputLabel>Scenario</InputLabel>
            <Select value={scenario} label="Scenario" onChange={e => setScenario(e.target.value)}>
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="all-completed">All Completed</MenuItem>
              <MenuItem value="all-pending">All Pending</MenuItem>
              <MenuItem value="busy">Busy</MenuItem>
              <MenuItem value="empty">Empty</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={handleSeedDemo}>
            Seed Demo Data
          </Button>
          <Button variant="outlined" color="error" onClick={handleResetDemo}>
            Reset Demo Data
          </Button>
        </Box>
      )}
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Total Agents</Typography>
            <Typography variant="h3" color="primary.main">
              {agentsLoading ? '...' : agents.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Active Agents</Typography>
            <Typography variant="h3" color="success.main">
              {agentsLoading ? '...' : activeAgents.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Total Missions</Typography>
            <Typography variant="h3" color="primary.main">
              {missionsLoading ? '...' : missions.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Completed Missions</Typography>
            <Typography variant="h3" color="info.main">
              {missionsLoading ? '...' : completedMissions.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        Mission Completions Over Time
      </Typography>
      <Paper sx={{ p: 4, minHeight: 300, textAlign: 'center', color: 'text.secondary' }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={missionCompletionsByDay} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
        {missionCompletionsByDay.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No completed missions yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AnalyticsPage; 