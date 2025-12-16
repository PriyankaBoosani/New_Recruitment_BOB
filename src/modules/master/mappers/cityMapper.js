export const mapCityFromApi = (apiCity) => ({
  id: apiCity.city_id,
  name: apiCity.city_name,
  stateId: apiCity.state_id
});
