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
      await getChallenge(contractAddress);
    } catch (err) {
      console.error('Failed to get challenge:', err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCredentialFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedCredential = JSON.parse(content);
          setCredential(parsedCredential);
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

    try {
      const result = await submitHealthProof(contractAddress, credential, issuerKey.trim());
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
          <button
            onClick={handleGetChallenge}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-brand-blue/80 transition-all duration-200"
          >
            {isLoading ? 'Getting Challenge...' : 'Get Challenge'}
          </button>
          
          {challenge && (
            <div className="bg-midnight-black p-3 rounded border border-pure-white/20">
              <p className="text-pure-white/80 text-sm">Challenge: <span className="font-mono">{challenge}</span></p>
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
            <div className="bg-midnight-black p-3 rounded border border-pure-white/20">
              <p className="text-pure-white/80 text-sm mb-2">Credential loaded: {credentialFile.name}</p>
              <div className="text-xs text-pure-white/60">
                <p>Cholesterol: {credential.results.cholesterol}</p>
                <p>Blood Pressure: {credential.results.bloodPressure}</p>
                <p>Smoker: {credential.results.isSmoker ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Issuer Key Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 3: Enter Issuer Key</h4>
          <input
            type="text"
            value={issuerKey}
            onChange={(e) => setIssuerKey(e.target.value)}
            placeholder="Enter issuer public key (64 characters)"
            className="w-full px-4 py-3 bg-midnight-black border border-pure-white/20 text-pure-white rounded-lg focus:border-brand-blue focus:outline-none"
          />
        </div>

        {/* Submit Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-pure-white">Step 4: Submit Proof</h4>
          <button
            onClick={handleSubmitProof}
            disabled={isLoading || !challenge || !issuerKey.trim() || !credential.signature}
            className="w-full px-6 py-3 bg-green-600 text-pure-white rounded-lg font-outfit disabled:opacity-50 hover:bg-green-600/80 transition-all duration-200"
          >
            {isLoading ? 'Submitting Proof...' : 'Submit Health Proof'}
          </button>
        </div>

        {/* Result Section */}
        {submissionResult && (
          <div className="bg-green-500/20 border border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-300 mb-2">Proof Submitted Successfully!</h4>
            <div className="text-green-200 text-sm space-y-1">
              <p>Transaction ID: {submissionResult.txId}</p>
              <p>Block Height: {submissionResult.blockHeight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
