"use client";
import { PrivyProvider } from "@privy-io/react-auth";

export default function EvmPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Add Privy config here if needed
      }}
    >
      {children}
    </PrivyProvider>
  );
} 