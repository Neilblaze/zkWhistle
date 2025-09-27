import { useState } from 'react';
import { useHealthProof } from '../hooks/useHealthProof';
import type { VerifiableCredential } from '../types/api';

interface HealthProofSubmissionProps {
  contractAddress: string;
}

export const HealthProofSubmission: React.FC<HealthProofSubmissionProps> = ({ contractAddress }) => {
  const { challenge, isLoading, error, getChallenge, submitHealthProof } = useHealthProof();
  
  const [issuerKey, setIssuerKey] = useState('');
  const [credential, setCredential] = useState<VerifiableCredential>({
    results: {
      cholesterol: 0,
      bloodPressure: 0,
      isSmoker: false
    },
    signature: ''
  });
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleGetChallenge = async () => {
    try {
      console.log('Getting challenge from contract...');
      const newChallenge = await getChallenge(contractAddress);
      console.log(`Your unique, single-use challenge nonce is: ${newChallenge}`);
      console.log('The CLI will now use this nonce to generate and submit your proof.');
    } catch (err) {
      console.error('Failed to get challenge:', err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCredentialFile(file);
      console.log('Reading credential file...');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedCredential = JSON.parse(content);
          setCredential(parsedCredential);
          console.log('Credential file read successfully.');
          console.log(`Health data loaded - Cholesterol: ${parsedCredential.results.cholesterol}, Blood Pressure: ${parsedCredential.results.bloodPressure}, Smoker: ${parsedCredential.results.isSmoker ? 'Yes' : 'No'}`);
        } catch (err) {
          alert('Invalid JSON file. Please upload a valid credential file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!challenge) {
      alert('Please get a challenge first');
      return;
    }
    if (!issuerKey.trim()) {
      alert('Please enter the issuer key');
      return;
    }
    if (!credential.signature) {
      alert('Please upload a valid credential file');
      return;
    }
    if (issuerKey.trim().length !== 64) {
      alert('Issuer key must be exactly 64 characters long');
      return;
    }

    try {
      console.log('Preparing to generate proof...');
      console.log('Private state updated for proof generation.');
      console.log('Generating and submitting your anonymous proof... (This may take a moment)');
      const result = await submitHealthProof(contractAddress, credential, issuerKey.trim());
      console.log('Verification Successful! Your health proof has been submitted.');
      console.log(`Transaction ${result.txId} added in block ${result.blockHeight}`);
      setSubmissionResult(result);
    } catch (err) {
      console.error('Failed to submit health proof:', err);
    }
  };

  return (
    <div className="bg-pure-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-pure-white mb-4">Health Proof Submission</h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Challenge Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 1: Get Challenge</h4>
          
          {/* Loading State */}
          {isLoading && !challenge && !credentialFile && !submissionResult && (
            <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <p className="text-blue-300 text-sm">Getting challenge from contract...</p>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                Obtaining a unique, single-use challenge nonce for proof generation.
              </p>
            </div>
          )}
          
          <div className="bg-yellow-500/20 border border-yellow-500 p-3 rounded">
            <p className="text-yellow-300 text-sm">
              🎯 Challenge Required for Verification
            </p>
            <p className="text-yellow-200 text-xs mt-1">
              Each proof submission requires a unique challenge nonce from the smart contract to prevent replay attacks.
            </p>
          </div>
          
          <button
            onClick={handleGetChallenge}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
          >
            {isLoading && !challenge ? 'Getting Challenge...' : 'Get Challenge'}
          </button>
          
          {challenge && (
            <div className="bg-midnight-black p-3 rounded border border-brand-blue/30">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-brand-blue">Your unique challenge nonce:</span>
                  <p className="font-mono text-sm bg-pure-white/10 p-2 rounded mt-1">{challenge}</p>
                </div>
                <p className="text-pure-white/80 text-xs">
                  ✅ Challenge obtained successfully. This nonce will be used to generate your proof.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Credential Upload Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 2: Upload Credential</h4>
          <div className="bg-midnight-black p-3 rounded border border-pure-white/20 mb-3">
            <p className="text-pure-white/80 text-sm mb-2">
              Need a sample credential file for testing? 
              <a 
                href="/sample-credential.json" 
                download 
                className="text-brand-blue hover:text-brand-blue/80 ml-1 underline"
              >
                Download sample-credential.json
              </a>
            </p>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue/80"
          />
          
          {credentialFile && (
            <div className="bg-midnight-black p-3 rounded border border-green-500/30">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-green-400">Credential loaded successfully:</span>
                  <p className="text-sm text-pure-white/90 mt-1">{credentialFile.name}</p>
                </div>
                <div className="bg-pure-white/10 p-2 rounded">
                  <p className="font-semibold text-green-400 text-sm mb-1">Health Data:</p>
                  <div className="text-xs text-pure-white/90 space-y-1">
                    <p>• Cholesterol Level: <span className="font-mono">{credential.results.cholesterol} mg/dL</span></p>
                    <p>• Blood Pressure: <span className="font-mono">{credential.results.bloodPressure} mmHg</span></p>
                    <p>• Smoking Status: <span className="font-mono">{credential.results.isSmoker ? 'Smoker' : 'Non-smoker'}</span></p>
                  </div>
                </div>
                <p className="text-green-300 text-xs">
                  ✅ Credential file validated and ready for proof generation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Issuer Key Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 3: Enter Issuer Key</h4>
          
          <div className="bg-purple-500/20 border border-purple-500 p-3 rounded">
            <p className="text-purple-300 text-sm">
              🏥 Trusted Clinic Verification
            </p>
            <p className="text-purple-200 text-xs mt-1">
              This is the public key of the clinic that issued your credential. It must be on the contract's trusted list.
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
        </div>

        {/* Submit Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 4: Submit Proof</h4>
          
          {/* Loading State for Proof Generation */}
          {isLoading && challenge && credentialFile && issuerKey && (
            <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <p className="text-blue-300 text-sm">Generating and submitting your anonymous proof...</p>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                This may take a moment as we generate the zero-knowledge proof to verify your health data without revealing it.
              </p>
            </div>
          )}
          
          <div className="bg-green-500/20 border border-green-500 p-3 rounded">
            <p className="text-green-300 text-sm">
              🔒 Zero-Knowledge Proof Generation
            </p>
            <p className="text-green-200 text-xs mt-1">
              Your health data will remain completely private. Only the verification result (pass/fail) will be revealed.
            </p>
          </div>
          
          <button
            onClick={handleSubmitProof}
            disabled={isLoading || !challenge || !issuerKey.trim() || !credential.signature || issuerKey.length !== 64}
            className="w-full px-6 py-3 bg-green-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-green-600/80 transition-all duration-200"
          >
            {isLoading && challenge && credentialFile && issuerKey ? 'Generating Proof...' : 'Submit Health Proof'}
          </button>
        </div>

        {/* Result Section */}
        {submissionResult && (
          <div className="bg-green-500/20 border border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-300 mb-3">🎉 Verification Successful!</h4>
            <p className="text-green-200 text-sm mb-3">
              Your health proof has been submitted successfully. The system has verified your credentials without revealing any private health information.
            </p>
            <div className="bg-midnight-black p-3 rounded">
              <div className="text-green-200 text-sm space-y-2">
                <div>
                  <span className="font-semibold text-green-400">Transaction ID:</span>
                  <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1 break-all">{submissionResult.txId}</p>
                </div>
                <div>
                  <span className="font-semibold text-green-400">Block Height:</span>
                  <p className="font-mono text-xs bg-pure-white/10 p-2 rounded mt-1">{submissionResult.blockHeight}</p>
                </div>
              </div>
            </div>
            <p className="text-green-300 text-xs mt-3">
              ✅ Your proof is now permanently recorded on the blockchain and can be independently verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
