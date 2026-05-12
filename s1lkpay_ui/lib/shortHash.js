export function shortHash(s) {
  if (!s) return "";
  return s.slice(0, 4) + "…" + s.slice(-4);
}
