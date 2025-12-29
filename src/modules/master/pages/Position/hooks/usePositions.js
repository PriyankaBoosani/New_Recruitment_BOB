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

  // ✅ Download positions template (xlsx)
  const downloadPositionTemplate = async () => {
    try {
      const res = await masterApiService.downloadPositionTemplate();
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "MasterPositionsDTO_template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download template");
    }
  };

  // ✅ Bulk add positions (xlsx)


const bulkAddPositions = async (file) => {
  setLoading(true);

  try {
    const res = await masterApiService.bulkAddPositions(file);

    console.log("API RESPONSE:", res); // logs for 200 & 422

    // ❌ business failure
    if (res.success === false) {
      toast.error(res.message);
      return {
        success: false,
        error: res.message
      };
    }
  await fetchPositions(); 
    // ✅ success
    toast.success(res.message || "File uploaded successfully");

    return {
      success: true
    };

  } catch (err) {
    // ❌ network / server error
    console.log("NETWORK ERROR:", err);

    const message = "Something went wrong";
    toast.error(message);

    return {
      success: false,
      error: message
    };

  } finally {
    setLoading(false);
  }
};


  return {
    positions,
    loading,
    fetchPositions,
    addPosition,
    updatePosition,
    deletePosition,
   downloadPositionTemplate,
   bulkAddPositions,
  };
};
