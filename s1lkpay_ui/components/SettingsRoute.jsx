import { SettingsPage } from "./SettingsPage.jsx";
import { useAppCtx } from "../hooks/useAppCtx.jsx";

export function SettingsRoute() {
  const { toast } = useAppCtx();
  return <SettingsPage toast={toast} />;
}
