const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const mapOnboardingPoolCandidates = (content = []) => {
  return content.map((candidate, index) => ({
    id: `${candidate.applicationNo}-${index}`,

    candidate: candidate.candidateName || "-",

    applicationNo: candidate.applicationNo || "-",

    offerLetterNo: candidate.letterNumber || "-",

    offerReleaseDate: formatDate(candidate.offerReleaseDate),

    acceptBeforeDate: formatDate(candidate.offerAcceptanceDate),

    offerExtendedDate: formatDate(candidate.offerExtendedDate),

    joiningDate: formatDate(candidate.joiningDate),

    onboardingStatus: candidate.applicationStatus || "-",

    medicalStatus: candidate.medicalStatus || "-",
  }));
};