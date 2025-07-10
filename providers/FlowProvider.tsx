"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FlowAccount {
  address: string;
  balance: string;
  code: Record<string, string>;
}

interface FlowProviderContextType {
  isConnected: boolean;
  account: FlowAccount | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: any) => Promise<any>;
  executeScript: (script: string, args: any[]) => Promise<any>;
  sendTransaction: (transaction: any) => Promise<any>;
}

const FlowProviderContext = createContext<FlowProviderContextType | undefined>(undefined);

export const useFlow = () => {
  const context = useContext(FlowProviderContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

interface FlowProviderProps {
  children: ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<FlowAccount | null>(null);

  const connect = async () => {
    try {
      // Check if Flow wallet is available
      if (typeof window !== 'undefined' && window.fcl) {
        await window.fcl.authenticate();
        const user = await window.fcl.currentUser().snapshot();
        
        if (user.loggedIn) {
          const account = await window.fcl.account(user.addr);
          setAccount({
            address: user.addr,
            balance: account.balance,
            code: account.code
          });
          setIsConnected(true);
        }
      } else {
        // Fallback: simulate Flow connection for development
        setAccount({
          address: '0x1234567890abcdef',
          balance: '100.0',
          code: {}
        });
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect to Flow:', error);
      // Fallback for development
      setAccount({
        address: '0x1234567890abcdef',
        balance: '100.0',
        code: {}
      });
      setIsConnected(true);
    }
  };

  const disconnect = () => {
    if (typeof window !== 'undefined' && window.fcl) {
      window.fcl.unauthenticate();
    }
    setIsConnected(false);
    setAccount(null);
  };

  const signTransaction = async (transaction: any) => {
    if (!isConnected) throw new Error('Not connected to Flow');
    
    try {
      if (typeof window !== 'undefined' && window.fcl) {
        return await window.fcl.signTransaction(transaction);
      }
      // Fallback for development
      return { transactionId: 'mock-transaction-id' };
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  const executeScript = async (script: string, args: any[]) => {
    try {
      if (typeof window !== 'undefined' && window.fcl) {
        return await window.fcl.query({
          cadence: script,
          args: args
        });
      }
      // Fallback for development
      return { result: 'mock-script-result' };
    } catch (error) {
      console.error('Failed to execute script:', error);
      throw error;
    }
  };

  const sendTransaction = async (transaction: any) => {
    if (!isConnected) throw new Error('Not connected to Flow');
    
    try {
      if (typeof window !== 'undefined' && window.fcl) {
        return await window.fcl.mutate({
          cadence: transaction.cadence,
          args: transaction.args,
          limit: transaction.limit || 100
        });
      }
      // Fallback for development
      return { transactionId: 'mock-transaction-id' };
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  };

  const value: FlowProviderContextType = {
    isConnected,
    account,
    connect,
    disconnect,
    signTransaction,
    executeScript,
    sendTransaction
  };

  return (
    <FlowProviderContext.Provider value={value}>
      {children}
    </FlowProviderContext.Provider>
  );
};

// Add Flow types to window object
declare global {
  interface Window {
    fcl?: {
      authenticate: () => Promise<void>;
      unauthenticate: () => void;
      currentUser: () => { snapshot: () => Promise<any> };
      account: (address: string) => Promise<any>;
      signTransaction: (transaction: any) => Promise<any>;
      query: (params: any) => Promise<any>;
      mutate: (params: any) => Promise<any>;
    };
  }
} 