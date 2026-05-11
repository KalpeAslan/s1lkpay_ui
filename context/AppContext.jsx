import { createContext } from "react";

export const AppContext = createContext({ toast: () => {}, onCreate: () => {} });
