// src/modules/jobPostings/hooks/useJobPositionsByRequisition.js
import { useState } from "react";
import { toast } from "react-toastify";
import jobPositionApiService from "../services/jobPositionApiService";
import { useMasterData } from "../hooks/useMasterData";
import { useTranslation } from "react-i18next";


export const useJobPositionsByRequisition = () => {
   const { t } = useTranslation("jobPostingsList");
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
         masterPositionId: api.masterPositionId,
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
     toast.error(t("positions_load_failed"));
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

      toast.success(t("position_deleted_success"));
    } catch {
      toast.error(t("position_delete_failed"));
    }
  };

  return {
    positionsByReq,
    loadingReqId,
    fetchPositions,
    deletePosition
  };
};
