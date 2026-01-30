import React, { useEffect, useState } from "react";
import "../../style/css/CandidateScreening.css";
import "../../style/css/CandidateVerification.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import { addDays, subDays } from "date-fns";
import { Person, FileText } from "react-bootstrap-icons";
import searchIcon from "../../assets/search-icon.png";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import masterApiService from "../jobPosting/services/masterApiService";
import RequisitionPositionSelector from "../candidatePreview/components/RequisitionPositionSelector";

/* ============================= */
/* STATIC TABLE DATA (TEMP)      */
/* ============================= */
const INITIAL_CANDIDATES = [
  {
    id: 1,
    name: "Jagadeesh Shukla",
    regNo: "9619654678",
    category: "General",
    time: "09:00 AM – 09:30 AM",
    zone: "Zone I",
    absent: false,
    status: "Pending",
  },
  {
    id: 2,
    name: "Priya Sharma",
    regNo: "9619671298",
    category: "OBC",
    time: "09:30 AM – 10:00 AM",
    zone: "Zone I",
    absent: false,
    status: "Verified",
  },
  {
    id: 3,
    name: "Sanjay Gupta",
    regNo: "9613452789",
    category: "SC",
    time: "10:00 AM – 10:30 AM",
    zone: "Zone I",
    absent: true,
    status: "Rejected",
  },
];

const STAGE_STATUS_MAP = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  PROVISIONAL: "Provisionally Approved",
};


const DatePill = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-pill" onClick={onClick} ref={ref}>
    {value}
    <span className="calendar-icon">📅</span>
  </div>
));

  const stageCounts = {
  Pending: 1,
  Rejected: 0,
  Verified: 0,
  ProvisionallyApproved: 0,
};

export default function CandidateVerification() {
  const [selectedDate, setSelectedDate] = useState(new Date("2026-01-26"));
  const [activeStage, setActiveStage] = useState(null);
  const [masterData, setMasterData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  

  /* ================= LOAD MASTERS ================= */
  useEffect(() => {
    const loadMasters = async () => {
      const res = await masterApiService.getAllMasters();
      setMasterData(res.data);
    };
    loadMasters();
  }, []);

  /* ================= FILTER ================= */
  const filteredCandidates = candidates.filter((c) => {
    const stageMatch = activeStage
      ? c.status === STAGE_STATUS_MAP[activeStage]
      : true;

    const searchMatch =
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.regNo.includes(searchText);

    return stageMatch && searchMatch;
  });

  const toggleAbsent = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, absent: !c.absent } : c
      )
    );
  };


  const isSelectionDone = selectedRequisition && selectedPosition;







  return (
    <div className="container-fluid px-4 py-3 candidate-verification-page">

     
   
      {/* ================= DATE + SEARCH ================= */}
  <div className="verification-toolbar">
  <div className="date-nav">
    <span
      className="nav-arrow"
      onClick={() => setSelectedDate(subDays(selectedDate, 1))}
    >
      ‹
    </span>

    {/* Date Picker */}
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      dateFormat="dd MMMM yyyy"
      customInput={<DatePill />}
    />

    <span
      className="nav-arrow"
      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
    >
      ›
    </span>
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




<div className="stage-filter-row d-flex align-items-center gap-4">
  <div className="d-flex align-items-center gap-3">
    <span className="fw-semibold">FILTER BY STAGE:</span>
    <span className="clear-all" onClick={() => setActiveStage(null)}>
      Clear All
    </span>
  </div>

  <div className="d-flex gap-2 flex-wrap">
    {Object.keys(STAGE_STATUS_MAP).map((key) => (
      <button
        key={key}
        className={`stage-chip d-flex align-items-center gap-2 ${
          activeStage === key ? "active" : ""
        }`}
        onClick={() => setActiveStage(key)}
      >
        <span>{STAGE_STATUS_MAP[key]}</span>

        <span className="stage-count">
          {stageCounts[key] ?? 0}
        </span>
      </button>
    ))}
  </div>
</div>



      {/* ================= REQUISITION + POSITION ================= */}
      <div className="requisition-selector-row">
        <RequisitionPositionSelector
          onRequisitionChange={setSelectedRequisition}
          onPositionChange={setSelectedPosition}
        />
      </div>

      {/* ================= REQUISITION STRIP (INLINE) ================= */}
      <div className="requisition-strip">
 

     {selectedRequisition && selectedPosition && (
  <div className="requisition-strip">
    <RequisitionStrip
      requisition={selectedRequisition}
      position={selectedPosition}
      masterData={masterData}
      isCardBg={false}
      isSaveEnabled={true}
    />
  </div>
)}

      </div>

      {/* ================= TABLE ================= */}
<div className="verification-table-wrapper">
  <div>
    <table className="table align-middle mb-0 verification-table">
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Category</th>
          <th>Time</th>
          <th>Zone</th>
          <th>Absent</th>
          <th>Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
  {/* 🔹 BEFORE selection → empty state */}
  {!isSelectionDone && (
    <>
      <tr className="no-candidates-row">
        <td colSpan="7" className="text-center py-4 text-muted">
          No candidates found
        </td>
      </tr>

      {/* divider line */}
      <tr className="no-candidates-divider">
        <td colSpan="7"></td>
      </tr>
    </>
  )}

  {/* 🔹 AFTER selection but no data */}
  {isSelectionDone && filteredCandidates.length === 0 && (
    <>
      <tr className="no-candidates-row">
        <td colSpan="7" className="text-center py-4 text-muted">
          No candidates found
        </td>
      </tr>

      {/*  divider line (ADDED) */}
      <tr className="no-candidates-dividers">
        <td colSpan="7"></td>
      </tr>
    </>
  )}

  {/*  AFTER selection with data */}
  {isSelectionDone &&
    filteredCandidates.length > 0 &&
    filteredCandidates.map((c) => (
      <tr key={c.id}>
        <td>
          <div className="fw-semibold">{c.name}</div>
          <div className="text-muted fs-12">
            Reg No: {c.regNo}
          </div>
        </td>
        <td>{c.category}</td>
        <td>{c.time}</td>
        <td>{c.zone}</td>
        <td>
          <input
            type="checkbox"
            checked={c.absent}
            onChange={() => toggleAbsent(c.id)}
          />
        </td>
        <td>
          <span
            className={`status-badge ${c.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {c.status}
          </span>
        </td>
        <td className="text-center">
          <Person className="me-3 cursor-pointer" />
          <FileText className="cursor-pointer" />
        </td>
      </tr>
    ))}
</tbody>

    </table>

    {/* 🔹 Pagination always visible (like screenshot 2) */}
    <div className="d-flex justify-content-between align-items-center px-3 py-2">
      <span className="text-muted fs-14">
        Showing {isSelectionDone ? filteredCandidates.length : 0}–0 of 0
      </span>

      <div className="d-flex gap-2">
        <select className="form-select form-select-sm" style={{ width: 70 }}>
          <option>10</option>
        </select>
        <button className="btn btn-sm btn-outline-secondary" disabled>
          Prev
        </button>
        <button className="btn btn-sm btn-outline-secondary" disabled>
          Next
        </button>
      </div>
    </div>
  </div>
</div>



    </div>
  );
}
