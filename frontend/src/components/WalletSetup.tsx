import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletSetupProps {
  onWalletReady: () => void;
}

export const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletReady }) => {
  const { wallet, isLoading, error, buildFreshWallet, buildWalletFromSeed } = useWallet();
  const [seedInput, setSeedInput] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);

  const handleBuildFresh = async () => {
    try {
      await buildFreshWallet();
      onWalletReady();
    } catch (err) {
      console.error('Failed to build fresh wallet:', err);
    }
  };

  const handleBuildFromSeed = async () => {
    if (!seedInput.trim()) {
      alert('Please enter a valid seed');
      return;
    }
    try {
      await buildWalletFromSeed(seedInput.trim());
      onWalletReady();
    } catch (err) {
      console.error('Failed to build wallet from seed:', err);
    }
  };

  if (wallet) {
    return (
      <div className="bg-pure-white/10 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-pure-white mb-4">Wallet Connected</h3>
        <div className="space-y-2 text-pure-white/80">
          <p><span className="font-semibold">Address:</span> {wallet.address}</p>
          <p><span className="font-semibold">Balance:</span> {wallet.balance}</p>
          <p><span className="font-semibold">Seed:</span> {wallet.seed.substring(0, 16)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pure-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-pure-white mb-4">Wallet Setup</h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleBuildFresh}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
        >
          {isLoading ? 'Building Wallet...' : 'Build Fresh Wallet'}
        </button>

        <div className="text-center">
          <span className="text-pure-white/60">or</span>
        </div>

        {!showSeedInput ? (
          <button
            onClick={() => setShowSeedInput(true)}
            className="w-full px-6 py-3 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200"
          >
            Restore from Seed
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="Enter your 64-character seed"
              className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleBuildFromSeed}
                disabled={isLoading || !seedInput.trim()}
                className="flex-1 px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
              >
                {isLoading ? 'Restoring...' : 'Restore Wallet'}
              </button>
              <button
                onClick={() => {
                  setShowSeedInput(false);
                  setSeedInput('');
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
