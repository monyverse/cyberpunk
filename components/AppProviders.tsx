"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ConfettiProvider>
        {children}
      </ConfettiProvider>
    </ThemeProvider>
  );
} 