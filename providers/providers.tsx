"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import React from "react";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [],
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
            <RainbowKitProvider modalSize="compact" initialChain={filecoinCalibration.id}>
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
              <Footer />
            </RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </ConfettiProvider>
    </ThemeProvider>
  );
}
