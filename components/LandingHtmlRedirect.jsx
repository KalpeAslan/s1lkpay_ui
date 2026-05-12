import { useEffect } from "react";

/** Sends visitors to the static marketing page at /landing.html */
export function LandingHtmlRedirect() {
  useEffect(() => {
    window.location.replace("/landing.html");
  }, []);
  return null;
}
