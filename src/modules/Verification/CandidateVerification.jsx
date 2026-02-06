import React, { useEffect, useState } from "react";
import "../../style/css/CandidateScreening.css";
import "../../style/css/CandidateVerification.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { addDays, subDays } from "date-fns";
import searchIcon from "../../assets/search-icon.png";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import masterApiService from "../master/services/masterApiService";
import RequisitionPositionSelector from "../candidatePreview/components/RequisitionPositionSelector";
import CandidateTable from "./components/CandidateTable";
import CandidateVerificationService from "./services/CandidateVerification";
import { DUMMY_DATA } from "./components/mockData";
import { mapCandidatesToTableRows } from "./mappers/CandidateVerificationMapper";



/* ================= STATUS MAP ================= */

const STAGE_STATUS_MAP = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  PROVISIONALLY_APPROVED: "Provisionally Approved",
};

/* ================= DATE PILL ================= */

const DatePill = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-pill" onClick={onClick} ref={ref}>
    {value}
    <span className="calendar-icon">📅</span>
  </div>
));

export default function CandidateVerification() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStage, setActiveStage] = useState(null);
  const [masterData, setMasterData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [allCandidatesRaw, setAllCandidatesRaw] = useState([]);





  

  /* ================= LOAD MASTER ================= */

  // useEffect(() => {
  //   masterApiService.getAllMasters().then(res => {
  //     setMasterData(res.data);
  //   });
  // }, []);






const formatApiDate = (d) => {
  if (!d) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



useEffect(() => {
  console.log("RAW API LIST SIZE:", allCandidatesRaw.length);
}, [allCandidatesRaw]);



useEffect(() => {
  if (!selectedDate) return;

  const loadCandidates = async () => {
    try {
      const dateStr = formatApiDate(selectedDate);

      const res =
        await CandidateVerificationService
          .getCandidatesByDate(dateStr);

      console.log("FULL API RESPONSE:", res);

      const apiList = res.data || [];   //  FIX

      console.log("RAW API LIST SIZE:", apiList.length);

      setAllCandidatesRaw(apiList);
      setAllCandidates(
        mapCandidatesToTableRows(apiList)
      );

    } catch (err) {
      console.error("Candidate API failed", err);
      setAllCandidatesRaw([]);
      setAllCandidates([]);
    }
  };

  loadCandidates();

}, [selectedDate]);



  /* ================= LOAD DUMMY → TABLE MAP ================= */

  // useEffect(() => {
  //   setAllCandidates(mapCandidatesToTableRows(DUMMY_DATA));
  // }, []);

  /* ================= FILTER ================= */




  const baseFiltered = allCandidates.filter(c => {

  if (!selectedRequisition || !selectedPosition) return false;

  const reqMatch =
    c.raw.requisitionId === selectedRequisition.requisition_id;

  const posMatch =
    c.raw.positionId === selectedPosition.positionId;

  const searchMatch =
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.regNo.includes(searchText);

  return reqMatch && posMatch && searchMatch;
});






const filteredCandidates = baseFiltered.filter(c =>
  activeStage
    ? c.status === STAGE_STATUS_MAP[activeStage]
    : true
);


  /* ================= STAGE COUNTS ================= */

const stageCounts = Object.keys(STAGE_STATUS_MAP).reduce((acc, key) => {
  acc[key] = baseFiltered.filter(
    c => c.status === STAGE_STATUS_MAP[key]
  ).length;
  return acc;
}, {});


  /* ================= ABSENT TOGGLE ================= */

  const toggleAbsent = (id) => {
    setAllCandidates(prev =>
      prev.map(c =>
        c.id === id ? { ...c, absent: !c.absent } : c
      )
    );
  };

const anyAbsentChanged =
  filteredCandidates.some(c => c.absent === true);


  const isSelectionDone =
    selectedRequisition && selectedPosition;


 const handleSaveAbsent = async () => {
  try {
    if (!filteredCandidates.length) return;

    for (const c of filteredCandidates) {
      await CandidateVerificationService.updateAbsentStatus(
        c.raw.applicationId,
        c.absent
      );
    }

    toast.success("Absent status updated");

  } catch (err) {
    console.error("Absent update failed", err);
    toast.error("Save failed");
  }
};



  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 py-3 candidate-verification-page">

      {/* ================= DATE + SEARCH ================= */}

      <div className="verification-toolbar">
        <div className="date-nav">

          <span
            className="nav-arrow"
            onClick={() =>
              setSelectedDate(d => subDays(d, 1))
            }
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
            onClick={() => {
              const next = addDays(selectedDate, 1);
              if (next <= new Date()) setSelectedDate(next);
            }}
          >›</span>

        </div>

        <div className="search-box">
          <img src={searchIcon} width={14} alt="search" />
          <input
            placeholder="Search candidates..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* ================= STAGE FILTER ================= */}

      <div className="stage-filter-row d-flex align-items-center gap-4">

        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">FILTER BY STAGE:</span>
          <span
            className="clear-all"
            onClick={() => setActiveStage(null)}
          >
            Clear All
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {Object.keys(STAGE_STATUS_MAP).map(key => (
            <button
              key={key}
              className={`stage-chip d-flex align-items-center gap-2 ${
                activeStage === key ? "active" : ""
              }`}
              onClick={() => setActiveStage(key)}
            >
              <span>{STAGE_STATUS_MAP[key]}</span>
              <span className="stage-count">
                {stageCounts[key] || 0}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* ================= SELECTORS ================= */}

    <div className="requisition-selector-row">
       <RequisitionPositionSelector
  apiList={allCandidatesRaw}
  onRequisitionChange={setSelectedRequisition}
  onPositionChange={setSelectedPosition}
/>

      </div>

      {/* ================= STRIP ================= */}

      {isSelectionDone && (
        <div className="requisition-strip">
          <RequisitionStrip
            requisition={selectedRequisition}
            position={selectedPosition}
            masterData={masterData}
            isCardBg={false}
isSaveEnabled={anyAbsentChanged}
             onSave={handleSaveAbsent}  
          />
        </div>
      )}

      {/* ================= TABLE ================= */}

      <CandidateTable
        requisition={selectedRequisition}
        position={selectedPosition}
        isSelectionDone={isSelectionDone}
        filteredCandidates={filteredCandidates}
        toggleAbsent={toggleAbsent}
      />

    </div>
  );
}
