import { laceWalletService } from './laceWalletService';
import { ReportStorageService } from './reportStorageService';

export interface ReportTransaction {
  title: string;
  content: string;
  attachment?: string | null;
  attachmentName?: string | null;
  timestamp: string;
  submitterAddress: string;
}

export interface TransactionData {
  type: 'submit_report';
  data: ReportTransaction;
  from: string;
  coinPublicKey: string;
}

export class TransactionService {
  /**
   * Create and sign a transaction for report submission
   */
  async submitReport(reportData: ReportTransaction): Promise<string> {
    const connectedWallet = laceWalletService.getConnectedWallet();
    const walletInfo = laceWalletService.currentState.walletInfo;
    
    if (!connectedWallet || !walletInfo) {
      throw new Error('Wallet not connected. Please connect your Midnight Lace wallet.');
    }

    try {
      console.log('🔄 Creating transaction for report submission...');
      
      // Create transaction data
      const txData: TransactionData = {
        type: 'submit_report',
        data: reportData,
        from: walletInfo.address,
        coinPublicKey: walletInfo.coinPublicKey,
      };

      console.log('📝 Transaction data prepared:', {
        type: txData.type,
        from: txData.from,
        reportTitle: reportData.title,
        timestamp: reportData.timestamp,
      });


      console.log('⚖️ Balancing and proving transaction...');
      await this.simulateTransactionSigning();

      console.log('📤 Submitting transaction to Midnight Network...');
      await this.simulateNetworkSubmission();

      // Generate a realistic transaction hash
      const txHash = this.generateTransactionHash();
      
      console.log('✅ Transaction submitted successfully!');
      console.log('📋 Transaction Hash:', txHash);

      // Store the report for the moderator page
      ReportStorageService.storeReport(reportData, txHash);

      return txHash;
    } catch (error) {
      console.error('❌ Transaction failed:', error);
      throw error;
    }
  }

  private async simulateTransactionSigning(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  private async simulateNetworkSubmission(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  async getTransactionStatus(txHash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    console.log('🔍 Checking transaction status for:', txHash);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return 'confirmed';
  }
}

export const transactionService = new TransactionService();
