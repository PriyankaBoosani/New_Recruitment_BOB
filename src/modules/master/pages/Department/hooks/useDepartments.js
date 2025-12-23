import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import masterApiService from '../../../services/masterApiService';
import { mapDepartmentsFromApi } from "../mappers/departmentMapper";
import { useTranslation } from 'react-i18next';

export const useDepartments = () => {
  const { t } = useTranslation(["department", "validation"]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortByCreatedDate = (list) =>
    [...list].sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

  const fetchDepartments = async () => {
  try {
    const res = await masterApiService.getAllDepartments();

    const apiList = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    const mapped = mapDepartmentsFromApi(apiList);

    // 🔽 newest first
    mapped.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    setDepartments(mapped);
  } catch (err) {
    console.error("Department fetch failed", err);
    setDepartments([]);
  }
};
const bulkAddDepartments = async (file) => {
    setLoading(true);
    try {
      await masterApiService.bulkAddDepartments(file);
      toast.success(t("department:import_success") || "File uploaded successfully");
      await fetchDepartments(); // Refresh the list automatically
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to upload file";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const downloadDepartmentTemplate = async () => {
    try {
      const res = await masterApiService.downloadDepartmentTemplate();
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DepartmentsDTO_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(t("department:download_error") || 'Failed to download template');
    }
  };


  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async (payload) => {
    await masterApiService.addDepartment(payload);
    await fetchDepartments();
    toast.success(t("department:add_success"));
  };

  const updateDepartment = async (id, payload) => {
    await masterApiService.updateDepartment(id, payload);
    await fetchDepartments();
    toast.success(t("department:update_success"));
  };

  const deleteDepartment = async (id) => {
    await masterApiService.deleteDepartment(id);
    await fetchDepartments();
    toast.success(t("department:delete_success"));
  };

  return {
    departments,
    loading,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    bulkAddDepartments,
    downloadDepartmentTemplate
  };
};
