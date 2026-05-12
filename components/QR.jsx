import { useMemo } from "react";
import { hash32 } from "../lib/hash32.js";
import { rng } from "../lib/rng.js";

export function QR({ value, size = 240, color = "#0a0a0a" }) {
  const N = 29;
  const cell = size / N;
  const cells = useMemo(() => {
    const grid = Array.from({ length: N }, () => Array(N).fill(false));
    const draw = (r, c) => {
      for (let i = 0; i < 7; i++)
        for (let j = 0; j < 7; j++) {
          const onBorder = i === 0 || i === 6 || j === 0 || j === 6;
          const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          if (onBorder || inner) grid[r + i][c + j] = true;
        }
    };
    draw(0, 0);
    draw(0, N - 7);
    draw(N - 7, 0);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) {
        const onBorder = i === 0 || i === 4 || j === 0 || j === 4;
        const inner = i === 2 && j === 2;
        if (onBorder || inner) grid[N - 9 + i][N - 9 + j] = true;
      }
    for (let i = 8; i < N - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }
    const rand = rng(hash32(value || "x"));
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const inFinder = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
        const inAlign = r >= N - 9 && c >= N - 9;
        if (inFinder || inAlign) continue;
        if (r === 6 || c === 6) continue;
        grid[r][c] = rand() > 0.5;
      }
    return grid;
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      aria-label="QR code"
    >
      <rect width={size} height={size} fill="#fff" />
      {cells.map((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={r + "_" + c}
              x={c * cell + 0.5}
              y={r * cell + 0.5}
              width={cell - 0.5}
              height={cell - 0.5}
              fill={color}
              rx={cell * 0.18}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
