import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import masterApiService from "../master/services/masterApiService";
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
import { useLocation } from "react-router-dom";
import InterviewFeedbackHistoryModal from "./components/InterviewFeedbackHistoryModal";
import useInterviewPool from "./hooks/useInterviewPool";
import candidateWorkflowServices from "./services/CandidateWorkflowServices";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import OfferPool from "./components/OfferPool";
import offerIcon from "../../assets/send-offer-icon.png";
import locationIcon from "../../assets/location-icon.png";
import RankListModal from "./components/RankListModal";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// import DropdownStrip from "./components/DropdownStrip"
// import CandidatePreviewPage from "./candidatePreviewPage";

export default function CandidateScreening({ selectedJob }) {
   const { t } = useTranslation(["candidateWorkflow","common"]);
   
   const STATUS_LABEL_MAP = {
    SHORTLISTED: "Shortlisted",
    APPLIED: "Applied",
    REJECTED: "Rejected",
    DISCREPANCY: "Discrepancy",
    PENDING: "Pending",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    // REJECTED: "Rejected",
  };

  const CANDIDATE_POOL_STATUSES = [
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "DISCREPANCY",
    "PENDING"
  ];
 const INTERVIEW_STATUS_LABEL_MAP = {
    SCHEDULED: "Scheduled",
    QUALIFIED: "Qualified",
    DISQUALIFIED: "Disqualified",
    PROVISIONALLY_APPROVED: "Provisionally Approved",
    PENDING: "Pending",
    ZONAL_REJECTED: "Zonal Rejected",
    ZONAL_ABSENT: "Zonal Absent",
    INTERVIEW_ABSENT: "Interview Absent",
  };

  const OFFER_POOL_STATUSES = [
    "OFFER_AWAITED",
    "OFFER_SENT",
    "OFFER_REJECTED",
    "OFFER_ACCEPTED",
  ];

  const OFFER_STATUS_LABEL_MAP = {
    OFFER_AWAITED: "Offer Awaited",
    OFFER_SENT: "Offer Sent",
    OFFER_REJECTED: "Offer Rejected",
    OFFER_ACCEPTED: "Offer Accepted",
  };
  const [interviewPage, setInterviewPage] = useState(0);
  const [interviewPageSize, setInterviewPageSize] = useState(10);
  const location = useLocation();

  const navActiveTab = location.state?.activeTab;

  const [activeTab, setActiveTab] = useState(
    navActiveTab || "CANDIDATE_POOL"
  ); const [selectedCandidate, setSelectedCandidate] = useState(null);
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
  const [allCandidatesForFilters, setAllCandidatesForFilters] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    stateId: "",
    categoryId: "",
    searchText: "",
  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const searchTimeoutRef = useRef(null);
  const {
    interviewCandidates,
    totalElements: interviewTotalElements,
    loading: loadingInterview,
    refetch: refetchInterviewPool
  } = useInterviewPool({
    positionId: selectedPositionId,
    filters,
    page: interviewPage,
    pageSize: interviewPageSize,
    enabled: !!selectedPositionId
  });
const TAB_PRIVILEGE_MAP = {
  CANDIDATE_POOL: "Candidate Pool",
  INTERVIEW_POOL: "Interview Pool",
  OFFER_POOL: "Offer Pool",
  ONBOARDING_POOL: "Compensation Pool", // assuming onboarding is compensation
};
  // const tabs = [
  //   { key: "CANDIDATE_POOL", label: "Candidate Pool", count: totalElements },
  //   { key: "INTERVIEW_POOL", label: "Interview Pool", count: interviewTotalElements },
  //   { key: "OFFER_POOL", label: "Offer Pool", count: 0 },
  //   { key: "ONBOARDING_POOL", label: "Onboarding Pool", count: 0 },
  // ];

  const tabs = [
  { key: "CANDIDATE_POOL", label: t("candidateWorkflow:candidate_pool"), count: totalElements },
  { key: "INTERVIEW_POOL", label: t("candidateWorkflow:interview_pool"), count: interviewTotalElements },
  { key: "OFFER_POOL", label: t("candidateWorkflow:offer_pool"), count: 0 },
  { key: "ONBOARDING_POOL", label: t("candidateWorkflow:onboarding_pool"), count: 0 },
];
const privileges = useSelector(
  (state) => state.user.privileges || {}
);

const hasPrivilege = (key) => {
 return privileges?.[key] === true;
};
  const accessibleTabs = useMemo(() => {
  return tabs.filter(tab =>
    hasPrivilege(TAB_PRIVILEGE_MAP[tab.key])
  );
}, [tabs, privileges]);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [showRankListModal, setShowRankListModal] = useState(false);
  const [offerSelectedIds, setOfferSelectedIds] = useState([]);
  const [offerRefreshKey, setOfferRefreshKey] = useState(0);
  const [offerTemplateId, setOfferTemplateId] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [acceptBeforeDate, setAcceptBeforeDate] = useState("");
  const [offerData, setOfferData] = useState([]);
  const [formErrors, setFormErrors] = useState({
    acceptBeforeDate: "",
    joiningDate: "",
  });

  const todayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const navInitRef = useRef({
    requisitionId: null,
    positionId: null,
    initialized: false,
  });

  // 🔍 Requisition search (debounced)
  const requisitionSearchTimeout = useRef(null);
  const isNavModeRef = useRef(false);

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
      const res = await masterApiService.getMasterDisplayAll();
      setMasterData(res.data);
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

  const stateMap = React.useMemo(() => {
    const map = {};
    (masterData?.states || []).forEach((s) => {
      map[s.stateId] = s.stateName;
    });
    return map;
  }, [masterData]);

  useEffect(() => {
    if (!selectedPositionId) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(0);
      fetchCandidates();
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [filters.searchText]);

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
        setPositions(res?.data || []);
      } catch (err) {
        console.error("Failed to load positions", err);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [selectedRequisitionId]);

  const formatCandidateData = (apiData) => {
    const formatStatus = (status = "") => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (apiData?.content || []).map((c) => ({
      id: c.candidateApplications.id, // REQUIRED for selection
      name: c.fullName,
      rank: c.rank,
      score: c.score,
      // experience: `${Math.floor((c.totalMonths || 0) / 12)} years`,
      experienceMonths: c.totalMonths || 0,
      status: formatStatus(c.candidateApplications.applicationStatus),
      location: stateMap[c.stateId] || "-",
      stateId: c.stateId,
      categoryId: c.categoryId,
      categoryName: categoryMap[c.categoryId] || "-",
      applicationNo: c.candidateApplications.applicationNo,
      candidateId: c.candidateApplications.candidateId,
      fileUrl: c.resumeUrl,
    }));
  };

  // 🔍 Fetch all candidates WITHOUT location/category filters for dropdown options
  const fetchAllCandidatesForFilters = async () => {
    try {
      const normalizedStatus = filters.status.length === 0 ? availableStatuses : filters.status.map((s) => s.toUpperCase());
      const res = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page: 0,
        size: 1000, // Large size to get all candidates
        positionId: selectedPositionId,
        status: normalizedStatus,
        stateId: "", // NO location filter
        categoryId: "", // NO category filter
      });

      const apiData = res?.data;
      const mappedCandidates = formatCandidateData(apiData);
      setAllCandidatesForFilters(mappedCandidates);
    } catch (err) {
      console.error("Failed to load all candidates for filters", err);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const normalizedStatus = filters.status.length === 0 ? availableStatuses : filters.status.map((s) => s.toUpperCase());

      const res = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page,
        size: pageSize,
        positionId: selectedPositionId,
        status: normalizedStatus,
        stateId: filters.stateId,
        categoryId: filters.categoryId,
      });

      const apiData = res?.data;
      const mappedCandidates = formatCandidateData(apiData);

      setCandidates(mappedCandidates);
      setTotalElements(apiData?.page?.totalElements || 0);
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${day}-${month}-${year} ${time}`;
  };


  // useEffect(() => {
  //   if (!selectedPositionId) {
  //     setCandidates([]);
  //     setTotalElements(0);
  //     return;
  //   }

  //   fetchCandidates();
  // }, [selectedPositionId, page, pageSize, filters, masterData]);

  useEffect(() => {
    if (!selectedPositionId) return;

    fetchCandidates();
  }, [
    selectedPositionId,
    page,
    pageSize,
    filters.status,
    filters.stateId,
    filters.categoryId,
    masterData,
  ]);

  // 🔍 Fetch all candidates for filter dropdowns when position/status changes
  useEffect(() => {
    if (!selectedPositionId) {
      setAllCandidatesForFilters([]);
      return;
    }

    fetchAllCandidatesForFilters();
  }, [selectedPositionId, filters.status, filters.searchText, masterData]);

const handleRequisitionChange = async (e) => {
  const reqId = e.target.value;

  isNavModeRef.current = false;

  setSelectedRequisitionId(reqId);
  setSelectedPositionId("");
  setCandidates([]);
  setSelectedCandidateIds([]);
  setSelectedInterviewCandidateIds([]);
  setPage(0);
  setTotalElements(0);

  if (!reqId) {
    setPositions([]);
    return;
  }

  try {
    setLoadingPositions(true);

    const res = await jobPositionApiService.getPositionsByReqId({
      requisitionId: reqId,
    });

    setPositions(res?.data || []);
  } catch (err) {
    console.error("Failed to load positions", err);
    setPositions([]);
  } finally {
    setLoadingPositions(false);
  }
};

  const handleViewFile = async (candidate) => {
    if (!candidate.fileUrl) {
      toast.error(t("candidateWorkflow:no_document_available"));
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

      const sasUrl = res || res?.data;

      if (!sasUrl) throw new Error("Invalid SAS URL");

      setPdfUrl(sasUrl.trim());
      setShowPdfViewer(true);
    } catch (err) {
      console.error(err);
      toast.error(t("candidateWorkflow:failed_open_document"));
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



  // const availableStatuses = CANDIDATE_POOL_STATUSES;
  const availableStatuses = React.useMemo(() => {
    if (activeTab === "INTERVIEW_POOL") {
      return Object.keys(INTERVIEW_STATUS_LABEL_MAP);
    }

    if (activeTab === "OFFER_POOL") {
      return OFFER_POOL_STATUSES;
    }

    return CANDIDATE_POOL_STATUSES;
  }, [activeTab]);


  const getStatusLabel = (status) => {
    if (activeTab === "INTERVIEW_POOL") {
      return INTERVIEW_STATUS_LABEL_MAP[status] || status;
    }
    return STATUS_LABEL_MAP[status] || status;
  };

  const selectedInterviewCandidates = useMemo(() => {
    return interviewCandidates.filter((c) =>
      selectedInterviewCandidateIds.includes(c.id)
    );
  }, [interviewCandidates, selectedInterviewCandidateIds]);


  const canSendToOfferPool =
    selectedInterviewCandidates.length > 0 &&
    selectedInterviewCandidates.every((c) => c.status === "QUALIFIED");

  const qualifiedInterviewIds = selectedInterviewCandidates
    .filter(c => c.status === "QUALIFIED")
    .map(c => c.id);

  useEffect(() => {
    if (activeTab === "INTERVIEW_POOL") {
      setInterviewPage(0);
    }
  }, [activeTab, filters.status]);


  const availableLocations = React.useMemo(() => {
    const map = new Map();

    allCandidatesForFilters.forEach((c) => {
      if (c.stateId && c.location) {
        map.set(c.stateId, c.location);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [allCandidatesForFilters]);

  const availableCategories = React.useMemo(() => {
    const map = new Map();

    allCandidatesForFilters.forEach((c) => {
      if (c.categoryId && c.categoryName) {
        map.set(c.categoryId, c.categoryName);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [allCandidatesForFilters]);

  // useEffect(() => {
  //   setPage(0);
  // }, [filters]);

  useEffect(() => {
    if (!navPositionId) {
      setFilters({
        status: [],
        stateId: "",
        categoryId: "",
        searchText: "",
      });
    }
  }, [selectedPositionId]);

  useEffect(() => {
    setFilters({
      status: [],
      stateId: "",
      categoryId: "",
      searchText: "",
    });
    setPage(0);
  }, [activeTab]);



  const navRequisitionId = location.state?.requisitionId || null;
  const navPositionId = location.state?.positionId || null;


  useEffect(() => {
    if (
      !navInitRef.current.initialized &&
      location.state?.requisitionId
    ) {
      navInitRef.current = {
        requisitionId: location.state.requisitionId,
        positionId: location.state.positionId || null,
        initialized: true,
      };

      isNavModeRef.current = true;

      // optional but clean
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (
      isNavModeRef.current &&
      navInitRef.current.requisitionId &&
      requisitions.length > 0
    ) {
      setSelectedRequisitionId(navInitRef.current.requisitionId);
    }
  }, [requisitions]);

  useEffect(() => {
    if (
      isNavModeRef.current &&
      navInitRef.current.positionId &&
      positions.length > 0
    ) {
      setSelectedPositionId(navInitRef.current.positionId);

      // 🔥 NAV MODE PERMANENTLY OFF
      isNavModeRef.current = false;
    }
  }, [positions]);
  const refreshCandidatesAfterSchedule = async () => {
    // reset pagination if needed
    setPage(0);
    // clear selection (important UX)
    setSelectedCandidateIds([]);
    // refetch list
    await fetchCandidates();
  };
  const getNormalizedStatuses = () => {
    return filters.status?.length
      ? filters.status.map((s) => s.toUpperCase())
      : availableStatuses;
  };
  const buildDownloadPayload = (documentType) => {
    const normalizedStatuses = getNormalizedStatuses();

    const basePayload = {
      documentType,
      positionId: selectedPositionId,
      screenName:
        activeTab === "INTERVIEW_POOL"
          ? "InterviewPool"
          : "CandidatePool",
      categoryId: filters.categoryId || null,
    };

    if (activeTab === "CANDIDATE_POOL") {
      return {
        ...basePayload,
        candidateApplicationStatuses: normalizedStatuses,
      };
    }

    if (activeTab === "INTERVIEW_POOL") {
      return {
        ...basePayload,
        interviewSchedulingStatuses: normalizedStatuses,
      };
    }

    return basePayload;
  };

  const handleDownload = async (type) => {
    if (!selectedPositionId) {
     toast.error(t("candidateWorkflow:select_position_first"));
      return;
    }

    // Normalize to extension format
    const extension = type === "pdf" ? ".pdf" : ".xlsx";

    try {
      const payload = buildDownloadPayload(extension);

      const res = await jobPositionApiService.downloadCandidateDetails(payload);

      const blob = new Blob([res.data], {
        type:
          extension === ".pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        extension === ".pdf"
          ? "candidate-details.pdf"
          : "candidate-details.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
     toast.error(t("candidateWorkflow:download_failed"));
    }
  };

  const mapInterviewFeedback = (candidateId) => {
    // STATIC for now — API later
    return [
      {
        name: "Anand G",
        comment: "Good to go",
        time: "28-07-2025 02:00 PM",
        score: 82,
      },
      {
        name: "Manohar K",
        comment: "Good to go",
        time: "28-07-2025 02:00 PM",
        score: 89,
      },
      {
        name: "Ramesh M",
        comment: "Good to go",
        time: "28-07-2025 02:00 PM",
        score: 78,
      },
    ];
  };

  const handleSendToOfferPool = async () => {
    if (qualifiedInterviewIds.length === 0) {
      toast.error(t("candidateWorkflow:select_qualified_candidate"));
      return;
    }

    try {
      await jobPositionApiService.sendToOfferPool(qualifiedInterviewIds);

      toast.success(t("candidateWorkflow:candidates_moved_to_offer_pool"));

      // Clear selection
      setSelectedInterviewCandidateIds([]);

      // Optional: refresh interview pool
      setInterviewPage(0);
      await refetchInterviewPool();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||  t("candidateWorkflow:failed_to_send_offer_pool")
      );
    }
  };

  const handleSendOffer = async () => {
    if (offerSelectedIds.length === 0) {
      toast.error(t("candidateWorkflow:select_at_least_one_candidate"));
      return;
    }

    if (!offerTemplateId) {
      toast.error(t("candidateWorkflow:select_offer_template"));
      return;
    }

    if (!joiningDate || !acceptBeforeDate) {
      toast.error(t("candidateWorkflow:select_joining_date"));
      return;
    }

    try {
      const payload = {
        offerTemplateId,
        joiningDate,
        acceptBeforeDate,
        offerIds: offerSelectedIds,
      };
      const response = await jobPositionApiService.sendOffer(payload);

      if (response?.data?.success === false) {
        toast.error(response?.data?.message || t("candidateWorkflow:failed_send_offer"));
        return;
      }

      toast.success(t("candidateWorkflow:offer_sent_successfully"));

      // Clear selections + form
      setOfferSelectedIds([]);
      setOfferTemplateId("");
      setJoiningDate("");
      setAcceptBeforeDate("");

      // Refresh Offer Pool
      setOfferRefreshKey((prev) => prev + 1);

    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || t("candidateWorkflow:failed_send_offer")
);
    }
  };

  const selectedOfferObjects = useMemo(() => {
    return offerData.filter(o => offerSelectedIds.includes(o.id));
  }, [offerData, offerSelectedIds]);

  const allAwaited =
    selectedOfferObjects.length > 0 &&
    selectedOfferObjects.every(o => o.status === "OFFER_AWAITED");

  const allHaveSelectListValue =
    selectedOfferObjects.length > 0 &&
    selectedOfferObjects.every(
      (o) =>
        o.selectList &&
        o.selectList.trim() !== ""
    );

  const isSendOfferEnabled =
    offerSelectedIds.length > 0 &&
    offerTemplateId &&
    joiningDate &&
    acceptBeforeDate &&
    allAwaited &&
    allHaveSelectListValue &&
    !formErrors.acceptBeforeDate &&
    !formErrors.joiningDate;

  useEffect(() => {
    if (activeTab !== "OFFER_POOL") {
      // User left Offer Pool → reset everything
      setOfferTemplateId("");
      setAcceptBeforeDate("");
      setJoiningDate("");
      setFormErrors({
        acceptBeforeDate: "",
        joiningDate: "",
      });
      setOfferSelectedIds([]);
    }
  }, [activeTab]);

  return (
    <div className="container-fluid px-5 py-4">
      {/* Header */}
      <div className="mb-4">
        <h5 className="mb-1 blue-color">{t("candidateWorkflow:candidate_screening")}</h5>
        <small className="text-muted">
          {t("candidateWorkflow:manage_schedule_interviews")}
        </small>
      </div>

      {/* Filters */}
      <div className="card mb-4 border-0">
        <div className="card-body p-0">
          <div className="row g-2 align-items-end border-bottom pb-4 px-3 py-3">
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
                {t("candidateWorkflow:import_candidates")}
              </button>
              <button className="btn text-white orange-bg fs-14">
                + {t("candidateWorkflow:add_candidate")}
              </button>
            </div>
          </div>

          <div className="mt-2 pt-1 pb-3">
            {normalizedRequisition && selectedPosition && (
              <RequisitionStrip
                requisition={normalizedRequisition}
                position={selectedPosition}
                isCardBg={false}
                isSaveEnabled={false}
                isSaveBtn={false}
                saveButton={false}
              />
            )}
          </div>

        </div>
      </div>

      {/* Desktop Table */}
      <div className="card rounded border-0 d-none d-md-block mt-4" style={{ marginBottom: '2rem !important' }}>
        <div className="card-header bg-white border-bottom-0 p-0 px-1 candidate-screening-tabs-header">
          {/* Tabs */}
          <ul className="nav nav-tabs border-0 pt-2 pb-3 px-2 border-bottom">
            {accessibleTabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link fs-14 ${activeTab === tab.key ? "orange-color orange-bottom-border" : "text-muted"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                  {/* <span className="ms-2 badge rounded-pill bg-light text-muted p-2" style={{ fontSize: '0.675rem', fontWeight: '500' }}>
                    {tab.count}
                  </span> */}
                </button>
              </li>
            ))}
          </ul>

          {/* Filters */}
          {activeTab !== "OFFER_POOL" && (
            <div className="row g-2 mt-1 px-2 py-1 align-items-center">
              <div className="col-md-2 col-6 d-flex align-items-center gap-2">
                <p className="text-muted fs-14 mb-1"> {t("candidateWorkflow:filter_by")}:</p>
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
                 {t("common:clear_all")}
                </button>
              </div>
              <div className="col-md-2 col-6 mt-0">
                <select
                  className="form-select fs-14 py-1 mt-0"
                  value={filters?.status[0] || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value ? [e.target.value] : [],
                    }))
                  }
                >
                  <option value="">{t("candidateWorkflow:all_statuses")}</option>
                  {/* {availableStatuses?.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL_MAP[status] || status}
                    </option>
                  ))} */}

                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}

                </select>
              </div>

              {activeTab === "CANDIDATE_POOL" && (
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
                    <option value="">{t("candidateWorkflow:all_locations")}</option>
                    {availableLocations?.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              {activeTab === "CANDIDATE_POOL" && (
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
                    <option value="">{t("candidateWorkflow:all_categories")}</option>
                    {availableCategories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 👇 spacer ONLY for Interview Pool */}
              {activeTab === "INTERVIEW_POOL" && (
                <div className="col-md-4 d-none d-md-block" />
              )}

              {selectedPositionId && selectedRequisitionId && (
                <div className="col-md-4 col-12 text-md-end mt-2 mt-md-0">
                  {/* <button className="btn orange-bg text-white fs-14 me-3 py-1 px-3">
                    <img src={rankIcon} className="me-2" width={15}/>
                    Rank
                  </button> */}
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip >{t("candidateWorkflow:download_pdf")}</Tooltip>}
                  >
                    <button className="btn fs-14 me-3 blue-color blue-border" onClick={() => handleDownload("pdf")}>
                      <img src={pdfIcon} className="" width={20} />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip >{t("candidateWorkflow:download_excel")}</Tooltip>}
                  >
                    <button className="btn fs-14 blue-color blue-border" onClick={() => handleDownload("xlsx")}>
                      <img src={excelIcon} className="" width={20} />
                    </button>
                  </OverlayTrigger>
                </div>
              )}
            </div>
          )}

          {activeTab === "OFFER_POOL" && (
            <div className="row g-2 mt-1 px-2 py-1 align-items-center border-bottom">
              <div className="col-md-2 col-6 d-flex align-items-center gap-2">
                <p className="text-muted fs-14 mb-1">{t("candidateWorkflow:filter_by_stage")}:</p>
                <button
                  className="btn fs-14 mb-1 error-text"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      status: [],
                    }))
                  }
                >
                  {t("common:clear_all")}
                </button>
              </div>

              <div className="col-md-10 d-flex flex-wrap gap-2 mt-0">
                {OFFER_POOL_STATUSES.map((status) => {
                  const isSelected = filters.status.includes(status);

                  return (
                    <span
                      key={status}
                      onClick={() =>
                        setFilters((prev) => {
                          const alreadySelected = prev.status.includes(status);

                          return {
                            ...prev,
                            status: alreadySelected
                              ? prev.status.filter((s) => s !== status)
                              : [...prev.status, status],
                          };
                        })
                      }
                      className={`badge px-3 py-2 border-0 rounded fw-normal fs-12 ${isSelected
                        ? "bg-primary text-white"
                        : "bg-light text-muted border"
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      {OFFER_STATUS_LABEL_MAP[status]}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "OFFER_POOL" && (
            <div className="row g-2 mt-1 px-2 py-2 align-items-end">

              {/* LEFT SECTION */}
              <div className="col-md-8 col-12">
                <div className="d-flex flex-wrap gap-4 justify-content-between align-items-end">
                  <div className="d-flex gap-3 flex-wrap align-items-end pb-3">
                    {/* Offer Template */}
                  <div>
                        <p className="mb-1 fw-normal fs-13 blue-color">{t("candidateWorkflow:offer_template")}</p>
                        <select
                          className="form-select fs-13 py-1"
                          style={{ width: "180px" }}
                          value={offerTemplateId}
                          onChange={(e) => setOfferTemplateId(e.target.value)}
                        >
                          <option value="">{t("candidateWorkflow:select_template")}</option>
                          <option value="3fa85f64-5717-4562-b3fc-2c963f66afa6">Template 1</option>
                        </select>

                        {/* Reserve space for alignment consistency */}
                        <small className="d-block mt-1 fs-12 invisible">
                          placeholder
                        </small>
                      </div>

                    {/* Accept Before Date */}
                    <div>
                      <p className="mb-1 fw-normal fs-13 blue-color">{t("candidateWorkflow:accept_before")}</p>
                      <input
                        type="date"
                        className="form-control fs-13 py-1"
                        style={{ width: "160px" }}
                        value={acceptBeforeDate}
                        min={todayString()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAcceptBeforeDate(value);

                          if (!value) {
                            setFormErrors(prev => ({ ...prev, acceptBeforeDate: "" }));
                            return;
                          }

                          if (value <= todayString()) {
                            setFormErrors(prev => ({
                              ...prev,
                              acceptBeforeDate: t("candidateWorkflow:must_be_greater_than_today"),
                            }));
                          } else {
                            setFormErrors(prev => ({ ...prev, acceptBeforeDate: "" }));
                          }
                        }}
                      />
                        <small
        className={`d-block mt-1 fs-12 ${
          formErrors.acceptBeforeDate ? "text-danger" : "invisible"
        }`}
      >
        {formErrors.acceptBeforeDate || "placeholder"}
      </small>
                    </div>

                    {/* Joining Date */}
                    <div>
                      <p className="mb-1 fw-normal fs-13 blue-color">{t("candidateWorkflow:joining_date_label")}</p>
                      <input
                        type="date"
                        className="form-control fs-13 py-1"
                        style={{ width: "160px" }}
                        value={joiningDate}
                        min={acceptBeforeDate || todayString()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setJoiningDate(value);

                          if (!value) {
                            setFormErrors(prev => ({ ...prev, joiningDate: "" }));
                            return;
                          }

                          if (!acceptBeforeDate) {
                            setFormErrors(prev => ({
                              ...prev,
                              joiningDate: t("candidateWorkflow:select_accept_before_first"),
                            }));
                            return;
                          }

                          if (value <= acceptBeforeDate) {
                            setFormErrors(prev => ({
                              ...prev,
                              joiningDate: t("candidateWorkflow:must_be_greater_than_accept_before"),
                            }));
                          } else {
                            setFormErrors(prev => ({ ...prev, joiningDate: "" }));
                          }
                        }}
                      />
                                            <small
                          className={`d-block mt-1 fs-12 ${
                            formErrors.joiningDate ? "text-danger" : "invisible"
                          }`}
                        >
                          {formErrors.joiningDate || "placeholder"}
                        </small>
                    </div>

                    {/* Send Offers Button */}
                  <div>
  <button
    className="btn orange-bg text-white fs-13 px-3 py-1"
    onClick={handleSendOffer}
    disabled={!isSendOfferEnabled}
  >
    <img className="me-2" src={offerIcon} width={14} />
    {t("candidateWorkflow:send_offers")}
  </button>

  {/* Reserve equal space like other fields */}
  <small className="d-block mt-1 fs-12 invisible">
    {"\u00A0"}
  </small>
