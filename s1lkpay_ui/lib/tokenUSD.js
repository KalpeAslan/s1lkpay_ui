import { TOKENS } from "../constants/tokens.js";

export function tokenUSD(sym, amount) {
  const rate = TOKENS[sym]?.rate ?? 0;
  return amount * rate;
}
