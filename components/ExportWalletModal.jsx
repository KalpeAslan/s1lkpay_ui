import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { CopyBtn } from "./CopyBtn.jsx";
import { IconClose } from "./icons/IconClose.jsx";
import { IconDownload } from "./icons/IconDownload.jsx";
import { IconEye } from "./icons/IconEye.jsx";
import { IconLock } from "./icons/IconLock.jsx";
import { IconWarn } from "./icons/IconWarn.jsx";

export function ExportWalletModal({ onClose }) {
  const qc = useQueryClient();
  const [confirmed, setConfirmed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [exportPayload, setExportPayload] = useState(null);
  const [localErr, setLocalErr] = useState("");

  const { data: record, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["wallet", "custodial-record"],
    queryFn: api.walletRecord,
    retry: 1,
  });

  const queryErrMsg = isError ? (error instanceof Error ? error.message : String(error ?? "")) : "";
  const walletNotFound = isError && /not found|404|wallet not found/i.test(queryErrMsg);
  const loadFailedOther = isError && !walletNotFound;

  const exportMut = useMutation({
    mutationFn: () => api.exportWallet(),
    onSuccess: (data) => {
      setExportPayload(data);
      setRevealed(true);
      setLocalErr("");
    },
    onError: (e) => {
      setLocalErr(e.message || "Could not export wallet.");
    },
  });

  const createMut = useMutation({
    mutationFn: () => api.createCustodialWallet(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet", "custodial-record"] });
      refetch();
      setLocalErr("");
    },
    onError: (e) => setLocalErr(e.message || "Could not create wallet."),
  });

  const onReveal = () => {
    if (!confirmed || exportMut.isPending) return;
    setLocalErr("");
    exportMut.mutate();
  };

  const onDownloadJson = () => {
    if (!record || !exportPayload) return;
    const body = {
      walletId: record.id,
      publicKey: exportPayload.publicKey ?? record.publicKey,
      privateKeyBase64: exportPayload.privateKeyBase64,
      encryptedPrivateKey: record.encryptedPrivateKey,
      warning: exportPayload.warning,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(body, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "s1lk-wallet-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconWarn width="18" height="18" style={{ color: "oklch(0.55 0.18 25)" }} />
              Export your wallet
            </h2>
            <p>Read this carefully before continuing.</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <IconClose width="16" height="16" />
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: 14 }}>
          <div className="danger-block">
            Exporting transfers full control of this wallet to you. <b>S1lk PAY cannot recover funds if your key is lost or stolen.</b>
            <ul>
              <li>Anyone with your secret key can move every token in this wallet.</li>
              <li>Store it offline — never in email, screenshots, or cloud notes.</li>
              <li>Customer payments will continue arriving to this address until you switch payout settings.</li>
            </ul>
          </div>

          {(localErr || (isError && queryErrMsg)) && (
            <div className="auth-err" style={{ marginBottom: 12 }}>
              {localErr || queryErrMsg}
            </div>
          )}

          {isLoading && <div style={{ color: "var(--muted)", padding: "12px 0" }}>Loading wallet…</div>}

          {walletNotFound && !isLoading && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p style={{ color: "var(--muted)", marginBottom: 12 }}>No custodial wallet found for this account.</p>
              <button className="btn btn-primary" type="button" disabled={createMut.isPending} onClick={() => createMut.mutate()}>
                {createMut.isPending ? "Creating…" : "Create wallet"}
              </button>
            </div>
          )}

          {loadFailedOther && !isLoading && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <button className="btn btn-sm" type="button" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && record && !walletNotFound && (
            <>
              <div className="field" style={{ marginTop: 8 }}>
                <label>Public address</label>
                <div className="addr-row">
                  <div className="a mono">{record.publicKey}</div>
                  <CopyBtn value={record.publicKey} label="Copy" className="" />
                </div>
              </div>
              <div className="field">
                <label>
                  Wallet ID <small className="muted">custodial record</small>
                </label>
                <div className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                  {record.id}
                </div>
              </div>
              <div className="field">
                <label>
                  Encrypted secret <small className="muted">stored on server (AES-256-GCM)</small>
                </label>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    wordBreak: "break-all",
                    color: "var(--muted)",
                    maxHeight: 72,
                    overflow: "auto",
                    padding: 8,
                    background: "var(--surface-2)",
                    borderRadius: 8,
                  }}
                >
                  {record.encryptedPrivateKey || "—"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <CopyBtn value={record.encryptedPrivateKey || ""} label="Copy ciphertext" className="btn btn-sm" />
                </div>
              </div>
              {record.createdAt && (
                <div className="field">
                  <label>Created</label>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{new Date(record.createdAt).toLocaleString()}</div>
                </div>
              )}
            </>
          )}

          {!revealed && record && !isLoading && (
            <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--surface-2)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 10px",
                }}
              >
                <IconLock width="22" height="22" />
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 420, margin: "0 auto" }}>
                When you continue, the server will decrypt your custodial secret key once. Make sure you are in a private place.
              </div>
            </div>
          )}

          {!isLoading && record && !revealed && (
            <div style={{ margin: "14px 0" }}>
              <div className="confirm-row" onClick={() => setConfirmed((c) => !c)}>
                <input type="checkbox" checked={confirmed} readOnly />
                <label>I understand that S1lk PAY cannot help me recover this wallet.</label>
              </div>
            </div>
          )}

          {revealed && exportPayload && (
            <>
              <div style={{ margin: "16px 0 6px", fontWeight: 600, fontSize: 13.5 }}>Secret key (base64)</div>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 8px" }}>
                {exportPayload.warning || "Keep this key private. Import into Phantom or another Solana wallet using this raw secret."}
              </p>
              <div className="addr-row">
                <div className="a mono" style={{ fontSize: 11, wordBreak: "break-all" }}>
                  {exportPayload.privateKeyBase64}
                </div>
                <CopyBtn value={exportPayload.privateKeyBase64} label="Copy" className="" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={onDownloadJson}>
                  <IconDownload width="14" height="14" /> Download backup (.json)
                </button>
              </div>
            </>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>
            {revealed ? "Done" : "Cancel"}
          </button>
          {!revealed && record && !isLoading && (
            <button className="btn btn-primary" disabled={!confirmed || exportMut.isPending} onClick={onReveal}>
              <IconEye width="14" height="14" /> {exportMut.isPending ? "Decrypting…" : "Reveal secret key"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
