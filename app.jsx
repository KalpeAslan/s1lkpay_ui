/* global React, ReactDOM, useTweaks, TweaksPanel, TweakRadio, TweakSection,
   Sidebar, Topbar, Dashboard, PaymentLinksList, PaymentsPage, SettingsPage,
   CreateLinkModal, LinkDetail, PublicPay, WalletPage, WithdrawPage, useToasts, I,
   AuthContext, AppContext, useAppCtx, AuthPage,
   api, queryClient, setToken, clearToken, getToken */
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter, Routes, Route, Navigate, Outlet,
  useNavigate, useLocation, useParams,
} from "react-router-dom";

const { useState } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{ "sidebar": "expanded" }/*EDITMODE-END*/;

// ── Auth guard ────────────────────────────────────────────────────────────────
function RequireAuth() {
  const { token } = React.useContext(AuthContext);
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace/>;
  return <Outlet/>;
}

// ── App layout shell ──────────────────────────────────────────────────────────
function AppShell() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const [showCreate, setShowCreate] = useState(false);
  const [toastNode, toast] = useToasts();
  const navigate = useNavigate();

  const onCreate = () => setShowCreate(true);
  const onLinkCreated = (link) => {
    setShowCreate(false);
    navigate("/links/" + link.id);
    toast("Payment link created");
    queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <AppContext.Provider value={{ toast, onCreate }}>
      <div className={"app" + (tweaks.sidebar === "rail" ? " sidebar-rail" : "")}>
        <Sidebar/>
        <div className="main">
          <Topbar
            sidebarStyle={tweaks.sidebar}
            setSidebarStyle={(v) => setTweak("sidebar", v)}
          />
          <div className="content"><Outlet/></div>
        </div>

        {showCreate && (
          <CreateLinkModal
            onClose={() => setShowCreate(false)}
            onCreate={onLinkCreated}
            toast={toast}
          />
        )}
        {toastNode}
        <TweaksPanelContent tweaks={tweaks} setTweak={setTweak}/>
      </div>
    </AppContext.Provider>
  );
}

// ── Route wrappers ─────────────────────────────────────────────────────────────
function DashboardRoute() {
  const { onCreate } = useAppCtx();
  const navigate = useNavigate();
  return (
    <Dashboard
      onCreate={onCreate}
      onOpenLink={(id) => navigate("/links/" + id)}
      onViewAll={() => navigate("/links")}
    />
  );
}

function LinksRoute() {
  const { onCreate } = useAppCtx();
  const navigate = useNavigate();
  return (
    <PaymentLinksList
      onCreate={onCreate}
      onOpenLink={(id) => navigate("/links/" + id)}
    />
  );
}

function LinkDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useAppCtx();
  const onSimulated = (linkId) => {
    toast("Payment received");
    queryClient.invalidateQueries({ queryKey: ["payment-link", linkId] });
    queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };
  return (
    <LinkDetail
      linkId={id}
      onBack={() => navigate("/links")}
      onSimulated={onSimulated}
      toast={toast}
    />
  );
}

function SettingsRoute() {
  const { toast } = useAppCtx();
  return <SettingsPage toast={toast}/>;
}

function PublicPayRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const onSimulated = (linkId) => {
    queryClient.invalidateQueries({ queryKey: ["payment-link", linkId] });
    queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };
  return (
    <PublicPay
      slug={slug}
      onExit={() => navigate(token ? "/dashboard" : "/")}
      onPaid={(linkId) => onSimulated(linkId)}
    />
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function App() {
  const [token, setTokenState] = useState(() => getToken());

  const setAuth = (t) => { setToken(t); setTokenState(t); };
  const logout  = () => { clearToken(); setTokenState(null); queryClient.clear(); };

  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage/>}/>
            <Route path="/pay/:slug" element={<PublicPayRoute/>}/>
            <Route element={<RequireAuth/>}>
              <Route element={<AppShell/>}>
                <Route index element={<Navigate to="/dashboard" replace/>}/>
                <Route path="/dashboard" element={<DashboardRoute/>}/>
                <Route path="/links" element={<LinksRoute/>}/>
                <Route path="/links/:id" element={<LinkDetailRoute/>}/>
                <Route path="/payments" element={<PaymentsPage/>}/>
                <Route path="/wallet" element={<WalletPage/>}/>
                <Route path="/withdraw" element={<WithdrawPage/>}/>
                <Route path="/settings" element={<SettingsRoute/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

function TweaksPanelContent({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Sidebar">
        <TweakRadio
          value={tweaks.sidebar}
          onChange={(v) => setTweak("sidebar", v)}
          options={[
            { value: "expanded", label: "Expanded" },
            { value: "rail", label: "Icons only" },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
