"use client";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import React from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { WagmiProvider, createConfig, http } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import AppShell from "@/components/AppShell";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  injected, 
  walletConnect, 
  coinbaseWallet, 
  safe, 
  metaMask 
} from '@wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id' }),
    coinbaseWallet({ appName: 'CyberPunk Metaverse' }),
    safe(),
    metaMask(),
  ],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ConfettiProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider 
              modalSize="compact" 
              initialChain={filecoinCalibration.id}
            >
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ConfettiProvider>
    </ThemeProvider>
  );
} 