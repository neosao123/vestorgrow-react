import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalProvider } from "./context/GlobalContext";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./assets/reset.css";
import "./assets/main.css";
import "./assets/altered.css";
import "./assets/responsive.css";
import "./index.css"
import { HelmetProvider, Helmet } from 'react-helmet-async';
import MetaTag from "./components/MetaTag";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <HelmetProvider>
        <MetaTag />
        <App />
      </HelmetProvider>
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
