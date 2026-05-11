/* global React, I, api, AuthContext */
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";
const { useState } = React;

function AuthPage() {
  const { token, setAuth } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");

  // If already authenticated, redirect immediately.
  if (token) return <Navigate to="/dashboard" replace/>;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && password.length >= 6;

  const mutation = useMutation({
    mutationFn: (data) =>
      mode === "login" ? api.login(data) : api.register(data),
    onSuccess: (res) => {
      setAuth(res.access_token);
      navigate("/dashboard", { replace: true });
    },
    onError: (e) => setErr(e.message || "Something went wrong."),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit || mutation.isPending) return;
    setErr("");
    mutation.mutate({
      email,
      password,
      ...(mode === "register" && firstName ? { firstName } : {}),
    });
  };

  const switchMode = (m) => { setMode(m); setErr(""); };

  return (
    <div className="auth-wrap">
      {/* ── left panel ── */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="sb-logo"><span>S</span></div>
          <div className="sb-name">S1lk <b>PAY</b></div>
        </div>
        <div className="auth-quote">
          <div className="auth-quote-mark">"</div>
          <p>Accept USDC, USDT and SOL from anywhere in the world — settle to your bank in 60 seconds.</p>
          <div className="auth-quote-meta">
            <div className="sb-avatar">SM</div>
            <div>
              <b>Sandbox Merchant</b>
              <small>Pilot customer</small>
            </div>
          </div>
        </div>
        <div className="auth-foot-l">
          <span><I.shield width="12" height="12"/> Solana · Mainnet</span>
          <span>SOC 2 Type II</span>
          <span>v0.9.2</span>
        </div>
      </div>

      {/* ── right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-brand auth-brand-mobile">
            <div className="sb-logo"><span>S</span></div>
            <div className="sb-name">S1lk <b>PAY</b></div>
          </div>

          <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to your S1lk PAY merchant account."
              : "Start accepting crypto payments in minutes."}
          </p>

          <form onSubmit={submit} noValidate>
            {mode === "register" && (
              <div className="field">
                <label htmlFor="auth-fname">First name <small style={{color:"var(--muted)"}}>optional</small></label>
                <input
                  id="auth-fname"
                  className="input"
                  autoComplete="given-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <label htmlFor="auth-password">Password</label>
                {mode === "login" && (
                  <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>Forgot?</a>
                )}
              </div>
              <div className="pw-input">
                <input
                  id="auth-password"
                  className="input"
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  <I.eye width="16" height="16"/>
                </button>
              </div>
            </div>

            {err && <div className="auth-err">{err}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={!canSubmit || mutation.isPending}
            >
              {mutation.isPending
                ? <span className="spinner"></span>
                : <>{mode === "login" ? "Sign in" : "Create account"} <I.arrowRight width="14" height="14"/></>}
            </button>
          </form>

          <div className="auth-foot">
            <span><I.lock width="12" height="12"/> Secured by S1lk PAY · End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthPage });
