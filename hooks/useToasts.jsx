import { useState } from "react";
import { IconCheck } from "../components/icons/IconCheck.jsx";

export function useToasts() {
  const [items, setItems] = useState([]);
  const push = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, msg }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 2400);
  };
  const node = (
    <div className="toast-wrap">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <IconCheck width="14" height="14" />
          {t.msg}
        </div>
      ))}
    </div>
  );
  return [node, push];
}
