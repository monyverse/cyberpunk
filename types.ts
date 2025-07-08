export interface Root {
  rootId: number;
  rootCid: string;
  subrootCid: string;
  subrootOffset: number;
}

export interface Provider {
  owner: string;
  pdpUrl: string;
}

export interface ProofSetDetails {
  id: number;
  roots: Root[];
  nextChallengeEpoch: number;
  pdpUrl: string;
}

export interface ProofSet {
  railId: number;
  payer: string;
  payee: string;
  commissionBps: number;
  metadata: string;
  rootMetadata: any[];
  clientDataSetId: number;
  withCDN: boolean;
  pdpVerifierProofSetId: number;
  nextRootId: number;
  currentRootCount: number;
  isLive: boolean;
  isManaged: boolean;
  details: ProofSetDetails | null;
  pdpUrl: string | null;
  provider: Provider | null;
}

export interface ProofSetsResponse {
  proofsets: ProofSet[];
}

/**
 * Interface for formatted balance data returned by useBalances
 */
export interface UseBalancesResponse {
  filBalance: bigint;
  usdfcBalance: bigint;
  pandoraBalance: bigint;
  filBalanceFormatted: number;
  usdfcBalanceFormatted: number;
  pandoraBalanceFormatted: number;
  persistenceDaysLeft: number;
  persistenceDaysLeftAtCurrentRate: number;
  isSufficient: boolean;
  isRateSufficient: boolean;
  isLockupSufficient: boolean;
  rateNeeded: bigint;
  totalLockupNeeded: bigint;
  depositNeeded: bigint;
  currentRateAllowanceGB: number;
  currentStorageGB: number;
  currentLockupAllowance: bigint;
}

export const defaultBalances: UseBalancesResponse = {
  filBalance: 0n,
  usdfcBalance: 0n,
  pandoraBalance: 0n,
  filBalanceFormatted: 0,
  usdfcBalanceFormatted: 0,
  pandoraBalanceFormatted: 0,
  persistenceDaysLeft: 0,
  persistenceDaysLeftAtCurrentRate: 0,
  isSufficient: false,
  isRateSufficient: false,
  isLockupSufficient: false,
  rateNeeded: 0n,
  totalLockupNeeded: 0n,
  depositNeeded: 0n,
  currentRateAllowanceGB: 0,
  currentStorageGB: 0,
  currentLockupAllowance: 0n,
};

/**
 * Interface representing the Pandora balance data returned from the SDK
 */
export interface PandoraBalanceData {
  rateAllowanceNeeded: bigint;
  currentRateUsed: bigint;
  currentRateAllowance: bigint;
  currentLockupAllowance: bigint;
  currentLockupUsed: bigint;
}

/**
 * Interface representing the calculated storage metrics
 */
export interface StorageCalculationResult {
  /** The required rate allowance needed for storage */
  rateNeeded: bigint;
  /** The current rate used */
  rateUsed: bigint;
  /** The current storage usage in bytes */
  currentStorageBytes: bigint;
  /** The current storage usage in GB */
  currentStorageGB: number;
  /** The required lockup amount needed for storage persistence */
  totalLockupNeeded: bigint;
  /** The additional lockup amount needed for storage persistence */
  depositNeeded: bigint;
  /** Number of days left before lockup expires */
  persistenceDaysLeft: number;
  /** Number of days left before lockup expires at current rate */
  persistenceDaysLeftAtCurrentRate: number;
  /** Whether the current rate allowance is sufficient */
  isRateSufficient: boolean;
  /** Whether the current lockup allowance is sufficient for at least the minimum days threshold */
  isLockupSufficient: boolean;
  /** Whether both rate and lockup allowances are sufficient */
  isSufficient: boolean;
  /** The current rate allowance in GB */
  currentRateAllowanceGB: number;
  /** The current lockup allowance in USDFC */
  currentLockupAllowance: bigint;
}

