import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { config } from '../config';
import { 
  CyberPunkAvatar, 
  MetaverseWorld, 
  Quest, 
  TradeOffer, 
  MetaverseStats,
  Vector3 
} from '../types';

export interface UseMetaverseReturn {
  // Avatar management
  avatar: CyberPunkAvatar | null;
  isLoadingAvatar: boolean;
  createAvatar: (name: string, appearance: any) => Promise<void>;
  updateAvatar: (updates: Partial<CyberPunkAvatar>) => Promise<void>;
  
  // World state
  world: MetaverseWorld | null;
  isLoadingWorld: boolean;
  moveAvatar: (position: Vector3) => Promise<void>;
  
  // Quests
  quests: Quest[];
  isLoadingQuests: boolean;
  acceptQuest: (questId: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  
  // Trading
  tradeOffers: TradeOffer[];
  isLoadingTrades: boolean;
  createTradeOffer: (items: any[], price: number) => Promise<void>;
  acceptTradeOffer: (offerId: string) => Promise<void>;
  
  // Stats
  stats: MetaverseStats | null;
  isLoadingStats: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useMetaverse(): UseMetaverseReturn {
  const { address, isConnected } = useAccount();
  const [avatar, setAvatar] = useState<CyberPunkAvatar | null>(null);
  const [world, setWorld] = useState<MetaverseWorld | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [stats, setStats] = useState<MetaverseStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingWorld, setIsLoadingWorld] = useState(false);
  const [isLoadingQuests, setIsLoadingQuests] = useState(false);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Initialize default world
  useEffect(() => {
    if (!world) {
      const defaultWorld: MetaverseWorld = {
        id: 'cyberpunk-wildnet',
        name: config.metaverse.name,
        description: 'A dystopian cyberpunk metaverse where technology and humanity collide.',
        size: config.metaverse.worldSize,
        players: [],
        buildings: [],
        spawnPoints: [
          { x: 0, y: 0, z: 0 },
          { x: 100, y: 0, z: 100 },
          { x: -100, y: 0, z: -100 }
        ],
        safeZones: [
          { x: 0, y: 0, z: 0, radius: 50 }
        ],
        dangerZones: [
          { x: 500, y: 0, z: 500, radius: 100 }
        ]
      };
      setWorld(defaultWorld);
    }
  }, [world]);

  // Load avatar when connected
  useEffect(() => {
    if (isConnected && address) {
      loadAvatar();
    }
  }, [isConnected, address]);

  const loadAvatar = async () => {
    if (!address) return;
    
    setIsLoadingAvatar(true);
    try {
      // In a real implementation, this would load from Filecoin/IPFS
      const savedAvatar = localStorage.getItem(`avatar_${address}`);
      if (savedAvatar) {
        setAvatar(JSON.parse(savedAvatar));
      }
    } catch (err) {
      setError('Failed to load avatar');
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const createAvatar = async (name: string, appearance: any) => {
    if (!address) return;
    
    setIsLoadingAvatar(true);
    try {
      const newAvatar: CyberPunkAvatar = {
        id: `${address}_${Date.now()}`,
        name,
        owner: address,
        appearance: {
          skinColor: appearance.skinColor || '#8B4513',
          hairStyle: appearance.hairStyle || 'short',
          hairColor: appearance.hairColor || '#000000',
          eyeColor: appearance.eyeColor || '#00ff41',
          cybernetics: [],
          clothing: []
        },
        stats: {
          health: 100,
          stamina: 100,
          cybernetics: 0,
          reputation: 0,
          level: 1,
          experience: 0
        },
        inventory: [],
        location: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        metadata: {
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };
      
      // Save to localStorage (in real app, save to Filecoin)
      localStorage.setItem(`avatar_${address}`, JSON.stringify(newAvatar));
      setAvatar(newAvatar);
    } catch (err) {
      setError('Failed to create avatar');
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const updateAvatar = async (updates: Partial<CyberPunkAvatar>) => {
    if (!avatar || !address) return;
    
    setIsLoadingAvatar(true);
    try {
      const updatedAvatar = { ...avatar, ...updates };
      localStorage.setItem(`avatar_${address}`, JSON.stringify(updatedAvatar));
      setAvatar(updatedAvatar);
    } catch (err) {
      setError('Failed to update avatar');
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const moveAvatar = async (position: Vector3) => {
    if (!avatar) return;
    
    await updateAvatar({
      ...avatar,
      location: position,
      metadata: {
        ...avatar.metadata,
        lastUpdated: new Date().toISOString()
      }
    });
  };

  const acceptQuest = async (questId: string) => {
    // Implementation for accepting quests
    console.log('Accepting quest:', questId);
  };

  const completeQuest = async (questId: string) => {
    // Implementation for completing quests
    console.log('Completing quest:', questId);
  };

  const createTradeOffer = async (items: any[], price: number) => {
    if (!address) return;
    
    const newOffer: TradeOffer = {
      id: `trade_${Date.now()}`,
      seller: address,
      items,
      price,
      currency: config.metaverse.gameMechanics.currency,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    setTradeOffers(prev => [...prev, newOffer]);
  };

  const acceptTradeOffer = async (offerId: string) => {
    // Implementation for accepting trade offers
    console.log('Accepting trade offer:', offerId);
  };

  const clearError = () => setError(null);

  return {
    avatar,
    isLoadingAvatar,
    createAvatar,
    updateAvatar,
    world,
    isLoadingWorld,
    moveAvatar,
    quests,
    isLoadingQuests,
    acceptQuest,
    completeQuest,
    tradeOffers,
    isLoadingTrades,
    createTradeOffer,
    acceptTradeOffer,
    stats,
    isLoadingStats,
    error,
    clearError
  };
} 