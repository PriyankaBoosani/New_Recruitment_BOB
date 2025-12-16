// cityMapper.js

// SINGLE item (API → UI)
export const mapCityFromApi = (item) => ({
  id: item.city_id,
  name: item.city_name
});

// LIST (API → UI)
export const mapCitiesFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapCityFromApi);
};
