import React, { useState } from "react";
import "../../style/css/CandidateScreening.css";
import RequisitionStrip from "./components/RequisitionStrip";
import CandidatePool from "./components/CandidatePool";
import InterviewPool from "./components/InterviewPool";
// import CandidatePreviewPage from "./candidatePreviewPage";

const candidates = [
  {
    id: 1,
    name: "Rajesh Kumar",
    regNo: "961344689",
    experience: "8 years",
    status: "Applied",
    location: "Mumbai, Maharashtra",
    category: "General",
  },
  {
    id: 2,
    name: "Priya Sharma",
    regNo: "961967129",
    experience: "6 years",
    status: "Applied",
    location: "Bangalore, Karnataka",
    category: "OBC",
  },
  {
    id: 3,
    name: "Amit Patel",
    regNo: "961963464",
    experience: "10 years",
    status: "Applied",
    location: "Ahmedabad, Gujarat",
    category: "General",
  },
  {
    id: 4,
    name: "Jagadeesh Shukla",
    regNo: "961965467",
    experience: "5 years",
    status: "Applied",
    location: "Hyderabad, Telangana",
    category: "SC",
  },
];

const job = {
 
   requisitionCode: "BOB/HRM/REC/ADVT/2025/12",
  startDate: "11-08-2025",
  endDate: "03-09-2025",
  positionTitle:
    "Deputy Manager : Product – ONDC (Open Network for Digital Commerce)",
  requisition_code: "REQ-2025-00055",
  registration_start_date: "31-12-2025",
  registration_end_date: "21-01-2026",
  position_title: "Deputy Manager : Product – ONDC (Open Network for Digital Commerce)",
 
  employment_type: "Full Time",
  eligibility_age_min: 21,
  eligibility_age_max: 35,
  mandatory_experience: 2,
  preferred_experience: 3,
  dept_name: "IT Technical",
  no_of_vacancies: 100,
 
  mandatory_qualification: "Bachelor’s degree in any discipline",
  preferred_qualification: "Master’s degree in relevant field",
  roles_responsibilities:
    "Manage day-to-day operations, coordinate with teams, ensure compliance with banking regulations",
 
  isLocationWise: true,
 
  positionStateDistributions: [
    {
      state_name: "Telangana",
      categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
      disability: { 1: 0, 2: 1, 3: 0, 4: 0 }
    },
    {
      state_name: "Andhra Pradesh",
      categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
      disability: { 1: 1, 2: 0, 3: 0, 4: 0 }
    },
    {
      state_name: "Tamil Nadu",
      categories: { 1: 10, 2: 5, 3: 3, 4: 2, 5: 4 },
      disability: { 1: 0, 2: 0, 3: 0, 4: 1 }
    },
    {
      state_name: "Gujarat",
      categories: { 1: 10, 2: 5, 3: 0, 4: 2, 5: 4 },
      disability: { 1: 0, 2: 0, 3: 1, 4: 0 }
    }
  ]
};

