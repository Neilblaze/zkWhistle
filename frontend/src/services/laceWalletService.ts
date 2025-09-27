// Simplified types for Midnight Lace wallet integration
// These will be replaced with actual @midnight-ntwrk types when available

interface DAppConnectorAPI {
  apiVersion: string;
  isEnabled(): Promise<boolean>;
  enable(): Promise<DAppConnectorWalletAPI>;
  serviceUriConfig(): Promise<ServiceUriConfig>;
}

interface DAppConnectorWalletAPI {
  state(): Promise<WalletInfo>;
  balanceAndProveTransaction(tx: any, newCoins: any[]): Promise<any>;
  submitTransaction(tx: any): Promise<string>;
}

interface ServiceUriConfig {
  indexerUri: string;
  indexerWsUri: string;
  proverServerUri: string;
}

interface WalletInfo {
  coinPublicKey: string;
  encryptionPublicKey: string;
  address: string;
}

export interface LaceWalletInfo {
  coinPublicKey: string;
  encryptionPublicKey: string;
  address: string;
}

export interface LaceWalletState {
  isConnected: boolean;
  walletInfo: LaceWalletInfo | null;
  isConnecting: boolean;
  error: string | null;
}

// Simple Observable implementation for wallet state
class SimpleObservable<T> {
  private subscribers: Array<(value: T) => void> = [];
  private currentValue: T;
  
  constructor(value: T) {
    this.currentValue = value;
  }
  
  subscribe(callback: (value: T) => void): { unsubscribe: () => void } {
    this.subscribers.push(callback);
    callback(this.currentValue); // Emit current value immediately
    
    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(callback);
        if (index > -1) {
          this.subscribers.splice(index, 1);
        }
      }
    };
  }
  
  next(newValue: T): void {
    this.currentValue = newValue;
    this.subscribers.forEach(callback => callback(newValue));
  }
  
  getValue(): T {
    return this.currentValue;
  }
  
  asObservable(): SimpleObservable<T> {
    return this;
  }
}

/**
 * Service for connecting to and managing the Midnight Lace wallet extension
 */
export class LaceWalletService {
  private walletStateSubject = new SimpleObservable<LaceWalletState>({
    isConnected: false,
    walletInfo: null,
    isConnecting: false,
    error: null,
  });

  private connectedWallet: DAppConnectorWalletAPI | null = null;
  private serviceUris: ServiceUriConfig | null = null;

  constructor() {
    // Check if wallet is already connected on initialization
    this.checkExistingConnection();
  }

  get walletState$(): SimpleObservable<LaceWalletState> {
    return this.walletStateSubject.asObservable();
  }

  get currentState(): LaceWalletState {
    return this.walletStateSubject.getValue();
  }

  private async checkExistingConnection(): Promise<void> {
    try {
      const connectorAPI = await this.getConnectorAPI();
      const isEnabled = await connectorAPI.isEnabled();
      
      if (isEnabled) {
        await this.connectToWallet();
      }
    } catch (error) {
      // Silent fail for checking existing connection
      console.debug('No existing wallet connection found:', error);
    }
  }

