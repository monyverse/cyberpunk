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
    <main className="flex min-h-screen flex-col items-center justify-start bg-[#181e2a] p-4 gap-8">
      {/* Dashboard Card */}
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
          </div>
        </div>
      </div>
      {/* Drone Simulation Dashboard */}
      <div className="w-full max-w-7xl mx-auto">
        <DroneSimDashboard />
      </div>
    </main>
  );
}