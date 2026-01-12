import { useState } from "react";
import { toast } from "react-toastify";
import jobPositionApiService from "../services/jobPositionApiService";
import { useMasterData } from "../hooks/useMasterData";

export const useJobPositionsByRequisition = () => {
  const [positionsByReq, setPositionsByReq] = useState({});
  const [loadingReqId, setLoadingReqId] = useState(null);

  const { positions: masterPositions } = useMasterData();

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

      const enriched = list.map(api => ({
        positionId: api.id,
        positionName: positionMap[api.masterPositionId] || "—", // ✅ FIX
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



  return {
    positionsByReq,
    loadingReqId,
    fetchPositions
  };
};
