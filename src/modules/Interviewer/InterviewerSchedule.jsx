import React, { useEffect, useMemo, useState } from "react";
import "../../style/css/CandidateVerification.css";
import "../../style/css/CandidateScreening.css";
import "../../style/css/InterviewerSchedule.css";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import { toast } from "react-toastify";

import searchIcon from "../../assets/search-icon.png";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import InterviewerPositionSelector from "../candidatePreview/components/InterviewerPositionSelector";
import InterviewerService from "./service/InterviewerService";
import PdfViewerModal from "../candidatePreview/components/PdfViewerModal";

import masterApiService from "../master/services/masterApiService";
import CandidateVerificationService from "../Verification/services/CandidateVerification";


import InterviewDayTable from "./components/InterviewDayTable";
import { mapPanelPositions } from "./mapper/InterviewerScheduleMapper";
import { mapInterviewerCandidates } from "./mapper/InterviewerScheduleMapper";
import { useLocation } from "react-router-dom";





/* ================= DATE PILL ================= */

const DatePill = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-pill" onClick={onClick} ref={ref}>
    {value}
    <span className="calendar-icon">📅</span>
  </div>
));

/* ================= SCREEN ================= */

export default function InterviewerSchedule() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");

  const [masterData, setMasterData] = useState(null);
  const [allCandidatesRaw, setAllCandidatesRaw] = useState([]);
  const [rows, setRows] = useState([]);

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [panelPositions, setPanelPositions] = useState([]);
const [usedRestoreData, setUsedRestoreData] = useState(false);


  /* ===== Pagination ===== */

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  /* ===== PDF ===== */

const location = useLocation();
const navState = location.state || {};


const cameFromPreviewBack =
  sessionStorage.getItem("fromPreviewBack") === "true";


  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  /* ================= LOAD MASTERS ================= */

  useEffect(() => {
    masterApiService.getMasterDisplayAll()
      .then(res => setMasterData(res.data || {}))
      .catch(() => setMasterData({}));
  }, []);
  

const navReqId =
  navState.requisition?.requisition?.id ||
  navState.requisition?.id ||
  null;

const navPosId =
  navState.position?.position?.positionId ||
  navState.position?.positionId ||
  null;



  useEffect(() => {
  if (navState.selectedDate) {
    setSelectedDate(new Date(navState.selectedDate));
  }
}, []);

  /* ================= LOAD CANDIDATES ================= */


/* ================= LOAD PANEL POSITIONS ================= */

useEffect(() => {
  InterviewerService.getPanelPositions()
    .then(res => {
      console.log("RAW POSITIONS API:", res.data);
    const mapped = mapPanelPositions(res.data || []);
      console.log("MAPPED PANEL POSITIONS:", mapped);
      setPanelPositions(mapped);
    })
    .catch(() => toast.error("Failed to load panel positions"));
}, []);



useEffect(() => {
  if (!cameFromPreviewBack) return;
  if (!navState.preloadedCandidates?.length) return;

  console.log("🔁 Using preloaded interviewer candidates");

  setAllCandidatesRaw(navState.preloadedCandidates);
  setRows(mapInterviewerCandidates(navState.preloadedCandidates));

  setUsedRestoreData(true);

}, []);




  const formatApiDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;







useEffect(() => {

  if (usedRestoreData) {
  console.log("⛔ Skip API load — using restored data");
  sessionStorage.removeItem("fromPreviewBack");
  return;
}


  const posId = selectedPosition?.position?.positionId;

  if (!posId) {
    setRows([]);
    setAllCandidatesRaw([]);
    setPage(0);
    return;
  }

  const load = async () => {
    const dateStr = formatApiDate(selectedDate || new Date());
    const res = await InterviewerService.getCandidatesByPositionAndDate(
      posId,
      dateStr
    );

    const apiList = res.data || [];
    setAllCandidatesRaw(apiList);
    setRows(mapInterviewerCandidates(apiList));
  };

  load();

}, [selectedPosition, selectedDate, usedRestoreData]);







useEffect(() => {
  if (!cameFromPreviewBack) return;
  if (!panelPositions.length) return;
  if (!navReqId || !navPosId) return;

  console.log("🔁 Restore interviewer selector", { navReqId, navPosId });

  const matched = panelPositions.find(p =>
    p.requisition?.id === navReqId &&
    p.position?.positionId === navPosId
  );

  if (!matched) {
    console.log("❌ No panel match found");
    return;
  }

  console.log("✅ Restored panel selector:", matched);

  setSelectedRequisition(matched);
  setSelectedPosition(matched);

}, [panelPositions, cameFromPreviewBack]);







 

  /* ================= FILTERING ================= */

const filteredRows = useMemo(() => {

  const text = searchText.toLowerCase();

  if (!text) return rows;

  return rows.filter(r =>
    r.name.toLowerCase().includes(text) ||
    r.regNo.toLowerCase().includes(text)
  );

}, [rows, searchText]);


