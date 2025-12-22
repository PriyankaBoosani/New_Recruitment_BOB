// src/routes/AppRoutes.js
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Public pages
import Login from "../modules/auth/pages/Login";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import Tokenexp from "../modules/auth/services/Tokenexp";

// Protected / pages (non-lazy)
import JobGrade from "../modules/master/pages/JobGrade";
import Location from "../modules/master/pages/Location";
import Position from "../modules/master/pages/Position/PositionPage";
// import SpecialCategory from "../modules/master/pages/SpecialCategory/SpecialCategoryPage";
import Category from "../modules/master/pages/Category";
import RelaxationType from "../modules/master/pages/RelaxationType";
import Document from "../modules/master/pages/Document";
// import InterviewPanel from "../modules/master/pages/InterviewPanel/InterviewPanelPage";
import User from "../modules/master/pages/User";
import Home from "../modules/master/pages/Home"; // dashboard/home
import JobPostingsList from "../modules/jobPosting/pages/JobPostingsList";
import CreateRequisition from "../modules/jobPosting/pages/CreateRequisition";
import UploadIndent from "../modules/jobPosting/pages/UploadIndent";

// Auth & layout helpers
import PrivateRoute from "../modules/auth/services/PrivateRoute";
import DepartmentPage from "../modules/master/pages/Department/DepartmentPage"
import CategoryPage from "../modules/master/pages/Category/CategoryPage";
import InterviewPanelPage from "../modules/master/pages/InterviewPanel/InterviewPanelPage";
import SpecialCategoryPage from "../modules/master/pages/SpecialCategory/SpecialCategoryPage";
import PositionPage from "../modules/master/pages/Position/PositionPage";
// Lazy loaded components
const Layout = React.lazy(() => import("../shared/components/Layout"));

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
              <Route path="/department" element={<DepartmentPage />} />
              <Route path="/location" element={<Location />} />
              {/* If you want plural: <Route path="/locations" element={<Location />} /> */}
              <Route path="/jobgrade" element={<JobGrade />} />
              <Route path="/position" element={<PositionPage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/specialcategory" element={<SpecialCategoryPage />} />
              <Route path="/relaxationtype" element={<RelaxationType />} />
              <Route path="/document" element={<Document />} />
              <Route path="/interviewpanel" element={<InterviewPanelPage />} />
              <Route path="/job-posting" element={<JobPostingsList />} />
              <Route path="/job-posting/create-requisition" element={<CreateRequisition />} />
              <Route
                path="/job-posting/upload-indent"
                element={<UploadIndent />}
              />

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