export interface PaymentActionProps extends SectionProps {
  totalLockupNeeded?: bigint;
  currentLockupAllowance?: bigint;
  rateNeeded?: bigint;
  depositNeeded?: bigint;
  isProcessingPayment: boolean;
  onPayment: (params: {
    lockupAllowance: bigint;
    epochRateAllowance: bigint;
    depositAmount: bigint;
  }) => Promise<void>;
  handleRefetchBalances: () => Promise<void>;
}

export interface StatusMessageProps {
  status?: string;
}

export interface SectionProps {
  balances?: UseBalancesResponse;
  isLoading?: boolean;
}

export interface AllowanceItemProps {
  label: string;
  isSufficient?: boolean;
  isLoading?: boolean;
}

// CyberPunk Metaverse Types
export interface CyberPunkAvatar {
  id: string;
  name: string;
  owner: string;
  appearance: {
    skinColor: string;
    hairStyle: string;
    hairColor: string;
    eyeColor: string;
    cybernetics: Cybernetic[];
    clothing: ClothingItem[];
  };
  stats: {
    health: number;
    stamina: number;
    cybernetics: number;
    reputation: number;
    level: number;
    experience: number;
  };
  inventory: InventoryItem[];
  location: Vector3;
  rotation: Vector3;
  metadata: {
    createdAt: string;
    lastUpdated: string;
    filecoinCID?: string;
  };
}

export interface Cybernetic {
  id: string;
  name: string;
  type: 'neural' | 'ocular' | 'limb' | 'cardiac' | 'respiratory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects: {
    health?: number;
    stamina?: number;
    cybernetics?: number;
    special?: string;
  };
  installed: boolean;
  filecoinCID?: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: 'head' | 'torso' | 'legs' | 'feet' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  style: 'street' | 'corporate' | 'nomad' | 'tech' | 'punk';
  stats: {
    armor?: number;
    style?: number;
    comfort?: number;
  };
  filecoinCID?: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'energy' | 'explosive';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  damage: number;
  range: number;
  fireRate: number;
  accuracy: number;
  ammoType: string;
  filecoinCID?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'motorcycle' | 'hovercraft' | 'drone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    speed: number;
    handling: number;
    armor: number;
    capacity: number;
  };
  filecoinCID?: string;
}

export interface Building {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'entertainment' | 'security';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size: Vector3;
  location: Vector3;
  owner: string;
  filecoinCID?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'clothing' | 'cybernetic' | 'consumable' | 'material' | 'currency';
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  filecoinCID?: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface MetaverseWorld {
  id: string;
  name: string;
  description: string;
  size: Vector3;
  players: CyberPunkAvatar[];
  buildings: Building[];
  spawnPoints: Vector3[];
  safeZones: Vector3[];
  dangerZones: Vector3[];
  filecoinCID?: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  requirements: {
    level: number;
    reputation: number;
    items?: string[];
  };
  rewards: {
    experience: number;
    currency: number;
    items?: InventoryItem[];
    reputation: number;
  };
  objectives: QuestObjective[];
  completed: boolean;
  filecoinCID?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'collect' | 'eliminate' | 'deliver' | 'explore' | 'craft';
  target: string;
  quantity: number;
  completed: boolean;
}

export interface TradeOffer {
  id: string;
  seller: string;
  items: InventoryItem[];
  price: number;
  currency: string;
  expiresAt: string;
  filecoinCID?: string;
}

export interface MetaverseStats {
  totalPlayers: number;
  onlinePlayers: number;
  totalTransactions: number;
  totalStorageUsed: number;
  averageSessionTime: number;
  popularLocations: string[];
  topPlayers: {
    name: string;
    level: number;
    reputation: number;
  }[];
}

// Filecoin Integration Types
export interface FilecoinAsset {
  id: string;
  name: string;
  type: keyof typeof import('./config').config.metaverse.assetTypes;
  filecoinCID: string;
  size: number;
  uploadedAt: string;
  owner: string;
  metadata: Record<string, any>;
  accessControl: 'public' | 'private' | 'restricted';
}

export interface MetaverseStorage {
  totalUsed: number;
  totalCapacity: number;
  assets: FilecoinAsset[];
  categories: Record<string, number>;
}
