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

export const mapInterviewerCandidates = (list = []) =>
  list.map((item, idx) => ({
    id: item.application?.id || idx,

    name: item.candidate?.fullName || "",
    regNo: item.application?.applicationNo || "",

    absent: item.application?.isAbsent || false,

    score: item.panelScore ?? "",
    comment: item.panelComments ?? "",

    raw: {
      applicationId: item.application?.id,
      positionId: item.application?.positionId,
      resumeUrl: item.resumeUrl,
      interview: item.interviewSchedule,
      candidate: item.candidate,
      application: item.application,
      full: item
    }
  }));
