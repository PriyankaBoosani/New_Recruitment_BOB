export const validateRequisitionSubmission = ({
  requisitions,
  selectedReqIds,
}) => {
  const errors = [];

  const selected = requisitions.filter(r =>
    selectedReqIds.has(r.id)
  );

  if (selected.length === 0) {
    errors.push("No requisitions selected for the current year.");
    return errors;
  }

  const noPositionReqs = selected.filter(
    r => Number(r.positions) === 0
  );

  if (noPositionReqs.length > 0) {
    const labels = noPositionReqs
      .map(r => r.code || r.requisitionId)
      .join(", ");

    errors.push(
      `Submission blocked. No positions found for requisition(s): ${labels}`
    );
  }

  return errors;
};
