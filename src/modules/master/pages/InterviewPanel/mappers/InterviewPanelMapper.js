export const mapInterviewPanelsApiToUI = (apiData, committeeMap) => {
  const apiList = Array.isArray(apiData) ? apiData : [];
  return apiList.map(item => {
    const panel = item.interviewPanelsDTO || {};
    const interviewers = item.interviewerDTOs || [];

    return {
      id: panel.interviewPanelId,
      name: panel.panelName || "-",
      community: committeeMap[panel.committeeId] || "-",
      communityId: panel.committeeId,
      members: interviewers.length ? interviewers.map(i => i.name).join(", ") : "-",
      memberNames: interviewers.map(i => i.name)
    };
  });
};

export const preparePanelPayload = (formData, membersOptions, isEditing, editingId) => {
  const interviewerIds = membersOptions
    .filter(m => formData.members.includes(m.name))
    .map(m => m.id);

  return {
    interviewPanelsDTO: {
      isActive: true,
      panelName: formData.name,
      description: "",
      committeeId: formData.community,
      interviewPanelId: isEditing ? editingId : ""
    },
    interviewerIds
  };
};