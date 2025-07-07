"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { useAccount } from 'wagmi';

const navLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'Assets', href: '/?tab=metaverse' },
  { name: 'Avatar', href: '/?tab=avatar' },
  { name: 'Storage', href: '/?tab=storage' },
  { name: 'Proof Sets', href: '/?tab=proof-set' },
  { name: 'Data Bridge', href: '/databridge' },
  { name: 'MCP Agents', href: '/mcp-agents' },
  { name: 'Onchain Agent', href: '/onchain-agent' },
];

export default function Navbar() {
  const { address, isConnected } = useAccount();
  return (
    <nav className="w-full h-16 flex items-center px-6 bg-[#1a2236] border-b border-[#232c43] shadow-lg z-50">
      <div className="flex items-center gap-3">
        <Image src="/cyberpunk-logo.png" alt="CyberPunk Logo" width={48} height={48} className="rounded-full" />
        <span className="text-2xl font-extrabold tracking-widest text-[#6ec1c8] uppercase" style={{ letterSpacing: '0.15em' }}>
          CYBER<span className="text-[#bdb89c]">PUNK</span>
        </span>
      </div>
      <div className="flex-1" />
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => (
          <Link key={link.name} href={link.href} className="text-[#bdb89c] hover:text-[#6ec1c8] font-semibold text-lg transition-colors">
            {link.name}
          </Link>
        ))}
      </div>
      <div className="ml-6">
          <ConnectButton />
      </div>
    </nav>
  );
}
