"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMetaverse } from '../hooks/useMetaverse';
import { config } from '../config';

interface AvatarAppearance {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
}

const skinColors = [
  '#8B4513', '#CD853F', '#DEB887', '#F5DEB3', '#FFE4B5',
  '#FFDAB9', '#FFE4E1', '#F0E68C', '#BDB76B', '#556B2F'
];

const hairStyles = [
  'short', 'long', 'spiky', 'mohawk', 'dreadlocks', 
  'buzzcut', 'undercut', 'fade', 'quiff', 'slicked'
];

const hairColors = [
  '#000000', '#8B4513', '#A0522D', '#CD853F', '#D2691E',
  '#FF4500', '#FF6347', '#FF69B4', '#FF1493', '#8A2BE2',
  '#4B0082', '#0000FF', '#00CED1', '#00FF00', '#FFFF00',
  '#FFD700', '#FFA500', '#FF0000', '#FFFFFF', '#808080'
];

const eyeColors = [
  '#00ff41', '#ff006e', '#ffd700', '#00ffff', '#ff00ff',
  '#0000ff', '#ff4500', '#32cd32', '#ff1493', '#00bfff',
  '#ff6347', '#9370db', '#20b2aa', '#ff69b4', '#00fa9a'
];

export function AvatarCreator() {
  const { createAvatar, isLoadingAvatar, error, clearError } = useMetaverse();
  const [avatarName, setAvatarName] = useState('');
  const [appearance, setAppearance] = useState<AvatarAppearance>({
    skinColor: '#8B4513',
    hairStyle: 'short',
    hairColor: '#000000',
    eyeColor: '#00ff41'
  });

  const handleCreateAvatar = async () => {
    if (!avatarName.trim()) {
      clearError();
      return;
    }
    
    await createAvatar(avatarName, appearance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 rounded-lg"
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
        CREATE YOUR CYBERPUNK AVATAR
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

      <div className="space-y-6">
        {/* Avatar Name */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
            AVATAR NAME
          </label>
          <input
            type="text"
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
            className="w-full p-3 rounded bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
            placeholder="Enter your cyberpunk name..."
            maxLength={20}
          />
        </div>

        {/* Skin Color */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
            SKIN TONE
          </label>
          <div className="grid grid-cols-5 gap-2">
            {skinColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAppearance(prev => ({ ...prev, skinColor: color }))}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  appearance.skinColor === color 
                    ? 'border-green-400 shadow-lg shadow-green-400/50' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Hair Style */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
            HAIR STYLE
          </label>
          <select
            value={appearance.hairStyle}
            onChange={(e) => setAppearance(prev => ({ ...prev, hairStyle: e.target.value }))}
            className="w-full p-3 rounded bg-gray-900/50 border border-gray-600 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
          >
            {hairStyles.map((style) => (
              <option key={style} value={style} className="bg-gray-900">
                {style.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Hair Color */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
            HAIR COLOR
          </label>
          <div className="grid grid-cols-5 gap-2">
            {hairColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAppearance(prev => ({ ...prev, hairColor: color }))}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  appearance.hairColor === color 
                    ? 'border-green-400 shadow-lg shadow-green-400/50' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Eye Color */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: config.metaverse.theme.textColor }}>
            EYE COLOR (CYBERNETIC)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {eyeColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAppearance(prev => ({ ...prev, eyeColor: color }))}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  appearance.eyeColor === color 
                    ? 'border-green-400 shadow-lg shadow-green-400/50' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ 
                  backgroundColor: color,
                  boxShadow: appearance.eyeColor === color ? `0 0 15px ${color}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Avatar Preview */}
        <div className="mt-8 p-4 rounded bg-gray-900/30 border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-center" style={{ color: config.metaverse.theme.textColor }}>
            AVATAR PREVIEW
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              {/* Head */}
              <div 
                className="w-16 h-16 rounded-full border-2"
                style={{ 
                  backgroundColor: appearance.skinColor,
                  borderColor: config.metaverse.theme.primaryColor
                }}
              >
                {/* Eyes */}
                <div className="absolute top-4 left-3 w-3 h-3 rounded-full" style={{ backgroundColor: appearance.eyeColor }} />
                <div className="absolute top-4 right-3 w-3 h-3 rounded-full" style={{ backgroundColor: appearance.eyeColor }} />
              </div>
              {/* Hair */}
              <div 
                className="absolute -top-2 left-0 right-0 h-4 rounded-t-full"
                style={{ backgroundColor: appearance.hairColor }}
              />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: config.metaverse.theme.primaryColor }}>
                {avatarName || 'UNNAMED'}
              </p>
              <p className="text-sm text-gray-400">
                Level 1 • Cyberpunk
              </p>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateAvatar}
          disabled={!avatarName.trim() || isLoadingAvatar}
          className="w-full py-4 px-6 rounded font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${config.metaverse.theme.primaryColor} 0%, ${config.metaverse.theme.secondaryColor} 100%)`,
            color: config.metaverse.theme.backgroundColor,
            boxShadow: `0 0 20px ${config.metaverse.theme.primaryColor}40`
          }}
        >
          {isLoadingAvatar ? 'CREATING AVATAR...' : 'ENTER THE METAVERSE'}
        </motion.button>
      </div>
    </motion.div>
  );
} 