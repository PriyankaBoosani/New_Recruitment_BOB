import React, { useMemo } from "react";
import Select from "react-select";

export default function InterviewerPositionSelector({
  apiData = [],
  selectedRequisition,
  selectedPosition,
  onRequisitionChange,
  onPositionChange
}) {

  /* ===== requisition options ===== */

const requisitionOptions = useMemo(() => {
  const map = new Map();

  apiData.forEach(r => {
    const req = r?.requisition;
    if (!req?.id) return;

    if (!map.has(req.id)) {
      map.set(req.id, {
        value: req.id,
        label: `${req.requisitionCode} — ${req.requisitionTitle}`,
        raw: r
      });
    }
  });

  return Array.from(map.values());
}, [apiData]);



  /* ===== position options ===== */

const positionOptions = useMemo(() => {
  if (!selectedRequisition) return [];

  return apiData
    .filter(r => r.requisition.id === selectedRequisition.requisition.id)
    .map(r => ({
      value: r.position.positionId,
      label: r.masterPosition.positionName,
      raw: r
    }));

}, [apiData, selectedRequisition]);
console.log("SELECTOR apiData:", apiData);
console.log("requisitionOptions:", requisitionOptions);


  return (
    <div className="row g-3">

      <div className="col-md-6">
        <label>Requisition</label>
        <Select
          options={requisitionOptions}
value={requisitionOptions.find(
  o => o.value === selectedRequisition?.requisition?.id
)}
          isClearable
          placeholder="Select Requisition"
       onChange={(opt) => {
onRequisitionChange(opt?.raw || null);
  onPositionChange(null);
}}

        />
      </div>

      <div className="col-md-6">
        <label>Position</label>
        <Select
          options={positionOptions}
value={positionOptions.find(o =>
  o.value === selectedPosition?.position?.positionId
)}

          isClearable
          isDisabled={!selectedRequisition}
          placeholder="Select Position"
          onChange={(opt) => {
            onPositionChange(opt?.raw || null);
          }}
        />
      </div>

    </div>
  );
}
