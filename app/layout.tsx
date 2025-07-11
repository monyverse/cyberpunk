// Only import Providers and AppShell directly, no React/MUI/client imports here
import Providers from "@/providers/providers";
import AppShell from "@/components/AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}