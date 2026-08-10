import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import DropdownStripMultipleposition from "../candidatePreview/components/DropdownStripMultipleposition";
import RequisitionStripformultiplepositions from "../candidatePreview/components/RequisitionStripformultiplepositions";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";
import masterApiService from "../master/services/masterApiService";
import BulkCommunicationPool from "./components/BulkCommunicationPool";
import upload_icon from "../../assets/upload_Icon.png";
import edit_icon from "../../assets/edit_icon.png";
import view_icon from "../../assets/view_icon.png";
import file_icon from "../../assets/file_icon.png";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Bulkcommunication = () => {
  const { t } = useTranslation("bulkCommunication");
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


  const [errors, setErrors] = useState({
    subject: "",
    body: "",
  });

  // Filter Pipeline State
  const [filters, setFilters] = useState({
    status: [],
    stateId: "",
    categoryId: "",
    searchText: "",
  });

  const handleViewAttachment = () => {
    if (!emailAttachment) return;

    const fileUrl = URL.createObjectURL(emailAttachment);
    window.open(fileUrl, "_blank");
  };

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



  const resetCommunicationForm = () => {
    setEmailSubject("");
    setEmailBody("");
    setEmailAttachment(null);

    setErrors({
      subject: "",
      body: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    // Validation
    const validationErrors = {
      subject: "",
      body: "",
    };

    let isValid = true;

    if (!emailSubject.trim()) {
      validationErrors.subject = t("this_field_is_required");
      isValid = false;
    }

    if (!emailBody.trim()) {
      validationErrors.body = t("this_field_is_required");
      isValid = false;
    }

    setErrors(validationErrors);

    if (!isValid) {
      return;
    }

    if (submitRef.current) return;
    submitRef.current = true;
    setSendingCommunication(true);

    try {
      const activeStatuses =
        filters.status.length === 0
          ? CANDIDATE_POOL_STATUSES
          : filters.status.map((s) => s.toUpperCase());

      const mailPayload = {
        selectAll:
          allCandidatesForFilters.length === selectedCandidateIds.length,
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

      const response = await jobPositionApiService.sendBulkEmail(formData);

      if (
        response?.data?.success === false ||
        response?.success === false
      ) {
        toast.error(
          response?.data?.message ||
          response?.message ||
          t("failed_to_send_communication")
        );
        return;
      }

      toast.success(
        // `Communication successfully processed for ${selectedCandidateIds.length} candidate(s)!`
        t("communication_success", {
          count: selectedCandidateIds.length,
        })
      );
      // Clear form
      setErrors({
        subject: "",
        body: "",
      });

      setIsModalOpen(false);
      setSelectedCandidateIds([]);
      setEmailSubject("");
      setEmailBody("");
      setEmailAttachment(null);
      resetCommunicationForm();
      setIsModalOpen(false);
      setSelectedCandidateIds([]);
    } catch (err) {
      console.error("Communication transmission pipeline failure:", err);

      const errorMessage =
        err?.response?.data?.message ||
       t("submission_failed")

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
          {t("bulk_communication")}
        </h4>
        <p className="text-muted small mb-0">
          {t("heading_description")}
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
                <h5 className="modal-title font-weight-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>{t("bulk_communication")}</h5>
                <button
                  type="button"
                  className="btn-close border-0 bg-transparent p-0 text-muted"
                  onClick={() => {
                    resetCommunicationForm();
                    setIsModalOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    lineHeight: 1,
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body p-4 bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">
                    {t("subject")}<span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    className={`form-control rounded-2 py-2 px-3 ${errors.subject ? "is-invalid" : ""
                      }`}
                    value={emailSubject}
                    onChange={(e) => {
                      setEmailSubject(e.target.value);

                      if (errors.subject) {
                        setErrors((prev) => ({
                          ...prev,
                          subject: "",
                        }));
                      }
                    }}
                    placeholder={t("subject_placeholder")}
                  />

                  {errors.subject && (
                    <div className="text-danger mt-1 small">
                      {errors.subject}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">
                    {t("message_body")} <span className="text-danger">*</span>
                  </label>

                  <textarea
                    rows="12"
                    className={`form-control rounded-2 p-3 ${errors.body ? "is-invalid" : ""
                      }`}
                    value={emailBody}
                    onChange={(e) => {
                      setEmailBody(e.target.value);

                      if (errors.body) {
                        setErrors((prev) => ({
                          ...prev,
                          body: "",
                        }));
                      }
                    }}
                    placeholder={t("message_placeholder")}
                  />

                  {errors.body && (
                    <div className="text-danger mt-1 small">
                      {errors.body}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label small font-weight-bold mb-1">
                    {t("attachments_optional")}
                  </label>

                  <div className="d-flex align-items-center gap-3">

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      onChange={handleFileChange}
                    />

                    {!emailAttachment ? (
                      <>
                        <div
                          className="upload-indent-box"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="text-center text-muted">
                            <img
                              src={upload_icon}
                              alt="upload_icon"
                              className="icon-40"
                            />
                            <div>{t("click_to_browse")}</div>
                            <span className="support">
                              {t("supported_formats")}
                            </span>
                          </div>
                        </div>

                        <span className="text-muted small">
                          {t("no_file_uploaded")}
                        </span>
                      </>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-between w-100 border rounded px-3 py-2"
                        style={{ background: "#f8f9ff" }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          📄
                          <span className="fw-semibold">
                            {emailAttachment.name}
                          </span>
                        </div>

                        <div className="d-flex align-items-center gap-2">

                          <button
                            type="button"
                            className="icon-btn"
                            title="View"
                            onClick={handleViewAttachment}
                          >
                            <img
                              src={view_icon}
                              alt="view"
                              className="icon-16"
                            />
                          </button>

                          <button
                            type="button"
                            className="icon-btn"
                            title="Replace"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <img
                              src={edit_icon}
                              alt="edit"
                              className="icon-16"
                            />
                          </button>

                          <button
                            type="button"
                            className="icon-btn"
                            title="Remove"
                            onClick={() => {
                              setEmailAttachment(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            ✕
                          </button>

                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 border rounded-3 d-flex align-items-start gap-3" style={{ backgroundColor: '#fff5f2', borderColor: '#ffe2da' }}>
                  <span className="fs-5 text-secondary" style={{ marginTop: '-2px' }}>👥</span>
                  <div>
                    <div className="font-weight-bold text-dark small" style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {/* {selectedCandidateIds.length} Selected Candidates */}
                      {selectedCandidateIds.length} {t("selected_candidates")}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                      {t("communication_selected_candidates")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light border-top d-flex justify-content-end gap-2 py-3 px-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 bg-white rounded-2"
                  onClick={() => {
                    resetCommunicationForm();
                    setIsModalOpen(false);
                  }}
                  style={{ fontSize: '0.95rem', color: '#333' }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  className="btn px-4 py-2 rounded-2 text-white font-weight-bold shadow-sm d-flex align-items-center gap-2"
                  disabled={sendingCommunication}
                  onClick={handleSendCommunication}
                  style={{ backgroundColor: '#e95420', border: 'none', fontSize: '0.95rem' }}
                >
                  {sendingCommunication ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {t("sending")}
                    </>
                  ) : (
                    <> {t("send_communication")}</>
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