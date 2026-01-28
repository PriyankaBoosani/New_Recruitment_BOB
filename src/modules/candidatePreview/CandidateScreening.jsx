import React, { useState, useEffect } from "react";
import masterApiService from "../jobPosting/services/masterApiService";
import "../../style/css/CandidateScreening.css";
import uploadIcon from "../../assets/upload-blue-icon.png"
import rankIcon from "../../assets/rank-icon.png"
import pdfIcon from "../../assets/pdf-icon.png"
import excelIcon from "../../assets/export-excel-icon.png"
import searchIcon from "../../assets/search-icon.png"
import RequisitionStrip from "./components/RequisitionStrip";
import CandidatePool from "./components/CandidatePool";
import InterviewPool from "./components/InterviewPool";
import ScheduleInterviewModal from "./components/ScheduleInterviewModal";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";
// import CandidatePreviewPage from "./candidatePreviewPage";
 
export default function CandidateScreening({ selectedJob }) {
	const tabs = [
		{ key: "CANDIDATE_POOL", label: "Candidate Pool", count: 11 },
		{ key: "INTERVIEW_POOL", label: "Interview Pool", count: 0 },
		{ key: "OFFER_POOL", label: "Offer Pool", count: 2 },
		{ key: "ONBOARDING_POOL", label: "Onboarding Pool", count: 0 },
	];

	const [activeTab, setActiveTab] = useState("CANDIDATE_POOL");
	const [selectedCandidate, setSelectedCandidate] = useState(null);
	const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
	const [selectedInterviewCandidateIds, setSelectedInterviewCandidateIds] = useState([]);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);
  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [masterData, setMasterData] = useState(null);
  
  useEffect(() => {
    const loadMasters = async () => {
      const res = await masterApiService.getAllMasters();
      setMasterData(res.data);
      console.log(" MASTER DATA:", res.data)
    };
    loadMasters();
  }, []);

  const categoryMap = React.useMemo(() => {
    const map = {};
    (masterData?.reservationCategories || []).forEach(cat => {
      map[cat.reservationCategoriesId] = cat.categoryName;
    });
    return map;
  }, [masterData]);

  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoadingRequisitions(true);
      try {
        const res = await jobPositionApiService.getRequisitions();
        setRequisitions(res?.data || []);
      } catch (err) {
        console.error("Failed to load requisitions", err);
      } finally {
        setLoadingRequisitions(false);
      }
    };

    fetchRequisitions();
  }, []);

  useEffect(() => {
    if (!selectedRequisitionId) {
      setPositions([]);
      setSelectedPositionId("");
      return;
    }

    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const res = await jobPositionApiService.getPositionsByReqId({
          requisitionId: selectedRequisitionId,
        });
        console.log("Positions response:", res.data);
        setPositions(res?.data || []);
      } catch (err) {
        console.error("Failed to load positions", err);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [selectedRequisitionId]);

  useEffect(() => {
    if (!selectedPositionId) {
      setCandidates([]);
      setTotalElements(0);
      return;
    }

    const fetchCandidates = async () => {
      setLoadingCandidates(true);
      try {
        const res = await jobPositionApiService.getCandidatesByPosition({
          searchText: "",
          page,
          size: pageSize,
          positionId: selectedPositionId,
          status: "",
          stateId: "",
          categoryId: "",
        });

        const apiData = res?.data;

        // 🔑 Normalize API → UI model
        const mappedCandidates = (apiData?.content || []).map((c) => ({
          id: c.candidateApplications.id, // REQUIRED for selection
          name: c.fullName,
          rank: c.rank,
          score: c.score,
          experience: `${Math.floor((c.totalMonths || 0) / 12)} years`,
          status: c.candidateApplications.applicationStatus,
          location: "-", // backend not sending yet
          category: categoryMap[c.categoryId] || "-",
          applicationNo: c.candidateApplications.applicationNo,
          candidateId: c.candidateApplications.candidateId,
        }));

        setCandidates(mappedCandidates);
        setTotalElements(apiData?.page?.totalElements || 0);
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    fetchCandidates();
  }, [selectedPositionId, page, pageSize]);

	const selectedCandidates = candidates.filter(c =>
		selectedCandidateIds.includes(c.id)
	);

	const canScheduleInterview =
		selectedCandidates.length > 0 &&
		selectedCandidates.every(c => c.status === "Shortlisted");

  const selectedRequisition = requisitions.find(
    (r) => r.id === selectedRequisitionId
  );

  const selectedPosition = positions.find(
    (p) => p.jobPositions?.positionId === selectedPositionId
  );

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
      <div className="card mb-4 border-0">
        <div className="card-body">
          <div className="row g-2 align-items-end border-bottom pb-4">
            <div className="col-md-3 col-12">
              <label className="fs-14 blue-color">Requisition</label>
              <select
                className="form-select fs-14 mt-1 py-1"
                value={selectedRequisitionId}
                onChange={(e) => setSelectedRequisitionId(e.target.value)}
                disabled={loadingRequisitions}
              >
                <option value="">Select Requisition</option>

                {requisitions.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.requisitionCode} - {req.requisitionTitle}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-12">
              <label className="fs-14 blue-color">Position</label>
              <select
                className="form-select fs-14 mt-1 py-1"
                value={selectedPositionId}
                onChange={(e) => setSelectedPositionId(e.target.value)}
                disabled={!selectedRequisitionId || loadingPositions}
              >
                <option value="">
                  {loadingPositions ? "Loading positions..." : "Select Position"}
                </option>

                {positions.map((pos) => (
                  <option key={pos.jobPositions.positionId} value={pos.jobPositions.positionId}>
                    {pos?.masterPositions?.positionName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-12 text-md-end">
              <button className="btn blue-color blue-border me-2 fs-14">
                                <img src={uploadIcon} width={15} className="me-2" />
                Import Candidates
              </button>
              <button className="btn text-white orange-bg fs-14">
                + Add Candidate
              </button>
            </div>
          </div>

					<div className="mt-3">
            {selectedPosition &&
              <RequisitionStrip
                job={selectedRequisition}
                position={selectedPosition}
                isCardBg={false}
                isSaveEnabled={false}
                masterData={masterData}
              />
            }
					</div>
        </div>
      </div>
 
      {/* Desktop Table */}
      <div className="card rounded border-0 d-none d-md-block mb-5">
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
						<div className="col-md-2 col-6 mt-0">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Status</option>
								<option>Applied</option>
								<option>Shortlisted</option>
							</select>
						</div>

						<div className="col-md-2 col-6 mt-0">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Location</option>
								<option>Mumbai</option>
								<option>Bangalore</option>
							</select>
						</div>

						<div className="col-md-2 col-6 mt-0">
							<select className="form-select fs-14 py-1 mt-0">
								<option>Category</option>
								<option>General</option>
								<option>OBC</option>
							</select>
						</div>

						<div className="col-md-4 col-12 text-md-end mt-2 mt-md-0">
							{/* <button className="btn orange-bg text-white fs-14 me-3 py-1 px-3">
								<img src={rankIcon} className="me-2" width={15}/>
								Rank
							</button> */}
							<button className="btn fs-14 me-3 blue-color blue-border">
								<img src={pdfIcon} className="" width={20}/>
							</button>
							<button className="btn fs-14 blue-color blue-border">
								<img src={excelIcon} className="" width={20}/>
							</button>
						</div>
					</div>

					<div className="row g-2 mt-1 align-items-center" style={{ backgroundColor: '#F9FAFB' }}>
						<div className="col-md-5 col-12 px-3 mb-2 py-2">
							 <div className="input-group">
								<span className="input-group-text bg-white border-end-0 py-1">
									<img src={searchIcon} width={15} />
								</span>
								<input
									type="text"
									className="form-control border-start-0 fs-14 py-2"
									placeholder="Search candidates..."
								/>
							</div>
						</div>
						<div className="col-md-7 col-12 text-md-end px-2 mb-2">
							{activeTab === "CANDIDATE_POOL" && canScheduleInterview && (
                <button className="btn blue-bg text-white fs-14" onClick={() => setShowScheduleModal(true)}>
                  Schedule Interview
                </button>
              )}

							{activeTab === "INTERVIEW_POOL" && selectedInterviewCandidateIds.length > 0 && (
								<>
									<button className="btn blue-color blue-border fs-14 me-2">
										Reschedule Interview
									</button>
									<button className="btn btn-danger fs-14">
										Cancel Interview
									</button>
								</>
							)}
						</div>
					</div>
				</div>
				{activeTab === "CANDIDATE_POOL" && !selectedCandidate && (
					<CandidatePool
            candidates={candidates}
            selectedIds={selectedCandidateIds}
            setSelectedIds={setSelectedCandidateIds}
            onView={(candidate) => setSelectedCandidate(candidate)}
            loading={loadingCandidates}
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            selectedPositionId={selectedPositionId}
          />
				)}

				{/* {selectedCandidate && (
					<CandidatePreviewPage
						candidate={selectedCandidate}
						onBack={() => setSelectedCandidate(null)}
					/>
				)} */}

				{activeTab === "INTERVIEW_POOL" && (
          <InterviewPool
            selectedIds={selectedInterviewCandidateIds}
            setSelectedIds={setSelectedInterviewCandidateIds}
          />
        )}
                {/* {activeTab === "OFFER_POOL" && <OfferPool />} */}
                {/* {activeTab === "ONBOARDING_POOL" && <OnboardingPool />} */}
                <ScheduleInterviewModal showScheduleModal={showScheduleModal} setShowScheduleModal={setShowScheduleModal} />
      </div>
    </div>
  );
}