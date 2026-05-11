import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { queryClient } from "../api/queryClient.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { PublicPay } from "./PublicPay.jsx";

export function PublicPayRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const onSimulated = (linkId) => {
    queryClient.invalidateQueries({ queryKey: ["payment-link", linkId] });
    queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };
  return (
    <PublicPay slug={slug} onExit={() => navigate(token ? "/dashboard" : "/")} onPaid={(linkId) => onSimulated(linkId)} />
  );
}
