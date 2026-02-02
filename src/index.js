// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import './index.css';

import App from './app/App';
import LanguageSync from './i18n/LanguageSync';
import SessionManager from './modules/auth/services/SessionManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
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
);
