import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import masterApiService from "../master/services/masterApiService";
import "../../style/css/CandidateScreening.css";
import uploadIcon from "../../assets/upload-blue-icon.png"
import rankIcon from "../../assets/rank-icon.png"
import pdfIcon from "../../assets/pdf-icon.png"
import excelIcon from "../../assets/export-excel-icon.png"
import searchIcon from "../../assets/search-icon.png"
import RequisitionStripformultiplepositions from "./components/RequisitionStripformultiplepositions";
import CandidatePool from "./components/CandidatePool";
import InterviewPool from "./components/InterviewPool";
import ScheduleInterviewModal from "./components/ScheduleInterviewModal";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";
import DropdownStripMultipleposition from "./components/DropdownStripMultipleposition";
import { toast } from "react-toastify";
import PdfViewerModal from "./components/PdfViewerModal";
import { useLocation, useNavigate } from "react-router-dom";
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
import ZonalRejectedCommentModal from "./components/ZonalRejectedCommentModal";
import { FaUsers, FaUserTie, FaFileSignature, FaUserCheck, FaBars, FaListOl, FaExternalLinkAlt } from "react-icons/fa";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import CandidateImportModal
  from "./components/CandidateImportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropdownStrip from "./components/DropdownStrip"
// import CandidatePreviewPage from "./candidatePreviewPage";
import { useDispatch } from "react-redux";
import { setRankEnabled, clearRankState } from "../../app/providers/rankSlice";

import {
  Modal,
  Button
} from "react-bootstrap";

