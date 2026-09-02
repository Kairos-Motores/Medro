import React from "react";
import ReactDOM from "react-dom/client";
import { Reshaped } from "reshaped";
import "reshaped/themes/reshaped/theme.css";
import "reshaped/themes/reshaped/media.css";
import { App } from "./app/App";
import "./styles/index.css";
import "./styles/reshaped-overrides.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Reshaped theme="reshaped" defaultColorMode="light">
      <App />
    </Reshaped>
  </React.StrictMode>,
);
