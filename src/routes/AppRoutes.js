// src/routes/AppRoutes.js
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Public pages
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";
import Tokenexp from "../components/Tokenexp";

// Protected / pages (non-lazy)
import JobGrade from "../pages/JobGrade";
import Location from "../pages/Location";
import Position from "../pages/Position";
import SpecialCategory from "../pages/SpecialCategory";
import Category from "../pages/Category";
import RelaxationType from "../pages/RelaxationType";
import Document from "../pages/Document";
import InterviewPanel from "../pages/InterviewPanel";
import User from "../pages/User";
import Home from "../pages/Home"; // dashboard/home

// Auth & layout helpers
import PrivateRoute from "../components/PrivateRoute";

// Lazy loaded components
const Department = React.lazy(() => import("../pages/department"));
const Layout = React.lazy(() => import("../components/Layout"));

// Loading fallback
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const AppRoutes = () => {
  // Use the same selector you use for auth in your app
  const token = useSelector((state) => state.user?.authUser?.access_token || state.user?.authUser?.accessToken || state.user?.auth?.access_token);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Root redirect: go to dashboard if authed, else login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected routes */}
        <Route element={<Tokenexp />}>
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/users" element={<User />} />
              <Route path="/department" element={<Department />} />
              <Route path="/location" element={<Location />} />
              {/* If you want plural: <Route path="/locations" element={<Location />} /> */}
              <Route path="/jobgrade" element={<JobGrade />} />
              <Route path="/position" element={<Position />} />
              <Route path="/category" element={<Category />} />
              <Route path="/specialcategory" element={<SpecialCategory />} />
              <Route path="/relaxationtype" element={<RelaxationType />} />
              <Route path="/document" element={<Document />} />
              <Route path="/interviewpanel" element={<InterviewPanel />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/login" />} />


      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
