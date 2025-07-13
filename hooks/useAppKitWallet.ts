import { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitBalance } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export interface AppKitWalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  chainName: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useAppKitWallet() {
  const { open, close } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId, chain } = useAppKitNetwork();
  const { data: balance } = useAppKitBalance();
  const { disconnect } = useDisconnect();

  const [state, setState] = useState<AppKitWalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    chainName: null,
    balance: null,
    isLoading: false,
    error: null,
  });

  // Update state when wallet connection changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected: isConnected,
      address: address || null,
      chainId: chainId || null,
      chainName: chain?.name || null,
      balance: balance ? balance.formatted : null,
      isLoading: status === 'connecting',
      error: status === 'disconnected' ? 'Wallet disconnected' : null,
    }));
  }, [isConnected, address, chainId, chain, balance, status]);

  // Connect wallet
  const connectWallet = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      open({ view: 'Connect' });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
      close();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      // AppKit handles network switching through the modal
      open({ view: 'Networks' });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  // Open account modal
  const openAccountModal = () => {
    open({ view: 'Account' });
  };

  // Open network modal
  const openNetworkModal = () => {
    open({ view: 'Networks' });
  };

  return {
    // State
    state,
    isConnected: state.isConnected,
    address: state.address,
    chainId: state.chainId,
    chainName: state.chainName,
    balance: state.balance,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    openAccountModal,
    openNetworkModal,
    openModal: open,
    closeModal: close,
  };
} 