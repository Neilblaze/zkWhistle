import { useState, useCallback } from 'react';
import { zkWhistleAPI } from '../services/api';
import type { VerifiableCredential, TransactionResult } from '../types/api';

export const useHealthProof = () => {
  const [challenge, setChallenge] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChallenge = useCallback(async (contractAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newChallenge = await zkWhistleAPI.getChallenge(contractAddress);
      setChallenge(newChallenge);
      return newChallenge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get challenge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitHealthProof = useCallback(async (
    contractAddress: string,
    credential: VerifiableCredential,
    issuerKey: string,
    challengeNonce?: string
  ) => {
    const proofChallenge = challengeNonce || challenge;
    if (!proofChallenge) {
      throw new Error('No challenge available. Please get a challenge first.');
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await zkWhistleAPI.submitHealthProof(
        contractAddress,
        credential,
        proofChallenge,
        issuerKey
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit health proof';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [challenge]);

  const clearChallenge = useCallback(() => {
    setChallenge(null);
    setError(null);
  }, []);

  return {
    challenge,
    isLoading,
    error,
    getChallenge,
    submitHealthProof,
    clearChallenge
  };
};
