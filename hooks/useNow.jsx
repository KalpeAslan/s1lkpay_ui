import { useEffect, useState } from "react";

export function useNow(intervalMs = 1000) {
  const [n, setN] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setN(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return n;
}
