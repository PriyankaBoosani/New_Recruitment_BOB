import React, { useEffect, useState } from "react";
import Select from "react-select";
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import {
  mapRequisitionToStripHeader,
  mapPositionListItem
} from "../mappers/candidatePreviewMapper";

const RequisitionPositionSelector = ({
  onRequisitionChange,
  onPositionChange
}) => {
  const [requisitions, setRequisitions] = useState([]);
  const [positions, setPositions] = useState([]);

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [loadingReq, setLoadingReq] = useState(false);
  const [loadingPos, setLoadingPos] = useState(false);

  /* ================= FETCH REQUISITIONS ================= */
  const fetchRequisitions = async (searchText = "") => {
    try {
      setLoadingReq(true);
      const res =
        await candidateWorkflowServices.getRequisitions(searchText);

      const mapped = (res.data || []).map(mapRequisitionToStripHeader);

      setRequisitions(
        mapped.map((r) => ({
          value: r.requisition_id,
          label: String(r.requisition_title || ""),
          raw: r
        }))
      );
    } catch (err) {
      console.error("Failed to load requisitions", err);
    } finally {
      setLoadingReq(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  /* ================= FETCH POSITIONS ================= */
  const fetchPositions = async (searchText = "") => {
    if (!selectedRequisition?.value) return;

    try {
      setLoadingPos(true);
      const res =
        await candidateWorkflowServices.getPositionsByRequisitionId(
          selectedRequisition.value,
          searchText
        );

      const mapped = (res.data || []).map(mapPositionListItem);

      setPositions(
        mapped.map((p) => ({
          value: p.positionId,
          label: String(p.positionName || ""),
          raw: p
        }))
      );
    } catch (err) {
      console.error("Failed to load positions", err);
    } finally {
      setLoadingPos(false);
    }
  };

  useEffect(() => {
    setSelectedPosition(null);
    setPositions([]);
    if (selectedRequisition) fetchPositions();
  }, [selectedRequisition]);

  return (
    <div className="row g-3 align-items-end">
      {/* REQUISITION */}
      <div className="col-md-6 col-12">
        <label className="fs-14 blue-color mb-1">Requisition</label>
        <Select
          isClearable
          isLoading={loadingReq}
          options={requisitions}
          value={selectedRequisition}
          placeholder="Select Requisition"
          onInputChange={(inputValue, { action }) => {
            if (action === "input-change") {
              fetchRequisitions(inputValue);
            }
          }}
          onChange={(option) => {
            setSelectedRequisition(option);
            onRequisitionChange?.(option?.raw || null);
            onPositionChange?.(null);
          }}
        />
      </div>

      {/* POSITION */}
      <div className="col-md-6 col-12">
        <label className="fs-14 blue-color mb-1">Position</label>
        <Select
          isClearable
          isLoading={loadingPos}
          options={positions}
          value={selectedPosition}
          placeholder={
            selectedRequisition
              ? "Select Position"
              : "Select Requisition first"
          }
          isDisabled={!selectedRequisition}
          onInputChange={(inputValue, { action }) => {
            if (action === "input-change" && selectedRequisition) {
              fetchPositions(inputValue);
            }
          }}
          onChange={(option) => {
            setSelectedPosition(option);
            onPositionChange?.(option?.raw || null);
          }}
        />
      </div>
    </div>
  );
};

export default RequisitionPositionSelector;
