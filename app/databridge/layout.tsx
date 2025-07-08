import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../globals.css';

import { ContextProvider } from '.';
import ReactQueryProvider from './ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

// Websit Config
export const metadata: Metadata = {
  title: 'OnRamp',
  description: 'Made with love by Team FIL-B',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ReactQueryProvider>
        <ContextProvider>{children}</ContextProvider>
      </ReactQueryProvider>
    </>
  );
}
