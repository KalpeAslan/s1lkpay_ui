import { useNavigate } from "react-router-dom";
import { PaymentLinksList } from "./PaymentLinksList.jsx";
import { useAppCtx } from "../hooks/useAppCtx.jsx";

export function LinksRoute() {
  const { onCreate } = useAppCtx();
  const navigate = useNavigate();
  return <PaymentLinksList onCreate={onCreate} onOpenLink={(id) => navigate("/links/" + id)} />;
}
