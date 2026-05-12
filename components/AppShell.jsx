import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { queryClient } from "../api/queryClient.js";
import { useToasts } from "../hooks/useToasts.jsx";
import { useTweaks } from "../hooks/useTweaks.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { CreateLinkModal } from "./CreateLinkModal.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { TweaksPanelContent } from "./TweaksPanelContent.jsx";

const DEFAULTS = /*EDITMODE-BEGIN*/ { sidebar: "expanded" } /*EDITMODE-END*/;

export function AppShell() {
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
        <Sidebar />
        <div className="main">
          <Topbar sidebarStyle={tweaks.sidebar} setSidebarStyle={(v) => setTweak("sidebar", v)} />
          <div className="content">
            <Outlet />
          </div>
        </div>

        {showCreate && (
          <CreateLinkModal onClose={() => setShowCreate(false)} onCreate={onLinkCreated} toast={toast} />
        )}
        {toastNode}
        <TweaksPanelContent tweaks={tweaks} setTweak={setTweak} />
      </div>
    </AppContext.Provider>
  );
}
