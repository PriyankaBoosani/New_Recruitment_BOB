
export const mapMessagesData = (
  apiMessages = [],
  selectedRequisitionId,
  selectedPositionId,
  selectedRequisitionName,
  selectedPositionName,
  requestTypes = [],
  threadMessagesMap = {}
) => {

  // ✅ Create lookup map
  const requestTypeMap = {};
  requestTypes.forEach(rt => {
    requestTypeMap[rt.requestTypeId] = rt.requestName;
  });

  return (apiMessages || []).map((item, index) => {
    return {
      // id: item?.conversationThreadId || index,
      id: item?.conversationThreadId,

      name: item?.candidateName || "",
      regNo: item?.applicationNo || "",

      requisitionId: selectedRequisitionId,
      requisitionName: selectedRequisitionName || "-",

      positionId: item?.positionId || selectedPositionId,
      positionName: selectedPositionName || "-",

      date: item?.createdDate
        ? item.createdDate.split("T")[0]
        : "-",

      time: item?.createdDate
        ? new Date(item.createdDate).toLocaleTimeString()
        : "-",

      status:
        item?.status === "PENDING"
          ? "Pending"
          : item?.status || "-",

      // ✅ FIX HERE
      type:
        item?.requestTypeName ||
        requestTypeMap[item?.requestTypeId] ||
        item?.requestTypeId ||
        "-",

      history: (threadMessagesMap[item?.conversationThreadId] || []).map(msg => ({
        type:
          msg.senderType === "CANDIDATE"
            ? "candidate"
            : "request",

        title: msg.senderType || "-",
        comment: msg.comments || "-",

        time: msg.createdDate
          ? new Date(msg.createdDate).toLocaleString()
          : "-",

        file: false,
      })),
    };
  });
};