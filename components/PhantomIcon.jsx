export function PhantomIcon({ size = 20 }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #9945ff 0%, #7c3aed 100%)",
        color: "white",
        fontSize: Math.round(size * 0.55),
        fontWeight: 700,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      P
    </span>
  );
}
