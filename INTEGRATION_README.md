# zkWhistle Frontend-Backend Integration

This document explains how the frontend and backend of the zkWhistle health credential verification system are integrated and how to use them together.

## Overview

The zkWhistle system allows users to verify their health credentials using zero-knowledge proofs while maintaining privacy. The system has two main roles:

1. **User Mode**: For individuals wanting to verify their health credentials
2. **Admin Mode**: For administrators managing the smart contract and trusted issuers

## Architecture

### Backend (CLI Application)
- Located in `/backend/`
- Written in TypeScript using Midnight Network libraries
- Provides core functionality for:
  - Wallet management
  - Smart contract deployment and interaction
  - Zero-knowledge proof generation and verification
  - Issuer management

### Frontend (Web Application)
- Located in `/frontend/`
- React + TypeScript application with Tailwind CSS
- Provides a user-friendly interface for all backend functionality
- Mock API service that simulates backend calls

## Getting Started

### Prerequisites
- Node.js 18+
- NPM or Yarn
- Access to Midnight Network testnet

### Installation

1. **Install dependencies for the entire project:**
   ```bash
   cd /home/abhij/zkWhistle
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Using the Application

### 1. Wallet Setup
The first step for both users and administrators is to set up a wallet:

- **Build Fresh Wallet**: Creates a new wallet with a random seed
- **Restore from Seed**: Restores an existing wallet using a 64-character hex seed

The wallet is required to interact with the Midnight Network and pay for transactions.

### 2. Contract Setup
After wallet setup, you need to either deploy a new contract or join an existing one:

- **Deploy New Contract**: Requires an owner secret key (64-character hex string)
- **Join Existing Contract**: Requires the contract address of an existing verifier contract

### 3. User Mode - Health Proof Verification

In User Mode, individuals can verify their health credentials:

1. **Get Challenge**: Obtain a unique challenge nonce from the smart contract
2. **Upload Credential**: Upload a JSON file containing health data and signature
   - Sample file available: [Download sample-credential.json](/sample-credential.json)
3. **Enter Issuer Key**: Provide the public key of the trusted issuer (clinic)
4. **Submit Proof**: Generate and submit a zero-knowledge proof

#### Sample Credential Format
```json
{
  "results": {
    "cholesterol": 150,
    "bloodPressure": 120,
    "isSmoker": false
  },
  "signature": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

### 4. Admin Mode - Contract Management

In Admin Mode, administrators can manage the smart contract:

1. **Add Issuer**: Add a trusted clinic/issuer to the contract
2. **Revoke Issuer**: Remove a clinic/issuer from the trusted list
3. **View Contract State**: Display current contract state including trusted issuers

## API Integration

### Current Implementation
The frontend currently uses a **mock API service** (`/frontend/src/services/api.ts`) that simulates backend responses. This allows for frontend development and testing without requiring a full backend server.

### Production Integration
To connect to the actual backend, you would need to:

1. **Create a Backend Server**: Wrap the CLI functionality in an HTTP server (Express.js, etc.)
2. **Update API Service**: Replace mock implementations with actual HTTP requests
3. **Handle Authentication**: Implement proper wallet authentication between frontend and backend
4. **Error Handling**: Add comprehensive error handling for network and blockchain interactions

### Key API Functions
- `buildFreshWallet()` - Create new wallet
- `buildWalletFromSeed(seed)` - Restore wallet from seed
- `deployContract(ownerSecretKey)` - Deploy new verifier contract
- `joinContract(contractAddress)` - Join existing contract
- `addIssuer(contractAddress, ownerSecretKey, issuerKey)` - Add trusted issuer
- `revokeIssuer(contractAddress, ownerSecretKey, issuerKey)` - Revoke issuer
- `getChallenge(contractAddress)` - Get verification challenge
- `submitHealthProof(contractAddress, credential, challenge, issuerKey)` - Submit proof

## Features

### User Experience
- **Step-by-step workflow**: Clear progression from wallet to contract to action
- **Mode switching**: Easy toggle between User and Admin modes
- **Real-time feedback**: Loading states and error messages
- **Sample data**: Downloadable sample credential for testing

### Security
- **Zero-knowledge proofs**: Health data privacy is maintained
- **Cryptographic verification**: All transactions are cryptographically secure
- **Trusted issuer system**: Only authorized clinics can issue valid credentials

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run typecheck # Run TypeScript checks
```

### Backend Development
```bash
cd backend
npm run build           # Build TypeScript
npm run testnet-remote  # Run CLI application
npm run issuer-tool     # Generate issuer credentials
```

## Troubleshooting

### Common Issues

1. **Linting Errors**: Ensure all imports use `import type` for TypeScript types
2. **Wallet Connection**: Verify you have sufficient testnet tokens
3. **Contract Deployment**: Ensure owner secret key is exactly 64 characters
4. **File Upload**: Credential files must be valid JSON format

### Network Issues
- Ensure connection to Midnight Network testnet
- Check that the proof server is running (default: http://127.0.0.1:6300)
- Verify indexer and node URLs are accessible

## Next Steps

1. **Backend Server**: Implement HTTP server wrapper around CLI functionality
2. **Real Integration**: Replace mock API with actual backend calls
3. **Authentication**: Implement secure wallet-based authentication
4. **State Management**: Add Redux or similar for complex state management
5. **Testing**: Add comprehensive unit and integration tests
6. **Deployment**: Set up production deployment pipeline

## Support

For technical issues or questions about the integration, please refer to:
- Backend documentation in `/backend/README.md`
- Frontend documentation in `/frontend/README.md`
- Midnight Network documentation
