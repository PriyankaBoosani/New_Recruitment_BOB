import { useEffect, useState, useCallback } from "react";
import jobPositionApiService from "../services/jobPositionApiService";

export const useJobPositionById = (positionId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
//const res = await jobPositionApiService.getPositionById(positionId);
  const fetchPosition = useCallback(async () => {
  if (!positionId) return;

  setLoading(true);

  try {

    const res = await jobPositionApiService.getPositionById(positionId);
    console.log("res",res);
  
    // ✅ CORRECT
    setData(res.data);

  } catch (e) {
    console.error("Failed to fetch position", e);
  } finally {
    setLoading(false);
  }
}, [positionId]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  return {
    data,
    loading,
    refetch: fetchPosition, // 🔑 THIS IS WHAT YOU WERE MISSING
  };
};
