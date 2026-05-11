import { CopyBtn } from "./CopyBtn.jsx";
import { IconClose } from "./icons/IconClose.jsx";
import { QR } from "./QR.jsx";

export function ReceiveModal({ address, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2>Receive crypto</h2>
            <p>Share your Solana address to receive any supported token.</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <IconClose width="16" height="16" />
          </button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 16 }}>
          <QR value={"solana:" + address} size={220} />
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>Wallet address · Solana</div>
            <div className="addr-row">
              <div className="a">{address}</div>
              <CopyBtn value={address} label="Copy" className="" />
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Only send USDC, USDT, or SOL on the Solana network.</div>
        </div>
      </div>
    </div>
  );
}
