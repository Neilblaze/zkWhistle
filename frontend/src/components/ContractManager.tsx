import { useState } from 'react';
import { useContract } from '../hooks/useContract';

interface ContractManagerProps {
  onContractReady: () => void;
}

export const ContractManager: React.FC<ContractManagerProps> = ({ onContractReady }) => {
  const { contract, contractState, isLoading, error, deployContract, joinContract, getContractState } = useContract();
  const [ownerSecretKey, setOwnerSecretKey] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleDeploy = async () => {
    if (!ownerSecretKey.trim()) {
      alert('Please enter a valid owner secret key (64 characters)');
      return;
    }
    try {
      await deployContract(ownerSecretKey.trim());
      onContractReady();
    } catch (err) {
      console.error('Failed to deploy contract:', err);
    }
  };

  const handleJoin = async () => {
    if (!contractAddress.trim()) {
      alert('Please enter a valid contract address');
      return;
    }
    try {
      await joinContract(contractAddress.trim());
      onContractReady();
    } catch (err) {
      console.error('Failed to join contract:', err);
    }
  };

  const handleGetState = async () => {
    if (!contract) return;
    try {
      await getContractState();
    } catch (err) {
      console.error('Failed to get contract state:', err);
    }
  };

  if (contract) {
    return (
      <div className="bg-pure-white/10 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-pure-white mb-4">Contract Connected</h3>
        <div className="space-y-4">
          <div className="space-y-2 text-pure-white/80">
            <p><span className="font-semibold">Address:</span> {contract.contractAddress}</p>
            <p><span className="font-semibold">Transaction ID:</span> {contract.deployTxData.public.txId}</p>
            <p><span className="font-semibold">Block Height:</span> {contract.deployTxData.public.blockHeight}</p>
          </div>

          <button
            onClick={handleGetState}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
          >
            {isLoading ? 'Loading State...' : 'Get Contract State'}
          </button>

          {contractState && (
            <div className="bg-midnight-black p-4 rounded border border-pure-white/20">
              <h4 className="font-bold text-pure-white mb-2">Contract State:</h4>
              <pre className="text-pure-white/80 text-sm overflow-x-auto">
                {JSON.stringify(contractState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pure-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-pure-white mb-4">Contract Setup</h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="block text-pure-white font-semibold">
            Owner Secret Key (for deployment/management)
          </label>
          <input
            type="password"
            value={ownerSecretKey}
            onChange={(e) => setOwnerSecretKey(e.target.value)}
            placeholder="Enter 64-character secret key"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
          />
        </div>

        <button
          onClick={handleDeploy}
          disabled={isLoading || !ownerSecretKey.trim()}
          className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
        >
          {isLoading ? 'Deploying Contract...' : 'Deploy New Contract'}
        </button>

        <div className="text-center">
          <span className="text-pure-white/60">or</span>
        </div>

        {!showJoinInput ? (
          <button
            onClick={() => setShowJoinInput(true)}
            className="w-full px-6 py-3 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200"
          >
            Join Existing Contract
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address (0x...)"
              className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleJoin}
                disabled={isLoading || !contractAddress.trim()}
                className="flex-1 px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
              >
                {isLoading ? 'Joining...' : 'Join Contract'}
              </button>
              <button
                onClick={() => {
                  setShowJoinInput(false);
                  setContractAddress('');
                }}
                className="px-6 py-3 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
