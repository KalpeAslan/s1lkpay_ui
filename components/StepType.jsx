import { IconCard } from "./icons/IconCard.jsx";
import { IconSend } from "./icons/IconSend.jsx";
import { IconWallet } from "./icons/IconWallet.jsx";

export function StepType({ type, setType }) {
  const options = [
    {
      id: "all",
      title: "Withdraw all funds",
      desc: "Cash out every token in your wallet at once.",
      icon: <IconWallet width="18" height="18" />,
      accent: false,
    },
    {
      id: "crypto",
      title: "Withdraw a specific token",
      desc: "Send a precise amount of one token to another wallet.",
      icon: <IconSend width="18" height="18" />,
      accent: false,
    },
    {
      id: "fiat",
      title: "Convert to fiat & withdraw to card",
      desc: "Sell crypto for USD, KZT, or VND and pay out to your bank card.",
      icon: <IconCard width="18" height="18" />,
      accent: true,
    },
  ];
  return (
    <>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Choose withdrawal type</h3>
      <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>How would you like to move funds out of your wallet?</p>
      <div className="option-grid">
        {options.map((o) => (
          <button key={o.id} className={"option-card" + (type === o.id ? " active" : "")} onClick={() => setType(o.id)}>
            <div className={"ico" + (o.accent ? " accent" : "")}>{o.icon}</div>
            <h4>{o.title}</h4>
            <p>{o.desc}</p>
          </button>
        ))}
      </div>
    </>
  );
}
