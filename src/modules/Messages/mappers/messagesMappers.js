// export const mapMessagesData = (
//   apiMessages = [],
//   selectedRequisitionId,
//   selectedPositionId,
//   selectedRequisitionName,
//   selectedPositionName
// ) => {
//   return (apiMessages || []).map((item, index) => {
//     const thread = item.message?.conversationThreads;
//     const msgs = item.message?.conversationMessages || [];
//     const candidate = item.candidateProfileEntity;

//     return {
//       id: thread?.conversationThreadId || index,

//       name: `${candidate?.firstName || ""} ${candidate?.lastName || ""}`.trim(),
//       regNo: candidate?.registrationNo,

//       // ✅ keep filters working
//       requisitionId: selectedRequisitionId,
//       requisitionName: selectedRequisitionName || "-",

//       positionId: selectedPositionId,
//       positionName: selectedPositionName || "-",

//       date: thread?.createdDate
//         ? thread.createdDate.split("T")[0]
//         : "-",

//       time: thread?.createdDate
//         ? new Date(thread.createdDate).toLocaleTimeString()
//         : "-",


//       status:
//         thread?.status?.toUpperCase() === "PENDING"
//           ? "Pending"
//           : thread?.status || "-",


//       type: thread?.initiatedBy || "-",

//       history: msgs.map((msg) => ({

//         type:
//           msg.senderType?.toLowerCase() === "candidate"
//             ? "candidate"
//             : "request",

//         title: msg.senderType || "-",
//         comment: msg.message || "-",

//         time: msg.createdDate
//           ? new Date(msg.createdDate).toLocaleString()
//           : "-",

//         file: !!msg.attachmentPath,
//       })),
//     };
//   });
// };


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