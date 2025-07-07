import { motion } from "framer-motion";
import Link from "next/link";
import Github from "./icons/Github";
import CyberPunkLogo from "./icons/CyberPunkLogo";

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const glitchAnimation = {
    x: [0, -1, 1, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatDelay: 8,
      ease: "easeInOut",
    },
  };

  const subtleGlow = {
    boxShadow: [
      "0 0 5px rgba(139, 208, 208, 0.2)",
      "0 0 10px rgba(139, 208, 208, 0.3)",
      "0 0 5px rgba(139, 208, 208, 0.2)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex w-full items-center overflow-hidden justify-center overflow-y-auto bg-[#1a1d29] border-t border-[#2a2f3f] relative"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,208,208,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,208,208,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        variants={itemVariants}
        className="mx-auto px-6 py-8 md:px-24 lg:px-8 relative z-10"
      >
        <motion.div
          variants={footerVariants}
          className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <motion.h1
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-semibold tracking-wide text-[#8bd0d0] flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <CyberPunkLogo />
              </motion.div>
              CYBERPUNK METAVERSE
            </motion.h1>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <motion.p 
              variants={itemVariants} 
              className="text-[#9ca3af] text-lg mb-2"
            >
              A dystopian cyberpunk metaverse powered by Filecoin Synapse and USDFC
            </motion.p>
            <motion.p 
              variants={itemVariants} 
              className="text-[#6b7280] text-sm"
            >
              Max Players: 1000 • World Size: 10k (m) • Storage: 50GB • Currency: CYBER
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#8bd0d0",
              color: "#1a1d29"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8bd0d0] text-[#1a1d29] font-medium rounded-lg hover:bg-[#7bc5c5] transition-colors duration-200"
              href="https://github.com/your-cyberpunk-repo"
              target="_blank"
            >
              Fork on GitHub
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Github />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-2 text-[#9ca3af]"
          >
            <span>Built with</span>
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-[#8bd0d0] text-xl"
            >
              ⚡
            </motion.span>
            <span>for the future</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-8 text-sm text-[#6b7280] border-t border-[#2a2f3f] pt-4 w-full justify-center"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#8bd0d0] rounded-full"></div>
              <span>Filecoin Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>USDFC Active</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Removed animated scan lines for cleaner look */}
    </motion.footer>
  );
}