</div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="col-md-4 col-12">
                <div className="d-flex justify-content-end gap-2 align-items-center pb-3">
                  <button className="btn orange-color orange-border fs-13 px-3 py-1">
                    <img className="me-2" src={locationIcon} width={16} />
                    {t("candidateWorkflow:assign_locations")}
                  </button>
                  <button className="btn blue-border blue-color fs-13 px-3 py-1" onClick={() => setShowRankListModal(true)} disabled={offerSelectedIds.length === 0}>
                    <img src={excelIcon} className="me-1" width={18} /> {t("candidateWorkflow:rank_list")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "OFFER_POOL" && (
            <div className="row g-2 mt-1 align-items-center" style={{ backgroundColor: '#F9FAFB' }}>
              <div className="col-md-5 col-12 px-3 mb-2 py-2">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 py-1">
                    <img src={searchIcon} width={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 fs-14 py-2 search_input"
                    placeholder={t("candidateWorkflow:search_candidates")}
                    value={filters.searchText}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchText: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-7 col-12 text-md-end px-2 mb-2">
                {activeTab === "CANDIDATE_POOL" 
                  && hasPrivilege("Interview Pool")
                  && canScheduleInterview && (
                  <button className="btn blue-bg text-white fs-14" onClick={() => setShowScheduleModal(true)}>
                    {t("candidateWorkflow:schedule_interview")}
                  </button>
                )}

                {activeTab === "INTERVIEW_POOL" 
                  && hasPrivilege("Offer Pool")
                  && canSendToOfferPool && (
                  <button
                    className="btn blue-bg text-white fs-14"
                    onClick={handleSendToOfferPool}
                  >
                    {t("candidateWorkflow:send_to_offer_pool")}
                  </button>
                )}

              </div>
            </div>
          )}
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
            selectedRequisitionId={selectedRequisitionId}
            requisition={normalizedRequisition}
            position={selectedPosition}
          />
        )}

        {activeTab === "INTERVIEW_POOL" && (
          <InterviewPool
            candidates={interviewCandidates}
            loading={loadingInterview}
            selectedIds={selectedInterviewCandidateIds}
            setSelectedIds={setSelectedInterviewCandidateIds}
            page={interviewPage}
            pageSize={interviewPageSize}
            totalElements={interviewTotalElements}
            onPageChange={setInterviewPage}
            onPageSizeChange={setInterviewPageSize}
            selectedPositionId={selectedPositionId}
            selectedRequisitionId={selectedRequisitionId}
            requisition={normalizedRequisition}
            position={selectedPosition}
            onViewFile={handleViewFile}
            getStatusLabel={getStatusLabel}
            onOpenFeedback={async (scheduledInterviewId) => {
              try {
                setShowFeedbackModal(true);
                setSelectedFeedback([]);

                const res = await candidateWorkflowServices.getPanelScores(
                  scheduledInterviewId
                );

                const rawList = res?.data || [];

                const mapped = rawList.map(item => {
                  const scoreObj = item.panelMembersScore;
                  const user = item.user;

                  return {
                    id: scoreObj.panelMembersScoreId,
                    name: user?.name || "-",
                    comment: scoreObj.panelComments || "-",
                    time: formatDateTime(scoreObj.modifiedDate),
                    score: scoreObj.panelScore ?? "-"
                  };
                });

                setSelectedFeedback(mapped);

              } catch (err) {
                console.error(err);
                toast.error(t("candidateWorkflow:failed_load_feedback"));
                setShowFeedbackModal(false);
              }
            }}


          />
        )}

        {activeTab === "OFFER_POOL" && (
          <OfferPool
            selectedPositionId={selectedPositionId}
            selectedRequisitionId={selectedRequisitionId}
            filters={filters}
            selectedIds={offerSelectedIds}
            setSelectedIds={setOfferSelectedIds}
            refreshKey={offerRefreshKey}
            onOffersLoaded={(data) => setOfferData(data)}
          />
        )}

        {/* {activeTab === "ONBOARDING_POOL" && <OnboardingPool />} */}
        <ScheduleInterviewModal
          showScheduleModal={showScheduleModal}
          setShowScheduleModal={setShowScheduleModal}
          applicationIds={selectedCandidateIds}
          positionId={navPositionId || selectedPositionId}
          onBulkScheduleSuccess={refreshCandidatesAfterSchedule}
        />
      </div>

      <PdfViewerModal
        show={showPdfViewer}
        onHide={() => {
          setShowPdfViewer(false);
          setPdfUrl(null);
        }}
        fileUrl={pdfUrl}
        loading={loadingPdf}
        title={t("candidateWorkflow:candidate_resume")}
      />

      <InterviewFeedbackHistoryModal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
        feedbackList={selectedFeedback}
      />

      <RankListModal
        showRankListModal={showRankListModal}
        setShowRankListModal={setShowRankListModal}
        selectedIds={offerSelectedIds}
        setSelectedIds={setOfferSelectedIds}
        onUploadSuccess={() => setOfferRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}