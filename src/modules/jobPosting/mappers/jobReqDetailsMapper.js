const isEditableStatus = ["NEW", "L1_REJECTED", "L2_REJECTED"];

export const mapJobRequisitionFromApi = (item = {}) => {
  const rawStatus = item.requisitionStatus ?? "";

  // ✅ DEFINE HERE (not outside)
  const isRejected = rawStatus === "L1_REJECTED" || rawStatus === "L2_REJECTED";

  return {
    id: item.id ?? "",
    requisitionId: item.requisitionCode ?? "",
    code: item.requisitionTitle ?? "",

    status: rawStatus,
    statusType: getStatusBadge(rawStatus),

    departments: item.departmentCount ?? 0,
    positions: item.positionCount ?? 0,
    vacancies: item.vacancyCount ?? 0,

    startDate: item.startDate ?? "-",
    endDate: item.endDate ?? "-",
    hasDraftPositions: item.hasDraftPositions === true,

    editable: isEditableStatus.includes(rawStatus),

    // ✅ now works
    isRejected,
  };
};
const getStatusBadge = (status = "") => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "L1_REJECTED":
    case "L2_REJECTED":
      return "danger";
    case "NEW":
      return "warning";
    case "L1_PENDING":
      return "yellowwarning";
    case "L1_APPROVED":
      return "info";
    default:
      return "secondary";
  }
};
