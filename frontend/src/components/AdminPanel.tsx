import { useState } from 'react';
import { useContract } from '../hooks/useContract';

interface AdminPanelProps {
  contractAddress: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ contractAddress }) => {
  const { isLoading, error, addIssuer, revokeIssuer } = useContract();
  
  const [ownerSecretKey, setOwnerSecretKey] = useState('');
  const [issuerKey, setIssuerKey] = useState('');
  const [actionResult, setActionResult] = useState<any>(null);

  const handleAddIssuer = async () => {
    if (!ownerSecretKey.trim() || !issuerKey.trim()) {
      alert('Please enter both owner secret key and issuer key');
      return;
    }
    if (ownerSecretKey.trim().length !== 64 || issuerKey.trim().length !== 64) {
      alert('Both keys must be exactly 64 characters long');
      return;
    }

    try {
      console.log('Adding issuer...');
      console.log('Updating private state with owner secret key for authentication...');
      console.log('Private state updated. Adding issuer...');
      const result = await addIssuer(ownerSecretKey.trim(), issuerKey.trim());
      console.log(`Transaction ${result.txId} added in block ${result.blockHeight}`);
      console.log('Issuer added successfully.');
      setActionResult({ type: 'add', result });
      setIssuerKey(''); // Clear issuer key after successful addition
    } catch (err) {
      console.error('Failed to add issuer:', err);
    }
  };

  const handleRevokeIssuer = async () => {
    if (!ownerSecretKey.trim() || !issuerKey.trim()) {
      alert('Please enter both owner secret key and issuer key');
      return;
    }
    if (ownerSecretKey.trim().length !== 64 || issuerKey.trim().length !== 64) {
      alert('Both keys must be exactly 64 characters long');
      return;
    }

    try {
      console.log('Revoking issuer...');
      console.log('Updating private state with owner secret key for authentication...');
      console.log('Private state updated. Revoking issuer...');
      const result = await revokeIssuer(ownerSecretKey.trim(), issuerKey.trim());
      console.log(`Transaction ${result.txId} added in block ${result.blockHeight}`);
      console.log('Issuer revoked successfully.');
      setActionResult({ type: 'revoke', result });
      setIssuerKey(''); // Clear issuer key after successful revocation
    } catch (err) {
      console.error('Failed to revoke issuer:', err);
    }
  };

  return (
    <div className="bg-pure-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-pure-white mb-4">Admin Panel</h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Contract Info */}
        <div className="bg-midnight-black p-4 rounded border border-pure-white/20">
          <h4 className="font-semibold text-pure-white mb-2">Contract Address:</h4>
          <p className="text-pure-white/80 text-sm font-mono break-all">{contractAddress}</p>
        </div>

        {/* Owner Secret Key */}
        <div className="space-y-3">
          <label className="block text-pure-white font-semibold">Owner Secret Key</label>
          <input
            type="password"
            value={ownerSecretKey}
            onChange={(e) => setOwnerSecretKey(e.target.value)}
            placeholder="Enter your owner secret key (64 characters)"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
          />
        </div>

        {/* Issuer Management */}
        <div className="space-y-4">
          <h4 className="font-semibold text-pure-white">Issuer Management</h4>
          
          {/* Loading State */}
          {isLoading && (
            <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <p className="text-blue-300 text-sm">
                  {actionResult?.type === 'add' ? 'Adding issuer...' : 'Revoking issuer...'}
                </p>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                Updating private state and submitting transaction to the blockchain...
              </p>
            </div>
          )}
          
          <div className="bg-blue-500/20 border border-blue-500 p-3 rounded">
            <p className="text-blue-300 text-sm">
              🏥 Manage Trusted Clinics
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Add or revoke public keys of clinics authorized to issue health credentials.
            </p>
          </div>
          
          <input
            type="text"
            value={issuerKey}
            onChange={(e) => setIssuerKey(e.target.value)}
            placeholder="Enter issuer public key (64 characters)"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none font-mono text-sm"
          />
          
          {issuerKey && (
            <div className="text-xs text-pure-white/60">
              <p>Key length: {issuerKey.length}/64 characters</p>
              {issuerKey.length === 64 ? (
                <p className="text-green-400">✅ Valid issuer key length</p>
              ) : (
                <p className="text-red-400">❌ Issuer key must be exactly 64 characters</p>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleAddIssuer}
              disabled={isLoading || !ownerSecretKey.trim() || !issuerKey.trim() || ownerSecretKey.length !== 64 || issuerKey.length !== 64}
              className="flex-1 px-6 py-3 bg-green-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-green-600/80 transition-all duration-200"
            >
              {isLoading && !actionResult ? 'Adding Issuer...' : 'Add Issuer'}
            </button>
            
            <button
              onClick={handleRevokeIssuer}
              disabled={isLoading || !ownerSecretKey.trim() || !issuerKey.trim() || ownerSecretKey.length !== 64 || issuerKey.length !== 64}
              className="flex-1 px-6 py-3 bg-red-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-red-600/80 transition-all duration-200"
            >
              {isLoading && !actionResult ? 'Revoking Issuer...' : 'Revoke Issuer'}
            </button>
          </div>
        </div>

        {/* Action Result */}
        {actionResult && (
          <div className={`p-4 rounded border ${
            actionResult.type === 'add' 
              ? 'bg-green-500/20 border-green-500' 
              : 'bg-orange-500/20 border-orange-500'
          }`}>
            <h4 className={`font-semibold mb-3 ${
              actionResult.type === 'add' ? 'text-green-300' : 'text-orange-300'
            }`}>
              {actionResult.type === 'add' ? '✅ Issuer Added Successfully!' : '🚫 Issuer Revoked Successfully!'}
            </h4>
            <p className={`text-sm mb-3 ${
              actionResult.type === 'add' ? 'text-green-200' : 'text-orange-200'
            }`}>
              {actionResult.type === 'add' 
                ? 'The clinic has been added to the trusted issuers list and can now issue valid health credentials.'
                : 'The clinic has been removed from the trusted issuers list and can no longer issue valid health credentials.'}
            </p>
            <div className="bg-midnight-black p-3 rounded">
              <div className={`text-sm space-y-2 ${
                actionResult.type === 'add' ? 'text-green-200' : 'text-orange-200'
              }`}>
                <div>
                  <span className={`font-semibold ${
                    actionResult.type === 'add' ? 'text-green-400' : 'text-orange-400'
                  }`}>Transaction ID:</span>
                  <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1 break-all">{actionResult.result.txId}</p>
                </div>
                <div>
                  <span className={`font-semibold ${
                    actionResult.type === 'add' ? 'text-green-400' : 'text-orange-400'
                  }`}>Block Height:</span>
                  <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1">{actionResult.result.blockHeight}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
