import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import User from './pages/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@fontsource/poppins/300.css";   // Light
import "@fontsource/poppins/400.css";   // Regular
import "@fontsource/poppins/500.css";   // Medium
import "@fontsource/poppins/600.css";   // Semi-bold
import "@fontsource/poppins/700.css";   // Bold
import Department from './pages/department';
import Location from './pages/Location';
import JobGrade from './pages/JobGrade';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<User />} />
            <Route path="/department" element={<Department />} />
            <Route path="/location" element={<Location />} />
            <Route path="/jobgrade" element={<JobGrade />} />
            {/* Add more routes here as you create more pages */}
          </Routes>
        </main>
      </div>
    </Router>
    
  );
}

export default App;
