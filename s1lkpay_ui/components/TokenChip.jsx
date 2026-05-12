import { TokenLogo } from "./TokenLogo.jsx";

export function TokenChip({ sym }) {
  return (
    <span className="tk">
      <TokenLogo sym={sym} />
      {sym}
    </span>
  );
}
