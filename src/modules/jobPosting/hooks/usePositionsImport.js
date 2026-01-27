// src/modules/jobPostings/hooks/usePositionsImport.js
import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";

export const usePositionsImport = () => {
  const [loading, setLoading] = useState(false);

  /* ================= UPLOAD ================= */
  const bulkAddPositions = async (file) => {
    setLoading(true);

    try {
      //  PASS FILE DIRECTLY
      const res = await jobPositionApiService.bulkImport(file);

      if (res?.success === false) {
        return {
          success: false,
          error: res.data,
          details: res.data || [],
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err?.response?.data?.message ||
          "Failed to import positions",
      };
    } finally {
      setLoading(false);
    }
  };


  /* ================= DOWNLOAD ================= */
  const downloadPositionTemplate = async () => {
    try {
      const res = await jobPositionApiService.downloadTemplate();

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = "JobPositionsExcelModel_template.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Template download failed", err);
    }
  };


  return {
    bulkAddPositions,
    downloadPositionTemplate,
    loading,
  };
};
