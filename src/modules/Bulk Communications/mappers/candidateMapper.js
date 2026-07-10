export const formatCandidateData = (
  apiData,
  categoryMap = {},
  stateMap = {}
) => {
  const formatStatus = (status = "") =>
    status.charAt(0) + status.slice(1).toLowerCase();

  return (apiData?.content || []).map((c) => ({
    id: c.candidateApplications.id,
    name: c.fullName,
    rank: c.rank,
    experienceMonths: c.totalMonths || 0,
    status: formatStatus(c.candidateApplications.applicationStatus),
    applicationNo: c.candidateApplications.applicationNo,
    candidateId: c.candidateApplications.candidateId,
    positionId: c.candidateApplications.positionId,
    fileUrl: c.resumeUrl,
    categoryName: categoryMap[c.categoryId] || "-",
    location: stateMap[c.stateId] || "-",
    totalMarksObtained: c.totalMarksObtained,
    examQualificationStatus: c.examQualificationStatus,
    finalScore: c.candidateRankingResults?.finalScore ?? "-",
    educationScore: c.candidateRankingResults?.educationScore ?? "-",
    experienceScore: c.candidateRankingResults?.experienceScore ?? "-",
    educationSimilarity:
      c.candidateRankingResults?.educationSimilarity ?? "-",
    experienceSimilarity:
      c.candidateRankingResults?.experienceSimilarity ?? "-",
  }));
};