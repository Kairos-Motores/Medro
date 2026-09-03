import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Reshaped } from "reshaped";
import "reshaped/themes/reshaped/theme.css";
import "reshaped/themes/reshaped/media.css";
import { App } from "./app/App";
import { useTheme, applyTheme } from "./lib/theme";
import "./styles/index.css";
import "./styles/reshaped-overrides.css";

function RootApp() {
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Reshaped theme="reshaped" colorMode={theme}>
      <App />
    </Reshaped>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
