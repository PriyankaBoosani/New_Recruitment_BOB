// src/App.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import AppRoutes from './routes/AppRoutes';

function AppWrapper() {
  const location = useLocation();
  const hideHeaderFor = ['/login', '/forgot-password', '/verify-otp'];
  const shouldHideHeader = hideHeaderFor.some(p => location.pathname.toLowerCase().startsWith(p));

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="app-container">
        {!shouldHideHeader && <Header />}
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </>
  );
}

export default function App() {
  return <AppWrapper />;
}
