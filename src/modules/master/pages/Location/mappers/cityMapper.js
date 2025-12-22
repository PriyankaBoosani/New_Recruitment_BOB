export const mapCitiesFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map(city => ({
    id: city.cityId,        // UUID
    name: city.cityName
  }));
};
