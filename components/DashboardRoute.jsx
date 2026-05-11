import { useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard.jsx";
import { useAppCtx } from "../hooks/useAppCtx.jsx";

export function DashboardRoute() {
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
