import { useState, useCallback } from 'react';
import { zkWhistleAPI } from '../services/api';
import type { WalletState } from '../types/api';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const clearWallet = useCallback(() => {
    setWallet(null);
    setError(null);
  }, []);

  return {
    wallet,
    isLoading,
    error,
    buildFreshWallet,
    buildWalletFromSeed,
    clearWallet
  };
};
