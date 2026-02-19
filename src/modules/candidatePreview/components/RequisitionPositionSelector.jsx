import React, { useMemo } from "react";
import Select, { components } from "react-select";

import {
  mapUniqueRequisitionsToDropdown,
  mapUniquePositionsToDropdown
} from "../../Verification/mappers/CandidateVerificationMapper";


/* ================= CONTROL TOOLTIP ================= */

const TooltipControl = (props) => {
  const selected = props.getValue()?.[0];

  return (
    <components.Control
      {...props}
      innerProps={{
        ...props.innerProps,
        title: selected?.label || ""
      }}
    />
  );
};


/* ================= OPTION TOOLTIP ================= */

const TooltipOption = (props) => (
  <components.Option {...props}>
    <div title={props.data.label}>
      {props.children}
    </div>
  </components.Option>
);


/* ================= MAIN ================= */

const RequisitionPositionSelector = ({
  apiList = [],
  onRequisitionChange,
  onPositionChange,
  selectedRequisitionRaw,
  selectedPositionRaw
}) => {

  /* ===== SELECT STYLES — SAME AS INTERVIEWER SELECTOR ===== */

  const selectStyles = {
    control: (b) => ({
      ...b,
      fontSize: "12px",
      minHeight: "34px"
    }),

    valueContainer: (b) => ({
      ...b,
      padding: "2px 8px"
    }),

    input: (b) => ({
      ...b,
      fontSize: "12px"
    }),

    /* selected value — single line with ellipsis */
    singleValue: (b) => ({
      ...b,
      fontSize: "14px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%"
    }),

    /* dropdown options — allow wrap */
    option: (b) => ({
      ...b,
      fontSize: "14px",
      whiteSpace: "normal",
      lineHeight: "18px"
    }),

    placeholder: (b) => ({
      ...b,
      fontSize: "12px",
      color: "#6c757d"
    }),

    menu: (b) => ({
      ...b,
      fontSize: "12px"
    })
  };


  /* ===== Build requisition options ===== */

  const requisitions = useMemo(
    () => mapUniqueRequisitionsToDropdown(apiList),
    [apiList]
  );


  /* ===== derive selected requisition option ===== */

  const selectedRequisitionOption = useMemo(() => {
    if (!selectedRequisitionRaw) return null;

    const found = requisitions.find(
      r => r.value === selectedRequisitionRaw.requisition_id
    );

    if (found) return found;

    // fallback if not in list
    return {
      value: selectedRequisitionRaw.requisition_id,
      label: selectedRequisitionRaw.requisition_title,
      raw: selectedRequisitionRaw
    };

  }, [requisitions, selectedRequisitionRaw]);


  /* ===== Build positions based on selected requisition ===== */

  const positions = useMemo(() => {
    if (!selectedRequisitionOption) return [];

    return mapUniquePositionsToDropdown(
      apiList,
      selectedRequisitionOption.value
    );

  }, [apiList, selectedRequisitionOption]);


  /* ===== derive selected position option ===== */

  const selectedPositionOption = useMemo(() => {
    if (!selectedPositionRaw) return null;

    const found = positions.find(
      p => p.value === selectedPositionRaw.positionId
    );

    if (found) return found;

    return {
      value: selectedPositionRaw.positionId,
      label: selectedPositionRaw.positionName,
      raw: selectedPositionRaw
    };

  }, [positions, selectedPositionRaw]);


  /* ================= UI ================= */

  return (
    <div className="row g-3">

      {/* ===== Requisition ===== */}

      <div className="col-md-4">
        <label className="fs-14 blue-color">Requisition</label>

        <Select
          styles={selectStyles}
          components={{
            Control: TooltipControl,
            Option: TooltipOption
          }}
          className="mt-1 fs-14"
          classNamePrefix="react-select"
          isClearable
          placeholder="Select Requisition"
          options={requisitions}
          value={selectedRequisitionOption}
          onChange={(opt) => {
            onRequisitionChange?.(opt?.raw || null);
            onPositionChange?.(null);
          }}
        />
      </div>


      {/* ===== Position ===== */}

      <div className="col-md-4">
        <label className="fs-14 blue-color">Position</label>

        <Select
          styles={selectStyles}
          components={{
            Control: TooltipControl,
            Option: TooltipOption
          }}
          className="mt-1 fs-14"
          classNamePrefix="react-select"
          isClearable
          placeholder="Select Position"
          options={positions}
          value={selectedPositionOption}
          isDisabled={!selectedRequisitionOption}
          onChange={(opt) => {
            onPositionChange?.(opt?.raw || null);
          }}
        />
      </div>

    </div>
  );
};

export default RequisitionPositionSelector;
