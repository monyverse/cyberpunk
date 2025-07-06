"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetaverseAssets } from '../hooks/useMetaverseAssets';
import { config } from '../config';
import { FilecoinAsset } from '../types';
import { Upload, Trash2, Eye, Download, FolderOpen } from 'lucide-react';

type AssetType = keyof typeof config.metaverse.assetTypes;

export function MetaverseAssetManager() {
  const { 
    assets, 
    storage, 
    uploadAsset, 
    deleteAsset, 
    getAssetsByType,
    isLoadingAssets,
    error 
  } = useMetaverseAssets();
  
  const [selectedType, setSelectedType] = useState<AssetType>('avatars');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const assetTypes = Object.entries(config.metaverse.assetTypes);
  const filteredAssets = getAssetsByType(selectedType);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      await uploadAsset(selectedFile, selectedType, {
        category: selectedType,
        uploadTimestamp: Date.now()
      });
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'avatars': return '👤';
      case 'buildings': return '🏢';
      case 'vehicles': return '🚗';
      case 'weapons': return '🔫';
      case 'clothing': return '👕';
      case 'textures': return '🎨';
      case 'audio': return '🎵';
      case 'scripts': return '📜';
      default: return '📁';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto p-6 rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${config.metaverse.theme.backgroundColor} 0%, #1a1a1a 100%)`,
        border: `2px solid ${config.metaverse.theme.primaryColor}`,
        boxShadow: `0 0 20px ${config.metaverse.theme.primaryColor}40`
      }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: config.metaverse.theme.primaryColor }}
      >
        METAVERSE ASSET MANAGER
      </motion.h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 rounded bg-red-900/50 border border-red-500 text-red-200"
        >
          {error}
        </motion.div>
      )}

      {/* Storage Stats */}
      {storage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded bg-gray-900/30 border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-3" style={{ color: config.metaverse.theme.textColor }}>
            STORAGE STATISTICS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.primaryColor }}>
                {formatFileSize(storage.totalUsed)}
              </p>
              <p className="text-sm text-gray-400">Used Storage</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.secondaryColor }}>
                {formatFileSize(storage.totalCapacity)}
              </p>
              <p className="text-sm text-gray-400">Total Capacity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.accentColor }}>
                {storage.assets.length}
              </p>
              <p className="text-sm text-gray-400">Total Assets</p>
            </div>
          </div>
          {/* Storage Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(storage.totalUsed / storage.totalCapacity) * 100}%` }}
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  background: `linear-gradient(90deg, ${config.metaverse.theme.primaryColor}, ${config.metaverse.theme.secondaryColor})`
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Asset Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" style={{ color: config.metaverse.theme.textColor }}>
          ASSET CATEGORY
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {assetTypes.map(([key, value]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(key as AssetType)}
              className={`p-3 rounded border-2 transition-all ${
                selectedType === key
                  ? 'border-green-400 bg-green-400/10 shadow-lg shadow-green-400/30'
                  : 'border-gray-600 hover:border-gray-400 bg-gray-900/50'
              }`}
            >
              <div className="text-2xl mb-1">{getAssetIcon(key)}</div>
              <div className="text-sm font-semibold" style={{ color: config.metaverse.theme.textColor }}>
                {value.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">
                {getAssetsByType(key).length} assets
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded bg-gray-900/30 border border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-3" style={{ color: config.metaverse.theme.textColor }}>
          UPLOAD NEW ASSET
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              className="w-full p-3 rounded bg-gray-900/50 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-3 rounded font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${config.metaverse.theme.primaryColor} 0%, ${config.metaverse.theme.secondaryColor} 100%)`,
              color: config.metaverse.theme.backgroundColor
            }}
          >
            <Upload size={20} />
            {uploading ? 'UPLOADING...' : 'UPLOAD TO FILECOIN'}
          </motion.button>
        </div>
        {selectedFile && (
          <div className="mt-3 p-2 rounded bg-gray-800/50 border border-gray-600">
            <p className="text-sm text-gray-300">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </p>
          </div>
        )}
      </motion.div>

      {/* Assets List */}
      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: config.metaverse.theme.textColor }}>
          {selectedType.toUpperCase()} ASSETS ({filteredAssets.length})
        </h3>
        
        {isLoadingAssets ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: config.metaverse.theme.primaryColor }} />
            <p className="mt-2 text-gray-400">Loading assets...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No {selectedType} assets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-4 rounded bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{getAssetIcon(asset.type)}</div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded hover:bg-gray-700 transition-colors"
                        title="View"
                      >
                        <Eye size={16} className="text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Download"
                      >
                        <Download size={16} className="text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteAsset(asset.id)}
                        className="p-1 rounded hover:bg-red-900/50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
                    {asset.name}
                  </h4>
                  
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Size: {formatFileSize(asset.size)}</p>
                    <p>Type: {asset.type}</p>
                    <p>Uploaded: {new Date(asset.uploadedAt).toLocaleDateString()}</p>
                    <p className="font-mono text-xs break-all">CID: {asset.filecoinCID}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
} 