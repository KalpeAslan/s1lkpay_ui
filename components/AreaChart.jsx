export function AreaChart({ series, height = 240 }) {
  const W = 720;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 14;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const vals = series.values;
  const max = Math.max(...vals, 1);
  const min = 0;
  const stepX = innerW / (vals.length - 1);
  const xs = vals.map((_, i) => padL + i * stepX);
  const ys = vals.map((v) => padT + innerH - ((v - min) / (max - min || 1)) * innerH);

  const linePath = xs
    .map((x, i) => {
      if (i === 0) return `M ${x},${ys[i]}`;
      const px = xs[i - 1];
      const py = ys[i - 1];
      const cx1 = px + stepX / 2;
      const cy1 = py;
      const cx2 = x - stepX / 2;
      const cy2 = ys[i];
      return `C ${cx1},${cy1} ${cx2},${cy2} ${x},${ys[i]}`;
    })
    .join(" ");
  const area = linePath + ` L ${xs[xs.length - 1]},${padT + innerH} L ${xs[0]},${padT + innerH} Z`;

  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: padT + t * innerH,
    val: max - t * (max - min),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img">
      <defs>
        <linearGradient id="areagrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => (
        <g key={i}>
          <line
            x1={padL}
            y1={g.y}
            x2={W - padR}
            y2={g.y}
            stroke="var(--line-2)"
            strokeWidth="1"
            strokeDasharray={i === grid.length - 1 ? "0" : "2,3"}
          />
          <text
            x={padL - 8}
            y={g.y + 4}
            fontSize="10"
            textAnchor="end"
            fill="var(--muted)"
            fontFamily="Geist Mono"
          >
            {g.val >= 1000 ? (g.val / 1000).toFixed(1) + "k" : g.val.toFixed(0)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#areagrad)" />
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={i === xs.length - 1 ? 4 : 0}
          fill="var(--accent)"
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {series.labels.map((l, i) =>
        i % 2 === 0 ? (
          <text key={i} x={xs[i]} y={H - 8} fontSize="10.5" textAnchor="middle" fill="var(--muted)" fontFamily="Geist">
            {l}
          </text>
        ) : null,
      )}
    </svg>
  );
}
