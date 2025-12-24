// src/modules/master/pages/JobGrade/hooks/useJobGrades.js

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import masterApiService from '../../../services/masterApiService';
import { mapJobGradesFromApi } from '../mappers/jobGradeMapper';

export const useJobGrades = () => {
  const { t } = useTranslation(['jobGrade']);
  const [jobGrades, setJobGrades] = useState([]);

  const fetchJobGrades = async () => {
    try {
      const res = await masterApiService.getAllJobGrades();
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const sorted = [...list].sort((a, b) => {
        const da = new Date(a.createdDate || 0).getTime();
        const db = new Date(b.createdDate || 0).getTime();
        return db - da;
      });

      setJobGrades(mapJobGradesFromApi(sorted));
    } catch {
      toast.error(t("fetch_error"));
    }
  };

  useEffect(() => {
    fetchJobGrades();
  }, []);

  /* ================= ADD ================= */
  const addJobGrade = async (payload) => {
    try {
      await masterApiService.addJobGrade(payload);
      await fetchJobGrades();
      toast.success(t("add_success"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("add_error"));
    }
  };

  /* ================= UPDATE ================= */
  const updateJobGrade = async (id, payload) => {
    try {
      await masterApiService.updateJobGrade(id, payload);
      await fetchJobGrades();
      toast.success(t("update_success"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("update_error"));
    }
  };

  /* ================= DELETE ================= */
  const deleteJobGrade = async (id) => {
    try {
      await masterApiService.deleteJobGrade(id);
      await fetchJobGrades();
      toast.success(t("delete_success"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("delete_error"));
    }
  };

    /* =========================
     DOWNLOAD TEMPLATE
  ========================= */
  const downloadJobGradeTemplate = async () => {
    try {
      const res = await masterApiService.downloadJobGradeTemplate();

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "JobGrade_Template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error(
        t("jobGrade:download_error") || "Download failed"
      );
    }
  };

  /* =========================
     BULK IMPORT
  ========================= */
  const bulkAddJobGrades = async (file) => {
    try {
      const res = await masterApiService.bulkAddJobGrades(file);

      toast.success(
        res?.data?.message ||
        t("jobGrade:import_success")
      );

      await fetchJobGrades();
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        t("jobGrade:import_error")
      );
      return { success: false };
    }
  };


  return {
    jobGrades,
    fetchJobGrades,
    addJobGrade,
    updateJobGrade,
    deleteJobGrade,
     bulkAddJobGrades,
  downloadJobGradeTemplate
  };
};
