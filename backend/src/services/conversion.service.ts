import { Injectable, Logger } from '@nestjs/common';

const USD_PRICES: Record<string, number> = {
  SOL: 152.5,
  USDC: 1,
  USDT: 1,
  KZTE: 0.002,
  PEPE: 0.000012,
};

export interface ConversionResult {
  fromToken: string;
  fromAmount: number;
  toToken: string;
  toAmount: number;
  rate: number;
  mock: boolean;
}

@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name);

  getRate(fromToken: string, toToken: string): number {
    const fromUsd = USD_PRICES[fromToken] ?? 1;
    const toUsd = USD_PRICES[toToken] ?? 1;
    return fromUsd / toUsd;
  }

  convert(fromToken: string, fromAmount: number, toToken: string): ConversionResult {
    const rate = this.getRate(fromToken, toToken);
    const toAmount = Number((fromAmount * rate).toFixed(6));

    this.logger.log(`Mock convert: ${fromAmount} ${fromToken} → ${toAmount} ${toToken} (rate: ${rate})`);

    return { fromToken, fromAmount, toToken, toAmount, rate, mock: true };
  }

  getSupportedTokens() {
    return Object.entries(USD_PRICES).map(([symbol, usdPrice]) => ({
      symbol,
      usdPrice,
    }));
  }

  toUsd(token: string, amount: number): number {
    return amount * (USD_PRICES[token] ?? 0);
  }
}