useEffect(() => {
  if (!selectedPosition) {
    console.log("🧹 CLEARING TABLE — no position selected");
    setRows([]);
    setAllCandidatesRaw([]);
    setPage(0);
  }
}, [selectedPosition]);




  /* ================= PAGINATION ================= */

  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [filteredRows.length]);

  /* ================= ROW UPDATES ================= */

  const toggleAbsent = id =>
    setRows(prev => prev.map(r =>
      r.id === id ? {...r, absent: !r.absent} : r
    ));

  const updateComment = (id,val) =>
    setRows(prev => prev.map(r =>
      r.id === id ? {...r, comment: val} : r
    ));

  const updateScore = (id,val) =>
    setRows(prev => prev.map(r =>
      r.id === id ? {...r, score: val} : r
    ));

  /* ================= VIEW RESUME ================= */

  const handleViewFile = async (raw) => {
    if (!raw?.resumeUrl)
      return toast.error("No document available");

    try {
      setLoadingPdf(true);
      const sas =
        await masterApiService.getAzureBlobSasUrl(
          raw.resumeUrl,
          "candidate"
        );
      setPdfUrl(sas?.trim());
      setShowPdfViewer(true);
    } catch {
      toast.error("Failed to open document");
    } finally {
      setLoadingPdf(false);
    }
  };

  /* ================= SAVE ================= */

const handleSave = async () => {
  try {

    if (!rows.length) {
      toast.warn("No candidates to save");
      return;
    }

    const payloads = rows.map(r => {
      const raw = r.raw;

      return {
        applicationId: raw.applicationId,
        scheduledInterviewId: raw.interviewScheduleId,
        candidateId: raw.candidateId,
        panelId: raw.panelId,
        panelScore: Number(r.score) || 0,
        panelComments: r.comment || "",
        interviewCenterId: raw.interviewCenterId,
        isAbsent: !!r.absent
      };
    });

    console.log("📦 ALL SCORE PAYLOADS:", payloads);

    // parallel calls (faster)
    await Promise.all(
      payloads.map(p =>
        InterviewerService.setCandidateScore(p)
      )
    );

    toast.success(`Saved ${payloads.length} candidates`);

  } catch (err) {
    console.error("🔥 SAVE SCORE ERROR:", err);
    toast.error("Save failed");
  }
};



  const anyChanged =
    filteredRows.some(r => r.absent || r.comment || r.score);

  const isSelectionDone =
    selectedRequisition && selectedPosition;

  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 py-3 candidate-verification-page">

      {/* ===== DATE + SEARCH TOOLBAR ===== */}

      <div className="verification-toolbar">

        <div className="date-nav">
          <span
            className="nav-arrow"
            onClick={() => setSelectedDate(d => subDays(d,1))}
          >‹</span>

          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="dd MMMM yyyy"
            customInput={<DatePill />}
            maxDate={new Date()}
          />

          <span
            className="nav-arrow"
            onClick={()=>{
              const next = addDays(selectedDate,1);
              if(next<=new Date()) setSelectedDate(next);
            }}
          >›</span>
        </div>

        <div className="search-box">
          <img src={searchIcon} width={14} alt="" />
          <input
            placeholder="Search candidates..."
            value={searchText}
            onChange={e=>setSearchText(e.target.value)}
          />
        </div>

      </div>

      {/* ===== SELECTOR CARD — SAME AS VERIFICATION ===== */}

      <div className="requisition-selector-row">

      <InterviewerPositionSelector
  apiData={panelPositions}
  selectedRequisition={selectedRequisition}
  selectedPosition={selectedPosition}
  onRequisitionChange={(r)=>{
    setSelectedRequisition(r);
    setSelectedPosition(null);
  }}
  onPositionChange={(p)=>{
    setSelectedPosition(p);
  }}
/>


      </div>

      {/* ===== STRIP — SAME AS VERIFICATION ===== */}

      {isSelectionDone && (
        <div className="requisition-strip">
       <RequisitionStrip
  requisition={{
    requisitionTitle: selectedRequisition?.requisition?.requisitionTitle,
    requisitionCode: selectedRequisition?.requisition?.requisitionCode,
    registration_start_date: selectedRequisition?.requisition?.startDate,
    registration_end_date: selectedRequisition?.requisition?.endDate
  }}

  position={{
    positionId: selectedPosition?.position?.positionId,
    positionName: selectedPosition?.masterPosition?.positionName
  }}

            isCardBg={false}
            isSaveEnabled={anyChanged}
            onSave={handleSave}
              isSaveBtn={true}
          />
        </div>
      )}

      {/* ===== TABLE ===== */}

     <InterviewDayTable
  rows={paginatedRows}
  totalElements={filteredRows.length}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  toggleAbsent={toggleAbsent}
  updateComment={updateComment}
  updateScore={updateScore}
  onViewFile={handleViewFile}
 requisition={{
    requisitionTitle: selectedRequisition?.requisition?.requisitionTitle,
    requisitionCode: selectedRequisition?.requisition?.requisitionCode,
    registration_start_date: selectedRequisition?.requisition?.startDate,
    registration_end_date: selectedRequisition?.requisition?.endDate
  }}
  position={{
    positionId: selectedPosition?.position?.positionId,
    positionName: selectedPosition?.masterPosition?.positionName
  }}
  selectedDate={selectedDate}
  allCandidatesRaw={allCandidatesRaw}
/>


      {/* ===== PDF VIEWER ===== */}

      <PdfViewerModal
        show={showPdfViewer}
        onHide={()=>{
          setShowPdfViewer(false);
          setPdfUrl(null);
        }}
        fileUrl={pdfUrl}
        loading={loadingPdf}
        title="Candidate Resume"
      />

    </div>
  );
}
