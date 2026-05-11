import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./api/queryClient.js";
import { getToken, setToken, clearToken } from "./api/session.js";
import { AuthContext } from "./context/AuthContext.jsx";
import { AppShell } from "./components/AppShell.jsx";
import { AuthPage } from "./components/AuthPage.jsx";
import { DashboardRoute } from "./components/DashboardRoute.jsx";
import { LinkDetailRoute } from "./components/LinkDetailRoute.jsx";
import { LinksRoute } from "./components/LinksRoute.jsx";
import { PaymentsPage } from "./components/PaymentsPage.jsx";
import { PublicPayRoute } from "./components/PublicPayRoute.jsx";
import { RequireAuth } from "./components/RequireAuth.jsx";
import { SettingsRoute } from "./components/SettingsRoute.jsx";
import { WalletPage } from "./components/WalletPage.jsx";
import { WithdrawPage } from "./components/WithdrawPage.jsx";

function App() {
  const [token, setTokenState] = useState(() => getToken());

  const setAuth = (t) => {
    setToken(t);
    setTokenState(t);
  };
  const logout = () => {
    clearToken();
    setTokenState(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/pay/:slug" element={<PublicPayRoute />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardRoute />} />
                <Route path="/links" element={<LinksRoute />} />
                <Route path="/links/:id" element={<LinkDetailRoute />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/settings" element={<SettingsRoute />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export { App };
