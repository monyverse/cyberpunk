"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { FlowProvider } from "@/providers/FlowProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { 
  injected, 
  walletConnect, 
  coinbaseWallet, 
  safe, 
  metaMask 
} from '@wagmi/connectors';
import React from "react";

const queryClient = new QueryClient();

const config = createConfig({
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

export function Providers({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <ThemeProvider>
      <ConfettiProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <RainbowKitProvider 
              modalSize="compact" 
              initialChain={filecoinCalibration.id}
            >
              <FlowProvider>
                {children}
              </FlowProvider>
            </RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </ConfettiProvider>
    </ThemeProvider>
  );
}
