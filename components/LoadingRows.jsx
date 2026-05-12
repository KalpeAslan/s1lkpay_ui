export function LoadingRows({ cols = 6, rows = 5 }) {
  return Array.from({ length: rows }, (_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }, (_, j) => (
        <td key={j}>
          <div
            className="skeleton"
            style={{ height: 14, borderRadius: 4, background: "var(--surface-2)", width: j === 0 ? 60 : "80%" }}
          />
        </td>
      ))}
    </tr>
  ));
}
