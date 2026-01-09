import { useState } from "react";
import { toast } from "react-toastify";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapJobPositionFromApi } from "../mappers/jobPositionAccordionMapper";

export const useJobPositionsByRequisition = () => {
  const [positionsByReq, setPositionsByReq] = useState({});
  const [loadingReqId, setLoadingReqId] = useState(null);

  const fetchPositions = async (requisitionId) => {
    // 🔒 cache guard
    if (positionsByReq[requisitionId]) return;

    try {
      setLoadingReqId(requisitionId);

      const res =
        await jobPositionApiService.getPositionsByRequisition(requisitionId);

      const list = res?.data?.data || [];

      setPositionsByReq((prev) => ({
        ...prev,
        [requisitionId]: list.map(mapJobPositionFromApi)
      }));
    } catch (err) {
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
