import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { User } from '../entities/user.entity';
import { SolanaService } from './solana.service';
import { encrypt, decrypt } from '../utils/crypto.utils';
import { TOKEN_BY_SYMBOL } from '../config/tokens.config';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    private solanaService: SolanaService,
  ) {}

  async createWallet(user: User): Promise<Wallet> {
    const { publicKey, privateKeyBase64 } = this.solanaService.generateKeypair();
    const encryptedPrivateKey = encrypt(privateKeyBase64);

    const wallet = this.walletRepo.create({
      publicKey,
      encryptedPrivateKey,
      user,
      userId: user.id,
    });

    return this.walletRepo.save(wallet);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.getWallet(userId);
    const balances = await this.solanaService.getAllBalances(wallet.publicKey);
    const totalUsd = balances.reduce((sum, b) => sum + b.usdValue, 0);

    return {
      publicKey: wallet.publicKey,
      balances,
      totalUsd: Math.round(totalUsd * 100) / 100,
    };
  }

  async getTransactions(userId: string) {
    const wallet = await this.getWallet(userId);
    return this.solanaService.getRecentTransactions(wallet.publicKey);
  }

  async exportWallet(userId: string) {
    const wallet = await this.getWallet(userId);
    const privateKeyBase64 = decrypt(wallet.encryptedPrivateKey);
    const keypair = this.solanaService.keypairFromBase64(privateKeyBase64);

    return {
      publicKey: wallet.publicKey,
      privateKeyBase64,
      warning: 'Keep your private key safe. Anyone with this key has full access to your wallet.',
    };
  }

  async withdraw(
    userId: string,
    toAddress: string,
    token: string,
    amount: number,
  ): Promise<string> {
    const wallet = await this.getWallet(userId);
    const privateKeyBase64 = decrypt(wallet.encryptedPrivateKey);

    if (token === 'SOL') {
      return this.solanaService.transferSOL(privateKeyBase64, toAddress, amount);
    }

    const tokenConfig = TOKEN_BY_SYMBOL[token];
    if (!tokenConfig) throw new NotFoundException(`Token ${token} not supported`);

    return this.solanaService.transferSPLToken(
      privateKeyBase64,
      toAddress,
      tokenConfig.mint,
      amount,
      tokenConfig.decimals,
    );
  }

  async withdrawFiat(userId: string, cardNumber: string, token: string, amount: number) {
    const wallet = await this.getWallet(userId);
    const balances = await this.solanaService.getAllBalances(wallet.publicKey);
    const tokenBalance = balances.find(b => b.symbol === token);

    return {
      status: 'processing',
      mock: true,
      message: 'Fiat withdrawal initiated (demo mode)',
      from: { token, amount, usdValue: tokenBalance?.usdValue ?? 0 },
      to: { card: `****${cardNumber.slice(-4)}`, estimatedArrival: '1-3 business days' },
      fee: { percent: 1.5, usd: Number((amount * 0.015).toFixed(2)) },
    };
  }

  async withdrawAll(userId: string, toAddress: string): Promise<{ results: any[] }> {
    const wallet = await this.getWallet(userId);
    const privateKeyBase64 = decrypt(wallet.encryptedPrivateKey);
    const balances = await this.solanaService.getAllBalances(wallet.publicKey);
    const results: any[] = [];

    for (const b of balances) {
      if (b.balance <= 0) continue;
      try {
        let txHash: string;
        if (b.symbol === 'SOL') {
          const keepForFees = 0.01;
          if (b.balance <= keepForFees) continue;
          txHash = await this.solanaService.transferSOL(
            privateKeyBase64, toAddress, b.balance - keepForFees,
          );
        } else {
          const tokenConfig = TOKEN_BY_SYMBOL[b.symbol];
          txHash = await this.solanaService.transferSPLToken(
            privateKeyBase64, toAddress, b.mint, b.balance, tokenConfig.decimals,
          );
        }
        results.push({ token: b.symbol, amount: b.balance, txHash, status: 'success' });
      } catch (err) {
        results.push({ token: b.symbol, amount: b.balance, error: err.message, status: 'failed' });
      }
    }

    return { results };
  }
}
