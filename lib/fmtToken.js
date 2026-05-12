import { fmtAmt } from "./fmtAmt.js";

export function fmtToken(n, sym) {
  const d = sym === "SOL" ? 3 : 2;
  return fmtAmt(n, d) + " " + sym;
}
