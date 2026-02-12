/* ================= PANEL POSITIONS ================= */

export const mapPanelPositions = (list = []) =>
  list.map(item => ({
    requisition: item.requisition,   // ✅ FULL OBJECT

    position: {
      positionId: item.position?.positionId,
      requisitionId: item.position?.requisitionId
    },

    masterPosition: {
      positionName: item.masterPosition?.positionName,
      positionCode: item.masterPosition?.positionCode
    },

    raw: item
  }));


/* ================= INTERVIEWER CANDIDATES ================= */

/* ================= INTERVIEWER CANDIDATES ================= */

/* ================= INTERVIEWER CANDIDATES ================= */

export const mapInterviewerCandidates = (list = []) => {
  console.log("🗺️ MAPPING INPUT LIST:", list);

  return list.map((item, idx) => {

    console.log("➡️ Mapping item:", item);
    console.log("✅ SAVE FIELDS:", {
  panelId: item.interviewSchedule?.panelId,
  centerId: item.interviewCentre?.interviewCentreId
});


    const start = item.interviewSchedule?.interviewStartAt;

    return {
      id: item.application?.id || idx,

      name: item.candidate?.fullName || "-",
      regNo: item.application?.applicationNo || "-",

      category:
        item.category?.categoryCode ||
        item.category?.categoryName ||
        "-",

      time: start
        ? new Date(start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        : "-",

      zone:
        item.interviewCentre?.zone ||
        item.interviewCentre?.interviewCentre ||
        "-",

      absent: item.application?.isAbsent ?? false,
      score: item.panelScore ?? "",
      comment: item.panelComments ?? "",

      raw: {
        applicationId: item.application?.id,
        candidateId: item.candidate?.candidateId,
         interviewScheduleId:
    item.interviewSchedule?.interviewScheduleId,

     panelId:
    item.interviewSchedule?.panelId,   //  FIXED

  interviewCenterId:
    item.interviewCentre?.interviewCentreId,



  interviewCenterId:
    item.interviewCentre?.interviewCentreId,
        positionId: item.application?.positionId,
        resumeUrl: item.resumeUrl,
        full: item
      }
    };
  });
};


