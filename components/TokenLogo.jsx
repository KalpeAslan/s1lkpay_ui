export function TokenLogo({ sym, size }) {
  const map = { USDC: "$", USDT: "₮", SOL: "◎", KZTE: "₸", PEPE: "P" };
  const style = size
    ? {
        width: size,
        height: size,
        fontSize: Math.round(size * 0.45),
        flex: `0 0 ${size}px`,
      }
    : {};
  return (
    <span className={"tk-logo tk-" + sym} style={style}>
      {map[sym] || sym[0]}
    </span>
  );
}
