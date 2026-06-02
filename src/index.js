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
console.log("📍 Current URL:", window.location.href);
console.log("📍 Pathname:", window.location.pathname);
console.log("📍 Search params:", window.location.search);

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

(async () => {
  try {
    // console.log("🚀 Initializing MSAL...");

    // Initialize MSAL
    await msalInstance.initialize();
    // console.log("✅ MSAL initialized");

    // ✅ CRITICAL: Handle redirect BEFORE rendering
    // This only processes if URL has auth code (?code=...)
    const response = await msalInstance.handleRedirectPromise();
    // console.log("🔍 handleRedirectPromise response:", response);

    if (response) {
      // console.log("✅ Redirect processed, account:", response.account.username);
      // console.log("📌 Will navigate to: /auth/callback");
      // Force URL change to /auth/callback so AuthCallback component renders
      window.history.replaceState({}, document.title, "/auth/callback");
      // console.log("📍 URL changed to:", window.location.pathname);
    } else {
      // console.log("ℹ️ No redirect detected (normal page load or already processed)");
      const accounts = msalInstance.getAllAccounts();
      const activeAccount = msalInstance.getActiveAccount();
      // console.log("📊 Active account:", activeAccount?.username || "none", "Total accounts:", accounts.length);
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
