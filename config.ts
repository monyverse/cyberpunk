/*
    Configuration for the CyberPunk Metaverse dApp using Filecoin Synapse.
    This includes storage configuration, metaverse settings, and cyberpunk theme options.
*/

export const config = {
  // Filecoin Storage Configuration
  storageCapacity: 50, // GB, increased for metaverse assets
  persistencePeriod: 365, // days, longer persistence for metaverse data
  minDaysThreshold: 30, // days, threshold for low-balance warnings
  withCDN: true, // Whether to use CDN for faster retrieval
  
  // CyberPunk Metaverse Configuration
  metaverse: {
    name: "CyberPunk WildNet",
    version: "1.0.0",
    maxPlayers: 1000,
    worldSize: {
      width: 10000, // meters
      height: 1000, // meters
      depth: 10000, // meters
    },
    // Asset storage categories
    assetTypes: {
      avatars: "avatars",
      buildings: "buildings", 
      vehicles: "vehicles",
      weapons: "weapons",
      clothing: "clothing",
      textures: "textures",
      audio: "audio",
      scripts: "scripts"
    },
    // Cyberpunk theme settings
    theme: {
      primaryColor: "#00ff41", // Matrix green
      secondaryColor: "#ff006e", // Neon pink
      accentColor: "#ffd700", // Gold
      backgroundColor: "#0a0a0a", // Dark background
      textColor: "#ffffff", // White text
      neonGlow: true,
      particleEffects: true,
      holographicUI: true
    },
    // Game mechanics
    gameMechanics: {
      currency: "CYBER",
      maxInventorySlots: 50,
      tradingEnabled: true,
      pvpEnabled: true,
      questSystem: true,
      craftingSystem: true,
      reputationSystem: true
    }
  }
} satisfies {
  storageCapacity: number;
  persistencePeriod: number;
  minDaysThreshold: number;
  withCDN: boolean;
  metaverse: {
    name: string;
    version: string;
    maxPlayers: number;
    worldSize: {
      width: number;
      height: number;
      depth: number;
    };
    assetTypes: Record<string, string>;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      backgroundColor: string;
      textColor: string;
      neonGlow: boolean;
      particleEffects: boolean;
      holographicUI: boolean;
    };
    gameMechanics: {
      currency: string;
      maxInventorySlots: number;
      tradingEnabled: boolean;
      pvpEnabled: boolean;
      questSystem: boolean;
      craftingSystem: boolean;
      reputationSystem: boolean;
    };
  };
};
