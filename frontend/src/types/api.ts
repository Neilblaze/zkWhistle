export interface VerifiableCredential {
  results: {
    cholesterol: number;
    bloodPressure: number;
    isSmoker: boolean;
  };
  signature: string;
}

export interface ContractState {
  owner: string;
  trustedIssuers: Record<string, boolean>;
  usedNonces: Record<string, boolean>;
  modelParameters: {
    riskThreshold: string;
  };
}

export interface WalletState {
  address: string;
  balance: string;
  seed: string;
  type?: 'seed' | 'lace';
  laceInfo?: {
    coinPublicKey: string;
    encryptionPublicKey: string;
  };
}

export interface DeployedContract {
  contractAddress: string;
  deployTxData: {
    public: {
      contractAddress: string;
      txId: string;
      blockHeight: number;
    };
  };
}

export interface TransactionResult {
  txId: string;
  blockHeight: number;
}

export interface ApiError {
  message: string;
  details?: any;
}
