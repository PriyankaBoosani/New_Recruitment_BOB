import { useEffect, useState } from "react";
import i18n from "i18next";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";
import {
  mapLocationsFromApi,
  mapLocationToApi
} from "../mappers/locationMapper";
import { mapCitiesFromApi } from "../mappers/cityMapper";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch cities
  const fetchCities = async () => {
    const res = await masterApiService.getallCities();
    const apiList = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    setCities(mapCitiesFromApi(apiList));
  };

  // 🔹 Fetch locations
  const fetchLocations = async (citiesList = cities) => {
    const res = await masterApiService.getAllLocations();
    const apiList = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    const mapped = mapLocationsFromApi(apiList, citiesList);

    // newest first (same as Department)
    mapped.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    setLocations(mapped);
  };

  // init
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCities();
      setLoading(false);
    };
    init();
  }, []);

  // once cities are loaded → load locations
  useEffect(() => {
    if (cities.length) {
      fetchLocations(cities);
    }
  }, [cities]);
  
  // ➕ Add
const addLocation = async (payload) => {
  await masterApiService.addLocation(mapLocationToApi(payload));
  await fetchLocations();
  toast.success(i18n.t("add_success", { ns: "location" }));
};

// ✏ Update
const updateLocation = async (id, payload) => {
  await masterApiService.updateLocation(id, mapLocationToApi(payload));
  await fetchLocations();
  toast.success(i18n.t("update_success", { ns: "location" }));
};

// ❌ Delete
const deleteLocation = async (id) => {
  await masterApiService.deleteLocation(id);
  await fetchLocations();
  toast.success(i18n.t("delete_success", { ns: "location" }));
};



  return {
    locations,
    cities,
    loading,
    addLocation,
    updateLocation,
    deleteLocation
  };
};
