import { AppContext } from "./AppContext";
import { useWorkspace } from "../hooks/useWorkspace";

export default function AppContextProvider({ children }) {
  const workspace = useWorkspace();

  return <AppContext.Provider value={workspace}>{children}</AppContext.Provider>;
}
