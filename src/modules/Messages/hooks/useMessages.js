import { useState } from "react";

export const useMessages = () => {
  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [date, setDate] = useState("");
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  // ✅ MOVE THIS HERE (reusable everywhere)
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "msg-status-approved";
      case "Rejected":
        return "msg-status-rejected";
      default:
        return "msg-status-default";
    }
  };

  // ✅ MOVE THIS HERE
  const getHistoryColor = (type) => {
    return type === "request" ? "#ff9800" : "#2196f3";
  };

  return {
    selectedRequisitionId,
    selectedPositionId,
    date,
    openRow,
    setSelectedRequisitionId,
    setSelectedPositionId,
    setDate,
    toggleRow,

    // ✅ expose reusable helpers
    getStatusClass,
    getHistoryColor
  };
};