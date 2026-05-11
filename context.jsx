// Shared contexts — loaded before screens so all components can consume them.
const AuthContext = React.createContext({ token: null, setAuth: () => {}, logout: () => {} });
const AppContext  = React.createContext({ toast: () => {}, onCreate: () => {} });

function useAuthCtx() { return React.useContext(AuthContext); }
function useAppCtx()  { return React.useContext(AppContext); }

Object.assign(window, { AuthContext, AppContext, useAuthCtx, useAppCtx });
