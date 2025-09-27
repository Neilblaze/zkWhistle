import { useState, useCallback, useEffect } from 'react';
import { zkWhistleAPI } from '../services/api';
import { laceWalletService } from '../services/laceWalletService';
import type { WalletState } from '../types/api';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [laceWalletState, setLaceWalletState] = useState(laceWalletService.currentState);

  // Subscribe to Lace wallet state changes
  useEffect(() => {
    const subscription = laceWalletService.walletState$.subscribe(setLaceWalletState);
    return () => subscription.unsubscribe();
  }, []);

  const buildFreshWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newWallet = await zkWhistleAPI.buildFreshWallet();
      setWallet(newWallet);
      return newWallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to build wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const buildWalletFromSeed = useCallback(async (seed: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const restoredWallet = await zkWhistleAPI.buildWalletFromSeed(seed);
      setWallet(restoredWallet);
      return restoredWallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to build wallet from seed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectLaceWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const laceInfo = await laceWalletService.connect();
      
      // Create a wallet state object compatible with the existing interface
      const laceWallet: WalletState = {
        address: laceInfo.address,
        balance: '0', // Balance will be fetched separately in a real implementation
        seed: '', // Lace wallet doesn't expose seeds
        type: 'lace',
        laceInfo: {
          coinPublicKey: laceInfo.coinPublicKey,
          encryptionPublicKey: laceInfo.encryptionPublicKey,
        },
      };
      
      setWallet(laceWallet);
      return laceWallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Lace wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectLaceWallet = useCallback(async () => {
    try {
      await laceWalletService.disconnect();
      setWallet(null);
      setError(null);
    } catch (err) {
      console.error('Failed to disconnect Lace wallet:', err);
    }
  }, []);

  const clearWallet = useCallback(() => {
    setWallet(null);
    setError(null);
    // Also disconnect Lace wallet if connected
    if (laceWalletState.isConnected) {
      void disconnectLaceWallet();
    }
  }, [laceWalletState.isConnected, disconnectLaceWallet]);

  return {
    wallet,
    isLoading,
    error,
    buildFreshWallet,
    buildWalletFromSeed,
    connectLaceWallet,
    disconnectLaceWallet,
    clearWallet,
    laceWalletState,
  };
};
