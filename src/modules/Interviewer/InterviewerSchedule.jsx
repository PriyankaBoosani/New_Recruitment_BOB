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
import RequisitionPositionSelector from "../candidatePreview/components/RequisitionPositionSelector";
import PdfViewerModal from "../candidatePreview/components/PdfViewerModal";

import masterApiService from "../master/services/masterApiService";
import CandidateVerificationService from "../Verification/services/CandidateVerification";
import { mapCandidatesToTableRows } from "../Verification/mappers/CandidateVerificationMapper";

import InterviewDayTable from "./components/InterviewDayTable";

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

  /* ===== Pagination ===== */

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  /* ===== PDF ===== */

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  /* ================= LOAD MASTERS ================= */

  useEffect(() => {
    masterApiService.getMasterDisplayAll()
      .then(res => setMasterData(res.data || {}))
      .catch(() => setMasterData({}));
  }, []);

  /* ================= LOAD CANDIDATES ================= */

  const formatApiDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  useEffect(() => {
    const load = async () => {
      try {
        const res =
          await CandidateVerificationService.getCandidatesByDate(
            formatApiDate(selectedDate)
          );

        const apiList = res.data || [];
        setAllCandidatesRaw(apiList);

        const mapped = mapCandidatesToTableRows(apiList).map(r => ({
          ...r,
          comment: "",
          score: ""
        }));

        setRows(mapped);

      } catch {
        toast.error("Failed to load candidates");
      }
    };

    load();
  }, [selectedDate]);

  /* ================= FILTERING ================= */

  const filteredRows = useMemo(() => {

    if (!selectedRequisition || !selectedPosition) return [];

    return rows.filter(r =>
      r.raw.requisitionId === selectedRequisition.requisition_id &&
      r.raw.positionId === selectedPosition.positionId &&
      (
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        r.regNo.includes(searchText)
      )
    );

  }, [rows, selectedRequisition, selectedPosition, searchText]);

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
      for (const r of filteredRows) {
        await CandidateVerificationService.updateAbsentStatus(
          r.raw.applicationId,
          r.absent
        );
      }
      toast.success("Saved successfully");
    } catch {
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

        <RequisitionPositionSelector
          apiList={allCandidatesRaw}
          selectedRequisitionRaw={selectedRequisition}
          selectedPositionRaw={selectedPosition}
          onRequisitionChange={(r)=>{
            setSelectedRequisition(r);
            setSelectedPosition(null);
          }}
          onPositionChange={setSelectedPosition}
        />

      </div>

      {/* ===== STRIP — SAME AS VERIFICATION ===== */}

      {isSelectionDone && (
        <div className="requisition-strip">
          <RequisitionStrip
            requisition={selectedRequisition}
            position={selectedPosition}
            isCardBg={false}
            isSaveEnabled={anyChanged}
            onSave={handleSave}
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

  requisition={selectedRequisition}
  position={selectedPosition}
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
