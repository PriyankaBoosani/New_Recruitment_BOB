// Location mapper (API → UI)
export const mapLocationsFromApi = (apiData = [], cities = []) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map(item => {
    const city = cities.find(c => c.id === item.city_id);

    return {
      id: item.location_id,
      name: item.location_name,
      cityId: item.city_id,
      cityName: city?.name || ''
    };
  });
};



// UI → API (Add / Update)
export const mapLocationToApi = (formData) => {
  return {
    location_name: formData.name.trim(),
    city_id: Number(formData.cityId)
  };
};
