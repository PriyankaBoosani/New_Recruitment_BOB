export const mapInterviewCandidates = (
  apiData = [],
  centreMap = {},
  panelMap = {}
) => {
  return apiData.map((item) => {
    const schedule = item.interviewSchedules || {};

    return {

      candidateId: schedule.candidateId,
      applicationId: schedule.applicationId,
      id: schedule.interviewScheduleId,
      name: item.fullName || "-",
      regNo: item.applicationNo || "-",
     fileUrl: item.resumeUrl,


      date: schedule.interviewStartAt
        ? (() => {
          const d = new Date(schedule.interviewStartAt);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        })()
        : "-",


      time:
        schedule.interviewStartAt && schedule.interviewEndAt
          ? `${new Date(schedule.interviewStartAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(schedule.interviewEndAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
          : "-",

      zone:
        centreMap[schedule.zonalOfficeId] || "Unknown Centre",

      panel:
        panelMap[schedule.panelId] || "Unknown Panel",


      status: schedule.interviewStatus || "SCHEDULED",

      score: schedule.finalScore ?? "",

    };
  });
};
