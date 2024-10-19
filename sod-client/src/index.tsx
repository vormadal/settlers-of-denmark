import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ColyseusContextProvider } from "./ColyseusContext";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { GameStateContextProvider } from "./GameStateContext";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <ColyseusContextProvider>
        <GameStateContextProvider>
          <App />
        </GameStateContextProvider>
      </ColyseusContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
