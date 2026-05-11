import { TweakRow } from "./TweakRow.jsx";

export function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input
        className="twk-field"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </TweakRow>
  );
}
