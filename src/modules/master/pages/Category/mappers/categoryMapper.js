// src/modules/master/pages/Category/mappers/categoryMapper.js

/* =========================
   API → UI
========================= */
export const mapCategoryFromApi = (api) => ({
  id: api.reservationCategoriesId,
  code: api.categoryCode,
  name: api.categoryName,
  description: api.categoryDesc,
  createdDate: api.createdDate,
  isActive: api.isActive
});

/* =========================
   API LIST → UI LIST
========================= */
export const mapCategoriesFromApi = (list = []) => {
  if (!Array.isArray(list)) return [];
  return list.map(mapCategoryFromApi);
};

/* =========================
   UI → API
========================= */
export const mapCategoryToApi = (ui, options = {}) => {
  const { id = null } = options;

  return {
    reservationCategoriesId: id,
    isActive: true,
    categoryCode: ui.code,
    categoryName: ui.name,
    categoryDesc: ui.description
  };
};
