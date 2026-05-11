import { useState } from "react";

export function BusinessTab({ settings, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const startEdit = () => {
    setForm({
      businessName: settings.businessName || "",
      supportEmail: settings.supportEmail || "",
      website: settings.website || "",
    });
    setEditing(true);
  };
  const save = () => {
    onSave(form);
    setEditing(false);
  };

  if (!editing)
    return (
      <div className="kv-list">
        <div className="kv-row">
          <div className="k">
            Business name<small>Shown to customers on payment pages.</small>
          </div>
          <div className="v">{settings.businessName || <span className="muted">Not set</span>}</div>
          <button className="btn btn-sm" onClick={startEdit}>
            Edit
          </button>
        </div>
        <div className="kv-row">
          <div className="k">Support email</div>
          <div className="v">{settings.supportEmail || <span className="muted">Not set</span>}</div>
          <button className="btn btn-sm" onClick={startEdit}>
            Edit
          </button>
        </div>
        <div className="kv-row">
          <div className="k">Website</div>
          <div className="v">{settings.website || <span className="muted">Not set</span>}</div>
          <button className="btn btn-sm" onClick={startEdit}>
            Add
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="field">
        <label>Business name</label>
        <input
          className="input"
          value={form.businessName}
          onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
        />
      </div>
      <div className="field">
        <label>Support email</label>
        <input
          className="input"
          type="email"
          value={form.supportEmail}
          onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
        />
      </div>
      <div className="field">
        <label>Website</label>
        <input
          className="input"
          type="url"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button className="btn" onClick={() => setEditing(false)}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
