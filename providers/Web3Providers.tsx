"use client";
import React from "react";
import EvmPrivyProvider from "./PrivyProvider";
import FlowProvider from "./FlowProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import AppShell from "@/components/AppShell";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <EvmPrivyProvider>
            <FlowProvider>
              <AppShell>
                {children}
              </AppShell>
            </FlowProvider>
          </EvmPrivyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 