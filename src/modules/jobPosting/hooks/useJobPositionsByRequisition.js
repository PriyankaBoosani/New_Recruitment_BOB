// src/modules/jobPostings/hooks/useJobPositionsByRequisition.js
import { useState } from "react";
import { toast } from "react-toastify";
import jobPositionApiService from "../services/jobPositionApiService";
import { useMasterData } from "../hooks/useMasterData";

export const useJobPositionsByRequisition = () => {
  const [positionsByReq, setPositionsByReq] = useState({});
  const [loadingReqId, setLoadingReqId] = useState(null);

  const { positions: masterPositions, departments } = useMasterData();

  const positionMap = {};
  masterPositions.forEach(p => {
    positionMap[p.id] = p.name;
  });

  const fetchPositions = async (requisitionId) => {
    if (positionsByReq[requisitionId]) return;

    try {
      setLoadingReqId(requisitionId);

      const res =
        await jobPositionApiService.getPositionsByRequisition(requisitionId);

      const list = res?.data || [];

      const departmentMap = {};
      departments.forEach(d => {
        departmentMap[d.id] = d.label;
      });

      const enriched = list.map(api => ({
        positionId: api.positionId || api.id,
        positionName: positionMap[api.masterPositionId] || "—",
        deptId: api.deptId,
        departmentName: departmentMap[api.deptId] || "—",
        vacancies: api.totalVacancies ?? 0,
        minAge: api.eligibilityAgeMin,
        maxAge: api.eligibilityAgeMax,
        mandatoryEducation: api.mandatoryEducation ?? "",
        preferredEducation: api.preferredEducation ?? "",
      }));

      setPositionsByReq(prev => ({
        ...prev,
        [requisitionId]: enriched
      }));
    } catch {
      toast.error("Failed to load positions");
    } finally {
      setLoadingReqId(null);
    }
  };

  // ✅ DELETE POSITION
  const deletePosition = async (requisitionId, positionId) => {
    try {
      await jobPositionApiService.deletePositionById(positionId);

      setPositionsByReq(prev => ({
        ...prev,
        [requisitionId]: prev[requisitionId].filter(
          p => p.positionId !== positionId
        )
      }));

      toast.success("Position deleted successfully");
    } catch {
      toast.error("Failed to delete position");
    }
  };

  return {
    positionsByReq,
    loadingReqId,
    fetchPositions,
    deletePosition
  };
};
