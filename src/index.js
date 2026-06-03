// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./modules/auth/services/msalConfig";

import { store, persistor } from "./store";
import "./index.css";

import App from "./app/App";
import LanguageSync from "./i18n/LanguageSync";
import SessionManager from "./modules/auth/services/SessionManager";

// Log redirect debugging

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

(async () => {
  try {
    // Initialize MSAL
    await msalInstance.initialize();

    // ✅ CRITICAL: Handle redirect BEFORE rendering
    // This only processes if URL has auth code (?code=...)
    const response = await msalInstance.handleRedirectPromise();

    if (response) {
      window.history.replaceState({}, document.title, "/auth/callback");
    }
    root.render(
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <LanguageSync />
              <SessionManager>
                <App />
              </SessionManager>
            </Router>
          </PersistGate>
        </Provider>
      </MsalProvider>
    );
  } catch (error) {
    console.error("❌ Initialization error:", error);
    root.render(<div>Error initializing app. Check console.</div>);
  }
})();
