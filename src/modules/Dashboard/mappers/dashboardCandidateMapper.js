export const mapCandidatePipeline = (data = {}) => {
  const pipeline = data?.candidatePipeline?.[0] || {};

  const candidateRegistration = data?.candidateRegistration?.[0] || {};
  console.log("cabd", candidateRegistration);

  const pipelineDetails =
    data?.pipelineDetails?.map((item) => ({
      requisitionId: item.requisition_code,
      department: item.department,
      position: item.position_name,
      vacancyCount: item.vacancy_count,

      applicationsReceived: item.applications_received,
      shortlistedCandidates: item.shortlisted_candidates,
      rejectedCandidates: item.rejected_candidates,
      pendingCandidates: item.pending_candidates,

      interviewsScheduled: item.interviews_scheduled,
      interviewsCompleted: item.interviews_completed,

      qualified: item.qualified_candidates,

      offersSent: item.offers_sent,
      offerAccepted: item.offer_accepted,
      offerRejected: item.offer_rejected,

      joined: item.joined,
    })) || [];

  const departmentColors = [
    "#D90429",
    "#1482BE",
    "#0D3B94",
    "#16A34A",
    "#F97316",
    "#8B5CF6",
    "#0891B2",
  ];

  const applicationsByDepartment =
    data?.applicationsByDepartment?.map((item, index) => ({
      department: item.department_name,
      value: item.num_applications,
      color: departmentColors[index % departmentColors.length],
    })) || [];

  const monthlyTrends =
    data?.monthlyTrends?.map((item) => ({
      month: new Date(item.month).toLocaleString("default", {
        month: "short",
      }),
      registrations: item.candidate_registrations || 0,
      interviews: item.interviews_completed || 0,
      requisitions: item.requisitions_created || 0,
      offers: item.offers_sent || 0,
      offerAccepted: item.offer_accepted || 0,
      candidatesJoined: item.candidates_joined || 0,
    })) || [];

  return {
    totalVacancies: pipeline.total_vacancies || 0,
    applicationsReceived: pipeline.applications_received || 0,
    shortlistedCandidates: pipeline.shortlisted_candidates || 0,
    rejectedCandidates: pipeline.rejected_candidates || 0,
    pendingCandidates: pipeline.pending_candidates || 0,
    interviewsScheduled: pipeline.interviews_scheduled || 0,
    interviewsCompleted: pipeline.interviews_completed || 0,
    qualified: pipeline.qualified || 0,
    offersSent: pipeline.offers_sent || 0,
    offerAccepted: pipeline.offer_accepted || 0,
    offerRejected: pipeline.offer_rejected || 0,
    joined: pipeline.joined || 0,

    candidateRegistration: {
      totalCandidates: candidateRegistration.total_candidates || 0,
      registeredOnly: candidateRegistration.registered_only || 0,
      profileCompleted: candidateRegistration.profile_completed || 0,
      appliedCandidates: candidateRegistration.applied_candidates || 0,
    },

    pipelineDetails,
    applicationsByDepartment,
    monthlyTrends,
  };
};
