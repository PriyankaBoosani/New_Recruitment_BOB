import React, { useEffect, useState } from "react";
import "../../style/css/CandidateScreening.css";
import "../../style/css/CandidateVerification.css";
import "react-datepicker/dist/react-datepicker.css";

 
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
 import uploadIcon from "../../assets/upload-blue-icon.png"

 
import { Person, FileText } from "react-bootstrap-icons";
import searchIcon from "../../assets/search-icon.png";
 
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import masterApiService from "../master/services/masterApiService";
import RequisitionPositionSelector
  from "../candidatePreview/components/RequisitionPositionSelector";
 
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
  {
    id: 4,
    name: "Amit Patel",
    regNo: "9619634646",
    category: "General",
    time: "11:00 AM – 11:30 AM",
    zone: "Zone I",
    absent: false,
    status: "Provisionally Approved",
  },
  {
    id: 5,
    name: "Neha Singh",
    regNo: "9613453467",
    category: "OBC",
    time: "11:30 AM – 12:00 PM",
    zone: "Zone I",
    absent: false,
    status: "Pending",
  },
];
 
/* ============================= */
/* STATUS → CLASS MAP            */
/* ============================= */
const STAGE_STATUS_MAP = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  PROVISIONAL: "Provisionally Approved",
};
 
 
export default function CandidateVerification({ selectedJob }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date("2026-01-26"));
const [activeStage, setActiveStage] = useState(null);
  const [masterData, setMasterData] = useState(null);
const [searchText, setSearchText] = useState("");
 
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
 
  const stages = [
    { key: "PENDING", label: "Pending", count: 2 },
    { key: "REJECTED", label: "Rejected", count: 1 },
    { key: "VERIFIED", label: "Verified", count: 1 },
    { key: "PROVISIONAL", label: "Provisionally Approved", count: 1 },
  ];
 
 
const filteredCandidates = candidates.filter((c) => {
  // Stage filter
  const stageMatch = activeStage
    ? c.status === STAGE_STATUS_MAP[activeStage]
    : true;
 
  // Search filter
  const searchMatch =
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.regNo.includes(searchText);
 
  return stageMatch && searchMatch;
});
 
 
const handleClearAll = () => {
  setActiveStage(null);
};
 
 
  useEffect(() => {
    const loadMasters = async () => {
      const res = await masterApiService.getMasterDisplayAll();
      setMasterData(res.data);
    };
    loadMasters();
  }, []);
 
  /* ============================= */
  /* Absent checkbox handler       */
  /* ============================= */
  const toggleAbsent = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, absent: !c.absent } : c
      )
    );
  };
 
  return (
<div className="container-fluid px-5 py-0">
 
      {/* ================= DATE + SEARCH ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="verification-date-wrapper">
          <button className="date-nav-btn" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
            ‹
          </button>
 
        <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  dateFormat="dd MMMM yyyy"
  popperPlacement="bottom-start"
  wrapperClassName="verification-datepicker-wrapper"
  maxDate={new Date()}        // disables future dates
  showDisabledMonthNavigation // optional (UX polish)
            customInput={
              <div className="verification-date-pill">
                <span>
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="calendar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#F36F21" strokeWidth="2" />
                    <path d="M8 2V6M16 2V6" stroke="#F36F21" strokeWidth="2" />
                    <path d="M3 10H21" stroke="#F36F21" strokeWidth="2" />
                  </svg>
                </span>
              </div>
            }
          />
 
          <button className="date-nav-btn" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
            ›
          </button>
        </div>
 
        <div style={{ width: "260px" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <img src={searchIcon} width={14} alt="search" />
            </span>
<input
  className="form-control border-start-0 fs-14"
  placeholder="Search candidates..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>
          </div>
        </div>
      </div>
 
  



{/* ================= FILTER + DROPDOWNS ================= */}
<div className="card border-0 mb-0">
  <div className="card-body">

    {/* FILTER BY STAGE */}
    <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
      <span className="fs-14 text-muted me-2">FILTER BY STAGE:</span>

      <button
        className="clear-all-btn"
        onClick={handleClearAll}
      >
        Clear All
      </button>

      {stages.map((stage) => (
        <button
          key={stage.key}
          onClick={() => setActiveStage(stage.key)}
          className={`stage-pill ${activeStage === stage.key ? "active" : ""}`}
        >
          <span>{stage.label}</span>
          <span className="stage-count">{stage.count}</span>
        </button>
      ))}
    </div>

    {/* REQUISITION + POSITION */}
  <div className="card mb-4 border-0">
        <div className="card-body">
          <div className="row g-2 align-items-end border-bottom pb-4">
          <div className="row g-2 align-items-end border-bottom pb-4">
              <RequisitionPositionSelector
                onRequisitionChange={setSelectedRequisition}
                onPositionChange={setSelectedPosition}
              />

         
            </div>

              
                </div>
                {selectedRequisition && selectedPosition && (
                  <div className="mt-3">
                    <RequisitionStrip
                      requisition={selectedRequisition}
                      position={selectedPosition}
                      masterData={masterData}
                      isCardBg={false}
                      isSaveEnabled={false}
                    />
                  </div>
                )}

        </div>
      </div>

  </div>
</div>




 
{/*      
<div className="requisition-section">
  <RequisitionStrip
    positionId={selectedJob?.positionId || "076d168c-c979-45e9-a19a-be656d9b210c"}
    masterData={masterData}
    isCardBg={false}
    isSaveEnabled={true}
  />
</div>
  */}
 
 
 
 
      {/* ================= STATIC TABLE ================= */}
      <div className="card border-0 mt-0">
        <div className="table-responsive">
          <table className="table fs-14 align-middle mb-0">
            <thead className="table-light">
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
  {filteredCandidates.map((c) => (
    <tr key={c.id}>
      <td>
        {c.name}
        <div className="fs-12 text-muted">Reg No: {c.regNo}</div>
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
        <span className={`status-pill ${c.status.replace(/\s/g, "").toLowerCase()}`}>
          {c.status}
        </span>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-3">
          <Person
            className="cursor-pointer"
            onClick={() =>
              navigate("/candidate-preview", {
                state: { candidate: c },
              })
            }
          />
          <FileText className="cursor-pointer" />
        </div>
      </td>
    </tr>
  ))}
</tbody>
 
 
          </table>
        </div>
      </div>
    </div>
  );
}
 
 