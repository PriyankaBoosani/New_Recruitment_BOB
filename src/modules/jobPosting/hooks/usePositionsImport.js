// src/modules/jobPostings/hooks/usePositionsImport.js
import { useState } from "react";
import requisitionApiService from "../services/requisitionApiService";

export const usePositionsImport = () => {
  const [loading, setLoading] = useState(false);

  const bulkAddPositions = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await requisitionApiService.bulkImport(formData);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error:
          err?.response?.data?.message || "Failed to import positions",
      };
    } finally {
      setLoading(false);
    }
  };

  const downloadPositionTemplate = async () => {
    await requisitionApiService.downloadTemplate();
  };

  return {
    bulkAddPositions,
    downloadPositionTemplate,
    loading,
  };
};
