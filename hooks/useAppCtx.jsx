import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export function useAppCtx() {
  return useContext(AppContext);
}
