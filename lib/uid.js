export function uid(prefix = "pl") {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}
