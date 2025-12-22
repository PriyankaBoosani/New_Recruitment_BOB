// src/modules/master/pages/JobGrade/hooks/useJobGrades.js

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import masterApiService from '../../../services/masterApiService';
import { mapJobGradesFromApi } from '../mappers/jobGradeMapper';

export const useJobGrades = () => {
  const [jobGrades, setJobGrades] = useState([]);

const fetchJobGrades = async () => {
  const res = await masterApiService.getAllJobGrades();
  const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

  // ✅ Sort newest first
  const sorted = [...list].sort((a, b) => {
    const da = new Date(a.createdDate || 0).getTime();
    const db = new Date(b.createdDate || 0).getTime();
    return db - da;
  });

  // ✅ ONLY SET ONCE
  setJobGrades(mapJobGradesFromApi(sorted));
};


  useEffect(() => {
    fetchJobGrades();
  }, []);

  const addJobGrade = async (payload) => {
  try {
    await masterApiService.addJobGrade(payload);
    await fetchJobGrades();
    toast.success("Job Grade added successfully");
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to add Job Grade"
    );
  }
};


  const updateJobGrade = async (id, payload) => {
    await masterApiService.updateJobGrade(id, payload);
    await fetchJobGrades();
    toast.success("Job Grade updated successfully");
  };

  const deleteJobGrade = async (id) => {
    await masterApiService.deleteJobGrade(id);
    await fetchJobGrades();
    toast.success("Job Grade deleted successfully");
  };

  return {
    jobGrades,
    fetchJobGrades,
    addJobGrade,
    updateJobGrade,
    deleteJobGrade
  };
};
