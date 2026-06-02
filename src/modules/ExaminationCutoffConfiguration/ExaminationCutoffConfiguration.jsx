import React, { useEffect, useMemo, useState } from "react";

import "../../style/css/ExaminationCutoffConfiguration.css";
import "../../style/css/CandidateVerification.css";
import "../../style/css/CandidateScreening.css";

import { useLocation, useNavigate } from "react-router-dom";

import DropdownStrip from "../candidatePreview/components/DropdownStrip";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";

import ExaminationCutoffTable from "./components/ExaminationCutoffTable";

import AddExaminationCutoffModal from "./components/AddExaminationCutoffModal";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";

export default function ExaminationCutoffConfiguration() {
  /* ================= MODAL ================= */

  const [showModal, setShowModal] = useState(false);

  const [editingData, setEditingData] = useState(null);

  const [viewOnly, setViewOnly] = useState(false);

  /* ================= DROPDOWN STATES ================= */

  const [requisitions, setRequisitions] = useState([]);

  const [positions, setPositions] = useState([]);

  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");

  const [selectedPositionId, setSelectedPositionId] = useState([]);

  const [loadingRequisitions, setLoadingRequisitions] = useState(false);

  const [hasExistingConfiguration, setHasExistingConfiguration] =
    useState(false);

  const [loadingPositions, setLoadingPositions] = useState(false);

  /* ================= TABLE DATA ================= */

  const [configurations, setConfigurations] = useState([]);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(10);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchRequisitions();
    //  loadConfigurations();
  }, []);

  const [statusFilter, setStatusFilter] = useState([]);

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

  /* ================= FETCH POSITIONS ================= */

  const fetchPositions = async (requisitionId) => {
    try {
      setLoadingPositions(true);

      const res = await jobPositionApiService.getPositionsByReqId({
        requisitionId,
      });

      setPositions(res?.data || []);
    } catch (err) {
      console.error("Failed to load positions", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  /* ================= FETCH CONFIGS ================= */

  const loadConfigurations = async (
    positionIds = [],
    positionsData = positions
  ) => {
    try {
      if (!positionIds.length) {
        setConfigurations([]);

        setHasExistingConfiguration(false);

        return;
      }

      const res = await jobPositionApiService.getExamConfigurationsByPositions(
        positionIds.join(",")
      );

      const data = res?.data || [];

      /* MAP POSITION NAME */

      const mappedData = data.map((item) => {
        const matchedPosition = positionsData.find(
          (pos) =>
            String(pos.jobPositions?.positionId) === String(item.positionId)
        );

        return {
          ...item,

          positionName: matchedPosition?.masterPositions?.positionName || "",
        };
      });

      setConfigurations(mappedData);

      /* CHECK CONFIG EXISTS */

      setHasExistingConfiguration(mappedData.length > 0);

      return mappedData;
    } catch (err) {
      console.error("Failed to load configurations", err);
    }
  };

  /* ================= SEARCH ================= */

  const handleRequisitionSearch = (inputValue) => {
    fetchRequisitions(inputValue);
  };

  /* ================= REQUISITION CHANGE ================= */

  const handleRequisitionChange = async (e) => {
    const reqId = e.target.value;

    setSelectedRequisitionId(reqId);

    setSelectedPositionId([]);

    setConfigurations([]);
    setHasExistingConfiguration(false);

    if (!reqId) {
      setPositions([]);
      return;
    }

    fetchPositions(reqId);
  };

  /* ================= POSITION CHANGE ================= */

  const handlePositionChange = async (ids) => {
    const formattedIds = ids.map(String);

    setSelectedPositionId(formattedIds);

    const configs = await loadConfigurations(formattedIds);
  };

  /* ================= SELECTED REQUISITION ================= */

  const selectedRequisition = requisitions.find(
    (r) => r.id === selectedRequisitionId
  );

  /* ================= NORMALIZED REQUISITION ================= */

  const normalizedRequisition = selectedRequisition
    ? {
        requisition_id: selectedRequisition.id,

        requisition_code: selectedRequisition.requisitionCode,

        requisition_title: selectedRequisition.requisitionTitle,

        registration_start_date: selectedRequisition.startDate,

        registration_end_date: selectedRequisition.endDate,
      }
    : null;

  /* ================= SELECTED POSITION ================= */

  const selectedPosition = positions
    .filter((p) =>
      selectedPositionId.includes(String(p.jobPositions?.positionId))
    )
    .map((p) => ({
      positionId: String(p.jobPositions?.positionId),

      positionName: p?.masterPositions?.positionName,
    }));

  const location = useLocation();
  const navigate = useNavigate();
  const fromCandidateScreening = location.state?.fromCandidateScreening;

  useEffect(() => {
    const state = location.state;

    if (!state?.openEditModal) {
      return;
    }

    const initialize = async () => {
      const reqId = state?.requisitionId;

      const positionIds = state?.positionIds || [];

      if (!reqId) return;

      setSelectedRequisitionId(reqId);

      /* FETCH POSITIONS */

      const res = await jobPositionApiService.getPositionsByReqId({
        requisitionId: reqId,
      });

      const fetchedPositions = res?.data || [];

      setPositions(fetchedPositions);

      /* SET SELECTED POSITION */

      const formattedIds = positionIds.map(String);

      setSelectedPositionId(formattedIds);

      /* LOAD CONFIGS */

      /* LOAD CONFIGS */

      const configs =
        (await loadConfigurations(formattedIds, fetchedPositions)) || [];

      /* AUTO OPEN EDIT */

      setTimeout(() => {
        const matchedConfig = configs.find((item) =>
          formattedIds.includes(String(item.positionId))
        );

        if (matchedConfig) {
          setEditingData(matchedConfig);

          setViewOnly(false);

          setShowModal(true);
        } else {
          /* OPEN EMPTY ADD MODAL */

          setEditingData(null);

          setShowModal(true);
        }

        window.history.replaceState({}, document.title);
      }, 500);
    };

    initialize();
  }, [location.state]);

  /* ================= FILTER TABLE ================= */

  const filteredConfigurations = useMemo(() => {
    let data = [...configurations];

    /* POSITION FILTER */

    if (selectedPositionId.length) {
      data = data.filter((item) =>
        selectedPositionId.includes(String(item.positionId))
      );
    }

    /* STATUS FILTER */

    if (statusFilter.length) {
      data = data.filter((item) => statusFilter.includes(item.status));
    }

    return data;
  }, [configurations, selectedPositionId, statusFilter]);

  /* ================= PAGINATION DATA ================= */

  const totalElements = filteredConfigurations.length;

  const totalPages = Math.ceil(totalElements / pageSize);

  const startIndex = page * pageSize;

  const endIndex = startIndex + pageSize;

  const paginatedConfigurations = filteredConfigurations.slice(
    startIndex,
    endIndex
  );

  /* ================= EDIT ================= */

  const handleEdit = (row) => {
    setViewOnly(false);

    setEditingData(row);

    setShowModal(true);
  };

  /* ================= VIEW ================= */

  const handleView = (row) => {
    setViewOnly(true);

    setEditingData(row);

    setShowModal(true);
  };

  /* ================= SAVE SUCCESS ================= */

  const handleSuccess = async () => {
    setShowModal(false);

    setEditingData(null);

    setViewOnly(false);

    await loadConfigurations(selectedPositionId);
  };

  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 py-4 exam-config-page">
      {/* ================= PAGE TITLE ================= */}

      <div className="mb-4">
        <h2 className="exam-page-title">
          Written Exam — Section & Cutoff Configuration
        </h2>

        <p className="exam-page-subtitle">
          Define the structural breakdown of the examination and establish
          rigorous passing criteria across different candidate categories.
        </p>
      </div>

      {/* ================= TOP CARD ================= */}

      {/* ================= TOP CARD ================= */}

      <div className="card mb-4 border-0 exam-top-card">
        <div className="card-body p-0">
          {/* FILTERS */}
          <div className="row g-2 align-items-end exam-filter-section">
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

            <DropdownStrip
              requisitions={requisitions}
              positions={positions}
              selectedRequisitionId={selectedRequisitionId}
              selectedPositionId={selectedPositionId?.[0] || ""}
              loadingRequisitions={loadingRequisitions}
              loadingPositions={loadingPositions}
              onRequisitionChange={handleRequisitionChange}
              onPositionChange={(id) => handlePositionChange(id ? [id] : [])}
              onRequisitionSearch={handleRequisitionSearch}
            />

            {/* BUTTONS */}
            <div className="col-md-6 col-12 text-md-end">
              <button
                className={`btn fs-14 ${
                  hasExistingConfiguration
                    ? "btn-secondary"
                    : "text-white orange-bg"
                }`}
                disabled={hasExistingConfiguration}
                onClick={() => {
                  /* REQUISITION VALIDATION */

                  if (!selectedRequisitionId) {
                    alert("Please select Requisition first");

                    return;
                  }

                  /* POSITION VALIDATION */

                  if (!selectedPositionId.length) {
                    alert("Please select Position first");

                    return;
                  }

                  setViewOnly(false);

                  setEditingData(null);

                  setShowModal(true);
                }}
              >
                + Add Configuration
              </button>
            </div>
          </div>

          {/* STRIP */}
          <div className="exam-strip-section">
            {normalizedRequisition && selectedPosition?.length > 0 && (
              

              <RequisitionStrip
                requisition={normalizedRequisition}
                position={selectedPosition?.[0]}
                isCardBg={false}
                isSaveEnabled={false}
                isSaveBtn={false}
                saveButton={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}

      <div className="card border-0 rounded-4 shadow-sm exam-table-card">
        {/* ================= HEADER ================= */}

        {/* ================= TABLE ================= */}

        <div className="exam-table-inner">
          <ExaminationCutoffTable
            rows={paginatedConfigurations}
            onView={handleView}
            onEdit={handleEdit}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            s
          />
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <AddExaminationCutoffModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingData(null);
          setViewOnly(false);
        }}
        editData={editingData}
        onSuccess={handleSuccess}
        viewOnly={viewOnly}
        selectedRequisition={selectedRequisition}
        selectedPosition={selectedPosition}
        fromCandidateScreening={fromCandidateScreening}
      />
    </div>
  );
}
