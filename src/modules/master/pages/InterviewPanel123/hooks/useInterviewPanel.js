// hooks/useInterviewPanel.js
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";
import { mapInterviewMembersApi } from "../mappers/interviewMembersMapper";

export const useInterviewPanel = () => {
  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [committeeMap, setCommitteeMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const committeeRes = await masterApiService.getMasterDropdownData();
      const list = committeeRes?.data || [];

      const map = {};
      list.forEach(c => (map[c.interviewCommitteeId] = c.committeeName));

      setCommitteeMap(map);
      setCommunityOptions(
        list.map(c => ({ id: c.interviewCommitteeId, name: c.committeeName }))
      );

      await fetchPanels(map);
      await fetchMembers();
    } catch {
      toast.error("Failed to load interview panels");
    } finally {
      setLoading(false);
    }
  };

  const fetchPanels = async (map) => {
    const res = await masterApiService.getInterviewPanels();
    const apiList = Array.isArray(res?.data) ? res.data : [];

    setPanels(
      apiList.map(item => {
        const p = item.interviewPanelsDTO || {};
        const members = item.interviewerDTOs || [];
        return {
          id: p.interviewPanelId,
          name: p.panelName,
          community: map[p.committeeId],
          members: members.map(m => m.name).join(", ")
        };
      })
    );
  };

  const fetchMembers = async () => {
    const res = await masterApiService.getActiveInterviewMembers();
    setMembersOptions(mapInterviewMembersApi(res));
  };

  return {
    panels,
    setPanels,
    communityOptions,
    membersOptions,
    committeeMap,
    loading,
    refreshPanels: () => fetchPanels(committeeMap)
  };
};
