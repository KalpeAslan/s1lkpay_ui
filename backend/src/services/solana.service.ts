import { Injectable, Logger } from '@nestjs/common';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getMint,
  getAccount,
} from '@solana/spl-token';
import { getSolanaConnection } from '../config/solana.config';
import { TOKEN_BY_SYMBOL, TOKEN_BY_MINT, SUPPORTED_TOKENS } from '../config/tokens.config';

export interface TokenBalance {
  symbol: string;
  name: string;
  mint: string;
  balance: number;
  usdValue: number;
}

const USD_PRICES: Record<string, number> = {
  SOL: 152.5,
  USDC: 1,
  USDT: 1,
  KZTE: 0.002,
  PEPE: 0.000012,
};

@Injectable()
export class SolanaService {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;

  constructor() {
    this.connection = getSolanaConnection();
  }

  generateKeypair(): { publicKey: string; privateKeyBase64: string } {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKeyBase64: Buffer.from(keypair.secretKey).toString('base64'),
    };
  }

  keypairFromBase64(base64: string): Keypair {
    return Keypair.fromSecretKey(Uint8Array.from(Buffer.from(base64, 'base64')));
  }

  async getSolBalance(publicKey: string): Promise<number> {
    try {
      const lamports = await this.connection.getBalance(new PublicKey(publicKey));
      return lamports / LAMPORTS_PER_SOL;
    } catch {
      return 0;
    }
  }

  async getAllBalances(publicKey: string): Promise<TokenBalance[]> {
    const balances: TokenBalance[] = [];
    const pubkey = new PublicKey(publicKey);

    const solBalance = await this.getSolBalance(publicKey);
    balances.push({
      symbol: 'SOL',
      name: 'Solana',
      mint: TOKEN_BY_SYMBOL['SOL'].mint,
      balance: solBalance,
      usdValue: solBalance * (USD_PRICES['SOL'] || 0),
    });

    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      for (const { account } of tokenAccounts.value) {
        const info = account.data.parsed?.info;
        if (!info) continue;

        const mint = info.mint;
        const tokenConfig = TOKEN_BY_MINT[mint];
        if (!tokenConfig) continue;

        const balance = info.tokenAmount?.uiAmount ?? 0;
        balances.push({
          symbol: tokenConfig.symbol,
          name: tokenConfig.name,
          mint,
          balance,
          usdValue: balance * (USD_PRICES[tokenConfig.symbol] || 0),
        });
      }
    } catch (err) {
      this.logger.warn('Could not fetch token accounts: ' + err.message);
    }

    return balances;
  }

  async transferSOL(
    fromBase64: string,
    toAddress: string,
    amountSOL: number,
  ): Promise<string> {
    const from = this.keypairFromBase64(fromBase64);
    const to = new PublicKey(toAddress);
    const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL);

    const tx = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: from.publicKey, toPubkey: to, lamports }),
    );

    const sig = await sendAndConfirmTransaction(this.connection, tx, [from]);
    return sig;
  }

  async transferSPLToken(
    fromBase64: string,
    toAddress: string,
    mintAddress: string,
    amount: number,
    decimals: number,
  ): Promise<string> {
    const from = this.keypairFromBase64(fromBase64);
    const mint = new PublicKey(mintAddress);
    const to = new PublicKey(toAddress);

    const fromATA = await getOrCreateAssociatedTokenAccount(
      this.connection, from, mint, from.publicKey,
    );
    const toATA = await getOrCreateAssociatedTokenAccount(
      this.connection, from, mint, to,
    );

    const rawAmount = BigInt(Math.floor(amount * Math.pow(10, decimals)));

    const tx = new Transaction().add(
      createTransferInstruction(fromATA.address, toATA.address, from.publicKey, rawAmount),
    );

    const sig = await sendAndConfirmTransaction(this.connection, tx, [from]);
    return sig;
  }

  async getRecentTransactions(publicKey: string, limit = 20) {
    try {
      const pubkey = new PublicKey(publicKey);
      const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });
      return signatures.map(s => ({
        txHash: s.signature,
        blockTime: s.blockTime ? new Date(s.blockTime * 1000) : null,
        status: s.err ? 'failed' : 'success',
      }));
    } catch {
      return [];
    }
  }
}
