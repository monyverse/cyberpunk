import { useState, useEffect } from 'react';
import { Drone, DroneMission, DroneTelemetry } from '../types';

export interface UseDronesReturn {
  drones: Drone[];
  missions: DroneMission[];
  addDrone: (drone: Omit<Drone, 'id' | 'createdAt' | 'updatedAt'>) => Drone;
  updateDrone: (id: string, updates: Partial<Drone>) => void;
  removeDrone: (id: string) => void;
  addMission: (mission: Omit<DroneMission, 'id' | 'status'>) => DroneMission;
  updateMission: (id: string, updates: Partial<DroneMission>) => void;
  removeMission: (id: string) => void;
  assignMission: (droneId: string, missionId: string) => void;
  updateTelemetry: (droneId: string, telemetry: DroneTelemetry) => void;
}

const DRONES_KEY = 'metaverse_drones';
const MISSIONS_KEY = 'metaverse_drone_missions';

export function useDrones(): UseDronesReturn {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [missions, setMissions] = useState<DroneMission[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDrones = localStorage.getItem(DRONES_KEY);
    if (savedDrones) setDrones(JSON.parse(savedDrones));
    const savedMissions = localStorage.getItem(MISSIONS_KEY);
    if (savedMissions) setMissions(JSON.parse(savedMissions));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(DRONES_KEY, JSON.stringify(drones));
  }, [drones]);
  useEffect(() => {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  }, [missions]);

  const addDrone = (drone: Omit<Drone, 'id' | 'createdAt' | 'updatedAt'>): Drone => {
    const newDrone: Drone = {
      ...drone,
      id: `drone_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDrones(prev => [...prev, newDrone]);
    return newDrone;
  };

  const updateDrone = (id: string, updates: Partial<Drone>) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
  };

  const removeDrone = (id: string) => {
    setDrones(prev => prev.filter(d => d.id !== id));
  };

  const addMission = (mission: Omit<DroneMission, 'id' | 'status'>): DroneMission => {
    const newMission: DroneMission = {
      ...mission,
      id: `mission_${Date.now()}`,
      status: 'pending',
    };
    setMissions(prev => [...prev, newMission]);
    return newMission;
  };

  const updateMission = (id: string, updates: Partial<DroneMission>) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMission = (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const assignMission = (droneId: string, missionId: string) => {
    updateDrone(droneId, { status: 'in-mission', lastMissionId: missionId });
    updateMission(missionId, { status: 'active', startTime: new Date().toISOString() });
  };

  const updateTelemetry = (droneId: string, telemetry: DroneTelemetry) => {
    updateDrone(droneId, { telemetry, location: telemetry.location, battery: telemetry.battery });
  };

  return {
    drones,
    missions,
    addDrone,
    updateDrone,
    removeDrone,
    addMission,
    updateMission,
    removeMission,
    assignMission,
    updateTelemetry,
  };
} 