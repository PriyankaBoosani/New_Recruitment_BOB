import { useCallback, useEffect, useState } from "react";
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import { mapOnboardingPoolCandidates } from "../mappers/onboardingPoolMapper";

const useOnboardingPool = ({
  positionId = [],
  searchText = "",
  page = 0,
  pageSize = 10,
  enabled = false,
}) => {
  const [onboardingCandidates, setOnboardingCandidates] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOnboardingPool = useCallback(async () => {
    if (!enabled || !positionId?.length) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        searchText: searchText || "",
        page,
        size: pageSize,
        positionIds: positionId,
        status: ["OFFER_ACCEPTED", "OFFERED", "PRE_ONBOARDING_PENDING", "PRE_ONBOARDING_COMPLETED", "ONBOARDED"],
      };

      console.log("ONBOARDING POOL PAYLOAD:", payload);

      const res =
        await candidateWorkflowServices.getOnboardingPool(payload);

      console.log("ONBOARDING POOL RESPONSE:", res);

      const apiData = res?.data;

      const content = apiData?.content || [];

      setOnboardingCandidates(
        mapOnboardingPoolCandidates(content)
      );

      setTotalElements(
        apiData?.page?.totalElements || 0
      );
    } catch (error) {
      console.error("Failed to load onboarding pool", error);

      setOnboardingCandidates([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [
    positionId,
    searchText,
    page,
    pageSize,
    enabled,
  ]);

  useEffect(() => {
    fetchOnboardingPool();
  }, [fetchOnboardingPool]);

  return {
    onboardingCandidates,
    totalElements,
    loading,
    refetch: fetchOnboardingPool,
  };
};

export default useOnboardingPool;