export interface TokenConfig {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  isNative?: boolean;
}

export const SUPPORTED_TOKENS: TokenConfig[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    isNative: true,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: process.env.MINT_USDC || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    mint: process.env.MINT_USDT || '45zcDDKqkWktUKLCdKYHLYznWg4Ypa9XShvuBqnNpgDp',
    decimals: 6,
  },
  {
    symbol: 'KZTE',
    name: 'Kazakhstani Tenge',
    mint: process.env.MINT_KZTE || 'Fc5LwYYMLr5Ea5CFnZ3TGPcyV7od4qu8r3Yot6ewmd3r',
    decimals: 6,
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    mint: process.env.MINT_PEPE || 'HCK7Hu7ZoX9wEiK3dETpBS88J4vj3A659Cj3FUi231dG',
    decimals: 6,
  },
];

export const TOKEN_BY_SYMBOL = Object.fromEntries(
  SUPPORTED_TOKENS.map(t => [t.symbol, t]),
) as Record<string, TokenConfig>;

export const TOKEN_BY_MINT = Object.fromEntries(
  SUPPORTED_TOKENS.map(t => [t.mint, t]),
) as Record<string, TokenConfig>;
