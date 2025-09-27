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
    if (ownerSecretKey.trim().length !== 64) {
      alert('Owner secret key must be exactly 64 characters long');
      return;
    }
    try {
      console.log('Deploying verifier contract...');
      const deployedContract = await deployContract(ownerSecretKey.trim());
      console.log(`Contract deployed at address: ${deployedContract.contractAddress}`);
      console.log(`Transaction ${deployedContract.deployTxData.public.txId} added in block ${deployedContract.deployTxData.public.blockHeight}`);
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
    if (!contractAddress.trim().startsWith('0x') || contractAddress.trim().length !== 66) {
      alert('Contract address must be in format 0x... and 66 characters long');
      return;
    }
    try {
      console.log('Joining contract...');
      const joinedContract = await joinContract(contractAddress.trim());
      console.log(`Joined contract at address: ${joinedContract.contractAddress}`);
      console.log('Joined contract successfully.');
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
        <h3 className="text-xl font-bold text-pure-white mb-4">✅ Contract Connected Successfully</h3>
        <div className="space-y-4">
          <div className="bg-midnight-black p-4 rounded border border-green-500/30">
            <div className="space-y-3 text-pure-white/90">
              <div>
                <span className="font-semibold text-green-400">Contract deployed at address:</span>
                <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1 break-all">{contract.contractAddress}</p>
              </div>
              <div>
                <span className="font-semibold text-green-400">Transaction ID:</span>
                <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1 break-all">{contract.deployTxData.public.txId}</p>
              </div>
              <div>
                <span className="font-semibold text-green-400">Block Height:</span>
                <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1">{contract.deployTxData.public.blockHeight}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded">
            <p className="text-green-300 text-sm">
              ✅ Contract connection successful. You can now proceed to the next step.
            </p>
          </div>

          <button
            onClick={handleGetState}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
          >
            {isLoading ? 'Loading State...' : 'Get Current Contract State'}
          </button>

          {contractState && (
            <div className="bg-midnight-black p-4 rounded border border-brand-blue/30">
              <h4 className="font-bold text-brand-blue mb-3">Current Verifier State:</h4>
              <div className="space-y-3 text-pure-white/90">
                <div>
                  <span className="font-semibold text-brand-blue">Owner:</span>
                  <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1 break-all">{contractState.owner}</p>
                </div>
                <div>
                  <span className="font-semibold text-brand-blue">Risk Threshold:</span>
                  <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1">{contractState.modelParameters.riskThreshold}</p>
                </div>
                <div>
                  <span className="font-semibold text-brand-blue">Trusted Issuers:</span>
                  <div className="bg-pure-white/10 p-2 rounded mt-1">
                    {Object.keys(contractState.trustedIssuers).length > 0 ? (
                      Object.entries(contractState.trustedIssuers).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono break-all">{key}</span>
                          <span className={`px-2 py-1 rounded ${value ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {value ? 'Active' : 'Revoked'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-pure-white/60 text-sm">No trusted issuers configured</p>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-brand-blue">Used Nonces:</span>
                  <div className="bg-pure-white/10 p-2 rounded mt-1">
                    {Object.keys(contractState.usedNonces).length > 0 ? (
                      Object.entries(contractState.usedNonces).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono">{key}</span>
                          <span className={`px-2 py-1 rounded ${value ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'}`}>
                            {value ? 'Used' : 'Available'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-pure-white/60 text-sm">No nonces used yet</p>
                    )}
                  </div>
                </div>
              </div>
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
        {/* Loading State Display */}
        {isLoading && (
          <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <p className="text-blue-300 text-sm">
                {showJoinInput ? 'Joining contract...' : 'Deploying verifier contract...'}
              </p>
            </div>
            <p className="text-blue-200 text-xs mt-2">
              {showJoinInput 
                ? 'Connecting to existing contract and verifying permissions...' 
                : 'Creating new smart contract on the blockchain. This may take a moment...'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-pure-white font-semibold">
            Owner Secret Key (for deployment/management)
          </label>
          <div className="bg-yellow-500/20 border border-yellow-500 p-3 rounded mb-3">
            <p className="text-yellow-300 text-sm">
              🔐 This key gives you administrative control over the contract
            </p>
            <p className="text-yellow-200 text-xs mt-1">
              Use this key to add/revoke trusted clinics and manage the verification system.
            </p>
          </div>
          <input
            type="password"
            value={ownerSecretKey}
            onChange={(e) => setOwnerSecretKey(e.target.value)}
            placeholder="Enter 64-character secret key"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none font-mono"
          />
          {ownerSecretKey && (
            <div className="text-xs text-pure-white/60">
              <p>Key length: {ownerSecretKey.length}/64 characters</p>
              {ownerSecretKey.length === 64 ? (
                <p className="text-green-400">✅ Valid key length</p>
              ) : (
                <p className="text-red-400">❌ Key must be exactly 64 characters</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleDeploy}
          disabled={isLoading || !ownerSecretKey.trim() || ownerSecretKey.length !== 64}
          className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
        >
          {isLoading && !showJoinInput ? 'Deploying Contract...' : 'Deploy New Contract'}
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
            <div className="bg-blue-500/20 border border-blue-500 p-3 rounded">
              <p className="text-blue-300 text-sm">
                🌐 Connect to an existing verifier contract
              </p>
              <p className="text-blue-200 text-xs mt-1">
                This is the public address of the smart contract that manages trusted issuers and verifies proofs.
              </p>
            </div>
            
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address (0x...)"
              className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none font-mono text-sm"
            />
            
            {contractAddress && (
              <div className="text-xs text-pure-white/60">
                <p>Address length: {contractAddress.length}/66 characters</p>
                {contractAddress.startsWith('0x') && contractAddress.length === 66 ? (
                  <p className="text-green-400">✅ Valid contract address format</p>
                ) : (
                  <p className="text-red-400">❌ Address must start with 0x and be 66 characters long</p>
                )}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleJoin}
                disabled={isLoading || !contractAddress.trim() || !contractAddress.startsWith('0x') || contractAddress.length !== 66}
                className="flex-1 px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
              >
                {isLoading && showJoinInput ? 'Joining Contract...' : 'Join Contract'}
              </button>
              <button
                onClick={() => {
                  setShowJoinInput(false);
                  setContractAddress('');
                }}
                disabled={isLoading}
                className="px-6 py-3 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200 disabled:opacity-50"
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
