import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import masterApiService from "../../../services/masterApiService";
import { mapInterviewMembersApi } from "../../../mappers/interviewMembersMapper";
import { mapInterviewPanelsApiToUI, preparePanelPayload } from "../mappers/InterviewPanelMapper";
import { validateInterviewPanelForm } from '../../../../../shared/utils/interviewpanel-validations';

export const useInterviewPanel = () => {
  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [committeeMap, setCommitteeMap] = useState({});
  const [editAssignedMembers, setEditAssignedMembers] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', community: '', members: [] });
  const [errors, setErrors] = useState({});
  
  const fetchPanels = async (map) => {
    const res = await masterApiService.getInterviewPanels();
    setPanels(mapInterviewPanelsApiToUI(res?.data, map || committeeMap));
  };

  const initData = async () => {
    setLoading(true);
    try {
      const [commRes, memRes] = await Promise.all([
        masterApiService.getMasterDropdownData(),
        masterApiService.getActiveInterviewMembers()
      ]);

      const map = {};
      const list = commRes?.data || [];
      list.forEach(c => { map[c.interviewCommitteeId] = c.committeeName; });
      
      setCommitteeMap(map);
      setCommunityOptions(list.map(c => ({ id: c.interviewCommitteeId, name: c.committeeName })));
      setMembersOptions(mapInterviewMembersApi(memRes));
      await fetchPanels(map);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isEditing, editingId) => {
    const result = validateInterviewPanelForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }

    const payload = preparePanelPayload(formData, membersOptions, isEditing, editingId);
    const res = isEditing 
      ? await masterApiService.updateInterviewPanel(editingId, payload)
      : await masterApiService.addInterviewPanel(payload);

    if (res?.success) {
      toast.success(isEditing ? "Updated successfully" : "Created successfully");
      await fetchPanels();
      return true;
    } else {
      toast.error(res?.message || "Save failed");
      return false;
    }
  };

  const handleDelete = async (id) => {
    const res = await masterApiService.deleteInterviewPanel(id);
    if (res?.success) {
      toast.success("Deleted successfully");
      setPanels(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  };

  return {
    panels, setPanels, loading, communityOptions, membersOptions, 
    formData, setFormData, errors, setErrors, editAssignedMembers, setEditAssignedMembers,
    initData, handleSave, handleDelete
  };
};