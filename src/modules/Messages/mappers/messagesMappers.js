export const mapMessagesData = (
  apiMessages = [],
  selectedRequisitionId,
  selectedPositionId,
  selectedRequisitionName,
  // selectedPositionName,
  positions = [],
  requestTypes = [],
  threadMessagesMap = {}
) => {
  const requestTypeMap = {};
  requestTypes.forEach((rt) => {
    requestTypeMap[rt.requestTypeId] = rt.requestName;
  });

  return (apiMessages || []).map((item) => {
    const createdDate = item?.createdDate ? new Date(item.createdDate) : null;

    return {
      id: item?.conversationThreadId,

      name: item?.candidateName || "",
      regNo: item?.applicationNo || "",

      requisitionId: selectedRequisitionId,
      requisitionName: selectedRequisitionName || "-",

      // positionId: item?.positionId || selectedPositionId,
      // positionName: selectedPositionName || "-",
      positionId: item?.positionId || "",

      positionName:
        positions.find((p) => p.jobPositions?.positionId === item?.positionId)?.masterPositions
          ?.positionName || "-",

      date: createdDate ? createdDate.toISOString().split("T")[0] : "-",

      time: createdDate
        ? createdDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",

      status: (() => {
        switch (item?.status) {
          case "PENDING":
            return "Pending";
          case "L1_PENDING":
            return "L1 Pending";
          case "L1_APPROVED":
            return "L1 Approved";
          case "L1_REJECTED":
            return "L1 Rejected";
          case "L2_PENDING":
            return "L2 Pending";
          case "L2_APPROVED":
            return "L2 Approved";
          case "L2_REJECTED":
            return "L2 Rejected";
          case "REJECTED":
            return "Rejected";
          default:
            return item?.status || "-";
        }
      })(),

      rawStatus: item?.status, // ✅ only once

      type:
        item?.requestTypeName || requestTypeMap[item?.requestTypeId] || item?.requestTypeId || "-",

      history: (threadMessagesMap[item?.conversationThreadId] || []).map((msg) => {
        const msgDate = msg?.createdDate ? new Date(msg.createdDate) : null;

        return {
          type: msg.senderType === "CANDIDATE" ? "candidate" : "request",
          title: msg.senderType || "-",
          comment: msg.message || msg.comments || "-",
          attachmentPath: msg.attachmentPath || null,

          time: msgDate
            ? msgDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "-",

          file: false,
        };
      }),
    };
  });
};
