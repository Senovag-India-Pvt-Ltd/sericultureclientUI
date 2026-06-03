import { useEffect } from "react";
import Router from "./router";

const LOGIN_PATH = "/seriui/";

// Cross-tab forced logout: if any tab clears the JWT (e.g. after a successful
// UPDATE/DELETE in the SQL Query Runner), every other tab in the same browser
// should redirect to login as well. localStorage is shared across tabs, and
// the `storage` event fires in OTHER tabs whenever a value is written or
// cleared — that's our signal.
function App() {
  useEffect(() => {
    const onStorage = (e) => {
      const isForcedFlag = e.key === "forced-logout" && e.newValue;
      const isJwtCleared = e.key === "jwtToken" && !e.newValue;
      const isFullClear  = e.key === null; // localStorage.clear()
      if (isForcedFlag || isJwtCleared || isFullClear) {
        try { localStorage.clear(); } catch (err) {}
        if (window.location.pathname !== LOGIN_PATH) {
          window.location.href = LOGIN_PATH;
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  console.log(process.env.REACT_APP_ENV);
  return (
    <>
      <Router />
    </>
  );
}

export default App;
