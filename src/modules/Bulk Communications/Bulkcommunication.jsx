import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import DropdownStripMultipleposition from "../candidatePreview/components/DropdownStripMultipleposition";
import RequisitionStripformultiplepositions from "../candidatePreview/components/RequisitionStripformultiplepositions";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";
import masterApiService from "../master/services/masterApiService";
import BulkCommunicationPool from "./components/BulkCommunicationPool";
import { toast } from "react-toastify"; 

const Bulkcommunication = () => {
  // Dropdown & Loader States
  const [requisitions, setRequisitions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState([]);

  // Data Loading, Master Frameworks & Pagination States
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [allCandidatesForFilters, setAllCandidatesForFilters] = useState([]);
  const [masterData, setMasterData] = useState(null);
  const [reservationCategories, setReservationCategories] = useState([]);

  // Filter Pipeline State
  const [filters, setFilters] = useState({
    status: [],
    stateId: "",
    categoryId: "",
    searchText: "",
  });

  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const requisitionSearchTimeout = useRef(null);
  const searchTimeoutRef = useRef(null);
  const fileInputRef = useRef(null); 
  const submitRef = useRef(false); 

  // --- New Communication Popup States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailAttachment, setEmailAttachment] = useState(null); 
  const [sendingCommunication, setSendingCommunication] = useState(false);

  // ---------------- Master Framework Initialization ----------------

  const loadMasters = async () => {
    try {
      const [masterRes, categoryRes] = await Promise.all([
        masterApiService.getMasterDisplayAll(),
        masterApiService.getAllCategories(),
      ]);
      setMasterData(masterRes.data);
      setReservationCategories(categoryRes?.data || []);
    } catch (err) {
      console.error("Master frameworks failed to load", err);
    }
  };

  useEffect(() => {
    loadMasters();
    fetchRequisitions();
  }, []);

  // ---------------- Data Mapping Transformers ----------------

  const categoryMap = useMemo(() => {
    const map = {};
    (reservationCategories || []).forEach((cat) => {
      map[cat.reservationCategoriesId] = cat.categoryName;
    });
    return map;
  }, [reservationCategories]);

  const stateMap = useMemo(() => {
    const map = {};
    (masterData?.states || []).forEach((s) => {
      map[s.stateId] = s.stateName;
    });
    return map;
  }, [masterData]);

  const formatCandidateData = useCallback((apiData) => {
    const formatStatus = (status = "") =>
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (apiData?.content || []).map((c) => ({
      id: c.candidateApplications.id,
      name: c.fullName,
      rank: c.rank,
      totalMarksObtained: Number(c.totalMarksObtained) > 0 ? c.totalMarksObtained : "-",
      examQualificationStatus: c.examQualificationStatus ? c.examQualificationStatus.replaceAll("_", " ") : "-",
      experienceMonths: c.totalMonths || 0,
      status: formatStatus(c.candidateApplications.applicationStatus),
      location: stateMap[c.stateId] || "-",
      state: stateMap[c.stateId] || "-",
      stateId: c.stateId,
      categoryId: c.categoryId,
      categoryName: categoryMap[c.categoryId] || "-",
      applicationNo: c.candidateApplications.applicationNo,
      candidateId: c.candidateApplications.candidateId,
      positionId: c.candidateApplications.positionId,
      fileUrl: c.resumeUrl,
      email: c.email || "-",
      positionName: c.positionName || "-",
    }));
  }, [categoryMap, stateMap]);

  // ---------------- Network API Interaction Handlers ----------------

  const fetchRequisitions = async (searchText = "") => {
    try {
      setLoadingRequisitions(true);
      const res = await jobPositionApiService.getRequisitions(searchText);
      setRequisitions(res?.data || []);
    } catch (err) {
      console.error("Failed to load requisitions", err);
    } finally {
      setLoadingRequisitions(false);
    }
  };

  const handleRequisitionSearch = useCallback((inputValue) => {
    if (requisitionSearchTimeout.current) clearTimeout(requisitionSearchTimeout.current);
    requisitionSearchTimeout.current = setTimeout(() => {
      fetchRequisitions(inputValue);
    }, 400);
  }, []);

  const CANDIDATE_POOL_STATUSES = useMemo(() => [
    "PENDING", "APPLIED", "RESCHEDULED", "NOT_SCHEDULED", "SCHEDULED", 
    "SELECTED_FOR_NEXT_ROUND", "NOT_AVAILABLE", "SELECTED", "REJECTED", 
    "DISQUALIFIED", "CANCELLED", "SHORTLISTED", "ELIGIBLE", "OFFERED", 
    "OFFER_REJECTED", "OFFER_ACCEPTED", "DISCREPANCY", "PROVISIONALLY_APPROVED", 
    "OFFER_AWAITED", "OFFER_SENT", "ZONAL_REJECTED", "ZONAL_ABSENT", 
    "INTERVIEW_ABSENT", "COMPENSATION_PENDING", "COMPENSATION_APPROVED", 
    "COMPENSATION_REJECTED", "COMPENSATION_RENEGOTITATE", "SCHEDULE_PENDING", 
    "RESCHEDULE_PENDING", "PRE_ONBOARDING_PENDING", "PRE_ONBOARDING_COMPLETED", 
    "ONBOARDED"
  ], []);

  const fetchCandidates = async () => {
    if (!selectedPositionId.length) return;
    try {
      setLoadingCandidates(true);
      
      const normalizedStatus = filters.status.length === 0 
        ? CANDIDATE_POOL_STATUSES 
        : filters.status.map((s) => s.toUpperCase());

      const res = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page,
        size: pageSize,
        positionIds: selectedPositionId,
        status: normalizedStatus,
        stateId: filters.stateId,
        categoryId: filters.categoryId,
        rank: true,
      });

      const apiData = res?.data;
      setCandidates(formatCandidateData(apiData));
      setTotalElements(apiData?.page?.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch page segment array data", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const fetchAllCandidatesForFilters = async () => {
    if (!selectedPositionId.length) {
      setAllCandidatesForFilters([]);
      return;
    }
    try {
      const normalizedStatus = filters.status.length === 0 
        ? CANDIDATE_POOL_STATUSES 
        : filters.status.map((s) => s.toUpperCase());

      const firstRes = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page: 0,
        size: pageSize,
        positionIds: selectedPositionId,
        status: normalizedStatus,
        stateId: "",
        categoryId: "",
      });

      const totalElements = firstRes?.data?.page?.totalElements || 0;
      if (totalElements === 0) {
        setAllCandidatesForFilters([]);
        return;
      }

      const finalRes = await jobPositionApiService.getCandidatesByPosition({
        searchText: filters.searchText,
        page: 0,
        size: totalElements,
        positionIds: selectedPositionId,
        status: normalizedStatus,
        stateId: "",
        categoryId: "",
      });

      setAllCandidatesForFilters(formatCandidateData(finalRes?.data));
    } catch (err) {
      console.error("Failed to build virtual contextual lookups alignment", err);
    }
  };

  // ---------------- Synchronization Run Cycles ----------------

  useEffect(() => {
    if (!selectedPositionId.length) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setPage(0);
      fetchCandidates();
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [filters.searchText]);

  useEffect(() => {
    if (selectedPositionId.length > 0 && reservationCategories.length > 0) {
      fetchCandidates();
    }
  }, [selectedPositionId, page, pageSize, filters.status, filters.stateId, filters.categoryId, masterData]);

  useEffect(() => {
    fetchAllCandidatesForFilters();
  }, [selectedPositionId, filters.status, filters.searchText, masterData]);

  useEffect(() => {
    if (!selectedRequisitionId) {
      setPositions([]);
      setSelectedPositionId([]);
      return;
    }
    const fetchPositions = async () => {
      try {
        setLoadingPositions(true); 
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

  // ---------------- Structural Handlers ----------------

  const handleRequisitionChange = (e) => {
    setSelectedRequisitionId(e.target.value);
    setSelectedPositionId([]);
    setCandidates([]);
    setSelectedCandidateIds([]);
    setPage(0);
    setTotalElements(0);
  };

  const handlePositionChange = (ids) => {
    setSelectedPositionId(ids);
    setSelectedCandidateIds([]);
    if (!ids || ids.length === 0) {
      setCandidates([]);
      setTotalElements(0);
      setAllCandidatesForFilters([]);
      setPage(0);
    }
  };

  const handleRemovePosition = (removeId) => {
    const updatedIds = selectedPositionId.filter((id) => id !== removeId);
    setPage(0);
    setSelectedPositionId(updatedIds);
    if (updatedIds.length === 0) {
      setCandidates([]);
      setTotalElements(0);
      setSelectedCandidateIds([]);
      setAllCandidatesForFilters([]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEmailAttachment(e.target.files[0]);
    }
  };

  const handleSendCommunication = async () => {
    console.log("Send bulk email submission pipeline initiated");
    
    if (submitRef.current) return;
    submitRef.current = true;
    setSendingCommunication(true);

    try {
      const activeStatuses = filters.status.length === 0 
        ? CANDIDATE_POOL_STATUSES 
        : filters.status.map(s => s.toUpperCase());

      const mailPayload = {
        selectAll: allCandidatesForFilters.length === selectedCandidateIds.length,
        applicationIds: selectedCandidateIds,
        positionIds: selectedPositionId,
        statusList: activeStatuses,
        subject: emailSubject,
        body: emailBody,
      };

      const formData = new FormData();
      formData.append(
        "mail",
        new Blob([JSON.stringify(mailPayload)], {
          type: "application/json",
        })
      );

      if (emailAttachment) {
        formData.append("attachment", emailAttachment);
      }

      await jobPositionApiService.sendBulkEmail(formData);
      toast.success(`Communication successfully processed for ${selectedCandidateIds.length} candidate(s)!`);
      
      setIsModalOpen(false);
      setSelectedCandidateIds([]);
      setEmailSubject("");
      setEmailBody("");
      setEmailAttachment(null);
    } catch (err) {
      console.error("Communication transmission pipeline failure:", err);
      const errorMessage = err?.response?.data?.message || "Submission failed. Please check network connectivity parameters.";
      toast.error(errorMessage);
    } finally {
      setSendingCommunication(false);
      submitRef.current = false;
    }
  };

  const selectedRequisition = requisitions.find((r) => r.id === selectedRequisitionId);
  const normalizedRequisition = selectedRequisition ? {
    requisition_id: selectedRequisition.id,
    requisition_code: selectedRequisition.requisitionCode,  
    requisition_title: selectedRequisition.requisitionTitle,    
    registration_start_date: selectedRequisition.startDate,
    registration_end_date: selectedRequisition.endDate,
  } : null;

  const selectedPosition = positions
    .filter((p) => selectedPositionId.includes(p.jobPositions?.positionId))
    .map((p) => ({
      positionId: p.jobPositions?.positionId,
      positionName: p?.masterPositions?.positionName,
    }));

  const hasLocationData = useMemo(() => {
    return positions.some(
      (p) => selectedPositionId.includes(p.jobPositions?.positionId) && (p.jobPositions?.positionStateDistributions?.length || 0) > 0
    );
  }, [positions, selectedPositionId]);

  return (
    <div className="container-fluid px-5 py-4">
      {/* --- Dynamic Page Heading Section Matching Bank of Baroda UX --- */}
      <div className="mb-4 text-start">
        <h4 className="font-weight-bold mb-1" style={{ color: '#1e3a8a', fontWeight: '500' }}>
          Bulk Communication
        </h4>
        <p className="text-muted small mb-0">
          Select requisitions and positions to broadcast email communications to specific candidates.
        </p>
      </div>

      <div className="card mb-4 border-0">
        <div className="card-body p-0">
          <div className="row g-2 align-items-end border-bottom pb-4 px-3 py-3">
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
          </div>

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
              />
            )}
          </div>
        </div>
      </div>

      <BulkCommunicationPool
        candidates={candidates}
        loading={loadingCandidates}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        filters={filters}
        setFilters={setFilters}
        selectedIds={selectedCandidateIds}
        setSelectedIds={setSelectedCandidateIds}
        allCandidatesForFilters={allCandidatesForFilters}
        hasLocationData={hasLocationData}
        selectedPositionId={selectedPositionId}
        selectedRequisitionId={selectedRequisitionId}
        requisition={normalizedRequisition}
        position={selectedPosition}
        onTriggerCommunication={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '900px' }}> 
            <div className="modal-content border-0 shadow rounded-3 overflow-hidden">
              <div className="modal-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="modal-title font-weight-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>Bulk Communication</h5>
                <button type="button" className="btn-close border-0 bg-transparent h4 mb-0 text-muted" onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}>&times;</button>
              </div>

              <div className="modal-body p-4 bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">Subject <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control rounded-2 py-2 px-3" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g., Interview Reminder"
                    style={{ fontSize: '0.95rem' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">Message Body <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control border rounded-2 p-3 text-secondary" 
                    rows="12"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Type your message contents here..."
                    style={{ 
                      fontSize: '0.92rem', 
                      backgroundColor: '#fafafa',
                      lineHeight: '1.6',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">Attachments (Optional)</label>
                  <div className="d-flex align-items-center gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="d-none" 
                      onChange={handleFileChange}
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-secondary px-3 py-2 d-flex align-items-center gap-2 text-dark rounded-2"
                      style={{ fontSize: '0.88rem', backgroundColor: '#fff', border: '1px solid #ced4da' }}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      📎 Upload File
                    </button>
                    <span className="text-muted small" style={{ fontSize: '0.85rem' }}>
                      {emailAttachment ? emailAttachment.name : "No file uploaded"}
                    </span>
                    {emailAttachment && (
                      <button 
                        type="button" 
                        className="btn btn-sm text-danger border-0 bg-transparent p-0 ms-1"
                        onClick={() => setEmailAttachment(null)}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 border rounded-3 d-flex align-items-start gap-3" style={{ backgroundColor: '#fff5f2', borderColor: '#ffe2da' }}>
                  <span className="fs-5 text-secondary" style={{ marginTop: '-2px' }}>👥</span>
                  <div>
                    <div className="font-weight-bold text-dark small" style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {selectedCandidateIds.length} Selected Candidates
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                      Communication will be sent to all selected candidates.
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light border-top d-flex justify-content-end gap-2 py-3 px-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4 py-2 bg-white rounded-2" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ fontSize: '0.95rem', color: '#333' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn px-4 py-2 rounded-2 text-white font-weight-bold shadow-sm d-flex align-items-center gap-2" 
                  disabled={sendingCommunication || !emailSubject || !emailBody}
                  onClick={handleSendCommunication}
                  style={{ backgroundColor: '#e95420', border: 'none', fontSize: '0.95rem' }}
                >
                  {sendingCommunication ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>🚀 Send Communication</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bulkcommunication;