import {
  FiUpload
} from "react-icons/fi";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import CompensationPool from "./components/CompensationPool";
import useCompensationPool from "./hooks/useCompensationPool";
import { mapCompensationCandidates } from "./mappers/compositionMapper";
import useCommitteeRequests from "../Approvals/hooks/useCommitteeRequests";
import InterviewScheduleTable from ".././interviews/components/InterviewScheduleTable";
import SchedulePoolTable from "../interviews/components/SchedulePoolTable";
import ScheduleApprovalModal from "../candidatePreview/components/ScheduleApprovalModal";
import ScheduleErrorModal from "../interviews/components/ScheduleErrorModal";
export default function CandidateScreening({ selectedJob }) {
  const { t } = useTranslation(["candidateWorkflow", "common"]);

  const STATUS_LABEL_MAP = {
    SHORTLISTED: "Shortlisted",
    APPLIED: "Applied",
    REJECTED: "Rejected",
    DISCREPANCY: "Discrepancy",
    PENDING: "Pending",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    ELIGIBLE: "Eligible",
    // REJECTED: "Rejected",
  };

  const user = useSelector((state) => state.user.user);


  const role = user?.role?.toLowerCase();

  const isRecruiter = role === "recruiter";

  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");

  const CANDIDATE_POOL_STATUSES = [
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "DISCREPANCY",
    "PENDING",
    "ELIGIBLE",
  ];

  const [compRefreshKey, setCompRefreshKey] = useState(0);
  const { panelData, fetchPanels } = useCommitteeRequests();

  const [showErrorModal, setShowErrorModal] =
    useState(false);

  const [errorCandidates, setErrorCandidates] =
    useState([]);

  const [errorMessage, setErrorMessage] =
    useState("");

  // const user = useSelector((state) => state.user.user);

  // const role = user?.role?.toLowerCase();

  // const isRecruiter = role === "recruiter";
  const COMPENSATION_POOL_STATUSES =
    role === "committee_member"
      ? [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "RENEGOTIATE",
      ]
      : [
        "NEW",
        "SUBMITTED",
        "PENDING",
        "APPROVED",
        "REJECTED",
        "RENEGOTIATE",
      ];

  const COMPENSATION_STATUS_LABEL_MAP = {
    NEW: "New",
    SUBMITTED: "Submitted",
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    RENEGOTIATE: "Renegotiate",
  };


  // const handleRemovePosition = (removeId) => {
  //   const updatedIds = selectedPositionId.filter(
  //     (id) => id !== removeId
  //   );

  //   setSelectedPositionId(updatedIds);

  //   // CLEAR DATA WHEN NO POSITIONS LEFT
  //   if (updatedIds.length === 0) {
  //     setCandidates([]);
  //     setTotalElements(0);
  //     setSelectedCandidateIds([]);
  //     setAllCandidatesForFilters([]);
  //   }
  // };

  const handleRemovePosition = (removeId) => {

    const updatedIds = selectedPositionId.filter(
      (id) => id !== removeId
    );

    // MOVE TO FIRST PAGE
    setPage(0);
    setInterviewPage(0);
    setSchedulePoolPage(0);

    setSelectedPositionId(updatedIds);

    // CLEAR DATA WHEN NO POSITIONS LEFT
    if (updatedIds.length === 0) {

      setCandidates([]);
      setTotalElements(0);

      setSelectedCandidateIds([]);
      setAllCandidatesForFilters([]);

      setSchedulePoolCandidates([]);
      setSchedulePoolTotal(0);
    }
  };



  const [
    examinationScoreData,
    setExaminationScoreData
  ] = useState([]);


  const [
    showImportCandidatesModal,
    setShowImportCandidatesModal
  ] = useState(false);

  // const user = useSelector((state) => state.user.user);


  // const role = user?.role?.toLowerCase();

  // const isRecruiter = role === "recruiter";




  useEffect(() => {
    if (role === "committee_member") {
      setActiveTab("COMPENSATION_POOL");
    }
  }, [role, selectedRequisitionId]);


  const isCommitteeMember = role === "committee_member";



  const INTERVIEW_STATUS_LABEL_MAP = {
    SCHEDULED: "Scheduled",
    QUALIFIED: "Qualified",
    DISQUALIFIED: "Disqualified",
    PROVISIONALLY_APPROVED: "Provisionally Approved",
    PENDING: "Pending",
    ZONAL_REJECTED: "Zonal Rejected",
    ZONAL_ABSENT: "Zonal Absent",
    INTERVIEW_ABSENT: "Interview Absent",
    RESCHEDULED: "Rescheduled",
  };
  const SCHEDULE_POOL_STATUS_LABEL_MAP = {
    L1_PENDING: "L1 Pending",
    L2_PENDING: "L2 Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PENDING: "Pending"
  };
  const OFFER_POOL_STATUSES = [
    "OFFER_AWAITED",
    "OFFER_SENT",
    "OFFER_REJECTED",
    "OFFER_ACCEPTED",
  ];
  const SCHEDULE_POOL_STATUSES = [
    "L1_PENDING",
    "PENDING",
    "REJECTED"
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
  const navigate = useNavigate();


  const navActiveTab = location.state?.activeTab;


  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState([]);

  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [submittingApproval, setSubmittingApproval] = useState(false);


  const [activeTab, setActiveTab] = useState(() => {
    if (role === "committee_member") return "COMPENSATION_POOL";
    return navActiveTab || "CANDIDATE_POOL";
  });


  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [selectedInterviewCandidateIds, setSelectedInterviewCandidateIds] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [requisitions, setRequisitions] = useState([]);
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);

  // const [positions, setPositions] = useState([]);
  // const [selectedPositionId, setSelectedPositionId] = useState("");
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [candidates, setCandidates] = useState([]);

  const [schedulePoolCandidates, setSchedulePoolCandidates] = useState([]);
  const [loadingSchedulePool, setLoadingSchedulePool] = useState(false);
  const [schedulePoolTotal, setSchedulePoolTotal] = useState(0);

  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [page, setPage] = useState(0);
  const [
    schedulePoolPage,
    setSchedulePoolPage
  ] = useState(0);

  const [
    schedulePoolPageSize,
    setSchedulePoolPageSize
  ] = useState(10);
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
  const [showZonalCommentModal, setShowZonalCommentModal] = useState(false);
  const [zonalComment, setZonalComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");



  const handleOpenZonalComments = (comment) => {
    setZonalComment(comment || "-");
    setShowZonalCommentModal(true);
  };

  //  const handleScheduleInterview = () => {
  //   if (!selectedCandidateIds.length) return;

  useEffect(() => {

    if (
      !location.state
        ?.openExaminationScore
    ) {
      return;
    }

    /* WAIT UNTIL REQUISITION
       & POSITION RESTORE */

    if (
      !selectedRequisitionId ||
      !selectedPositionId.length
    ) {
      return;
    }

    /* SMALL DELAY FOR UI */

    setTimeout(() => {

      handleOpenExaminationScore();

      navigate(
        location.pathname,
        {
          replace: true,
          state: {}
        }
      );

    }, 300);

  }, [
    location.state?.openExaminationScore,
    selectedRequisitionId,
    selectedPositionId
  ]);






  useEffect(() => {

    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

  }, [location.state?.activeTab]);

  // useEffect(() => {

  //   if (
  //     !location.state?.refreshSchedulePool
  //   ) {
  //     return;
  //   }

  //   if (
  //     activeTab !== "SCHEDULE_POOL"
  //   ) {
  //     return;
  //   }

  //   if (
  //     !selectedPositionId?.length
  //   ) {
  //     return;
  //   }

  //   fetchSchedulePoolCandidates();

  // }, [
  //   location.state?.refreshSchedulePool,
  //   activeTab,
  //   selectedPositionId?.join(",")
  // ]);

  const handleSubmitForApproval = async () => {

    try {

      setSubmittingApproval(true);

      const payload = {
        positionIds: selectedPositionId
      };



      const res =
        await candidateWorkflowServices
          .submitForApproval(
            selectedPositionId
          );



      //  HANDLE BACKEND VALIDATION
      if (!res?.success) {

        setErrorMessage(
          res?.message ||
          "Validation failed"
        );
        console.log("message", res.data[0].message)
        //  store backend data
        setErrorCandidates(
          Array.isArray(res?.data)
            ? res.data
            : []
        );

        setShowApprovalModal(false);

        setShowErrorModal(true);

        return;
      }

      toast.success(
        "Submitted for approval successfully"
      );

      setShowApprovalModal(false);

      fetchSchedulePoolCandidates();

      // CLEAR SCHEDULE POOL FILTER
      setFilters(prev => ({
        ...prev,
        status: []
      }));

      // MOVE TO INTERVIEW POOL
      // setActiveTab("INTERVIEW_POOL");

      // RESET PAGE
      //setInterviewPage(0);
      setSchedulePoolPage(0);

      // REFRESH
      setTimeout(async () => {
        await refetchInterviewPool();
      }, 0);

    } catch (err) {

      console.error(
        "SUBMIT APPROVAL ERROR",
        err
      );

      // ✅ HANDLE 400
      if (err?.response?.data) {

        setErrorMessage(

          err.response.data.message ||

          "Validation failed"

        );

        setErrorCandidates(

          Array.isArray(
            err.response.data.data
          )
            ? err.response.data.data
            : []

        );

        setShowErrorModal(true);

        return;

      }

      toast.error(
        "Failed to submit for approval"
      );

    } finally {

      setSubmittingApproval(false);

    }

  };
  const handleScheduleInterview = () => {



    if (!selectedCandidateIds.length) {
      toast.error("Please select candidates");
      return;
    }

    const selectedCandidatesData = allCandidatesForFilters
      .filter(c => selectedCandidateIds.includes(c.id))
      .map(c => ({
        id: c.id,
        name: c.name,
        regNo: c.applicationNo,
        positionId: c.positionId,
        interviewCenterId: c.interviewCenterId,
        interviewCenterName: c.interviewCenterName
      }));

    // const params = new URLSearchParams({
    //   requisitionId: selectedRequisitionId || "",
    //   positionId: selectedPositionId || "",
    //   candidates: JSON.stringify(selectedCandidatesData)
    // });


    // navigate("/schedule-interviews", {
    //   state: {
    //     candidates: selectedCandidatesData,
    //     requisitionId: selectedRequisitionId,
    //     positionId: selectedPositionId
    //   }
    // });





    navigate("/schedule-interviews", {
      state: {
        candidates: selectedCandidatesData,

        requisitionId: selectedRequisitionId,

        //  multiple positions
        positionId: selectedPositionId,

        requisition: normalizedRequisition,
        position: selectedPosition,

        page,
        pageSize,
        filters,

        activeTab: "CANDIDATE_POOL",
        sourceTab: "CANDIDATE_POOL",
      }
    });
  };

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
    enabled: selectedPositionId.length > 0
  });


  const {
    data: compensationCandidates,
    totalElements: compensationTotal,
    loading: loadingCompensation,
    refetch: refetchCompensation
  } = useCompensationPool({
    positionId: selectedPositionId[0],
    filters,
    page: interviewPage,
    pageSize: interviewPageSize,
    enabled:
      activeTab === "COMPENSATION_POOL" &&
      selectedPositionId.length > 0 &&
      (isCommitteeMember || selectedPositionId.length > 0), refreshKey: compRefreshKey
  });

  const TAB_PRIVILEGE_MAP = {
    CANDIDATE_POOL: "Candidate Pool",
    INTERVIEW_POOL: "Interview Pool",
    SCHEDULE_POOL: "Schedule Pool",
    COMPENSATION_POOL: "Compensation Pool",
    OFFER_POOL: "Offer Pool",
    // ONBOARDING_POOL: "Compensation Pool", // assuming onboarding is compensation
  };
  // const tabs = [
  //   { key: "CANDIDATE_POOL", label: "Candidate Pool", count: totalElements },
  //   { key: "INTERVIEW_POOL", label: "Interview Pool", count: interviewTotalElements },
  //   { key: "OFFER_POOL", label: "Offer Pool", count: 0 },
  //   { key: "ONBOARDING_POOL", label: "Onboarding Pool", count: 0 },
  // ];

  const tabs = [
    { key: "CANDIDATE_POOL", label: t("candidateWorkflow:candidate_pool"), count: totalElements },
    {
      key: "SCHEDULE_POOL",
      label: t("candidateWorkflow:schedule_pool"),
      count: 0
    },
    { key: "INTERVIEW_POOL", label: t("candidateWorkflow:interview_pool"), count: interviewTotalElements },

    { key: "COMPENSATION_POOL", label: "Compensation Pool", count: compensationTotal },
    { key: "OFFER_POOL", label: t("candidateWorkflow:offer_pool"), count: 0 },
    { key: "ONBOARDING_POOL", label: t("candidateWorkflow:onboarding_pool"), count: 0 },
  ];
  const privileges = useSelector(
    (state) => state.user.privileges || {}
  );

  const hasPrivilege = (key) => {
    return privileges?.[key] === true;
  };


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
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);

  const isRankEnabled = useSelector(
    (state) => state.rank.isRankEnabled
  );
  const isScoreEnabled = useSelector(
    (state) => state.rank.isScoreEnabled
  );

  const todayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const paginatedSchedulePool =
    useMemo(() => {

      const start =
        schedulePoolPage *
        schedulePoolPageSize;

      const end =
        start +
        schedulePoolPageSize;

      return schedulePoolCandidates.slice(
        start,
        end
      );

    }, [
      schedulePoolCandidates,
      schedulePoolPage,
      schedulePoolPageSize
    ]);
  const hasLocationData = useMemo(() => {
    return positions.some((p) =>
      selectedPositionId.includes(p.jobPositions?.positionId) &&
      (p.jobPositions?.positionStateDistributions?.length || 0) > 0
    );
  }, [positions, selectedPositionId]);

  const navInitRef = useRef({
    requisitionId: null,
    positionIds: [],
    initialized: false,
  });

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setShowPreview(false);
    setPreviewUrl("");
  };

  const isBackNavigation = location.state?.page !== undefined || location.state?.interviewPage !== undefined;

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



  useEffect(() => {
    if (!selectedPositionId.length) {
      setSelectedCompensationIds([]);
    }
  }, [selectedPositionId]);



  useEffect(() => {
    if (selectedPositionId.length) {
      fetchPanels(selectedPositionId);
    }
  }, [selectedPositionId]);

  const employmentTypeMap = React.useMemo(() => {
    const map = {};
    (masterData?.employementTypes || []).forEach((e) => {
      map[e.employementTypeId] = e.typeName; // "Contract" or "Regular"
    });
    return map;
  }, [masterData]);




  useEffect(() => {
    if (selectedPositionId.length === 0) {
      setCandidates([]);
      setTotalElements(0);

      setSelectedCandidateIds([]);
      setSelectedInterviewCandidateIds([]);
      setSelectedCompensationIds([]);

      setAllCandidatesForFilters([]);
    }
  }, [selectedPositionId]);




  useEffect(() => {

    setSelectedCandidateIds([]);
    setSelectedInterviewCandidateIds([]);
    setSelectedCompensationIds([]);
    setOfferSelectedIds([]);

  }, [activeTab]);


  const isContractPosition = useMemo(() => {
    if (!positions.length || !selectedPositionId.length || !employmentTypeMap) return false;

    const selectedPositionObj = positions.find(
      (p) => p.jobPositions?.positionId === selectedPositionId[0]
    );

    const employmentType =
      employmentTypeMap[selectedPositionObj?.jobPositions?.employmentType];

    return employmentType === "Contract";
  }, [positions, selectedPositionId, employmentTypeMap]);

  const accessibleTabs = useMemo(() => {


    return tabs.filter((tab) => {

      if (tab.key === "COMPENSATION_POOL") {

        if (role === "committee_member") {
          return true; // ✅ force show
        }

        if (!isContractPosition) {
          return false;
        }
      }

      // if (tab.key === "COMPENSATION_POOL") {
      //   return false;
      // }

      // Enable Schedule Pool if Interview Pool privilege is true
      if (tab.key === "SCHEDULE_POOL" && hasPrivilege("Interview Pool")) {
        return true;
      }

      return hasPrivilege(TAB_PRIVILEGE_MAP[tab.key]);

    });


  }, [tabs, privileges, isContractPosition, role]); //  IMPORTANT




  const [selectedCompensationIds, setSelectedCompensationIds] = useState([]);
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
    if (!selectedPositionId.length || activeTab !== "CANDIDATE_POOL") return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(0);
      fetchCandidates();
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [filters.searchText]); // Remove activeTab from dependencies to prevent page reset on tab change

  useEffect(() => {
    fetchRequisitions("");
  }, []);

  useEffect(() => {

    if (activeTab !== "SCHEDULE_POOL") {
      return;
    }

    if (!selectedPositionId?.length) {
      return;
    }

    fetchSchedulePoolCandidates();

  }, [
    activeTab,
    selectedPositionId?.join(","),
    filters.searchText,
    filters.status
  ]);

  useEffect(() => {

    //  DON'T RESET DURING NAVIGATION RESTORE
    if (!selectedRequisitionId) {

      if (isNavModeRef.current) {
        return;
      }

      setPositions([]);
      setSelectedPositionId([]);
      return;
    }

    const fetchPositions = async () => {
      setLoadingPositions(true);

      try {
        const res =
          await jobPositionApiService.getPositionsByReqId({
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

  useEffect(() => {
    masterApiService.getAllTemplates().then((res) => {
      if (res?.success) {
        setTemplates(res.data);
      }
    });
  }, []);

  const formatCandidateData = (apiData) => {
    const formatStatus = (status = "") => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (apiData?.content || []).map((c) => ({
      id: c.candidateApplications.id, // REQUIRED for selection
      name: c.fullName,
      rank: c.rank,

      educationScore:
        c?.candidateRankingResults?.educationScore ?? "-",

      experienceScore:
        c?.candidateRankingResults?.experienceScore ?? "-",

      finalScore:
        c?.candidateRankingResults?.finalScore ?? "-",

      educationSimilarity:
        c?.candidateRankingResults?.educationSimilarity ?? "-",

      experienceSimilarity:
        c?.candidateRankingResults?.experienceSimilarity ?? "-",
      // experience: `${Math.floor((c.totalMonths || 0) / 12)} years`,
      experienceMonths: c.totalMonths || 0,
      status: formatStatus(c.candidateApplications.applicationStatus),
      location: stateMap[c.stateId] || "-",
      stateId: c.stateId,
      categoryId: c.categoryId,
      categoryName: categoryMap[c.categoryId] || "-",
      applicationNo: c.candidateApplications.applicationNo,
      candidateId: c.candidateApplications.candidateId,
      positionId: c.candidateApplications.positionId,

      fileUrl: c.resumeUrl,
      interviewCenterId: c.interviewCenter?.interviewCentreId,  // Add interview centre ID
      interviewCenterName: c.interviewCenter?.interviewCentre,  // Add interview centre name
    }));
  };

  // 🔍 Fetch all candidates WITHOUT location/category filters for dropdown options
  // const fetchAllCandidatesForFilters = async () => {
  //   try {
  //     const normalizedStatus = filters.status.length === 0 ? availableStatuses : filters.status.map((s) => s.toUpperCase());
  //     const res = await jobPositionApiService.getCandidatesByPosition({
  //       searchText: filters.searchText,
  //       page: 0,
  //       size: 1000, // Large size to get all candidates
  //       positionIds: selectedPositionId,
  //       status: normalizedStatus,
  //       stateId: "", // NO location filter
  //       categoryId: "", // NO category filter
  //     });

  //     const apiData = res?.data;
  //     const mappedCandidates = formatCandidateData(apiData);
  //     setAllCandidatesForFilters(mappedCandidates);
  //   } catch (err) {
  //     console.error("Failed to load all candidates for filters", err);
  //   }
  // };


  const [allInterviewCandidatesForFilters, setAllInterviewCandidatesForFilters] = useState([]);

  useEffect(() => {

    if (
      activeTab !== "INTERVIEW_POOL" ||
      !selectedPositionId.length
    ) {
      setAllInterviewCandidatesForFilters([]);
      return;
    }

    // wait until status reset completes
    const timer = setTimeout(() => {
      fetchAllInterviewCandidatesForFilters();
    }, 0);

    return () => clearTimeout(timer);

  }, [
    selectedPositionId,
    filters.status,
    filters.searchText,
    activeTab
  ]);


  const fetchAllInterviewCandidatesForFilters = async () => {
    try {

      const normalizedStatus =
        filters.status.length === 0
          ? availableStatuses
          : filters.status.map((s) => s.toUpperCase());

      // FIRST API
      const firstRes =
        await candidateWorkflowServices.getInterviewCandidates({
          searchText: filters.searchText || "",
          positionIds: selectedPositionId,
          statusList: normalizedStatus,
          page: 0,
          size: pageSize,
        });

      const firstApiData = firstRes?.data;

      const totalElements =
        firstApiData?.page?.totalElements || 0;

      // SECOND API WITH TOTAL
      const finalRes =
        await candidateWorkflowServices.getInterviewCandidates({
          searchText: filters.searchText || "",
          positionIds: selectedPositionId,
          statusList: normalizedStatus,
          page: 0,
          size: totalElements,
        });

      const finalApiData = finalRes?.data;

      const mappedCandidates =
        (finalApiData?.content || []).map((c) => ({
          ...c,
          id: c?.interviewSchedules?.interviewScheduleId
        }));

      setAllInterviewCandidatesForFilters(mappedCandidates);

    } catch (err) {
      console.error(
        "Failed to load all interview candidates",
        err
      );
    }
  };

  // const allInterviewCandidatesForFilters = useMemo(() => {
  //   return interviewCandidates;
  // }, [interviewCandidates]);




  const fetchAllCandidatesForFilters = async () => {
    try {
      const normalizedStatus =
        filters.status.length === 0
          ? availableStatuses
          : filters.status.map((s) => s.toUpperCase());

      //  FIRST API CALL
      const firstRes =
        await jobPositionApiService.getCandidatesByPosition({
          searchText: filters.searchText,
          page: 0,
          size: pageSize, // initial small fetch
          positionIds: selectedPositionId,
          status: normalizedStatus,
          stateId: "",
          categoryId: "",
        });

      const firstApiData = firstRes?.data;

      const totalElements =
        firstApiData?.page?.totalElements || 0;

      //  SECOND API CALL WITH TOTAL ELEMENTS
      const finalRes =
        await jobPositionApiService.getCandidatesByPosition({
          searchText: filters.searchText,
          page: 0,
          size: totalElements,
          positionIds: selectedPositionId,
          status: normalizedStatus,
          stateId: "",
          categoryId: "",
        });

      const finalApiData = finalRes?.data;


      const mappedCandidates =
        formatCandidateData(finalApiData);

      setAllCandidatesForFilters(mappedCandidates);

    } catch (err) {
      console.error(
        "Failed to load all candidates for filters",
        err
      );
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
        positionIds: selectedPositionId,
        status: normalizedStatus,
        stateId: filters.stateId,
        categoryId: filters.categoryId,
        rank: isRankEnabled,
        score: isScoreEnabled,
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
  const fetchSchedulePoolCandidates = async () => {

    if (!selectedPositionId.length) return;

    try {

      setLoadingSchedulePool(true);

      const payload = {

        searchText: filters.searchText || "",

        positionIds: selectedPositionId,

        statusList:
          filters.status.length
            ? filters.status
            : ["L1_PENDING", "REJECTED", "PENDING"],

        page: 0,

        size: 0

      };




      const res = await candidateWorkflowServices.getSchedulePoolCandidates(payload);

      const apiData = res?.data;
      const content = Array.isArray(apiData) ? apiData : apiData?.content || [];


      const mappedRows = content.map((c) => {

        const start =
          c?.interviewScheduleStaging
            ?.interviewStartAt;

        const end =
          c?.interviewScheduleStaging
            ?.interviewEndAt;

        return {
          panelScheduleConfigurations:
            c?.panelScheduleConfigurations || [],
          // IMPORTANT FOR EDIT FLOW
          applicationId:
            c?.application?.id,
          positionId:
            c?.application?.positionId,

          interviewCenterId:
            c?.interviewCentres
              ?.interviewCentreId || "",

          panelId:
            c?.interviewPanels
              ?.interviewPanelId,

          duration:
            c?.interviewScheduleStaging
              ?.interviewDurationMinutes || 15,

          perDay: "1",

          // TABLE DATA
          id:
            c?.application?.id,

          name:
            c?.fullName || "-",

          regNo:
            c?.application
              ?.applicationNo || "-",

          date:
            start?.split("T")[0] || "-",

          rawDate:
            start?.split("T")[0] || "",

          startTime:
            start
              ?.split("T")[1]
              ?.slice(0, 5) || "",

          endTime:
            end
              ?.split("T")[1]
              ?.slice(0, 5) || "",

          time:
            start && end
              ? `${start
                .split("T")[1]
                .slice(0, 5)} - ${end
                  .split("T")[1]
                  .slice(0, 5)}`
              : "-",

          zone:
            c?.interviewCentres?.displayName || "-",
          candidateId:
            c?.application?.candidateId,

          fileUrl:
            c?.resumeUrl,

          panel:
            c?.interviewPanels
              ?.panelName || "-",
          interviewStatus: c?.interviewScheduleStaging.interviewSchedulingApprovalStatus || "-",
          remarks: c?.interviewScheduleStaging.remarks || " -",
          positionId:
            c?.application?.positionId,

        };

      });


      setSchedulePoolCandidates(mappedRows);

      setSchedulePoolTotal(
        mappedRows.length
      );

    } catch (err) {

      console.error(
        "Failed to fetch schedule pool",
        err
      );

    } finally {

      setLoadingSchedulePool(false);

    }

  };
  const handleJoiningDateChange = (value) => {
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
  };
  const handleTemplateChange = (value) => {
    setOfferTemplateId(value);
    setSelectedTemplate(value);
  };


  const [submitBeforeDate, setSubmitBeforeDate] = useState("");
  const mappedCompensationCandidates = mapCompensationCandidates(compensationCandidates);

  const selectedCompensationCandidates = mappedCompensationCandidates.filter(c =>
    selectedCompensationIds.includes(c.id)
  );

  const canSendToOfferFromCompensation =
    selectedCompensationCandidates.length > 0 &&
    selectedCompensationCandidates.every(
      (c) => c.status === "APPROVED"
    );

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
    if (!selectedPositionId.length || activeTab !== "CANDIDATE_POOL") return;

    fetchCandidates();
  }, [
    selectedPositionId,
    page,
    pageSize,
    filters.status,
    filters.stateId,
    filters.categoryId,
    masterData,
    activeTab,

  ]);
  useEffect(() => {
    if (!selectedPositionId.length || activeTab !== "CANDIDATE_POOL") return;

    if (isRankEnabled) {
      fetchCandidates();
    }
  }, [isRankEnabled]);

  // 🔍 Fetch all candidates for filter dropdowns when position/status changes
  useEffect(() => {
    if (!selectedPositionId || activeTab !== "CANDIDATE_POOL") {
      setAllCandidatesForFilters([]);
      return;
    }

    fetchAllCandidatesForFilters();
  }, [selectedPositionId, filters.status, filters.searchText, masterData, activeTab, isRankEnabled]);

  const handleRequisitionChange = async (e) => {
    const reqId = e.target.value;
    dispatch(clearRankState());
    isNavModeRef.current = false;

    setSelectedRequisitionId(reqId);
    setSelectedPositionId([]);
    //  CORRECT LOGIC
    if (role === "committee_member") {
      setActiveTab("COMPENSATION_POOL");
    }
    setCandidates([]);
    setSelectedCandidateIds([]);
    setSelectedInterviewCandidateIds([]);
    setSelectedCompensationIds([]);
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
  // const handlePositionChange = (id) => {
  //   dispatch(clearRankState()); // RESET HERE
  //   setSelectedPositionId(id);
  // };

  // const handlePositionChange = (ids) => {
  //   dispatch(clearRankState());

  //   setSelectedPositionId(ids);

  //   // CLEAR EVERYTHING WHEN NO POSITION SELECTED
  //   if (!ids || ids.length === 0) {
  //     setCandidates([]);
  //     setTotalElements(0);

  //     setSelectedCandidateIds([]);
  //     setSelectedInterviewCandidateIds([]);
  //     setSelectedCompensationIds([]);

  //     setAllCandidatesForFilters([]);

  //     setPage(0);
  //   }
  // };

  const handlePositionChange = (ids) => {
    dispatch(clearRankState());

    setSelectedPositionId(ids);

    // CLEAR EVERYTHING WHEN NO POSITION SELECTED
    if (!ids || ids.length === 0) {

      setCandidates([]);
      setTotalElements(0);

      setSelectedCandidateIds([]);
      setSelectedInterviewCandidateIds([]);
      setSelectedCompensationIds([]);

      setAllCandidatesForFilters([]);

      // ADD THESE
      setSchedulePoolCandidates([]);
      setSchedulePoolTotal(0);

      setPage(0);
      setSchedulePoolPage(0);
    }
  };


  useEffect(() => {

    if (
      activeTab === "SCHEDULE_POOL" &&
      selectedPositionId.length === 0
    ) {

      setSchedulePoolCandidates([]);
      setSchedulePoolTotal(0);
    }

  }, [selectedPositionId, activeTab]);

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

  const canScheduleMultiPositionInterview =
    canScheduleInterview &&
    selectedPositionId?.length > 0;

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

  const selectedPositionObj = positions.find(
    (p) => p.jobPositions?.positionId === selectedPositionId[0]
  );

  const selectedPosition = positions
    .filter(p => selectedPositionId.includes(p.jobPositions?.positionId))
    .map(p => ({
      positionId: p.jobPositions?.positionId,
      positionName: p?.masterPositions?.positionName
    }));

  const navPositionIds = location.state?.positionIds || [];


  // const availableStatuses = CANDIDATE_POOL_STATUSES;
  const availableStatuses = React.useMemo(() => {
    if (activeTab === "INTERVIEW_POOL") {
      return Object.keys(INTERVIEW_STATUS_LABEL_MAP);
    }
    if (activeTab === "SCHEDULE_POOL") {
      return SCHEDULE_POOL_STATUSES;
    }

    if (activeTab === "COMPENSATION_POOL") {
      return COMPENSATION_POOL_STATUSES; //  ADD THIS
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
    if (activeTab === "SCHEDULE_POOL") {
      return SCHEDULE_POOL_STATUS_LABEL_MAP[status] || status;
    }
    if (activeTab === "COMPENSATION_POOL") {
      return COMPENSATION_STATUS_LABEL_MAP[status] || status; //  ADD THIS
    }

    return STATUS_LABEL_MAP[status] || status;
  };

  const selectedInterviewCandidates = useMemo(() => {
    return allInterviewCandidatesForFilters.filter((c) =>
      selectedInterviewCandidateIds.includes(String(c.id))
    );
  }, [
    allInterviewCandidatesForFilters,
    selectedInterviewCandidateIds
  ]);


  const canSendToOfferPool =
    selectedInterviewCandidates.length > 0 &&
    selectedInterviewCandidates.every(
      (c) =>
        c?.interviewSchedules?.interviewStatus === "QUALIFIED"
    );
  const handleReschedule = () => {



    const mappedRows = selectedInterviewCandidates.map((c) => ({

      // REQUIRED FOR SAVE
      applicationId:
        c?.application?.id || "",

      interviewCenterId:
        c?.center?.interviewCentreId || "",
      positionId: c?.application?.positionId || "",

      panelId:
        c?.panel?.interviewPanelId || "",

      duration:
        c?.interviewSchedules?.interviewDurationMinutes || 15,

      perDay: "1",

      // TABLE DATA
      id:
        c?.interviewSchedules?.interviewScheduleId || "",

      name:
        c?.fullName || "-",

      regNo:
        c?.application?.applicationNo || "-",

      // DATE
      date:
        c?.interviewSchedules?.interviewStartAt
          ?.split("T")[0] || "",

      rawDate:
        c?.interviewSchedules?.interviewStartAt
          ?.split("T")[0] || "",

      // TIME
      startTime:
        c?.interviewSchedules?.interviewStartAt
          ?.split("T")[1]
          ?.slice(0, 5) || "",

      endTime:
        c?.interviewSchedules?.interviewEndAt
          ?.split("T")[1]
          ?.slice(0, 5) || "",

      time:
        c?.interviewSchedules?.interviewStartAt &&
          c?.interviewSchedules?.interviewEndAt
          ? `${c.interviewSchedules.interviewStartAt
            .split("T")[1]
            .slice(0, 5)} - ${c.interviewSchedules.interviewEndAt
              .split("T")[1]
              .slice(0, 5)}`
          : "-",

      // CENTER
      zone:
        c?.center?.displayName || "-",

      // PANEL
      panel:
        c?.panel?.panelName || "-"

    }));


    // BUILD PANEL STRUCTURE
    const groupedPanels = Object.values(

      mappedRows.reduce((acc, item, index) => {

        if (!acc[item.panel]) {

          acc[item.panel] = {

            id:
              item.panelId || index + 1,

            name:
              item.panel,

            slots: []

          };

        }

        acc[item.panel].slots.push({

          date:
            item.rawDate || "",

          startTime:
            item.startTime || "",

          endTime:
            item.endTime || "",

          duration:
            item.duration || 15,

          perDay:
            item.perDay || "1"

        });

        return acc;

      }, {})

    );



    navigate("/schedule-interviews", {

      state: {

        isEditMode: true,
        isReschedule: true,

        requisitionId:
          selectedRequisitionId,

        positionId:
          selectedPositionId,

        // TABLE DATA
        schedulePoolData:
          mappedRows,

        // PANEL DATA
        selectedPanels:
          groupedPanels,

        requisition:
          normalizedRequisition,

        position:
          selectedPosition,

        activeTab: "INTERVIEW_POOL",
        sourceTab: "INTERVIEW_POOL"

      }

    });

  };
  const canReschedule =
    selectedInterviewCandidates.length > 0 &&
    selectedInterviewCandidates.every(
      (c) =>
        c?.interviewSchedules?.interviewStatus === "SCHEDULED" || c?.interviewSchedules?.interviewStatus === "RESCHEDULED"
    );
  const qualifiedInterviewIds = selectedInterviewCandidates
    .filter(
      (c) =>
        c?.interviewSchedules?.interviewStatus === "QUALIFIED"
    )
    .map((c) => String(c.id));

  useEffect(() => {
    if (isBackNavigation) return; //  ADD THIS LINE  
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
    if (isBackNavigation) return;

    if (!navPositionIds?.length) {
      setFilters({
        status: [],
        stateId: "",
        categoryId: "",
        searchText: "",
      });
    }
  }, [selectedPositionId]);

  useEffect(() => {
    if (isBackNavigation) return;

    // setFilters((prev) => ({
    //   ...prev,
    //   status: [],
    // }));
  }, [activeTab]);

  useEffect(() => {
    if (!location.state) return;

    //  Candidate Pool
    if (location.state.page !== undefined) {
      setPage(location.state.page);
    }

    if (location.state.pageSize !== undefined) {
      setPageSize(location.state.pageSize);
    }

    // 🔥 INTERVIEW POOL FIX (ADD THIS)
    if (location.state.interviewPage !== undefined) {
      setInterviewPage(location.state.interviewPage);
    }

    if (location.state.interviewPageSize !== undefined) {
      setInterviewPageSize(location.state.interviewPageSize);
    }

    if (location.state.filters) {
      setFilters(location.state.filters);
    }

  }, []);

  const navRequisitionId = location.state?.requisitionId || null;

  const selectedTemplateData = templates.find(
    (t) => t.templateId === offerTemplateId
  );

  const templateName = selectedTemplateData?.templateName || "";


  useEffect(() => {
    const navReqId = location.state?.requisitionId;
    const navPosIds = location.state?.positionIds || [];

    if (!navReqId) return;

    isNavModeRef.current = true;

    navInitRef.current = {
      requisitionId: navReqId,
      positionIds: Array.isArray(navPosIds)
        ? navPosIds
        : [navPosIds],
      initialized: true,
    };

    //  IMPORTANT
    setSelectedRequisitionId(navReqId);

  }, [location.state]);

  // useEffect(() => {
  //   if (
  //     isNavModeRef.current &&
  //     navInitRef.current.requisitionId &&
  //     requisitions.length > 0
  //   ) {
  //     setSelectedRequisitionId(navInitRef.current.requisitionId);
  //   }
  // }, [requisitions]);

  useEffect(() => {
    if (
      !isNavModeRef.current ||
      !navInitRef.current.positionIds?.length ||
      !positions?.length
    ) {
      return;
    }

    const rawIds = navInitRef.current.positionIds;

    const incomingIds = Array.isArray(rawIds)
      ? rawIds
      : [rawIds];

    // normalize ids
    const normalizedIncoming = incomingIds.map(String);

    const validIds = positions
      .filter((p) =>
        normalizedIncoming.includes(
          String(p.jobPositions?.positionId)
        )
      )
      .map((p) => p.jobPositions?.positionId);



    if (validIds.length > 0) {
      setSelectedPositionId(validIds);
    }

    isNavModeRef.current = false;
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
      positionIds: selectedPositionId,
      screenName:
        activeTab === "INTERVIEW_POOL"
          ? "InterviewPool"
          : activeTab === "COMPENSATION_POOL"
            ? "CompensationPool"
            : "CandidatePool",
      categoryId: filters.categoryId || null,
      rank: isRankEnabled,
      score: isScoreEnabled,
    };

    //  Candidate Pool
    if (activeTab === "CANDIDATE_POOL") {
      return {
        ...basePayload,
        candidateApplicationStatuses: normalizedStatuses,
      };
    }

    //  Interview Pool
    if (activeTab === "INTERVIEW_POOL") {
      return {
        ...basePayload,
        interviewSchedulingStatuses: normalizedStatuses,
      };
    }

    //   Compensation Pool (NEW)
    if (activeTab === "COMPENSATION_POOL") {
      return {
        ...basePayload,
        candidateApplicationStatuses: CANDIDATE_POOL_STATUSES, // fixed list
        compensationStatuses: normalizedStatuses, // selected filter
      };
    }
    if (activeTab === "SCHEDULE_POOL") {
      return {
        ...basePayload,
        screenName: "SchedulePool",
        //  interviewSchedulingApprovalStatuses: ["L1_PENDING", "PENDING", "REJECTED"],
        interviewSchedulingApprovalStatuses: normalizedStatuses,

      };
    }

    return basePayload;
  };





  const handleDownload = async (type) => {
    if (!selectedPositionId.length) {
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


  const handleSendToCompensation = async () => {



    if (!submitBeforeDate) {
      toast.error("Please select Submit Before date");
      return;
    }

    const today = todayString();

    if (submitBeforeDate <= today) {
      toast.error("Past dates are not allowed");
      return;
    }


    if (selectedInterviewCandidates.length === 0) {
      toast.error("Select at least one candidate");
      return;
    }




    const allQualified = selectedInterviewCandidates.every(
      (c) =>
        c?.interviewSchedules?.interviewStatus === "QUALIFIED"
    );

    if (!allQualified) {
      toast.error("Only QUALIFIED candidates allowed");
      return;
    }

    try {
      const payload = {
        interviewSchedules: selectedInterviewCandidates.map((c) => ({
          applicationId: c?.application?.id,
          candidateId: c?.application?.candidateId,


          panelId:
            c?.interviewSchedules?.panelId ?? null,

          interviewStartAt:
            c?.interviewSchedules?.interviewStartAt ?? null,

          interviewEndAt:
            c?.interviewSchedules?.interviewEndAt ?? null,

          interviewDurationMinutes:
            c?.interviewSchedules?.interviewDurationMinutes ?? 0,

          meetingLink:
            c?.interviewSchedules?.meetingLink ?? "",

          zonalOfficeId:
            c?.interviewSchedules?.zonalOfficeId ?? null,

          finalScore:
            c?.interviewSchedules?.finalScore ?? 0,

          interviewStatus:
            c?.interviewSchedules?.interviewStatus,

          zonalVerificationStatus:
            c?.interviewSchedules?.zonalVerificationStatus ?? "",

          zonalSubmitBeforeDate:
            c?.interviewSchedules?.zonalSubmitBeforeDate ?? null,

          zonalHrComments:
            c?.interviewSchedules?.zonalHrComments ?? "",

          interviewScheduleId: c.id,
        })),
        submitBeforeDate: submitBeforeDate,
      };


      await candidateWorkflowServices.sendToCompensationPool(payload);

      toast.success("Sent to Compensation Pool");

      setSelectedInterviewCandidateIds([]);
      setInterviewPage(0);
      await refetchInterviewPool();

    } catch (err) {
      console.error(err);
      toast.error("Failed to send to Compensation Pool");
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
    try {
      let payloadIds = [];

      //  INTERVIEW POOL (NO CHANGE)
      if (activeTab === "INTERVIEW_POOL") {
        if (qualifiedInterviewIds.length === 0) {
          toast.error(t("candidateWorkflow:select_qualified_candidate"));
          return;
        }

        payloadIds = qualifiedInterviewIds;
      }

      //  COMPENSATION POOL (NEW LOGIC)
      if (activeTab === "COMPENSATION_POOL") {
        const approvedCandidates = selectedCompensationCandidates.filter(
          (c) => c.status === "APPROVED"
        );

        if (approvedCandidates.length === 0) {
          toast.error("Select APPROVED candidates");
          return;
        }

        payloadIds = approvedCandidates.map(
          (c) => c.interviewScheduleId
        );
      }

      //  FINAL API CALL
      await jobPositionApiService.sendToOfferPool(payloadIds);

      toast.success(t("candidateWorkflow:candidates_moved_to_offer_pool"));

      //  Clear selections
      setSelectedInterviewCandidateIds([]);
      setSelectedCompensationIds([]);

      //  Refresh
      setInterviewPage(0);
      await refetchInterviewPool();
      await refetchCompensation();

    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        t("candidateWorkflow:failed_to_send_offer_pool")
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

  const handleOpenExaminationScore =
    () => {

      // VALIDATION
      if (
        !selectedRequisitionId ||
        !selectedPositionId?.length
      ) {

        toast.error(
          "Please select requisition and position"
        );

        return;
      }

      // BUILD GRID DATA
      const mappedData =
        positions
          .filter((p) =>
            selectedPositionId.includes(
              p?.jobPositions?.positionId
            )
          )
          .map((p, index) => ({

            id:
              p?.jobPositions?.positionId,

            positionName:
              p?.masterPositions
                ?.positionName || "-",

            startDate:
              normalizedRequisition
                ?.registration_start_date,

            endDate:
              normalizedRequisition
                ?.registration_end_date,

            expanded:
              index === 0
          }));

      setExaminationScoreData(
        mappedData
      );

      setShowExaminationModal(true);

    };


  const handleEditExaminationScore =
    () => {

      setShowExaminationModal(false);

      navigate(
        "/ExaminationCutoffConfiguration",
        {
          state: {

            requisitionId:
              selectedRequisitionId,

            positionIds:
              selectedPositionId,

            openEditModal: true,

            fromCandidateScreening: true
          }
        }
      );

    };

  const handlePreview = async () => {
    try {
      const res = await masterApiService.previewTemplate(offerTemplateId);

      // Convert blob to URL
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Option 2 (better): show in modal
      setPreviewUrl(fileURL);
      setShowPreview(true);
    } catch (err) {
      console.error("Preview failed", err);
    }
  };

  const handleSubmitBeforeDateChange = (value) => {

    const today = todayString();

    // EMPTY
    if (!value) {
      setSubmitBeforeDate("");
      return;
    }

    // BLOCK TODAY + PAST
    if (value <= today) {

      toast.error("Today and past dates are not allowed");

      setSubmitBeforeDate("");

      return;
    }

    // VALID
    setSubmitBeforeDate(value);
  };
  const handleAcceptBeforeDateChange = (value) => {
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
  };


  const [showExaminationModal, setShowExaminationModal] = useState(false);
  const [selectedRelaxation, setSelectedRelaxation] = useState("SET_II");
  const handleStatusChange = (value) => {
    setPage(0);
    setFilters(prev => ({
      ...prev,
      status: value ? [value] : [],
    }));
  };
  const handleOfferStatusToggle = (status) => {
    setFilters(prev => {
      const alreadySelected = prev.status.includes(status);

      return {
        ...prev,
        status: alreadySelected
          ? prev.status.filter(s => s !== status)
          : [...prev.status, status],
      };
    });
  };
  const groupedPanels = Object.values(

    schedulePoolCandidates.reduce((acc, item) => {

      const config =
        item.panelScheduleConfigurations?.[0];

      if (!config) return acc;

      if (!acc[item.panelId]) {

        acc[item.panelId] = {

          id:
            item.panelId,

          name:
            item.panel,
          startDate:
            item.rawDate,

          endDate:
            item.rawDate,

          slots: []

        };

      }

      const slot = {

        date:
          config?.startDatetime
            ?.split("T")[0] || "",

        startTime:
          config?.startDatetime
            ?.split("T")[1]
            ?.slice(0, 5) || "",

        endTime:
          config?.endDatetime
            ?.split("T")[1]
            ?.slice(0, 5) || "",

        duration:
          config?.durationMinutes || 15,

        perDay:
          String(
            config?.interviewsPerDay || 1
          )

      };

      // prevent duplicate slots
      const exists =
        acc[item.panelId].slots.some(
          s =>
            s.date === slot.date &&
            s.startTime === slot.startTime &&
            s.endTime === slot.endTime
        );

      if (!exists) {
        acc[item.panelId].slots.push(slot);
      }

      return acc;

    }, {})

  );
  const handleEditSchedule = () => {

    navigate("/schedule-interviews", {
      state: {

        isEditMode: true,
        isReschedule: false,

        requisitionId: selectedRequisitionId,

        positionId: selectedPositionId,

        //  FULL SCHEDULE DATA
        schedulePoolData: schedulePoolCandidates,

        requisition: normalizedRequisition,

        position: selectedPosition,

        activeTab: "SCHEDULE_POOL",
        selectedPanels: groupedPanels
      }
    });

  };

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
            {/* <DropdownStripMultipleposition
              requisitions={requisitions}
              positions={positions}
              selectedRequisitionId={selectedRequisitionId}
              selectedPositionId={selectedPositionId}
              loadingRequisitions={loadingRequisitions}
              loadingPositions={loadingPositions}
              onRequisitionChange={handleRequisitionChange}
              onPositionChange={handlePositionChange}
              onRequisitionSearch={handleRequisitionSearch}
            /> */}
            {activeTab === "CANDIDATE_POOL" || activeTab === "INTERVIEW_POOL" || activeTab === "SCHEDULE_POOL" ? (
              <DropdownStripMultipleposition
                requisitions={requisitions}
                positions={positions}
                selectedRequisitionId={selectedRequisitionId}
                selectedPositionId={selectedPositionId}
                loadingRequisitions={loadingRequisitions}
                loadingPositions={loadingPositions}
                onRequisitionChange={handleRequisitionChange}
                onPositionChange={handlePositionChange}
                onRequisitionSearch={handleRequisitionSearch}
              />
            ) : (
              <DropdownStrip
                requisitions={requisitions}
                positions={positions}
                selectedRequisitionId={selectedRequisitionId}
                selectedPositionId={selectedPositionId[0] || ""}
                loadingRequisitions={loadingRequisitions}
                loadingPositions={loadingPositions}
                onRequisitionChange={handleRequisitionChange}

                onPositionChange={(id) =>
                  handlePositionChange(id ? [id] : [])
                }

                onRequisitionSearch={handleRequisitionSearch}
              />
            )}

            <div className="col-md-6 col-12">

              <div className="d-flex justify-content-md-end align-items-end gap-2 h-100">

                {/* IMPORT BUTTON */}

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() =>
                    setShowImportCandidatesModal(true)
                  }
                  className="d-flex align-items-center gap-2 bulk-import-btn"
                  style={{
                    height: "38px"
                  }}
                >

                  <FiUpload />

                  {t(
                    "candidateWorkflow:import_candidates"
                  )}

                </Button>

                {/* EXAMINATION SCORE */}

                <button
                  className="btn blue-color blue-border fs-14"
                  onClick={
                    handleOpenExaminationScore
                  }
                  style={{
                    height: "38px"
                  }}
                >
                  Examination Score
                </button>

              </div>

            </div>
          </div>

          {/* <div className="mt-2 pt-1 pb-3">
{normalizedRequisition && selectedPosition?.length > 0 && (          
     <RequisitionStripformultiplepositions
  requisition={normalizedRequisition}
  position={selectedPosition}
  isCardBg={false}
  isSaveEnabled={false}
  isSaveBtn={false}
  saveButton={false}
  onRemovePosition={(positionId) => {
    setSelectedPositionId((prev) =>
      prev.filter((id) => id !== positionId)
    );
  }}
/>
            )}
          </div> */}







          {activeTab === "CANDIDATE_POOL" || activeTab === "INTERVIEW_POOL" || activeTab === "SCHEDULE_POOL" ? (

            <div className="mt-2 pt-1 pb-3">
              {normalizedRequisition && selectedPosition?.length > 0 && (
                <RequisitionStripformultiplepositions
                  requisition={normalizedRequisition}
                  position={selectedPosition}
                  isCardBg={false}
                  isSaveEnabled={false}
                  isSaveBtn={false}
                  saveButton={false}
                  onRemovePosition={handleRemovePosition}
                // onRemovePosition={(positionId) => {
                //   setSelectedPositionId((prev) =>
                //     prev.filter((id) => id !== positionId)
                //   );
                // }}
                />
              )}
            </div>

          ) : (

            <div className="mt-2 pt-1 pb-3">
              {normalizedRequisition && selectedPosition?.length > 0 && (
                <RequisitionStrip
                  requisition={normalizedRequisition}
                  position={selectedPosition[0]}
                  isCardBg={false}
                  isSaveEnabled={false}
                  isSaveBtn={false}
                  saveButton={false}
                />
              )}
            </div>

          )}

        </div>
      </div>

      {/* Desktop Table */}
      <div className="card rounded border-0 d-none d-md-block mt-4 mb-5">
        <div className="card-header bg-white border-bottom-0 p-0 px-1 candidate-screening-tabs-header">
          {/* Tabs */}
          <ul className="nav nav-tabs border-0 pt-2 pb-3 px-2 border-bottom tabs">
            {accessibleTabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link fs-14 ${activeTab === tab.key ? "orange-color orange-bottom-border" : "text-muted"
                    }`}
                  onClick={() => {

                    if (role === "committee_member") return;

                    const multiTabs = [
                      "CANDIDATE_POOL",
                      "INTERVIEW_POOL",
                      "SCHEDULE_POOL"
                    ];

                    const goingToSingleSelect =
                      !multiTabs.includes(tab.key);

                    // Clear ONLY when multiple positions exist
                    if (
                      goingToSingleSelect &&
                      selectedPositionId.length > 1
                    ) {

                      setSelectedRequisitionId("");
                      setSelectedPositionId([]);
                      setPositions([]);

                      setCandidates([]);
                      setTotalElements(0);

                      setSelectedCandidateIds([]);
                      setSelectedInterviewCandidateIds([]);
                      setSelectedCompensationIds([]);

                      setAllCandidatesForFilters([]);
                      setPage(0);                // Candidate Pool page reset
                      setInterviewPage(0);       // Interview Pool page reset
                      setSchedulePoolPage(0);    // Schedule Pool page reset
                    }

                    setFilters(prev => ({
                      ...prev,
                      status: [],          // clear old tab status
                      searchText: "",      // optional if you also want search reset
                    }));

                    setActiveTab(tab.key);
                  }}
                  type="button"
                >
                  {tab.key === "CANDIDATE_POOL" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                      />
                    </svg>
                  )}
                  {tab.key === "INTERVIEW_POOL" && (
                    <svg class="w-[21px] h-[21px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>

                  )}

                  {tab.key === "SCHEDULE_POOL" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 3a1 1 0 0 1 1 1v1h10V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm13 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z"
                      />
                    </svg>
                  )}
                  {tab.key === "OFFER_POOL" && (
                    <svg class="w-[21px] h-[21px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                    </svg>

                  )}
                  {tab.key === "ONBOARDING_POOL" && (
                    <svg class="w-[21px] h-[21px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2c-1.10457 0-2 .89543-2 2v4c0 .55228.44772 1 1 1s1-.44772 1-1V4h12v7h-2c-.5523 0-1 .4477-1 1v2h-1c-.5523 0-1 .4477-1 1s.4477 1 1 1h5c.5523 0 1-.4477 1-1V3.85714C20 2.98529 19.3667 2 18.268 2H6Z" />
                      <path d="M6 11.5C6 9.567 7.567 8 9.5 8S13 9.567 13 11.5 11.433 15 9.5 15 6 13.433 6 11.5ZM4 20c0-2.2091 1.79086-4 4-4h3c2.2091 0 4 1.7909 4 4 0 1.1046-.8954 2-2 2H6c-1.10457 0-2-.8954-2-2Z" />
                    </svg>

                  )} {tab.label}
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
                  onChange={(e) => handleStatusChange(e.target.value)}
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

              {activeTab === "CANDIDATE_POOL" && hasLocationData && (
                <div className="col-md-2 col-6 mt-0">
                  <select
                    className="form-select fs-14 py-1 mt-0"
                    value={filters?.stateId}
                    onChange={(e) => {
                      setPage(0);
                      setFilters((prev) => ({
                        ...prev,
                        stateId: e.target.value,
                      }))
                    }}
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
                    onChange={(e) => {
                      setPage(0);

                      setFilters((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
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
              {(activeTab === "INTERVIEW_POOL" || activeTab === "COMPENSATION_POOL" || activeTab === "SCHEDULE_POOL") && (
                <div className="col-md-4 d-none d-md-block" />
              )}

              {selectedPositionId.length > 0 && selectedRequisitionId && (
                <div
                  className={`col-12 text-md-end mt-2 mt-md-0 ${activeTab === "CANDIDATE_POOL" && hasLocationData
                    ? "col-md-4"
                    : activeTab === "CANDIDATE_POOL"
                      ? "col-md-6"
                      : "col-md-4"
                    }`}
                >

                  {activeTab === "CANDIDATE_POOL" && (
                    <button
                      className="rank-btn fs-14"
                      onClick={() => {

                        dispatch(setRankEnabled(true)); //  ONLY TRUE


                        setPage(0);
                      }}
                    >
                      <FontAwesomeIcon icon={faListOl} className="rank-icon" /> Rank
                    </button>
                  )}

                  <>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip>
                          {t("candidateWorkflow:download_pdf")}
                        </Tooltip>
                      }
                    >
                      <button
                        className="btn fs-14 me-3 blue-color blue-border"
                        onClick={() => handleDownload("pdf")}
                      >
                        <img src={pdfIcon} width={20} />
                      </button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip>
                          {t("candidateWorkflow:download_excel")}
                        </Tooltip>
                      }
                    >
                      <button
                        className="btn fs-14 blue-color blue-border"
                        onClick={() => handleDownload("xlsx")}
                      >
                        <img src={excelIcon} width={20} />
                      </button>
                    </OverlayTrigger>
                  </>

                </div>
              )}
            </div>
          )}

          {activeTab === "OFFER_POOL" && (
            <div className="row g-2 mt-1 px-3 py-1 align-items-center border-bottom">
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
                      onClick={() => handleOfferStatusToggle(status)}
                      className={`badge px-3 py-2 border-2 rounded fw-normal fs-12 ${isSelected
                        ? "orange-color orange-border"
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
            <div className="row g-2 mt-1 px-3 py-2 align-items-center">

              {/* LEFT SECTION */}
              <div className="col-md-8 col-12">
                <div className="d-flex flex-wrap gap-4 justify-content-between align-items-end">
                  <div className="d-flex gap-3 flex-wrap align-items-end">
                    {/* Offer Template */}

                    <div>
                      {/* Label */}
                      <div className="d-flex align-items-center justify-content-between" style={{ width: "180px" }}>
                        <p className="mb-1 fw-normal fs-13 blue-color">
                          {t("candidateWorkflow:offer_template")}
                        </p>
                      </div>

                      {/* Dynamic Dropdown */}
                      <select
                        title={templateName} //  hover shows full text
                        className="form-select fs-13 py-1 text-truncate"
                        style={{
                          width: "180px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          paddingRight: "30px"

                        }}
                        value={offerTemplateId}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                      >

                        <option value="">
                          {t("candidateWorkflow:select_template")}
                        </option>

                        {templates.map((t) => (
                          <option key={t.templateId} value={t.templateId}>
                            {t.templateName}
                          </option>
                        ))}
                      </select>

                      {/* Preview with Hover */}
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="preview-tooltip">
                            {templateName || "No template selected"}
                          </Tooltip>
                        }
                      >
                        {selectedTemplate ? (
                          <span
                            onClick={handlePreview}
                            className="cursor-pointer text-orange orange-color"
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              fontFamily: "Segoe UI, sans-serif",
                              letterSpacing: "0.5px",
                              textDecoration: "underline",
                            }}
                          >
                            Template Preview
                          </span>
                        ) : (
                          <small className="d-block invisible">placeholder</small>
                        )}
                      </OverlayTrigger>
                    </div>
                    {/* <div>
                      <div className="d-flex align-items-center justify-content-between" style={{ width: "180px" }}>
                        <p className="mb-1 fw-normal fs-13 blue-color">
                          {t("candidateWorkflow:offer_template")}
                        </p>

                      </div>

                      <select
                        className="form-select fs-13 py-1"
                        style={{ width: "180px" }}
                        value={offerTemplateId}
                        onChange={(e) => {
                          setOfferTemplateId(e.target.value);
                          setSelectedTemplate(e.target.value);
                        }}
                      >
                        <option value="">
                          {t("candidateWorkflow:select_template")}
                        </option>
                        <option value="3fa85f64-5717-4562-b3fc-2c963f66afa6">
                          Template 1
                        </option>
                      </select>

                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="preview-tooltip">
                            {offerTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6"
                              ? "Template 1"
                              : ""}
                          </Tooltip>
                        }
                      >
                        {selectedTemplate && offerTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6" ? (
                          <span
                            onClick={() => setShowPreview(true)}
                            className="cursor-pointer text-orange orange-color"
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              fontFamily: "Segoe UI, sans-serif",
                              letterSpacing: "0.5px",
                              textDecoration: "underline",
                            }}
                          >
                            Preview
                          </span>
                        ) : (
                          <small className="d-block invisible">placeholder</small>
                        )}
                      </OverlayTrigger>


                    </div> */}

                    {/* Accept Before Date */}
                    <div>
                      <p className="mb-1 fw-normal fs-13 blue-color">{t("candidateWorkflow:accept_before")}11</p>
                      <input
                        type="date"
                        className="form-control fs-13 py-1"
                        style={{ width: "160px" }}
                        value={acceptBeforeDate}
                        min={todayString()}
                        onChange={(e) => handleAcceptBeforeDateChange(e.target.value)}
                      />
                      <small
                        className={`d-block mt-1 fs-12 ${formErrors.acceptBeforeDate ? "text-danger" : "invisible"
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
                        onChange={(e) => handleJoiningDateChange(e.target.value)}

                      />
                      <small
                        className={`d-block mt-1 fs-12 ${formErrors.joiningDate ? "text-danger" : "invisible"
                          }`}
                      >
                        {formErrors.joiningDate || "placeholder"}
                      </small>
                    </div>

                    {/* <div>
                      <p className="mb-1 fw-normal fs-13 blue-color">
                        {t("candidateWorkflow:preview")}
                      </p>

                      <div
                        className={`form-control fs-13 d-flex align-items-center justify-content-center 
      ${selectedTemplate
                            ? "cursor-pointer orange-bg text-white"
                            : "disabled_button custom-disabled-bg1"
                          }
    `}
                        style={{ width: "80px", height: "32px" }}
                        onClick={() => selectedTemplate && setShowPreview(true)}
                      >
                        <i className="bi bi-eye" style={{ fontSize: "16px" }}></i>
                      </div>

                      <small className="d-block mt-1 fs-12 invisible">
                        {"\u00A0"}
                      </small>
                    </div> */}



                    <div>
                      <button
                        className={`form-select fs-13 px-3 py-1 orange-bg text-white ${isSendOfferEnabled ? "" : "disabled_button"
                          }`}
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
                <div className="d-flex justify-content-end gap-2 align-items-center">
                  <button
                    className={`btn fs-13 px-3 py-1 orange-border orange-color text-orange ${isSendOfferEnabled ? "" : "disabled_button"
                      }`}
                    style={{
                      minHeight: "39px",
                      cursor: isSendOfferEnabled ? "pointer" : "not-allowed"
                    }}
                    disabled={!isSendOfferEnabled}
                  >
                    <img
                      className="me-2 orange-color"
                      src={locationIcon}
                      width={16}
                      style={{ color: "#f36f21 !important" }}
                    />
                    {t("candidateWorkflow:assign_locations")}
                  </button>



                  <button className={`btn blue-border blue-color fs-13 px-3 py-1 ${offerSelectedIds.length !== 0 ? "" : "disabled_button"}`} onClick={() => setShowRankListModal(true)} disabled={offerSelectedIds.length === 0}
                    style={{ minHeight: "39px" }}>
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
              <div className="col-md-7 col-12 px-2 mb-2">

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                  {/* LEFT SIDE COUNT */}
                  <div>

                    {activeTab === "CANDIDATE_POOL" && (
                      <div className="selected-count-chip">

                        {selectedCandidateIds.length}{" "}

                        {selectedCandidateIds.length === 1
                          ? "Candidate"
                          : "Candidates"} Selected
                      </div>
                    )}

                    {activeTab === "INTERVIEW_POOL" && (
                      <div className="selected-count-chip">



                        {selectedInterviewCandidateIds.length}{" "}

                        {selectedInterviewCandidateIds.length === 1
                          ? "Candidate"
                          : "Candidates"} Selected
                      </div>
                    )}

                    {activeTab === "COMPENSATION_POOL" && (
                      <div className="selected-count-chip">

                        {selectedCompensationIds.length}{" "}

                        {selectedCompensationIds.length === 1
                          ? "Candidate"
                          : "Candidates"} Selected
                      </div>
                    )}

                  </div>

                  {/* RIGHT SIDE BUTTONS */}
                  <div className="d-flex gap-2">

                    {activeTab === "CANDIDATE_POOL"
                      && hasPrivilege("Interview Pool")
                      && canScheduleMultiPositionInterview && (
                        <button
                          className="btn blue-bg text-white fs-14"
                          onClick={handleScheduleInterview}
                        >
                          {t("candidateWorkflow:schedule_interview")}
                        </button>
                      )}
                    {activeTab === "INTERVIEW_POOL" && canSendToOfferPool && (
                      isContractPosition ? (
                        <div className="d-flex align-items-center justify-content-end gap-4">
                          {/*  Submit Before Date */}
                          <div className="d-flex align-items-center gap-2">
                            <span className="fs-14">
                              Submit Before <span className="text-danger">*</span>
                            </span>
                            <input
                              type="date"
                              className="form-control fs-14"
                              style={{ width: "155px" }}
                              value={submitBeforeDate}
                              min={new Date(Date.now() + 86400000)
                                .toISOString()
                                .split("T")[0]}
                              onChange={(e) =>
                                handleSubmitBeforeDateChange(e.target.value)
                              }

                            />
                          </div>

                          {/* Button */}
                          <button
                            className="btn orange-bg text-white fs-14"
                            onClick={handleSendToCompensation}
                          // disabled={!submitBeforeDate} // 🔥 important
                          >
                            {t("candidateWorkflow:Compensation_Request")}
                          </button>
                        </div>
                      ) : (
                        hasPrivilege("Offer Pool") && (
                          <button
                            className="btn blue-bg text-white fs-14"
                            onClick={handleSendToOfferPool}
                          >
                            {t("candidateWorkflow:send_to_offer_pool")}
                          </button>
                        )
                      )
                    )}

                    {/* {activeTab === "INTERVIEW_POOL"
                    && hasPrivilege("Offer Pool")
                    && canSendToOfferPool && (
                      <button
                        className="btn blue-bg text-white fs-14"
                        onClick={handleSendToOfferPool}
                      >
                        {t("candidateWorkflow:send_to_offer_pool")}
                      </button>
                  )} */}

                    {activeTab === "COMPENSATION_POOL"
                      && hasPrivilege("Offer Pool")
                      && canSendToOfferFromCompensation && (
                        <button
                          className="btn blue-bg text-white fs-14"
                          onClick={handleSendToOfferPool}
                        >
                          {t("candidateWorkflow:send_to_offer_pool")}
                        </button>
                      )}

                  </div>

                </div>

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
            selectedPositionId={selectedPositionId[0]}
            selectedRequisitionId={selectedRequisitionId}
            requisition={normalizedRequisition}
            position={selectedPosition}
            isRankEnabled={isRankEnabled}
            filters={filters}   //  ADD THIS
            hasLocationData={hasLocationData}
            allCandidatesForFilters={allCandidatesForFilters}
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
            filters={filters}   //  ADD THIS
            totalElements={interviewTotalElements}
            onPageChange={setInterviewPage}
            onPageSizeChange={setInterviewPageSize}
            selectedPositionId={selectedPositionId[0]}
            selectedRequisitionId={selectedRequisitionId}
            requisition={normalizedRequisition}
            position={selectedPosition}
            onViewFile={handleViewFile}
            getStatusLabel={getStatusLabel}
            canReschedule={canReschedule}
            onReschedule={handleReschedule}
            allCandidatesForFilters={allInterviewCandidatesForFilters}
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
            onOpenZonalComments={handleOpenZonalComments}




          />
        )}


        {activeTab === "COMPENSATION_POOL" && selectedPositionId && (
          <CompensationPool
            candidates={mapCompensationCandidates(compensationCandidates)}
            loading={loadingCompensation}
            page={interviewPage}
            pageSize={interviewPageSize}
            totalElements={compensationTotal}
            onPageChange={setInterviewPage}
            onPageSizeChange={setInterviewPageSize}
            selectedIds={selectedCompensationIds}
            setSelectedIds={setSelectedCompensationIds}

            //  ADD THESE
            onViewFile={handleViewFile}
            selectedRequisitionId={selectedRequisitionId}
            selectedPositionId={selectedPositionId[0]}
            requisition={normalizedRequisition}
            position={selectedPosition}
            refetch={refetchCompensation}
            triggerRefresh={() => setCompRefreshKey(prev => prev + 1)}
            panelData={panelData}
            allCandidatesForFilters={allCandidatesForFilters}
            filters={filters}
          />
        )}

        {activeTab === "SCHEDULE_POOL" && (
          <div>
            {/* 
          <div className="d-flex justify-content-end mb-3">

            <button
              className="btn btn-primary"
              onClick={handleEditSchedule}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit Schedule
            </button>

          </div> */}

            <SchedulePoolTable
              rows={paginatedSchedulePool}

              onEdit={handleEditSchedule}

              onSubmitApproval={() =>
                setShowApprovalModal(true)
              }

              page={schedulePoolPage}
              position={selectedPosition}


              pageSize={schedulePoolPageSize}

              totalElements={schedulePoolCandidates.length}


              onPageChange={setSchedulePoolPage}

              onPageSizeChange={setSchedulePoolPageSize}

              onViewProfile={(candidate) => {

                navigate("/candidate-preview", {

                  state: {

                    candidate: candidate,

                    applicationId: candidate.applicationId,

                    positionId: selectedPositionId,

                    requisitionId: selectedRequisitionId,

                    fromInterviewPool: true,

                    activeTab: "SCHEDULE_POOL",

                    page,
                    pageSize,
                    filters,

                    requisition: normalizedRequisition,

                    position: selectedPosition

                  }

                });

              }}

              onViewResume={(candidate) => {
                handleViewFile(candidate);
              }}

              onOpenZonalComments={
                handleOpenZonalComments
              }
            />
          </div>
        )}

        {activeTab === "OFFER_POOL" && (
          <OfferPool
            selectedPositionId={selectedPositionId[0]}
            selectedRequisitionId={selectedRequisitionId}
            filters={filters}
            selectedIds={offerSelectedIds}
            setSelectedIds={setOfferSelectedIds}
            refreshKey={offerRefreshKey}
            onOffersLoaded={(data) => setOfferData(data)}
            offerTemplateId={offerTemplateId}
            acceptBeforeDate={acceptBeforeDate}
            joiningDate={joiningDate}
          />
        )}

        {/* {activeTab === "ONBOARDING_POOL" && <OnboardingPool />} */}
        <ScheduleInterviewModal
          showScheduleModal={showScheduleModal}
          setShowScheduleModal={setShowScheduleModal}
          applicationIds={selectedCandidateIds}
          positionId={navPositionIds?.length ? navPositionIds : selectedPositionId}
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
      <ZonalRejectedCommentModal
        show={showZonalCommentModal}
        onHide={() => setShowZonalCommentModal(false)}
        comment={zonalComment}
      />

      <RankListModal
        showRankListModal={showRankListModal}
        setShowRankListModal={setShowRankListModal}
        selectedIds={offerSelectedIds}
        setSelectedIds={setOfferSelectedIds}
        onUploadSuccess={() => setOfferRefreshKey(prev => prev + 1)}
      />
      {/* <Modal show={showPreview}
        onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{templateName || "Preview"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          {previewUrl && (
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              title="PDF Preview"
            />
          )}
        </Modal.Body>
      </Modal> */}
      <ScheduleErrorModal
        show={showErrorModal}
        onClose={() =>
          setShowErrorModal(false)
        }
        errorMessage={errorMessage}
        errorCandidates={errorCandidates}
      />

      <ScheduleApprovalModal
        show={showApprovalModal}
        onClose={() =>
          setShowApprovalModal(false)
        }
        onApprove={handleSubmitForApproval}
        loading={submittingApproval}
      />
      <Modal
        show={showPreview}
        onHide={handleClose}
        size="xl"
        centered
      >
        {/* HEADER */}
        <Modal.Header closeButton className="border-0 pb-2">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0 fw-semibold">
                {templateName || "Preview"}
              </h6>
              <small className="text-muted">Template Preview</small>
            </div>

            {/* ACTION BUTTONS */}
            <div className="d-flex gap-4 align-items-center" style={{
              paddingRight: "15px"
            }}>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                > <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </div>
        </Modal.Header>

        {/* BODY */}
        <Modal.Body
          style={{
            height: "85vh",
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {previewUrl ? (
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              title="PDF Preview"
              style={{
                border: "none",
                borderRadius: "8px",
                background: "#fff",
              }}
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              No preview available
            </div>
          )}
        </Modal.Body>



      </Modal>

      <Modal
        show={
          showImportCandidatesModal
        }
        onHide={() =>
          setShowImportCandidatesModal(false)
        }
        size="lg"
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title
            style={{
              fontSize: "18px",
              fontWeight: "600"
            }}
          >

            Import Candidates

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <CandidateImportModal
            t={t}
            positionIds={
              selectedPositionId
            }
            onClose={() =>
              setShowImportCandidatesModal(
                false
              )
            }
            onSuccess={() => {

              console.log(
                "IMPORT SUCCESS"
              );

            }}
          />

        </Modal.Body>

      </Modal>




      <Modal
        show={showExaminationModal}
        onHide={() => setShowExaminationModal(false)}
        centered
        size="xl"
        backdrop="static"
      >

        <Modal.Header
          closeButton
          className="border-0 pb-2"
          style={{
            padding: "20px 24px 10px"
          }}
        >

          <div>

            <h2
              className="fw-bold mb-1"
              style={{
                fontSize: "18px",
                color: "#1F2937"
              }}
            >
              Rank Positions Summary
            </h2>

            <p
              className="mb-0"
              style={{
                fontSize: "13px",
                color: "#6B7280"
              }}
            >
              View and manage position rankings
            </p>

          </div >

        </Modal.Header>

        <Modal.Body
          style={{
            padding: "8px 24px 20px",
            maxHeight: "72vh",
            overflowY: "auto"
          }}
        >

          {examinationScoreData.map((item, index) => (

            <div
              key={index}
              className="mb-3"
              style={{
                border: "1px solid #D8DEE8",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#FFFFFF"
              }}
            >

              {/* HEADER */}

              <div
                onClick={() => {

                  setExaminationScoreData(prev =>
                    prev.map((p, i) => ({
                      ...p,
                      expanded:
                        i === index
                          ? !p.expanded
                          : p.expanded
                    }))
                  );

                }}
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: "#F3F4F6",
                  padding: "16px 18px",
                  cursor: "pointer"
                }}
              >

                {/* LEFT */}

                <div>

                  <h5
                    className="fw-semibold mb-0"
                    style={{
                      fontSize: "15px",
                      color: "#374151"
                    }}
                  >
                    {item.positionName}
                  </h5>

                </div>

                {/* RIGHT */}

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="d-flex align-items-center gap-3"
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      fontWeight: "600"
                    }}
                  >

                    <span>
                      Start: {item.startDate}
                    </span>

                    <span>
                      End: {item.endDate}
                    </span>

                  </div>

                  {/* EDIT BUTTON */}

                  <button
                    className="btn btn-sm"
                    style={{
                      border: "1px solid #F97316",
                      color: "#F97316",
                      background: "#FFF7ED",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "4px 12px",
                      borderRadius: "6px"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleEditExaminationScore(item, index);
                    }}
                  >
                    <i className="bi bi-pencil-square me-1" />
                    Edit
                  </button>

                  <i
                    className={`bi bi-chevron-${item.expanded ? "up" : "down"
                      }`}
                    style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      fontWeight: "700"
                    }}
                  />

                </div>

              </div>

              {/* BODY */}

              {item.expanded && (

                <div
                  style={{
                    padding: "14px 18px 18px",
                    background: "#FFFFFF"
                  }}
                >

                  <div
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      overflow: "hidden"
                    }}
                  >

                    <table
                      className="table mb-0"
                      style={{
                        borderCollapse: "collapse"
                      }}
                    >

                      <thead>

                        <tr
                          style={{
                            background: "#F9FAFB"
                          }}
                        >

                          <th
                            style={{
                              minWidth: "260px",
                              padding: "10px 14px",
                              border: "1px solid #E5E7EB",
                              fontSize: "12px",
                              color: "#374151",
                              fontWeight: "700"
                            }}
                          >
                            CATEGORY
                          </th>

                          {[
                            "SC",
                            "ST",
                            "OBC",
                            "EWS",
                            "UR",
                            "OC",
                            "HI",
                            "VI",
                            "ID",
                            "TOTAL"
                          ].map((head) => (

                            <th
                              key={head}
                              style={{
                                padding: "10px",
                                border: "1px solid #E5E7EB",
                                textAlign: "center",
                                fontSize: "12px",
                                color: "#374151",
                                fontWeight: "700"
                              }}
                            >
                              {head}
                            </th>

                          ))}

                        </tr>

                      </thead>

                      <tbody>

                        {/* APPEARED */}

                        <tr>

                          <td
                            style={{
                              padding: "10px 14px",
                              border: "1px solid #E5E7EB",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#374151"
                            }}
                          >
                            APPEARED
                          </td>

                          {[120, 85, 200, 95, 450, 50, 15, 10, 5, 1030]
                            .map((val, i) => (

                              <td
                                key={i}
                                style={{
                                  textAlign: "center",
                                  border: "1px solid #E5E7EB",
                                  padding: "10px",
                                  fontSize: "13px",
                                  color: "#374151"
                                }}
                              >
                                {val}
                              </td>

                            ))}

                        </tr>

                        {/* VACANCY */}

                        <tr>

                          <td
                            style={{
                              padding: "10px 14px",
                              border: "1px solid #E5E7EB",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#374151"
                            }}
                          >
                            VACANCY
                          </td>

                          {[25, 18, 45, 22, 95, 12, 4, 3, 1, 225]
                            .map((val, i) => (

                              <td
                                key={i}
                                style={{
                                  textAlign: "center",
                                  border: "1px solid #E5E7EB",
                                  padding: "10px",
                                  fontSize: "13px",
                                  color: "#374151"
                                }}
                              >
                                {val}
                              </td>

                            ))}

                        </tr>

                        {/* HIGHLIGHTED ROW */}

                        <tr
                          style={{
                            background: "#F7EDC3"
                          }}
                        >

                          <td
                            style={{
                              padding: "10px 14px",
                              border: "1px solid #E5E7EB",
                              fontWeight: "700",
                              fontSize: "13px",
                              color: "#374151"
                            }}
                          >
                            QUALIFIED WITH NO RELAXATION
                          </td>

                          {[45, 30, 85, 40, 180, 20, 8, 5, 2, 415]
                            .map((val, i) => (

                              <td
                                key={i}
                                style={{
                                  textAlign: "center",
                                  border: "1px solid #E5E7EB",
                                  padding: "10px",
                                  fontSize: "13px",
                                  color: "#374151",
                                  fontWeight: "700"
                                }}
                              >
                                {val}
                              </td>

                            ))}

                        </tr>

                        {/* QUALIFIED SET II */}

                        {/* <tr>

                          <td
                            style={{
                              padding: "10px 14px",
                              border: "1px solid #E5E7EB",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#374151"
                            }}
                          >
                            QUALIFIED WITH SET II (5%)
                          </td>

                    {[25,18,45,22,95,12,4,3,1,225]
                            .map((val, i) => (

                              <td
                                key={i}
                                style={{
                                  textAlign: "center",
                                  border: "1px solid #E5E7EB",
                                  padding: "10px",
                                  fontSize: "13px",
                                  color: "#374151"
                                }}
                              >
                                {val}
                              </td>

                            ))}

                  </tr> */}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}

            </div>

          ))}

        </Modal.Body>

        <Modal.Footer
          className="border-0"
          style={{
            padding: "0 24px 20px"
          }}
        >

          <button
            className="btn"
            style={{
              minWidth: "110px",
              height: "40px",
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              color: "#6B7280",
              fontWeight: "600",
              fontSize: "13px"
            }}
            onClick={() =>
              setShowExaminationModal(false)
            }
          >
            CANCEL
          </button>

          <button
            className="btn text-white"
            style={{
              minWidth: "110px",
              height: "40px",
              background: "#F97316",
              border: "none",
              fontWeight: "600",
              fontSize: "13px"
            }}
            onClick={() =>
              handleEditExaminationScore()
            }
          >
            SAVE
          </button>

        </Modal.Footer>

      </Modal>




    </div>

  );
}



