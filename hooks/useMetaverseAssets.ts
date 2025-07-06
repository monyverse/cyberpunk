import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useFileUpload } from './useFileUpload';
import { config } from '../config';
import { FilecoinAsset, MetaverseStorage } from '../types';

export interface UseMetaverseAssetsReturn {
  // Asset management
  assets: FilecoinAsset[];
  isLoadingAssets: boolean;
  uploadAsset: (file: File, type: string, metadata?: any) => Promise<FilecoinAsset>;
  deleteAsset: (assetId: string) => Promise<void>;
  
  // Storage management
  storage: MetaverseStorage | null;
  isLoadingStorage: boolean;
  
  // Asset categories
  getAssetsByType: (type: string) => FilecoinAsset[];
  getAssetsByOwner: (owner: string) => FilecoinAsset[];
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useMetaverseAssets(): UseMetaverseAssetsReturn {
  const { address, isConnected } = useAccount();
  const { uploadFileMutation } = useFileUpload();
  
  const [assets, setAssets] = useState<FilecoinAsset[]>([]);
  const [storage, setStorage] = useState<MetaverseStorage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);

  // Load assets when connected
  useEffect(() => {
    if (isConnected && address) {
      loadAssets();
      loadStorageStats();
    }
  }, [isConnected, address]);

  const loadAssets = async () => {
    if (!address) return;
    
    setIsLoadingAssets(true);
    try {
      // In a real implementation, this would load from Filecoin/IPFS
      const savedAssets = localStorage.getItem(`assets_${address}`);
      if (savedAssets) {
        setAssets(JSON.parse(savedAssets));
      }
    } catch (err) {
      setError('Failed to load assets');
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const loadStorageStats = async () => {
    if (!address) return;
    
    setIsLoadingStorage(true);
    try {
      const categories: Record<string, number> = {};
      const userAssets = assets.filter(asset => asset.owner === address);
      
      userAssets.forEach(asset => {
        categories[asset.type] = (categories[asset.type] || 0) + asset.size;
      });
      
      const totalUsed = userAssets.reduce((sum, asset) => sum + asset.size, 0);
      
      setStorage({
        totalUsed,
        totalCapacity: config.storageCapacity * 1024 * 1024 * 1024, // Convert GB to bytes
        assets: userAssets,
        categories
      });
    } catch (err) {
      setError('Failed to load storage stats');
    } finally {
      setIsLoadingStorage(false);
    }
  };

  const uploadAsset = async (file: File, type: string, metadata: any = {}): Promise<FilecoinAsset> => {
    if (!address) throw new Error('Wallet not connected');
    
    try {
      // Upload file to Filecoin using existing hook
      const uploadResult = await uploadFileMutation.mutateAsync(file);
      
      const newAsset: FilecoinAsset = {
        id: `asset_${Date.now()}`,
        name: file.name,
        type: type as keyof typeof config.metaverse.assetTypes,
        filecoinCID: uploadResult.rootCid,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        owner: address,
        metadata: {
          ...metadata,
          originalName: file.name,
          mimeType: file.type,
          uploadTimestamp: Date.now()
        },
        accessControl: 'private'
      };
      
      // Save to local storage (in real app, save to Filecoin)
      const updatedAssets = [...assets, newAsset];
      localStorage.setItem(`assets_${address}`, JSON.stringify(updatedAssets));
      setAssets(updatedAssets);
      
      // Update storage stats
      await loadStorageStats();
      
      return newAsset;
    } catch (err) {
      setError('Failed to upload asset');
      throw err;
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!address) return;
    
    try {
      const updatedAssets = assets.filter(asset => asset.id !== assetId);
      localStorage.setItem(`assets_${address}`, JSON.stringify(updatedAssets));
      setAssets(updatedAssets);
      
      // Update storage stats
      await loadStorageStats();
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  const getAssetsByType = (type: string): FilecoinAsset[] => {
    return assets.filter(asset => asset.type === type);
  };

  const getAssetsByOwner = (owner: string): FilecoinAsset[] => {
    return assets.filter(asset => asset.owner === owner);
  };

  const clearError = () => setError(null);

  return {
    assets,
    isLoadingAssets,
    uploadAsset,
    deleteAsset,
    storage,
    isLoadingStorage,
    getAssetsByType,
    getAssetsByOwner,
    error,
    clearError
  };
} 