import React, { useState, useEffect, useRef, useCallback } from "react";
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
import DropdownStrip from "./components/DropdownStrip";
import { toast } from "react-toastify";
import PdfViewerModal from "./components/PdfViewerModal";
// import DropdownStrip from "./components/DropdownStrip"
// import CandidatePreviewPage from "./candidatePreviewPage";
 
export default function CandidateScreening({ selectedJob }) {
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
  const [filters, setFilters] = useState({
    status: [],
    stateId: "",
    categoryId: "",
    searchText: "",
  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const tabs = [
    { key: "CANDIDATE_POOL", label: "Candidate Pool", count: totalElements },
    { key: "INTERVIEW_POOL", label: "Interview Pool", count: 0 },
    { key: "OFFER_POOL", label: "Offer Pool", count: 0 },
    { key: "ONBOARDING_POOL", label: "Onboarding Pool", count: 0 },
  ];
 
  // 🔍 Requisition search (debounced)
  const requisitionSearchTimeout = useRef(null);
 
  const fetchRequisitions = async (searchText = "") => {
    setLoadingRequisitions(true);
    try {
      const res = await jobPositionApiService.getRequisitions(searchText);
      setRequisitions(res?.data || []);
    } catch (err) {
      console.error("Failed to load requisitions", err);
    } finally {
      setLoadingRequisitions(false);
    }
  };
 
  const handleRequisitionSearch = useCallback((inputValue) => {
    if (requisitionSearchTimeout.current) {
      clearTimeout(requisitionSearchTimeout.current);
    }
 
    requisitionSearchTimeout.current = setTimeout(() => {
      fetchRequisitions(inputValue);
    }, 400);
  }, []);
 
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
      map[cat.categoryId] = cat.categoryName;
    });
    return map;
  }, [masterData]);

  const stateMap = React.useMemo(() => {
    const map = {};
    (masterData?.states || []).forEach((s) => {
      map[s.stateId] = s.stateName;
    });
    return map;
  }, [masterData]);
 
  useEffect(() => {
    fetchRequisitions("");
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
 
  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      // const res = await jobPositionApiService.getCandidatesByPosition({
      //   searchText: "",
      //   page,
      //   size: pageSize,
      //   positionId: selectedPositionId,
      //   status: "",
      //   stateId: "",
      //   categoryId: "",
      // });
 
      const res = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page,
        size: pageSize,
        positionId: selectedPositionId,
        status: filters.status,
        stateId: filters.stateId,
        categoryId: filters.categoryId,
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
        location: stateMap[c.stateId] || "-",
        stateId: c.stateId,
        categoryId: c.categoryId,
        categoryName: categoryMap[c.categoryId] || "-",
        applicationNo: c.candidateApplications.applicationNo,
        candidateId: c.candidateApplications.candidateId,
        fileUrl: c.fileUrl,
      }));
 
      setCandidates(mappedCandidates);
      setTotalElements(apiData?.page?.totalElements || 0);
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoadingCandidates(false);
    }
  };
 
  useEffect(() => {
    if (!selectedPositionId) {
      setCandidates([]);
      setTotalElements(0);
      return;
    }
 
    fetchCandidates();
  }, [selectedPositionId, page, pageSize, filters, masterData]);
 
  const handleRequisitionChange = (e) => {
    const reqId = e.target.value;
    setSelectedRequisitionId(reqId);
 
    // 🔥 HARD RESET of dependent state
    setSelectedPositionId("");
    setPositions([]);
    setCandidates([]);
    setSelectedCandidateIds([]);
    setSelectedInterviewCandidateIds([]);
    setPage(0);
    setTotalElements(0);
  };
 
  const handleViewFile = async (candidate) => {
    if (!candidate.fileUrl) {
      toast.error("No document available");
      return;
    }

    try {
      setLoadingPdf(true);


const selectedRequisition = requisitions.find(
  (r) => r.id === selectedRequisitionId
);

const rawRequisition = selectedRequisition
      const res = await masterApiService.getAzureBlobSasUrl(
        candidate.fileUrl,
        "candidate"
      );

      const sasUrl = res?.data?.url || res?.data;

      if (!sasUrl) throw new Error("Invalid SAS URL");

      setPdfUrl(sasUrl);
      setShowPdfViewer(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to open document");
    } finally {
      setLoadingPdf(false);
    }
  };
 
  const selectedCandidates = candidates.filter(c =>
    selectedCandidateIds.includes(c.id)
  );
 
  const canScheduleInterview =
    selectedCandidates.length > 0 &&
    selectedCandidates.every(c => c.status === "Shortlisted");
 
 const selectedRequisition = requisitions.find(
  (r) => r.id === selectedRequisitionId
);
const normalizedRequisition = selectedRequisition
  ? {
      requisition_id: selectedRequisition.id,
      requisition_code: selectedRequisition.requisitionCode,
      requisition_title: selectedRequisition.requisitionTitle,
      registration_start_date: selectedRequisition.startDate,
      registration_end_date: selectedRequisition.endDate,
    }
  : null;
 
 const selectedPosition = positions.find(
  (p) => p.jobPositions?.positionId === selectedPositionId
)
  ? {
      positionId: selectedPositionId,
      positionName:
        positions.find(
          (p) => p.jobPositions?.positionId === selectedPositionId
        )?.masterPositions?.positionName,
    }
  : null;
 
 
  const availableStatuses = React.useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      if (c.status) set.add(c.status);
    });
    return Array.from(set);
  }, [candidates]);
 
  const availableLocations = React.useMemo(() => {
    const map = new Map();

    candidates.forEach((c) => {
      if (c.stateId && c.location) {
        map.set(c.stateId, c.location);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [candidates]);
 
  const availableCategories = React.useMemo(() => {
    const map = new Map();
 
    candidates.forEach((c) => {
      if (c.categoryId && c.categoryName) {
        map.set(c.categoryId, c.categoryName);
      }
    });
 
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [candidates]);
 
  useEffect(() => {
    setPage(0);
  }, [filters]);
 
  useEffect(() => {
    setFilters({
      status: [],
      stateId: "",
      categoryId: "",
      searchText: "",
    });
  }, [selectedPositionId]);
 
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
								{/* <img src={uploadIcon} width={15} className="me-2" /> */}
            <DropdownStrip
              requisitions={requisitions}
              positions={positions}
              selectedRequisitionId={selectedRequisitionId}
              selectedPositionId={selectedPositionId}
              loadingRequisitions={loadingRequisitions}
              loadingPositions={loadingPositions}
              onRequisitionChange={handleRequisitionChange}
              onPositionChange={setSelectedPositionId}
              onRequisitionSearch={handleRequisitionSearch}
            />
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
            {normalizedRequisition && selectedPosition && (
              <RequisitionStrip
                requisition={normalizedRequisition}
                position={selectedPosition}
                isCardBg={false}
                isSaveEnabled={false}
                masterData={masterData}
              />
            )}
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
              <button
                className="btn fs-14 mb-1 error-text"
                onClick={() =>
                  setFilters({
                    status: [],
                    stateId: "",
                    categoryId: "",
                    searchText: "",
                  })
                }
              >
                Clear all
              </button>
            </div>
            <div className="col-md-2 col-6 mt-0">
              <select
                className="form-select fs-14 py-1 mt-0"
                value={filters?.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value ? [e.target.value] : [],
                  }))
                }
              >
                <option value="">All Statuses</option>
                {availableStatuses?.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
 
            <div className="col-md-2 col-6 mt-0">
              <select
                className="form-select fs-14 py-1 mt-0"
                value={filters?.stateId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    stateId: e.target.value,
                  }))
                }
              >
                <option value="">All Locations</option>
                {availableLocations?.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
 
            <div className="col-md-2 col-6 mt-0">
              <select
                className="form-select fs-14 py-1 mt-0"
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              >
                <option value="">All Categories</option>
                {availableCategories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
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
    onViewFile={handleViewFile}
    loading={loadingCandidates}
    page={page}
    pageSize={pageSize}
    totalElements={totalElements}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
    selectedPositionId={selectedPositionId}
    requisition={normalizedRequisition}
    position={selectedPosition}
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
      <PdfViewerModal
        show={showPdfViewer}
        onHide={() => {
          setShowPdfViewer(false);
          setPdfUrl(null);
        }}
        fileUrl={pdfUrl}
        loading={loadingPdf}
        title="Candidate Document"
      />
    </div>
  );
}