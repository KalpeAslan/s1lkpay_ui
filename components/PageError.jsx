export function PageError({ message = "Something went wrong." }) {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <div style={{ color: "var(--danger, #e54)" }}>{message}</div>
    </div>
  );
}
