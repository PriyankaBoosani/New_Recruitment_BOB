// src/modules/master/pages/InterviewPanel/hooks/useInterviewPanels.js

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import masterApiService from '../../../services/masterApiService';
import { mapInterviewPanelsFromApi } from '../mappers/interviewPanelMapper';

export const useInterviewPanels = () => {
  const [panels, setPanels] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);

  const fetchPanels = async () => {
    const res = await masterApiService.getInterviewPanels();
    const apiList = Array.isArray(res.data) ? res.data : res.data?.data || [];
    const mapped = mapInterviewPanelsFromApi(apiList);

    setPanels(mapped);

    // derive unique members list
    const members = Array.from(
      new Set(mapped.flatMap(p => p.membersArray))
    );
    setMembersOptions(members);
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  const addPanel = async (payload) => {
    await masterApiService.addInterviewPanel(payload);
    await fetchPanels();
    toast.success("Panel added successfully");
  };

  const updatePanel = async (id, payload) => {
    await masterApiService.updateInterviewPanel(id, payload);
    await fetchPanels();
    toast.success("Panel updated successfully");
  };

  const deletePanel = async (id) => {
    await masterApiService.deleteInterviewPanel(id);
    await fetchPanels();
    toast.success("Panel deleted successfully");
  };

  return {
    panels,
    membersOptions,
    fetchPanels,
    addPanel,
    updatePanel,
    deletePanel
  };
};
