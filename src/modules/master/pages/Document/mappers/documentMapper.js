// src/modules/master/pages/Document/mappers/documentMapper.js
import { cleanData } from "../../../../../shared/utils/common-validations";
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
  documentName:  cleanData(ui.name),
  documentDesc: cleanData(ui.description)
});
