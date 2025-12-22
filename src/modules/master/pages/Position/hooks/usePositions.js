import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";
import { mapPositionsFromApi } from "../mappers/positionMapper";



export const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildJobGradeMap = (jobGrades = []) => {
  const map = {};
  jobGrades.forEach(jg => {
    map[jg.jobGradeId] = jg.jobGradeCode; // 👈 what you want to display
  });
  return map;
};


const fetchPositions = async () => {
  setLoading(true);
  try {
    // 1️⃣ Fetch positions
    const posRes = await masterApiService.getAllPositions();
    const positionApiData = posRes?.data || [];
const mappedPositions = mapPositionsFromApi(positionApiData).reverse();

    // 2️⃣ Fetch departments
    const deptRes = await masterApiService.getAllDepartments();
    const deptApiData = Array.isArray(deptRes.data)
      ? deptRes.data
      : deptRes.data?.data || [];

    const deptMap = {};
    deptApiData.forEach(d => {
      deptMap[d.departmentId] = d.departmentName;
    });

    // 3️⃣ Fetch job grades
    const jobGradeRes = await masterApiService.getAllJobGrades();
    const jobGradeApiData = Array.isArray(jobGradeRes.data)
      ? jobGradeRes.data
      : jobGradeRes.data?.data || [];

    const jobGradeMap = buildJobGradeMap(jobGradeApiData);

    // 4️⃣ Enrich positions
    const enrichedPositions = mappedPositions.map(p => ({
      ...p,
      department: deptMap[p.departmentId] || "—",
      jobGrade: jobGradeMap[p.jobGradeId] || "—"
    }));

    setPositions(enrichedPositions);
  } catch (err) {
    console.error("Fetch positions failed", err);
    setPositions([]);
  } finally {
    setLoading(false);
  }
};



  const buildDepartmentMap = (departments = []) => {
  const map = {};
  departments.forEach(d => {
    map[d.departmentId] = d.departmentName;
  });
  return map;
};


  useEffect(() => {
    fetchPositions();
  }, []);

  const addPosition = async (payload) => {
    await masterApiService.addPosition(payload);
    await fetchPositions();
    toast.success("Position added successfully");
  };

  const updatePosition = async (id, payload) => {
    await masterApiService.updatePosition(id, payload);
    await fetchPositions();
    toast.success("Position updated successfully");
  };

  const deletePosition = async (id) => {
    await masterApiService.deletePosition(id);
    await fetchPositions();
    toast.success("Position deleted successfully");
  };

  return {
    positions,
    loading,
    fetchPositions,
    addPosition,
    updatePosition,
    deletePosition,
  };
};
