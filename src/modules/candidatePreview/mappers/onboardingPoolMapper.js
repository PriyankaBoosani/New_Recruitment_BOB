const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatusLabel = (status) => {
  if (!status) return "-";

  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
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

    // Display value
    onboardingStatus:
      formatStatusLabel(candidate.applicationStatus),

    // Keep original backend value for badge color
    onboardingStatusCode: candidate.applicationStatus || "",

    medicalStatus:  "-",
  }));
};