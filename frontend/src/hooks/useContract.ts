import { useState, useCallback } from 'react';
import { zkWhistleAPI } from '../services/api';
import type { DeployedContract, ContractState } from '../types/api';

export const useContract = () => {
  const [contract, setContract] = useState<DeployedContract | null>(null);
  const [contractState, setContractState] = useState<ContractState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deployContract = useCallback(async (ownerSecretKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newContract = await zkWhistleAPI.deployContract(ownerSecretKey);
      setContract(newContract);
      return newContract;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deploy contract';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinContract = useCallback(async (contractAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const joinedContract = await zkWhistleAPI.joinContract(contractAddress);
      setContract(joinedContract);
      return joinedContract;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join contract';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addIssuer = useCallback(async (ownerSecretKey: string, issuerKey: string) => {
    if (!contract) {
      throw new Error('No contract available');
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await zkWhistleAPI.addIssuer(contract.contractAddress, ownerSecretKey, issuerKey);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add issuer';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const revokeIssuer = useCallback(async (ownerSecretKey: string, issuerKey: string) => {
    if (!contract) {
      throw new Error('No contract available');
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await zkWhistleAPI.revokeIssuer(contract.contractAddress, ownerSecretKey, issuerKey);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke issuer';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const getContractState = useCallback(async (contractAddress?: string) => {
    const address = contractAddress || contract?.contractAddress;
    if (!address) {
      throw new Error('No contract address available');
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const state = await zkWhistleAPI.getContractState(address);
      setContractState(state);
      return state;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get contract state';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const clearContract = useCallback(() => {
    setContract(null);
    setContractState(null);
    setError(null);
  }, []);

  return {
    contract,
    contractState,
    isLoading,
    error,
    deployContract,
    joinContract,
    addIssuer,
    revokeIssuer,
    getContractState,
    clearContract
  };
};
