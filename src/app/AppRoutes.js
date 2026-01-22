// src/routes/AppRoutes.js
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Public pages
import Login from "../modules/auth/pages/Login";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import Tokenexp from "../modules/auth/services/Tokenexp";

// Protected / pages (non-lazy)
import JobGradePage from "../modules/master/pages/JobGrade/JobGradePage";
import LocationPage from "../modules/master/pages/Location/LocationPage";
import PositionPage from "../modules/master/pages/Position/PositionPage";
// import SpecialCategory from "../modules/master/pages/SpecialCategory/SpecialCategoryPage";
import CategoryPage from "../modules/master/pages/Category/CategoryPage";
import RelaxationType from "../modules/master/pages/RelaxationType";
import DocumentPage from "../modules/master/pages/Document/DocumentPage";
import UserPage from "../modules/master/pages/User/UserPage";
import Home from "../modules/master/pages/Home"; // dashboard/home
import JobPostingsList from "../modules/jobPosting/pages/JobPostingsList";
import CreateRequisition from "../modules/jobPosting/pages/CreateRequisition";
import GenericOrAnnexuresPage from "../modules/master/pages/GenericOrAnnexures/GenericOrAnnexuresPage";
import CertificationPage from "../modules/master/pages/CertificationPage/CertificationPage";
import NonAdminRoute from "./NonAdminRoute";
import AdminRoute from "./AdminRoute";
import CandidatePreview from "../modules/candidatePreview/candidatePreviewPage";


import AddPosition from "../modules/jobPosting/pages/AddPosition";

// Auth & layout helpers
import PrivateRoute from "../modules/auth/services/PrivateRoute";
import DepartmentPage from "../modules/master/pages/Department/DepartmentPage"
// import CategoryPage from "../modules/master/pages/Category/CategoryPage";
import InterviewPanel from "../modules/master/pages/InterviewPanel/InterviewPanelPage";
//import InterviewPanel from "../modules/master/pages/InterviewPanel";
import SpecialCategoryPage from "../modules/master/pages/SpecialCategory/SpecialCategoryPage";
import CandidatePreviewPage from "../modules/candidatePreview/candidatePreviewPage";
import CandidateScreening from "../modules/candidatePreview/CandidateScreening";
// import PositionPage from "../modules/master/pages/Position/PositionPage";
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
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<UserPage />} />
                <Route path="/department" element={<DepartmentPage />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/jobgrade" element={<JobGradePage />} />
                <Route path="/position" element={<PositionPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/specialcategory" element={<SpecialCategoryPage />} />
                <Route path="/relaxationtype" element={<RelaxationType />} />
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/document" element={<DocumentPage />} />
                <Route path="/interviewpanel" element={<InterviewPanel />} />
                <Route path="/generic-or-annexures" element={<GenericOrAnnexuresPage />} />
              </Route>              {/* ---------- NON-ADMIN ONLY ROUTES ---------- */}
              <Route element={<NonAdminRoute />}>
                <Route path="/job-posting" element={<JobPostingsList />} />
                <Route path="/job-posting/create-requisition" element={<CreateRequisition />} />
                <Route
                  path="/job-posting/:requisitionId/add-position"
                  element={<AddPosition />}
                />
             
                <Route path="/candidate-preview" element={<CandidatePreviewPage />} />
                <Route path="/candidate-workflow" element={<CandidateScreening />} />
              </Route>


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
