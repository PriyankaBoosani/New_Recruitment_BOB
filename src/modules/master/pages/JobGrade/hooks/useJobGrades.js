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

  return {
    jobGrades,
    fetchJobGrades,
    addJobGrade,
    updateJobGrade,
    deleteJobGrade
  };
};
