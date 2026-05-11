import { fmtAmt } from "./fmtAmt.js";

export function fmtUSD(n) {
  return "$" + fmtAmt(n, 2);
}
