import { useParams, useNavigate } from "react-router-dom";
import { queryClient } from "../api/queryClient.js";
import { LinkDetail } from "./LinkDetail.jsx";
import { useAppCtx } from "../hooks/useAppCtx.jsx";

export function LinkDetailRoute() {
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
    <LinkDetail linkId={id} onBack={() => navigate("/links")} onSimulated={onSimulated} toast={toast} />
  );
}
