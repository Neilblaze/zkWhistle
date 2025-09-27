import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletSetupProps {
  onWalletReady: () => void;
}

export const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletReady }) => {
  const { 
    wallet, 
    isLoading, 
    error, 
    buildFreshWallet, 
    buildWalletFromSeed, 
    connectLaceWallet,
    disconnectLaceWallet,
    laceWalletState 
  } = useWallet();
  const [seedInput, setSeedInput] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);

  const handleBuildFresh = async () => {
    try {
      console.log('Building fresh wallet...');
      const newWallet = await buildFreshWallet();
      console.log(`Fresh wallet built successfully with address: ${newWallet.address}`);
      console.log(`Wallet balance: ${parseInt(newWallet.balance).toLocaleString()} tokens`);
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
    if (seedInput.trim().length !== 64) {
      alert('Seed must be exactly 64 characters long');
      return;
    }
    try {
      console.log('Building wallet from seed...');
      const restoredWallet = await buildWalletFromSeed(seedInput.trim());
      console.log(`Wallet restored successfully with address: ${restoredWallet.address}`);
      console.log(`Wallet balance: ${parseInt(restoredWallet.balance).toLocaleString()} tokens`);
      onWalletReady();
    } catch (err) {
      console.error('Failed to build wallet from seed:', err);
    }
  };

  const handleConnectLace = async () => {
    try {
      console.log('Connecting to Lace wallet...');
      const laceWallet = await connectLaceWallet();
      console.log(`Lace wallet connected successfully with address: ${laceWallet.address}`);
      onWalletReady();
    } catch (err) {
      console.error('Failed to connect to Lace wallet:', err);
    }
  };

  const handleDisconnectLace = async () => {
    try {
      await disconnectLaceWallet();
      console.log('Lace wallet disconnected');
    } catch (err) {
      console.error('Failed to disconnect Lace wallet:', err);
    }
  };

  if (wallet) {
    return (
      <div className="bg-pure-white/10 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-pure-white mb-4">
          ✅ Wallet Connected Successfully {wallet.type === 'lace' ? '(Lace)' : '(Seed-based)'}
        </h3>
        <div className="bg-midnight-black p-4 rounded border border-green-500/30">
          <div className="space-y-3 text-pure-white/90">
            <div>
              <span className="font-semibold text-green-400">Your wallet address is:</span>
              <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1 break-all">{wallet.address}</p>
            </div>
            <div>
              <span className="font-semibold text-green-400">Your wallet balance is:</span>
              <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1">{parseInt(wallet.balance).toLocaleString()} tokens</p>
            </div>
            {wallet.type === 'lace' ? (
              <div>
                <span className="font-semibold text-green-400">Wallet type:</span>
                <p className="text-sm text-pure-white/80 mt-1">🟢 Connected via Midnight Lace Extension</p>
                {wallet.laceInfo && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-pure-white/60">Coin Public Key: {wallet.laceInfo.coinPublicKey.slice(0, 16)}...</p>
                    <p className="text-xs text-pure-white/60">Encryption Public Key: {wallet.laceInfo.encryptionPublicKey.slice(0, 16)}...</p>
                  </div>
                )}
                <button
                  onClick={handleDisconnectLace}
                  className="mt-2 px-3 py-1 text-xs bg-red-600/20 border border-red-500 text-red-300 rounded hover:bg-red-600/30 transition-colors"
                >
                  Disconnect Lace Wallet
                </button>
              </div>
            ) : (
              <div>
                <span className="font-semibold text-green-400">Your wallet seed is:</span>
                <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1 break-all">{wallet.seed}</p>
                <p className="text-yellow-400 text-xs mt-1">⚠️ Keep this seed secret and safe!</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded">
          <p className="text-green-300 text-sm">
            ✅ Wallet connected successfully. You can now proceed to contract setup.
          </p>
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
          {/* Loading State Display */}
          {(isLoading || laceWalletState.isConnecting) && (
            <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <p className="text-blue-300 text-sm">
                  {laceWalletState.isConnecting ? 'Connecting to Lace wallet...' :
                   showSeedInput ? 'Building wallet from seed...' : 'Building fresh wallet...'}
                </p>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                {laceWalletState.isConnecting 
                  ? 'Please check your Lace wallet extension for connection requests.'
                  : 'This may take a moment as we connect to the network and sync your wallet.'
                }
              </p>
            </div>
          )}

          {/* Lace Wallet Error Display */}
          {laceWalletState.error && (
            <div className="bg-orange-500/20 border border-orange-500 text-orange-300 p-3 rounded">
              <p className="text-sm font-semibold">🔶 Lace Wallet Setup Required</p>
              <div className="text-xs mt-2 whitespace-pre-line">{laceWalletState.error}</div>
              {laceWalletState.error.includes('enable') && (
                <div className="mt-3 p-2 bg-blue-500/20 border border-blue-500/50 rounded text-blue-200 text-xs">
                  <p className="font-semibold">💡 Quick Fix:</p>
                  <p>The Lace preview wallet requires manual connection approval. Check your browser's extension area for any pending notifications from Lace.</p>
                </div>
              )}
            </div>
          )}

          {/* Lace Wallet Connection Option */}
          <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-300 mb-2">🌙 Midnight Lace Wallet</h4>
            <p className="text-purple-200 text-sm mb-3">
              Connect your Midnight Lace wallet extension for seamless transactions
            </p>
            <div className="space-y-2">
              <button
                onClick={handleConnectLace}
                disabled={isLoading || laceWalletState.isConnecting}
                className="w-full px-6 py-3 bg-purple-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-purple-600/80 transition-all duration-200"
              >
                {laceWalletState.isConnecting ? 'Connecting to Lace...' : 
                 laceWalletState.error ? 'Retry Connection' : 'Connect Lace Wallet'}
              </button>
              
              {laceWalletState.error && (
                <p className="text-xs text-purple-300 text-center">
                  Having trouble? Check the console (F12) for detailed logs
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-pure-white/60">or use seed-based wallet</span>
          </div>

          <button
            onClick={handleBuildFresh}
            disabled={isLoading || laceWalletState.isConnecting}
            className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
          >
            {isLoading && !showSeedInput ? 'Building Fresh Wallet...' : 'Build Fresh Wallet'}
          </button>

          <div className="text-center">
            <span className="text-pure-white/60">or</span>
          </div>

          {!showSeedInput ? (
            <button
              onClick={() => setShowSeedInput(true)}
              disabled={isLoading || laceWalletState.isConnecting}
              className="w-full px-6 py-3 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200 disabled:opacity-50"
            >
              Restore from Seed
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-500/20 border border-yellow-500 p-3 rounded">
                <p className="text-yellow-300 text-sm">
                  💡 Enter your wallet seed to restore an existing wallet
                </p>
                <p className="text-yellow-200 text-xs mt-1">
                  This should be a 64-character hexadecimal string that was provided when you first created your wallet.
                </p>
              </div>
              
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Enter your 64-character seed (hex string)"
                className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none font-mono text-sm"
              />
              
              {seedInput && (
                <div className="text-xs text-pure-white/60">
                  <p>Seed length: {seedInput.length}/64 characters</p>
                  {seedInput.length === 64 ? (
                    <p className="text-green-400">✅ Valid seed length</p>
                  ) : (
                    <p className="text-red-400">❌ Seed must be exactly 64 characters</p>
                  )}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleBuildFromSeed}
                  disabled={isLoading || laceWalletState.isConnecting || !seedInput.trim() || seedInput.length !== 64}
                  className="flex-1 px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
                >
                  {isLoading && showSeedInput ? 'Restoring Wallet...' : 'Restore Wallet'}
                </button>
                <button
                  onClick={() => {
                    setShowSeedInput(false);
                    setSeedInput('');
                  }}
                  disabled={isLoading || laceWalletState.isConnecting}
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
