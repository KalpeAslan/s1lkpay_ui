import { clusterApiUrl, Connection } from '@solana/web3.js';

export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL ||
  `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` ||
  clusterApiUrl('devnet');

export const getSolanaConnection = () => new Connection(SOLANA_RPC_URL, 'confirmed');
