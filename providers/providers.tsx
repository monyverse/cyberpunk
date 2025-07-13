"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import React from "react";
import { wagmiAdapter } from "@/config/appkit";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <ThemeProvider>
      <ConfettiProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </ConfettiProvider>
    </ThemeProvider>
  );
}
export default Providers;