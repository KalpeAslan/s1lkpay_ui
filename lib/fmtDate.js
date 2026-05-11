export function fmtDate(d, opts = {}) {
  const o = { month: "short", day: "numeric", ...opts };
  return new Date(d).toLocaleDateString("en-US", o);
}
