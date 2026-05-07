export const mapMessagesData = (
  apiMessages = [],
  selectedRequisitionId,
  selectedPositionId,
  selectedRequisitionName,
  selectedPositionName,
  requestTypes = [],
  threadMessagesMap = {}
) => {

  // Create lookup map
  const requestTypeMap = {};
  requestTypes.forEach(rt => {
    requestTypeMap[rt.requestTypeId] = rt.requestName;
  });

  return (apiMessages || []).map((item, index) => {
    return {
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

rawStatus: item?.status,

      rawStatus: item?.status,

      rawStatus: item?.status,   

  
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

  
        comment: msg.message || msg.comments || "-",

        time: msg.createdDate
          ? new Date(msg.createdDate).toLocaleString()
          : "-",

        file: false,
      })),
    };
  });
};