import { useState, useEffect, useCallback } from "react";
import { mapInterviewCandidates } from "../mappers/interviewMapper";
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import masterApiService from "../../master/services/masterApiService"

export default function useInterviewPool({
  positionId,
  filters,
  page,
  pageSize,
  enabled
}) {
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [centreMap, setCentreMap] = useState({});
  const [panelMap, setPanelMap] = useState({});

  // 🔹 Fetch interview centres only once
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [centreRes, panelRes] = await Promise.all([
          masterApiService.getAllInterviewCenters(),
          masterApiService.getInterviewPanels(),
        ]);

        // Centres
        const centres = centreRes?.data || [];
        const centreLookup = {};
        centres.forEach((c) => {
          centreLookup[c.interviewCentreId] = c.interviewCentre;
        });

        // Panels
        const panels = panelRes?.data || [];
        const panelLookup = {};
        panels.forEach((p) => {
          panelLookup[p.interviewPanelId] = p.panelName;
        });

        setCentreMap(centreLookup);
        setPanelMap(panelLookup);


      } catch (err) {
        console.error("Failed to fetch master data", err);
      }
    };

    fetchMasters();
  }, []);

  const fetchInterviewCandidates = useCallback(async () => {
    if (!enabled || !positionId) {
      setData([]);
      setTotalElements(0);
      return;
    }
    setLoading(true);

    try {
      // Only fetch interview statuses: SCHEDULED, QUALIFIED, DISQUALIFIED, PROVISIONALLY_APPROVED, PENDING
      const INTERVIEW_STATUSES = ["SCHEDULED", "QUALIFIED", "DISQUALIFIED", "PROVISIONALLY_APPROVED", "PENDING", "ZONAL_ABSENT", "INTERVIEW_ABSENT", "ZONAL_REJECTED"];
      
      const res = await candidateWorkflowServices.getInterviewCandidates({
        searchText: filters.searchText || "",
        positionId,
        statusList: filters.status.length ? filters.status : INTERVIEW_STATUSES,
        page,
        size: pageSize,
      });

      const apiData = res?.data;

      setData(
        mapInterviewCandidates(
          apiData?.content || [],
          centreMap,
          panelMap
        )
      );

      setTotalElements(apiData?.page?.totalElements || 0);

    } catch (err) {
      console.error("Interview fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [
    positionId,
    filters.searchText,
    filters.status,
    page,
    pageSize,
    enabled,
    centreMap,
    panelMap
  ]);


  useEffect(() => {
    fetchInterviewCandidates();
  }, [fetchInterviewCandidates]);

  return {
    interviewCandidates: data,
    totalElements,
    loading,
    refetch: fetchInterviewCandidates
  };
}
