export const mapCommitteeOverview = (data) => {
  const committee = data?.committeeOverview?.[0] || {};

  return {
    interviewPanel: committee.total_interview_panels || 0,
    screeningPanel: committee.total_screening_panels || 0,
    compensationPanel: committee.total_compensation_panels || 0,

    interviewPanels:
      data?.interviewPanels?.map((item) => ({
        panelName: item.panel_name,
        positionsAssigned: item.positions_assigned,
        avgTurnaroundDays: item.avg_turnaround_days,
      })) || [],

    screeningPanels:
      data?.screeningPanels?.map((item) => ({
        panelName: item.panel_name,
        positionsAssigned: item.positions_assigned,
        avgScreeningDays: item.avg_screening_days,
      })) || [],

    compensationPanels:
      data?.compensationPanels?.map((item) => ({
        panelName: item.panel_name,
        positionsAssigned: item.positions_assigned,
        offersReviewed: item.offers_reviewed,
      })) || [],
  };
};
