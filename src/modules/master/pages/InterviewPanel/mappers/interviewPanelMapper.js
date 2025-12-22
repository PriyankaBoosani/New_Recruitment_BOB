// src/modules/master/pages/InterviewPanel/mappers/interviewPanelMapper.js

export const mapInterviewPanelFromApi = (api) => ({
  id: api.panel_id,
  name: api.panel_name,
  members: api.interviewer_names?.join(', ') || '',
  membersArray: api.interviewer_names || []
});

export const mapInterviewPanelsFromApi = (apiData = []) =>
  apiData.map(mapInterviewPanelFromApi);

export const mapInterviewPanelToApi = (ui) => ({
  panel_name: ui.name,
  interviewer_ids: ui.members // array of user IDs OR names (backend dependent)
});
