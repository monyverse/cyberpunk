"use client";
import Image from 'next/image';
import { StorageManager } from "../components/StorageManager";
import { useAccount } from "wagmi";
import { useState } from "react";
import { FileUploader } from "../components/FileUploader";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";
import { ViewProofSets } from "@/components/ViewProofSets";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalances } from "@/hooks/useBalances";
import { AvatarCreator } from "@/components/AvatarCreator";
import { MetaverseAssetManager } from "@/components/MetaverseAssetManager";
import { useMetaverse } from "@/hooks/useMetaverse";
import { config } from "@/config";
import { Zap, Users, Globe, Database, Gamepad2 } from "lucide-react";
import DroneSimDashboard from "../components/DroneSimDashboard";

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { showConfetti } = useConfetti();
  const { data: balances, isLoading: isLoadingBalances } = useBalances();
  const { avatar } = useMetaverse();

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-[#1a2236] border-r border-[#232c43] p-4 gap-6">
        <nav className="flex flex-col gap-3 mt-4">
          <button className={`btn w-full ${activeTab === 'dashboard' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`btn w-full ${activeTab === 'metaverse' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('metaverse')}>Assets</button>
          <button className={`btn w-full ${activeTab === 'avatar' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('avatar')}>Avatar</button>
          <button className={`btn w-full ${activeTab === 'storage' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('storage')}>Storage</button>
          <button className={`btn w-full ${activeTab === 'proof-set' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('proof-set')}>Proof Sets</button>
          <button className={`btn w-full ${activeTab === 'drone-sim' ? 'bg-[#bdb89c] text-[#232c43]' : ''}`} onClick={() => setActiveTab('drone-sim')}>Drone Sim</button>
        </nav>
        <div className="mt-auto">
          <ConnectButton />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-[#181e2a] flex flex-col items-center justify-start">
        {showConfetti && (
          <Confetti
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        )}
        <div className="flex flex-col items-center w-full gap-6">
          {/* Dashboard Card */}
          {activeTab === 'dashboard' && (
            <div
              className="relative w-full max-w-5xl mx-auto mb-8 rounded-2xl shadow-xl overflow-hidden"
              style={{
                backgroundImage: "url('/hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 flex flex-col items-center md:items-start">
                  <h1 className="text-5xl font-extrabold tracking-widest text-[#6ec1c8] uppercase mb-2 text-center md:text-left">CYBER<span className="text-[#bdb89c]">PUNK</span> METAVERSE</h1>
                  <p className="text-lg text-[#bdb89c] mb-4 text-center md:text-left">A dystopian cyberpunk metaverse powered by Filecoin Synapse and USDFC.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 w-full">
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#6ec1c8' }} />
                      <p className="text-2xl font-bold" style={{ color: '#6ec1c8' }}>{config.metaverse.maxPlayers}</p>
                      <p className="text-sm text-[#bdb89c]">Max Players</p>
                    </div>
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-2" style={{ color: '#bdb89c' }} />
                      <p className="text-2xl font-bold" style={{ color: '#bdb89c' }}>{config.metaverse.worldSize.width / 1000}k</p>
                      <p className="text-sm text-[#bdb89c]">World Size (m)</p>
                    </div>
                    <div className="text-center">
                      <Database className="w-8 h-8 mx-auto mb-2" style={{ color: '#ffd700' }} />
                      <p className="text-2xl font-bold" style={{ color: '#ffd700' }}>{config.storageCapacity}GB</p>
                      <p className="text-sm text-[#bdb89c]">Storage</p>
                    </div>
                    <div className="text-center">
                      <Gamepad2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#6ec1c8' }} />
                      <p className="text-2xl font-bold" style={{ color: '#6ec1c8' }}>{config.metaverse.gameMechanics.currency}</p>
                      <p className="text-sm text-[#bdb89c]">Currency</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center md:text-left">
                    <span className="text-lg font-semibold text-[#bdb89c]">Your USDFC Balance: </span>
                    <span className="text-2xl font-bold text-[#6ec1c8]">
                      {isLoadingBalances || !isConnected ? '...' : balances?.usdfcBalanceFormatted.toFixed(1) + ' $'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Other Tabs */}
          <AnimatePresence mode="wait">
            {activeTab === "avatar" && (
              <motion.div key="avatar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <div className="card w-full max-w-2xl mx-auto"><AvatarCreator /></div>
              </motion.div>
            )}
            {activeTab === "metaverse" && (
              <motion.div key="metaverse" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "smooth" }}>
                <div className="card w-full max-w-6xl mx-auto"><MetaverseAssetManager /></div>
              </motion.div>
            )}
            {activeTab === "storage" && (
              <motion.div key="storage" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <div className="card w-full max-w-3xl mx-auto"><StorageManager /></div>
              </motion.div>
            )}
            {activeTab === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "smooth" }}>
                <div className="card w-full max-w-3xl mx-auto"><FileUploader /></div>
              </motion.div>
            )}
            {activeTab === "proof-set" && (
              <motion.div key="proof-set" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <div className="card w-full max-w-4xl mx-auto"><ViewProofSets /></div>
              </motion.div>
            )}
            {activeTab === 'drone-sim' && (
              <motion.div key="drone-sim" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "smooth" }}>
                <div className="w-full max-w-7xl mx-auto">
                  <DroneSimDashboard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}