// import React from "react";
// import "../../style/css/PreviewModal.css";
// import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
// import ApplicationForm from "../candidatePreview/components/ApplicationForm";

// const job = {
 
//    requisitionCode: "BOB/HRM/REC/ADVT/2025/12",
//   startDate: "11-08-2025",
//   endDate: "03-09-2025",
//   positionTitle:
//     "Deputy Manager : Product – ONDC (Open Network for Digital Commerce)",
//   requisition_code: "REQ-2025-00055",
//   registration_start_date: "31-12-2025",
//   registration_end_date: "21-01-2026",
//   position_title: "Deputy Manager : Product – ONDC (Open Network for Digital Commerce)",
 
//   employment_type: "Full Time",
//   eligibility_age_min: 21,
//   eligibility_age_max: 35,
//   mandatory_experience: 2,
//   preferred_experience: 3,
//   dept_name: "IT Technical",
//   no_of_vacancies: 100,
 
//   mandatory_qualification: "Bachelor’s degree in any discipline",
//   preferred_qualification: "Master’s degree in relevant field",
//   roles_responsibilities:
//     "Manage day-to-day operations, coordinate with teams, ensure compliance with banking regulations",
 
//   isLocationWise: true,
 
//   positionStateDistributions: [
//     {
//       state_name: "Telangana",
//       categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
//       disability: { 1: 0, 2: 1, 3: 0, 4: 0 }
//     },
//     {
//       state_name: "Andhra Pradesh",
//       categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
//       disability: { 1: 1, 2: 0, 3: 0, 4: 0 }
//     },
//     {
//       state_name: "Tamil Nadu",
//       categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
//       disability: { 1: 0, 2: 0, 3: 0, 4: 1 }
//     },
//     {
//       state_name: "Gujarat",
//       categories: { 1: 10, 2: 5, 3: 0, 4: 2, 5: 4 },
//       disability: { 1: 0, 2: 0, 3: 1, 4: 0 }
//     }
//   ]
// };

// const CandidatePreviewPage = ({
//   onHide,
//   previewData,
//   selectedJob,
//   formErrors,
//   setFormErrors,
// }) => {
//   return (
//     <div className="bob-preview-page container-fluid p-4">

//       {/* Close Button */}
//       <button
//         type="button"
//         className="btn-close position-absolute"
//         style={{ top: "6px", right: "15px", zIndex: 1 }}
//         onClick={onHide}
//         aria-label="Close"
//       />

//       {/* Requisition Strip */}
//       {/* <RequisitionStrip
//         requisition={{
//           requisition_code: selectedJob?.requisition_code,
//           start_date: selectedJob?.start_date,
//           end_date: selectedJob?.end_date,
//         }}
//         positionTitle={selectedJob?.position_title}
//         // isSaveVisisble={false}
//       /> */}

//       <RequisitionStrip
//         job={job}
//         //   isSaved={isSaved}
//         //   onSave={() => setIsSaved(true)}
//         //   onViewPosition={() => setShowPosition(true)}
//         isCardBg={true}
//         isSaveEnabled={true}
//       />

//       {/* Application Form (ALL ACCORDIONS INSIDE THIS) */}
//       <div className="mt-3">
//         <ApplicationForm
//           previewData={previewData}
//           selectedJob={selectedJob}
//           formErrors={formErrors}
//           setFormErrors={setFormErrors}
//         />
//       </div>

//     </div>
//   );
// };

// export default CandidatePreviewPage;




import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";
import RequisitionStrip from "./components/RequisitionStrip";
import ApplicationForm from "./components/ApplicationForm";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";
import { useSelector } from "react-redux";

/* =========================
   TEMP JOB OBJECT
   (replace later with API)
========================= */
const job = {
  requisitionCode: "BOB/HRM/REC/ADVT/2025/12",
  startDate: "11-08-2025",
  endDate: "03-09-2025",
  positionTitle:
    "Deputy Manager : Product – ONDC (Open Network for Digital Commerce)",
  requisition_code: "REQ-2025-00055",
  registration_start_date: "31-12-2025",
  registration_end_date: "21-01-2026",
  employment_type: "Full Time",
  eligibility_age_min: 21,
  eligibility_age_max: 35,
  mandatory_experience: 2,
  preferred_experience: 3,
  dept_name: "IT Technical",
  no_of_vacancies: 100,
  mandatory_qualification: "Bachelor’s degree",
  preferred_qualification: "Master’s degree",
  roles_responsibilities:
    "Manage day-to-day operations, coordinate with teams",
  isLocationWise: true,
  positionStateDistributions: []
};

const CandidatePreviewPage = ({ onHide }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 master data from redux
  const masters = useSelector((state) => state.master);

  // 🔹 TEMP ids (replace with route params later)
  const candidateId = "75ddc495-a378-4a1c-8240-7bd6509c9965";
  const applicationId = "aed76e48-03eb-4755-b44e-3e7c1185d85a";

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);

        const res =
          await candidateWorkflowServices.getCandidateAllDetails(
            candidateId,
            applicationId
          );

        if (res.success) {
          const mappedData = mapCandidateToPreview(
            res.data,
            masters
          );
          setPreviewData(mappedData);
        }
      } catch (error) {
        console.error("Failed to load candidate preview", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId, applicationId, masters]);

  if (loading) {
    return (
      <div className="text-center p-4">
        Loading candidate details…
      </div>
    );
  }

  return (
    <div className="bob-preview-page container-fluid p-4">
      {/* Close button */}
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: "6px", right: "15px", zIndex: 1 }}
        onClick={onHide}
        aria-label="Close"
      />

      {/* Requisition strip */}
      <RequisitionStrip
        job={job}
        isCardBg
        isSaveEnabled
      />

      {/* Application form */}
      <div className="mt-3">
        <ApplicationForm previewData={previewData} />
      </div>
    </div>
  );
};

export default CandidatePreviewPage;