  /**
   * Connect to the Midnight Lace wallet extension
   */
  async connect(): Promise<LaceWalletInfo> {
    this.updateState({ isConnecting: true, error: null });

    try {
      const { wallet, uris } = await this.connectToWallet();
      const walletState = await wallet.state();

      const walletInfo: LaceWalletInfo = {
        coinPublicKey: walletState.coinPublicKey,
        encryptionPublicKey: walletState.encryptionPublicKey,
        address: walletState.address,
      };

      this.connectedWallet = wallet;
      this.serviceUris = uris;

      this.updateState({
        isConnected: true,
        walletInfo,
        isConnecting: false,
        error: null,
      });

      return walletInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to wallet';
      
      this.updateState({
        isConnected: false,
        walletInfo: null,
        isConnecting: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * Disconnect from the wallet
   */
  async disconnect(): Promise<void> {
    this.connectedWallet = null;
    this.serviceUris = null;

    this.updateState({
      isConnected: false,
      walletInfo: null,
      isConnecting: false,
      error: null,
    });
  }

  /**
   * Get the connected wallet instance for transaction operations
   */
  getConnectedWallet(): DAppConnectorWalletAPI | null {
    return this.connectedWallet;
  }

  /**
   * Get service URIs for network configuration
   */
  getServiceUris(): ServiceUriConfig | null {
    return this.serviceUris;
  }

  private updateState(partial: Partial<LaceWalletState>): void {
    const currentState = this.walletStateSubject.getValue();
    this.walletStateSubject.next({ ...currentState, ...partial });
  }

  private async getConnectorAPI(): Promise<DAppConnectorAPI> {
    const COMPATIBLE_CONNECTOR_API_VERSION = '1.';

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds with 100ms intervals
      
      const checkForWallet = () => {
        // Debug: Check what's available in window.midnight
        console.log('🔍 Debugging Midnight Lace Detection:');
        console.log('window.midnight:', (window as any).midnight);
        
        if ((window as any).midnight) {
          console.log('Available properties:', Object.keys((window as any).midnight));
          
          // Check for different possible API locations
          const possiblePaths = [
            (window as any).midnight?.mnLace,
            (window as any).midnight?.lace,
            (window as any).midnight?.wallet,
            (window as any).midnight
          ];
          
          possiblePaths.forEach((api, index) => {
            if (api) {
              console.log(`Found API at path ${index}:`, api);
              console.log('API properties:', Object.keys(api));
              if (api.apiVersion) {
                console.log('API Version:', api.apiVersion);
              }
            }
          });
        }
        
        // Try multiple possible API paths for preview versions
        const connectorAPI = (window as any).midnight?.mnLace || 
                           (window as any).midnight?.lace ||
                           (window as any).midnight?.wallet;
        
        if (connectorAPI) {
          console.log('✅ Found connector API:', connectorAPI);
          console.log('API Version:', connectorAPI.apiVersion);
          
          // More lenient version check for preview versions
          if (!connectorAPI.apiVersion || 
              connectorAPI.apiVersion.startsWith(COMPATIBLE_CONNECTOR_API_VERSION) ||
              connectorAPI.apiVersion.includes('preview') ||
              connectorAPI.apiVersion.includes('dev')) {
            console.log('✅ API version compatible or preview version');
            resolve(connectorAPI);
          } else {
            reject(new Error(
              `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}x', got '${connectorAPI.apiVersion}'.`
            ));
          }
        } else if (attempts >= maxAttempts) {
          console.log('❌ No Midnight Lace wallet found after', maxAttempts, 'attempts');
          console.log('Final window.midnight state:', (window as any).midnight);
          reject(new Error('Could not find Midnight Lace wallet. Extension installed?'));
        } else {
          attempts++;
          setTimeout(checkForWallet, 100);
        }
      };
      
      checkForWallet();
    });
  }

  private async connectToWallet(): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> {
    const connectorAPI = await this.getConnectorAPI();
    
    console.log('🔍 Checking if wallet is enabled...');
    const isEnabled = await connectorAPI.isEnabled();
    console.log('Wallet enabled status:', isEnabled);
    
    if (!isEnabled) {
      console.log('🚀 Wallet not enabled, attempting to enable...');
      // For preview versions, we try to enable directly instead of throwing an error
      try {
        const walletConnectorAPI = await connectorAPI.enable();
        if (!walletConnectorAPI) {
          throw new Error('Failed to enable wallet. Please check your Lace extension and try again.');
        }
        
        console.log('✅ Wallet enabled successfully');
        const uris = await connectorAPI.serviceUriConfig();
        return { wallet: walletConnectorAPI, uris };
        
      } catch (enableError) {
        console.error('Enable error:', enableError);
        throw new Error(
          'Please enable the zkWhistle app in your Lace wallet:\n\n' +
          '1. Click on the Lace extension icon\n' +
          '2. Go to Settings or Connected Sites\n' +
          '3. Find zkWhistle and enable it\n' +
          '4. Refresh this page and try again'
        );
      }
    }

    console.log('✅ Wallet already enabled, getting wallet API...');
    const walletConnectorAPI = await connectorAPI.enable();
    if (!walletConnectorAPI) {
      throw new Error('Application is not authorized. Please authorize this application in your wallet.');
    }

    const uris = await connectorAPI.serviceUriConfig();
    console.log('✅ Successfully connected to wallet');

    return { wallet: walletConnectorAPI, uris };
  }
}

// Global instance
export const laceWalletService = new LaceWalletService();
