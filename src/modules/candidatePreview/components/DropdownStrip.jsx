import React, { useMemo } from "react";
import Select from "react-select";

export default function DropdownStrip({
  requisitions,
  positions,
  selectedRequisitionId,
  selectedPositionId,
  loadingRequisitions,
  loadingPositions,
  onRequisitionChange,
  onPositionChange,
	onRequisitionSearch
}) {
	const requisitionOptions = useMemo(
    () =>
      requisitions.map((req) => ({
        value: req.id,
        label: `${req.requisitionCode} - ${req.requisitionTitle}`,
      })),
    [requisitions]
  );

  const positionOptions = useMemo(
    () =>
      positions.map((pos) => ({
        value: pos.jobPositions.positionId,
        label: pos?.masterPositions?.positionName,
      })),
    [positions]
  );

  return (
    <>
      <div className="col-md-3 col-12">
        <label className="fs-14 blue-color">Requisition</label>
        <Select
					className="mt-1 fs-14"
					classNamePrefix="react-select"
					options={requisitionOptions}
					isLoading={loadingRequisitions}
					isClearable
					placeholder="Select Requisition"
					value={requisitionOptions.find(
						(opt) => opt.value === selectedRequisitionId
					)}
					onInputChange={(inputValue, actionMeta) => {
						if (actionMeta.action === "input-change") {
							onRequisitionSearch(inputValue);
						}
					}}
					onChange={(option) =>
						onRequisitionChange({
							target: { value: option ? option.value : "" },
						})
					}
				/>
      </div>

      <div className="col-md-3 col-12">
        <label className="fs-14 blue-color">Position</label>
        <Select
          className="mt-1 fs-14"
          classNamePrefix="react-select"
          options={positionOptions}
          isLoading={loadingPositions}
          isDisabled={!selectedRequisitionId}
          isClearable
          placeholder={
            loadingPositions ? "Loading positions..." : "Select Position"
          }
          value={
            selectedPositionId
              ? positionOptions.find(opt => opt.value === selectedPositionId)
              : null
          }
          onChange={(option) =>
            onPositionChange(option ? option.value : "")
          }
        />
      </div>
    </>
  );
}
