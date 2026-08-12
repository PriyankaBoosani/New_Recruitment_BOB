import { useCallback, useEffect, useRef, useState } from "react";
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

  const searchTimeoutRef = useRef(null);

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
    if (!enabled || !positionId?.length) {
      return;
    }

    // Don't debounce pagination/position changes.
    // Debounce only when search text changes.
    if (searchText) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        fetchOnboardingPool();
      }, 500);
    } else {
      fetchOnboardingPool();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    searchText,
    page,
    pageSize,
    positionId,
    enabled,
    fetchOnboardingPool,
  ]);

  return {
    onboardingCandidates,
    totalElements,
    loading,
    refetch: fetchOnboardingPool,
  };
};

export default useOnboardingPool;