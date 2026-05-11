import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { BusinessTab } from "./BusinessTab.jsx";
import { IconPlus } from "./icons/IconPlus.jsx";
import { PageLoader } from "./PageLoader.jsx";
import { TokensTab } from "./TokensTab.jsx";
import { WalletTab } from "./WalletTab.jsx";

export function SettingsPage({ toast }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState("business");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });

  const mutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: (updated) => {
      qc.setQueryData(["settings"], updated);
      toast && toast("Settings saved");
    },
  });

  if (isLoading) return <PageLoader />;

  const s = settings || {};

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Settings</h1>
          <p>Manage your S1lk PAY account and payout preferences.</p>
        </div>
      </div>
      <div className="card card-pad">
        <div className="settings-grid">
          <div className="settings-side">
            {[
              ["business", "Business profile"],
              ["wallet", "Payout wallet"],
              ["tokens", "Accepted tokens"],
              ["notifications", "Notifications"],
              ["developers", "Developers"],
              ["team", "Team"],
            ].map(([id, label]) => (
              <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
          <div>
            {tab === "business" && <BusinessTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending} />}
            {tab === "wallet" && <WalletTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending} />}
            {tab === "tokens" && <TokensTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending} />}
            {tab === "notifications" && (
              <div className="kv-list">
                <div className="kv-row">
                  <div className="k">
                    Email on payment<small>Receive an email when a link is paid.</small>
                  </div>
                  <div className="v">On</div>
                  <button className="toggle on" />
                </div>
                <div className="kv-row">
                  <div className="k">
                    Webhooks<small>POST to your endpoint on payment events.</small>
                  </div>
                  <div className="v">Off</div>
                  <button className="toggle" />
                </div>
              </div>
            )}
            {tab === "developers" && (
              <div className="kv-list">
                <div className="kv-row">
                  <div className="k">Publishable key</div>
                  <div className="v mono">pk_test_3kF92m…s1lk</div>
                  <button className="btn btn-sm">Copy</button>
                </div>
                <div className="kv-row">
                  <div className="k">Secret key</div>
                  <div className="v mono">sk_test_••••••••••••</div>
                  <button className="btn btn-sm">Reveal</button>
                </div>
                <div className="kv-row">
                  <div className="k">Webhook URL</div>
                  <div className="v muted">Not configured</div>
                  <button className="btn btn-sm">Add</button>
                </div>
              </div>
            )}
            {tab === "team" && (
              <div className="empty">
                <h4>Just you for now</h4>
                Invite teammates to share access to this account.
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary">
                    <IconPlus width="14" height="14" /> Invite teammate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
