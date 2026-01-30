export const mapInterviewPanelsApiToUI = (list = []) => {
  return list.map((panel, index) => ({
    id: panel.interviewPanelId,
    panelName: panel.panelName,
    panelType: panel.committee?.committeeName || "-",

    members:
      panel.panelMembers?.length > 0
        ? panel.panelMembers
            .map(m => m.panelMember?.name)
            .join(", ")
        : "-",

    memberIds:
      panel.panelMembers?.map(m => m.panelMember?.userId) || []
  }));
};


export const mapPanelToFormData = (panel) => {
  return {
    id: panel.interviewPanelId,
    name: panel.panelName || "",
    community: panel.committee?.interviewCommitteeId || "",
    members:
      panel.panelMembers?.map(m => m.panelMember?.userId) || []
  };
};


export const preparePanelPayload = (
  formData,
  communityOptions,
  membersOptions
) => {
  const selectedCommittee = communityOptions.find(
    c => c.id === formData.community
  );

  const selectedMembers = membersOptions.filter(m =>
    formData.members.includes(m.value)
  );

  return {
    panelName: formData.name,
    description: formData.description || "",

    committee: {
      committeeName: selectedCommittee?.name || "",
      committeeDesc: "",
      interviewCommitteeId: selectedCommittee?.id
    },

    panelMembers: selectedMembers.map(m => ({
      panelMember: {
        userId: m.value,
        name: m.label,
        role: m.role || "",
        email: m.email || ""
      }
    }))
  };
};


export const mapPanelsApi = (list = []) => {
  return list.map(panel => ({
    id: panel.interviewPanelId,
    name: panel.panelName,
    committeeId: panel.committee?.interviewCommitteeId,
    committeeName: panel.committee?.committeeName,

    members:
      panel.panelMembers?.map(
        m => m.panelMember?.name
      ) || []
  }));
};
