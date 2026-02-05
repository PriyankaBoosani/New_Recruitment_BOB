/* ================= STATUS MAP ================= */

const STATUS_MAP = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  PROVISIONALLY_APPROVED: "Provisionally Approved",
};

/* ================= TIME FORMAT ================= */

const formatTime = (s, e) => {
  if (!s || !e) return "-";

  const start = new Date(s);
  const end = new Date(e);

  const startStr = start
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/ AM| PM/, "")
    .toUpperCase();

  const endStr = end
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  return `${startStr} – ${endStr}`;
};


/* ================= REQUISITIONS ================= */

export const mapUniqueRequisitionsToDropdown = (list = []) => {
  const map = new Map();

  list.forEach((c) => {
    if (!map.has(c.requisitionId)) {
      map.set(c.requisitionId, {
        value: c.requisitionId,
        label: c.requisitionTitle,
        raw: {
          requisition_id: c.requisitionId,
          requisition_title: c.requisitionTitle,
          registration_start_date: c.requisitionStartDate,
          registration_end_date: c.requisitionEndDate,
        },
      });
    }
  });

  return Array.from(map.values());
};

/* ================= POSITIONS ================= */

export const mapUniquePositionsToDropdown = (list = [], requisitionId) => {
  const map = new Map();

  list
    .filter((c) => c.requisitionId === requisitionId)
    .forEach((c) => {
      if (!map.has(c.positionId)) {
        map.set(c.positionId, {
          value: c.positionId,
          label: c.positionTitle,
          raw: {
            positionId: c.positionId,
            positionName: c.positionTitle,
          },
        });
      }
    });

  return Array.from(map.values());
};

/* ================= TABLE ROWS ================= */

export const mapCandidatesToTableRows = (list = []) => {
  return list.map((c) => ({
    id: c.interviewScheduleId,
    name: c.candidateName,
    regNo: c.applicationNumber,
    category: c.categoryCode || "-",
    time: formatTime(c.interviewStartAt, c.interviewEndAt),
    zone : "Zone-1", 
    // zone: c.zonalOfficeName,
    absent: c.isAbsent,
    status: STATUS_MAP[c.zonalVerificationStatus] || c.zonalVerificationStatus,
    raw: c,
  }));
};
