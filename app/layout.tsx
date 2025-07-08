// app/layout.jsx

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import Footer from "@/components/ui/Footer";
import { Providers } from "../providers/providers";
import * as fcl from "@onflow/fcl";

// FCL config for Flow testnet (global)
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xAgentNPC", "0x90ba9bdcb25f0aeb");

const queryClient = new QueryClient();

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>CYBERPUNK METAVERSE</title>
        <meta
          name="description"
          content="Explore. Hunt. Earn. Evolve — All through your drone"
        />
        <meta
          name="keywords"
          content="Drones, AR, METAVERSE, pdp, upload, filecoin, usdfc"
        />
        <meta name="author" content=",Monyverse" />
        <meta name="viewport" content="width=device-width, initial-scale=0.6" />
        <link rel="icon" href="/filecoin.svg" />
      </head>
      <body className="bg-[#181e2a] min-h-screen w-full">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
                    {children}
                  </main>
                  <Footer />
                </Providers>
              </body>
            </html>
          );
        }
