/* global React, ReactDOM, useTweaks, TweaksPanel, TweakRadio, TweakSection, TweakSelect,
   seedLinks, Sidebar, Topbar, Dashboard, PaymentLinksList, PaymentsPage, SettingsPage,
   CreateLinkModal, LinkDetail, PublicPay, WalletPage, WithdrawPage, useToasts, I */
const { useState, useEffect, useMemo } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "sidebar": "expanded"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const [route, setRoute] = useState("home");
  const [links, setLinks] = useState(() => seedLinks());
  const [openLink, setOpenLink] = useState(null); // link object for detail
  const [showCreate, setShowCreate] = useState(false);
  const [publicLink, setPublicLink] = useState(null); // when set, render public pay page
  const [toastNode, toast] = useToasts();

  // Listen for "Open" from detail page
  useEffect(() => {
    const h = (e) => setPublicLink(e.detail.link);
    window.addEventListener("s1lk:open-public", h);
    return () => window.removeEventListener("s1lk:open-public", h);
  }, []);

  const onCreate = () => setShowCreate(true);
  const onLinkCreated = (link) => {
    setLinks(prev => [link, ...prev]);
    setShowCreate(false);
    setOpenLink(link);
    setRoute("links");
    toast("Payment link created");
  };

  const simulatePayment = (id) => {
    setLinks(prev => prev.map(l => l.id === id ? {
      ...l,
      status: "paid",
      paid: Date.now(),
      txHash: "5z9f8gQpW2eR3hQax9Lp" + Math.random().toString(36).slice(2, 8),
    } : l));
    setOpenLink(prev => prev && prev.id === id ? {
      ...prev, status: "paid", paid: Date.now(),
      txHash: "5z9f8gQpW2eR3hQax9Lp" + Math.random().toString(36).slice(2, 8),
    } : prev);
    toast("Payment received");
  };

  const onViewClient = () => {
    // pick the most recent pending link, else the most recent link
    const pending = links.find(l => l.status === "pending");
    setPublicLink(pending || links[0]);
  };

  if (publicLink) {
    return (
      <>
        <PublicPay
          link={publicLink}
          onExit={() => setPublicLink(null)}
          onPaid={(id) => simulatePayment(id)}
        />
        {toastNode}
        <TweaksPanelContent tweaks={tweaks} setTweak={setTweak}/>
      </>
    );
  }

  const crumbs = (() => {
    if (openLink) return ["Payment links", openLink.description];
    if (route === "home") return ["Home"];
    if (route === "links") return ["Payment links"];
    if (route === "payments") return ["Payments"];
    if (route === "settings") return ["Settings"];
    if (route === "wallet") return ["Wallet"];
    if (route === "withdraw") return ["Wallet", "Withdraw"];
    if (route === "create") return ["Create link"];
    return ["Home"];
  })();

  let body;
  if (openLink) {
    body = <LinkDetail link={openLink} onBack={() => setOpenLink(null)} onSimulate={() => simulatePayment(openLink.id)}/>;
  } else if (route === "home") {
    body = <Dashboard links={links} onCreate={onCreate} onOpenLink={(l) => l === "__all__" ? setRoute("links") : setOpenLink(l)}/>;
  } else if (route === "links") {
    body = <PaymentLinksList links={links} onCreate={onCreate} onOpenLink={setOpenLink}/>;
  } else if (route === "payments") {
    body = <PaymentsPage links={links}/>;
  } else if (route === "settings") {
    body = <SettingsPage/>;
  } else if (route === "wallet") {
    body = <WalletPage onWithdraw={() => setRoute("withdraw")}/>;
  } else if (route === "withdraw") {
    body = <WithdrawPage onDone={() => { setRoute("home"); toast("Withdrawal initiated"); }}/>;
  } else if (route === "create") {
    // Open the modal & default to home behind it
    if (!showCreate) setShowCreate(true);
    body = <Dashboard links={links} onCreate={onCreate} onOpenLink={setOpenLink}/>;
  }

  return (
    <div className={"app" + (tweaks.sidebar === "rail" ? " sidebar-rail" : "")}>
      <Sidebar route={route} setRoute={(r) => { setOpenLink(null); if (r === "create") { onCreate(); } else { setRoute(r); } }} links={links}/>
      <div className="main">
        <Topbar
          crumbs={crumbs}
          onCreate={onCreate}
          onViewClient={onViewClient}
          sidebarStyle={tweaks.sidebar}
          setSidebarStyle={(v) => setTweak("sidebar", v)}
        />
        <div className="content">{body}</div>
      </div>

      {showCreate && (
        <CreateLinkModal onClose={() => setShowCreate(false)} onCreate={onLinkCreated}/>
      )}

      {/* Quick demo FAB — only if there is a pending link */}
      {!openLink && route === "home" && links.some(l => l.status === "pending") && (
        <button className="demo-fab" onClick={onViewClient}>
          <span className="demo-dot"></span>
          Play demo: open client view
        </button>
      )}

      {toastNode}
      <TweaksPanelContent tweaks={tweaks} setTweak={setTweak}/>
    </div>
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
