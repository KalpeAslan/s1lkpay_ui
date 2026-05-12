export function TweakSection({ label, title, children }) {
  const head = label ?? title ?? "";
  return (
    <>
      {head ? <div className="twk-sect">{head}</div> : null}
      {children}
    </>
  );
}