export default function CandidateScreening({ selectedJob }) {
	const tabs = [
		{ key: "CANDIDATE_POOL", label: "Candidate Pool", count: 11 },
		{ key: "INTERVIEW_POOL", label: "Interview Pool", count: 0 },
		{ key: "OFFER_POOL", label: "Offer Pool", count: 2 },
		{ key: "ONBOARDING_POOL", label: "Onboarding Pool", count: 0 },
	];

	const [activeTab, setActiveTab] = useState("CANDIDATE_POOL");
	const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="container-fluid px-5 py-4">
      {/* Header */}
      <div className="mb-4">
        <h5 className="mb-1 blue-color">Candidate Screening</h5>
        <small className="text-muted">
          Manage and schedule interviews for candidates
        </small>
      </div>

      {/* Filters */}
      <div className="card mb-3 border-0">
        <div className="card-body">
          <div className="row g-2 align-items-end border-bottom pb-4">
            <div className="col-md-3 col-12">
                <label className="fs-14 blue-color">Requisition</label>
              <select className="form-select fs-14 mt-1 py-1">
                <option>Select Requisition</option>
                <option>BOB/HRM/REC/ADVT/2025/06</option>
              </select>
            </div>
            <div className="col-md-3 col-12">
                <label className="fs-14 blue-color">Position</label>
              <select className="form-select fs-14 mt-1 py-1">
                <option>Select Position</option>
                <option>Deputy Manager</option>
              </select>
            </div>
            <div className="col-md-6 col-12 text-md-end">
              <button className="btn blue-color blue-border me-2 fs-14">
                Import Candidates
              </button>
              <button className="btn text-white orange-bg fs-14">
                + Add Candidate
              </button>
            </div>
          </div>

					<div className="mt-3">
						<RequisitionStrip
							job={job}
							isCardBg={false}
							isSaveEnabled={false}
						/>
					</div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card rounded border-0 d-none d-md-block">
				<div className="card-header bg-white border-bottom-0 p-0 px-1 candidate-screening-tabs-header">
					{/* Tabs */}
					<ul className="nav nav-tabs border-0 pt-2 pb-3 px-2 border-bottom">
						{tabs.map((tab) => (
							<li className="nav-item" key={tab.key}>
								<button
									className={`nav-link fs-14 ${
										activeTab === tab.key ? "orange-color orange-bottom-border" : "text-muted"
									}`}
									onClick={() => setActiveTab(tab.key)}
									type="button"
								>
									{tab.label}
									<span className="ms-2 badge rounded-pill bg-light text-muted p-2" style={{ fontSize: '0.675rem', fontWeight: '500' }}>
										{tab.count}
									</span>
								</button>
							</li>
						))}
					</ul>

					{/* Filters */}
					<div className="row g-2 mt-1 px-2 py-1 align-items-center">
						<div className="col-md-2 col-6 d-flex align-items-center">
							<p className="text-muted fs-14 mb-1">FILTER BY:</p>
							<button className="btn fs-14 mb-1 error-text">Clear all</button>
						</div>
						<div className="col-md-2 col-6">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Status</option>
								<option>Applied</option>
								<option>Shortlisted</option>
							</select>
						</div>

						<div className="col-md-2 col-6">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Location</option>
								<option>Mumbai</option>
								<option>Bangalore</option>
							</select>
						</div>

						<div className="col-md-2 col-6">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Category</option>
								<option>General</option>
								<option>OBC</option>
							</select>
						</div>

						<div className="col-md-4 col-12 text-md-end mt-2 mt-md-0">
							<button className="btn orange-bg text-white fs-14 me-3">
								Rank
							</button>
							<button className="btn fs-14 me-3 blue-color blue-border">
								PDF
							</button>
							<button className="btn fs-14 blue-color blue-border">
								Excel
							</button>
						</div>
					</div>

					<div className="row g-2 mt-1 align-items-center bg-secondary bg-opacity-10">
						<div className="col-md-6 col-12 px-2 mb-2 py-2">
							 <div className="input-group">
								<span className="input-group-text bg-white border-end-0 py-1">
									🔍
								</span>
								<input
									type="text"
									className="form-control border-start-0 fs-14 py-1"
									placeholder="Search candidates..."
								/>
							</div>
						</div>
					</div>
				</div>
				{activeTab === "CANDIDATE_POOL" && !selectedCandidate && (
					<CandidatePool
						candidates={candidates}
						onView={(candidate) => setSelectedCandidate(candidate)}
					/>
				)}

				{/* {selectedCandidate && (
					<CandidatePreviewPage
						candidate={selectedCandidate}
						onBack={() => setSelectedCandidate(null)}
					/>
				)} */}

				{activeTab === "INTERVIEW_POOL" && <InterviewPool />}
				{/* {activeTab === "OFFER_POOL" && <OfferPool />} */}
				{/* {activeTab === "ONBOARDING_POOL" && <OnboardingPool />} */}
      </div>
    </div>
  );
}
