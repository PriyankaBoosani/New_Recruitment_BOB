export const mapLocationFromApi = (apiLoc, cities = []) => {
  const city = cities.find(c => c.id === apiLoc.city_id);

  return {
    id: apiLoc.location_id,
    cityId: apiLoc.city_id,
    cityName: city?.name || '',
    name: apiLoc.location_name
  };
};

// UI → API
export const mapLocationToApi = (uiLoc) => ({
  city_id: Number(uiLoc.cityId),
  location_name: uiLoc.name
});