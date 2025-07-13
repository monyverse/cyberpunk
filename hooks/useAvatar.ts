import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AvatarMetadata {
  name: string;
  description: string;
  traits: {
    platform: string;
    style: string;
    createdAt: string;
    [key: string]: any;
  };
}

interface StoredAvatar {
  id: string;
  walletAddress: string;
  avatarUrl: string;
  ipfsHash: string;
  filecoinCid: string;
  metadata: AvatarMetadata;
  storedAt: string;
  nftTokenId?: string;
  nftContractAddress?: string;
}

export function useAvatar() {
  const [avatar, setAvatar] = useState<StoredAvatar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const hasAvatar = !!avatar;

  // Load avatar on mount and when wallet changes
  useEffect(() => {
    if (isConnected && address) {
      loadAvatar();
    } else {
      setAvatar(null);
    }
  }, [isConnected, address]);

  const loadAvatar = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/avatar/${address}`);
      if (response.ok) {
        const data = await response.json();
        setAvatar(data.avatar);
      } else if (response.status === 404) {
        setAvatar(null);
      } else {
        throw new Error('Failed to load avatar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load avatar');
    } finally {
      setLoading(false);
    }
  };

  const storeAvatar = async (avatarUrl: string, metadata: AvatarMetadata): Promise<boolean> => {
    if (!address) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/avatar/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          avatarUrl,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store avatar');
      }

      const data = await response.json();
      setAvatar(data.avatar);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store avatar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (): Promise<boolean> => {
    if (!avatar || !address) {
      setError('No avatar to mint or wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/avatar/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          avatarId: avatar.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mint NFT');
      }

      const data = await response.json();
      setAvatar(prev => prev ? { ...prev, ...data.nft } : null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async (): Promise<boolean> => {
    if (!avatar || !address) {
      setError('No avatar to delete or wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/avatar/${address}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete avatar');
      }

      setAvatar(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete avatar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    avatar,
    loading,
    error,
    hasAvatar,
    storeAvatar,
    mintNFT,
    deleteAvatar,
    loadAvatar,
  };
} 