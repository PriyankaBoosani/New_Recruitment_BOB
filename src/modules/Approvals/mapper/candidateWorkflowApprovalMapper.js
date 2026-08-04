export const mapWorkflowApprovalCandidates = (
  apiData = {},
  stage = "SCREENING"
) => {
  const formatStatus = (status = "") =>
    status
      .toLowerCase()
      .split("_")
      .map((word) => {
        if (word === "l1" || word === "l2") {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

  if (stage === "INTERVIEW") {
    return (apiData.content || []).map((item) => ({
      id: item.interviewSchedules?.interviewScheduleId,
      name: item.fullName,
      appNo: item.application?.applicationNo,
      category: item.categoryName,
      zone: item.center?.displayName || "-",
      panel: item.panel?.panelName || "-",
      score: item.interviewSchedules?.finalScore || "-",
      status: formatStatus(item.interviewSchedules?.interviewStatus),
      approvalStatus: formatStatus(item.workflowStatus),

      fileUrl: item.resumeUrl,
      candidateId: item.application?.candidateId,
      positionId: item.application?.positionId,
      applicationId: item.application?.id,
      posStageWorkflowId: item.posStageWorkflowId,
    }));
  }

  return (apiData.content || []).map((item) => ({
    id: item.candidateApplications?.id,
    name: item.fullName,
    appNo: item.candidateApplications?.applicationNo,
      category: item.categoryName,
    exp: item.totalMonths
      ? `${Math.floor(item.totalMonths / 12)} Years ${
          item.totalMonths % 12
        } Months`
      : "-",
    result: formatStatus(item.candidateApplications?.applicationStatus),
    workflowStatus: formatStatus(item.workflowStatus),

    fileUrl: item.resumeUrl,
    email: item.email,
    candidateId: item.candidateApplications?.candidateId,
    positionId: item.candidateApplications?.positionId,
    applicationId: item.candidateApplications?.id,
    posStageWorkflowId: item.posStageWorkflowId,
  }));
};