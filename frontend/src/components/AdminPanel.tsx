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

    try {
      const result = await addIssuer(ownerSecretKey.trim(), issuerKey.trim());
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

    try {
      const result = await revokeIssuer(ownerSecretKey.trim(), issuerKey.trim());
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
          
          <input
            type="text"
            value={issuerKey}
            onChange={(e) => setIssuerKey(e.target.value)}
            placeholder="Enter issuer public key (64 characters)"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
          />

          <div className="flex space-x-3">
            <button
              onClick={handleAddIssuer}
              disabled={isLoading || !ownerSecretKey.trim() || !issuerKey.trim()}
              className="flex-1 px-6 py-3 bg-green-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-green-600/80 transition-all duration-200"
            >
              {isLoading ? 'Adding...' : 'Add Issuer'}
            </button>
            
            <button
              onClick={handleRevokeIssuer}
              disabled={isLoading || !ownerSecretKey.trim() || !issuerKey.trim()}
              className="flex-1 px-6 py-3 bg-red-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-red-600/80 transition-all duration-200"
            >
              {isLoading ? 'Revoking...' : 'Revoke Issuer'}
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
            <h4 className={`font-semibold mb-2 ${
              actionResult.type === 'add' ? 'text-green-300' : 'text-orange-300'
            }`}>
              Issuer {actionResult.type === 'add' ? 'Added' : 'Revoked'} Successfully!
            </h4>
            <div className={`text-sm space-y-1 ${
              actionResult.type === 'add' ? 'text-green-200' : 'text-orange-200'
            }`}>
              <p>Transaction ID: {actionResult.result.txId}</p>
              <p>Block Height: {actionResult.result.blockHeight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
