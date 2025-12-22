// src/modules/master/pages/Document/mappers/documentMapper.js

// API → UI
export const mapDocumentFromApi = (api) => ({
  id: api.documentTypeId,
  name: api.documentName,
  description: api.documentDesc,
  isActive: api.isActive
});

// LIST
export const mapDocumentsFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapDocumentFromApi);
};

// UI → API
export const mapDocumentToApi = (ui) => ({
  documentName: ui.name,
  documentDesc: ui.description
});
