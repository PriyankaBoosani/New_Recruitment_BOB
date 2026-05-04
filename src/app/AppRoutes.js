// src/routes/AppRoutes.js
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Login from "../modules/auth/pages/Login";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import Tokenexp from "../modules/auth/services/Tokenexp";

// Protected / pages (non-lazy)
import JobGradePage from "../modules/master/pages/JobGrade/JobGradePage";
import LocationPage from "../modules/master/pages/Location/LocationPage";
import PositionPage from "../modules/master/pages/Position/PositionPage";
import CategoryPage from "../modules/master/pages/Category/CategoryPage";
import DocumentPage from "../modules/master/pages/Document/DocumentPage";
import UserPage from "../modules/master/pages/User/UserPage";
import JobPostingsList from "../modules/jobPosting/pages/JobPostingsList";
import CreateRequisition from "../modules/jobPosting/pages/CreateRequisition";
import GenericOrAnnexuresPage from "../modules/master/pages/GenericOrAnnexures/GenericOrAnnexuresPage";
import CertificationPage from "../modules/master/pages/CertificationPage/CertificationPage";
import EducationModal from "../modules/master/pages/EducationQualification/EducationQualificationPage";
// import NonAdminRoute from "./NonAdminRoute";
// import AdminRoute from "./AdminRoute";
import AddPosition from "../modules/jobPosting/pages/AddPosition";
// Auth & layout helpers
import PrivateRoute from "../modules/auth/services/PrivateRoute";
import DepartmentPage from "../modules/master/pages/Department/DepartmentPage"
import InterviewPanel from "../modules/committeeManagement/InterviewPanelPage";
import CandidatePreviewPage from "../modules/candidatePreview/candidatePreviewPage";
import CandidateVerification from "../modules/Verification/CandidateVerification";
import CandidateScreening from "../modules/candidatePreview/CandidateScreening";
import InterviewerSchedule from "../modules/Interviewer/InterviewerSchedule"
// import CandidateInterview from "../modules/Interview/CandidateInterview";
import ScheduleInterviews from "../modules/interviews/ScheduleInterviews";

import UnauthorizedPage from "./UnauthorizedPage"
import PrivilegeRoute from "./PrivilegeRoute";
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
 // const token = useSelector((state) => state.user?.authUser?.access_token || state.user?.authUser?.accessToken || state.user?.auth?.access_token);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Root redirect: go to dashboard if authed, else login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Protected routes */}
        <Route element={<Tokenexp />}>
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route
                  path="/users"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <UserPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/department"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <DepartmentPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/location"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <LocationPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/jobgrade"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <JobGradePage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/position"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <PositionPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/category"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <CategoryPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/certification"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <CertificationPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/document"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <DocumentPage />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/generic-or-annexures"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <GenericOrAnnexuresPage />
                    </PrivilegeRoute>
                  }
                />   

                 <Route
                  path="/education-qualification"
                  element={
                    <PrivilegeRoute privilege="Admin">
                      <EducationModal />
                    </PrivilegeRoute>
                  }
                />       
                {/* ---------- NON-ADMIN ONLY ROUTES ---------- */}
                <Route
                  path="/job-posting"
                  element={
                    <PrivilegeRoute privilege="JobPostings">
                      <JobPostingsList />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/job-posting/create-requisition"
                  element={
                    <PrivilegeRoute privilegesRequired={["JobPostings", "View Position"]}>
                      <CreateRequisition />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/job-posting/:requisitionId/add-position"
                  element={
                      <PrivilegeRoute privilegesRequired={["JobPostings", "View Position"]}>
                        <AddPosition />
                      </PrivilegeRoute>
                  }
                />

             <Route
  path="/candidate-preview"
  element={
    <PrivilegeRoute privilegesRequired={["Candidate Pool", "Verification", "Interview", "Compensation Pool"]}>
      <CandidatePreviewPage />
    </PrivilegeRoute>
  }
/>

                <Route
                  path="/candidate-workflow"
                  element={
                     <PrivilegeRoute privilegesRequired={["Candidate Pool", "Compensation Pool"]}>
                   
                      <CandidateScreening />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/candidate-verification"
                  element={
                    <PrivilegeRoute privilege="Verification">
                      <CandidateVerification />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/candidate-interviewer"
                  element={
                    <PrivilegeRoute privilege="Interview">
                      <InterviewerSchedule />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/interviewpanel"
                  element={
                    <PrivilegeRoute privilege="Committee Management">
                      <InterviewPanel />
                    </PrivilegeRoute>
                  }
                />

                {/* <Route
                  path="/schedule-interviews"
                  element={
                    <PrivilegeRoute privilege="Interview">
                      <ScheduleInterviews />
                    </PrivilegeRoute>
                  }
                />

                {/* <Route
                  path="/requisition-requests"
                  element={
                    <PrivilegeRoute privilege="Requisition Approval">
                      <Approvals />
                    </PrivilegeRoute>
                  }
                />

                <Route
                  path="/extension-requests"
                  element={
                    <PrivilegeRoute privilege="Requisition Approval">
                      <ExtensionsRequests />
                    </PrivilegeRoute>
                  }
                /> */}

                {/* <Route
                  path="/committee-requests"
                  element={
                    <PrivilegeRoute privilege="Requisition Approval">
                      <CommitteeRequests />
                    </PrivilegeRoute>
                  }
                /> */}



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

