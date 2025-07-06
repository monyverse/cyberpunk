"use client";
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
import Github from "@/components/ui/icons/Github";
import Filecoin from "@/components/ui/icons/Filecoin";
import { AvatarCreator } from "@/components/AvatarCreator";
import { MetaverseAssetManager } from "@/components/MetaverseAssetManager";
import { useMetaverse } from "@/hooks/useMetaverse";
import { config } from "@/config";
import { Zap, Users, Globe, Database, Gamepad2 } from "lucide-react";

type Tab = "avatar" | "metaverse" | "storage" | "upload" | "proof-set";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "smooth",
    },
  },
};

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("avatar");
  const { showConfetti } = useConfetti();
  const { data: balances, isLoading: isLoadingBalances } = useBalances();
  const { avatar, isLoadingAvatar } = useMetaverse();

  return (
    <div className="w-full flex flex-col justify-center min-h-fit" style={{ backgroundColor: config.metaverse.theme.backgroundColor }}>
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
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center my-10 w-full mx-auto"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold uppercase tracking-tighter flex items-center gap-3 mb-2"
          style={{ color: config.metaverse.theme.primaryColor }}
        >
          <Zap className="w-10 h-10" />
          {config.metaverse.name}
          <motion.a
            whileHover={{ scale: 1.3 }}
            href="https://github.com/FIL-Builders/fs-upload-dapp"
            className="text-primary transition-colors duration-200 hover:underline cursor-pointer rounded-md hover:text-[#008cf6]"
            target="_blank"
          >
            <Github />
          </motion.a>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-lg font-semibold mb-4 text-center max-w-2xl"
          style={{ color: config.metaverse.theme.textColor }}
        >
          A dystopian cyberpunk metaverse powered by{" "}
          <motion.a
            href="https://github.com/FilOzone/synapse-sdk"
            className="text-primary transition-colors duration-200 hover:underline cursor-pointer hover:text-[#008cf6] rounded-md p-1"
            target="_blank"
          >
            Filecoin Synapse
          </motion.a>
          {" "}and secured with{" "}
          <motion.a
            href="https://docs.secured.finance/usdfc-stablecoin/getting-started"
            className="text-[#e9ac00] hover:underline cursor-pointer"
            target="_blank"
          >
            USDFC
          </motion.a>
        </motion.p>

        {/* Metaverse Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full max-w-4xl"
        >
          <div className="text-center p-4 rounded-lg border border-gray-700 bg-gray-900/30">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: config.metaverse.theme.primaryColor }} />
            <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.primaryColor }}>
              {config.metaverse.maxPlayers}
            </p>
            <p className="text-sm text-gray-400">Max Players</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-700 bg-gray-900/30">
            <Globe className="w-8 h-8 mx-auto mb-2" style={{ color: config.metaverse.theme.secondaryColor }} />
            <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.secondaryColor }}>
              {config.metaverse.worldSize.width / 1000}k
            </p>
            <p className="text-sm text-gray-400">World Size (m)</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-700 bg-gray-900/30">
            <Database className="w-8 h-8 mx-auto mb-2" style={{ color: config.metaverse.theme.accentColor }} />
            <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.accentColor }}>
              {config.storageCapacity}GB
            </p>
            <p className="text-sm text-gray-400">Storage</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-700 bg-gray-900/30">
            <Gamepad2 className="w-8 h-8 mx-auto mb-2" style={{ color: config.metaverse.theme.primaryColor }} />
            <p className="text-2xl font-bold" style={{ color: config.metaverse.theme.primaryColor }}>
              {config.metaverse.gameMechanics.currency}
            </p>
            <p className="text-sm text-gray-400">Currency</p>
          </div>
        </motion.div>

        {/* Balance Display */}
        <motion.p
          variants={itemVariants}
          className="text-lg font-semibold mb-2 text-center"
          style={{ color: config.metaverse.theme.textColor }}
        >
          Your USDFC Balance:{" "}
          {isLoadingBalances || !isConnected
            ? "..."
            : balances?.usdfcBalanceFormatted.toFixed(1) + " $"}
        </motion.p>

        {chainId !== 314159 && (
          <motion.p
            variants={itemVariants}
            className="text-lg font-semibold mb-4 text-center"
          >
            <span className="max-w-xl text-center bg-red-600/70 p-2 rounded-md">
              ⚠️ Filecoin mainnet is not supported yet. Please use Filecoin
              Calibration network.
            </span>
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ConnectButton />
              </motion.div>
              <motion.p variants={itemVariants} className="mt-3 text-secondary">
                Connect your wallet to enter the CyberPunk Metaverse
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={itemVariants}
              className="mt-3 max-w-7xl w-full border-1 rounded-lg p-8"
              style={{
                borderColor: config.metaverse.theme.primaryColor,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <motion.div variants={itemVariants} className="flex mb-6 flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("avatar")}
                  className={`py-2 px-4 text-center border-2 transition-colors rounded ${
                    activeTab === "avatar"
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-400"
                  }`}
                >
                  {avatar ? "Avatar" : "Create Avatar"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("metaverse")}
                  className={`py-2 px-4 text-center border-2 transition-colors rounded ${
                    activeTab === "metaverse"
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-400"
                  }`}
                >
                  Metaverse Assets
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("storage")}
                  className={`py-2 px-4 text-center border-2 transition-colors rounded ${
                    activeTab === "storage"
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-400"
                  }`}
                >
                  Manage Storage
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("upload")}
                  className={`py-2 px-4 text-center border-2 transition-colors rounded ${
                    activeTab === "upload"
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-400"
                  }`}
                >
                  Upload File
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("proof-set")}
                  className={`py-2 px-4 text-center border-2 transition-colors rounded ${
                    activeTab === "proof-set"
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-400"
                  }`}
                >
                  View Proof Sets
                </motion.button>
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === "avatar" ? (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <AvatarCreator />
                  </motion.div>
                ) : activeTab === "metaverse" ? (
                  <motion.div
                    key="metaverse"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      type: "smooth",
                    }}
                  >
                    <MetaverseAssetManager />
                  </motion.div>
                ) : activeTab === "storage" ? (
                  <motion.div
                    key="storage"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <StorageManager />
                  </motion.div>
                ) : activeTab === "upload" ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      type: "smooth",
                    }}
                  >
                    <FileUploader />
                  </motion.div>
                ) : (
                  activeTab === "proof-set" && (
                    <motion.div
                      key="proof-set"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <ViewProofSets />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
