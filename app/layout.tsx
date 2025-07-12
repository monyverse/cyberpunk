// Only import Providers and AppShell directly, no React/MUI/client imports here
import AppShell from "@/components/AppShell";
import Web3Providers from "../providers/Web3Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Web3Providers>
          <AppShell>
            {children}
          </AppShell>
        </Web3Providers>
      </body>
    </html>
  );
}