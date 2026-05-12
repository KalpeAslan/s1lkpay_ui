import { useNow } from "../hooks/useNow.jsx";

export function Countdown({ to, compact }) {
  const now = useNow(1000);
  const ms = Math.max(0, new Date(to).getTime() - now);
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => x.toString().padStart(2, "0");
  if (compact) return <span className="mono">{d > 0 ? `${d}d ` : ""}{pad(h)}:{pad(m)}:{pad(sec)}</span>;
  return (
    <div className="countdown">
      <div className="seg">
        <b>{d}</b>
        <small>days</small>
      </div>
      <div className="sep">:</div>
      <div className="seg">
        <b>{pad(h)}</b>
        <small>hrs</small>
      </div>
      <div className="sep">:</div>
      <div className="seg">
        <b>{pad(m)}</b>
        <small>min</small>
      </div>
      <div className="sep">:</div>
      <div className="seg">
        <b>{pad(sec)}</b>
        <small>sec</small>
      </div>
    </div>
  );
}
