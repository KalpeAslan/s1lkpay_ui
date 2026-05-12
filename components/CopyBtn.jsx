import { useState } from "react";
import { IconCheck } from "./icons/IconCheck.jsx";
import { IconCopy } from "./icons/IconCopy.jsx";

export function CopyBtn({ value, label = "Copy", className = "btn btn-sm", onCopy }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={className}
      onClick={() => {
        try {
          navigator.clipboard?.writeText(value);
        } catch {
          /* ignore */
        }
        setDone(true);
        onCopy && onCopy();
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <IconCheck width="14" height="14" /> : <IconCopy width="14" height="14" />}
      {done ? "Copied" : label}
    </button>
  );
}
