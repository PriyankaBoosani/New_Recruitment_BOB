import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import masterApiService from "../../master/services/masterApiService";
import { mapInterviewMembersApi } from "../mappers/interviewMembersMapper";
import { mapInterviewPanelsApiToUI, preparePanelPayload } from "../mappers/InterviewPanelMapper";
import { validateInterviewPanelForm } from '../../../shared/utils/interviewpanel-validations';
import { t } from 'i18next';

export const useInterviewPanel = () => {
  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [committeeMap, setCommitteeMap] = useState({});
  const [editAssignedMembers, setEditAssignedMembers] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', community: '', members: [] });
  const [errors, setErrors] = useState({});
  
  // const fetchPanels = useCallback(async (map) => {
  //   const res = await masterApiService.getInterviewPanels();
  //   console.log("fetchPanels",res);
  //   setPanels(mapInterviewPanelsApiToUI(res?.data, map || committeeMap));
  // }, [committeeMap]);

  const initData = useCallback(async () => {
  setLoading(true);
  try {
    // 1️⃣ Committees (critical)
    const commRes = await masterApiService.getMasterDropdownData();
    console.log("commRes", commRes);

    const list = commRes?.data || [];
    const map = {};
    list.forEach(c => {
      map[c.interviewCommitteeId] = c.committeeName;
    });

    setCommitteeMap(map);
    setCommunityOptions(
      list.map(c => ({
        id: c.interviewCommitteeId,
        name: c.committeeName
      }))
    );

    //await fetchPanels(map);

    // 2️⃣ Members (non-blocking)
    try {
      const memRes = await masterApiService.getActiveInterviewMembers();
      console.log("memRes", memRes);
      setMembersOptions(mapInterviewMembersApi(memRes));
    } catch (err) {
      console.error("Members API failed", err);
      setMembersOptions([]);
      toast.error("Unable to load interview members");
    }

  } finally {
    setLoading(false);
  }
}, []);


  const handleSave = useCallback(async (isEditing, editingId) => {
    const result = validateInterviewPanelForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }

    const payload = preparePanelPayload(
      formData,
      membersOptions,
      isEditing,
      editingId
    );

    try {
      const res = isEditing
        ? await masterApiService.updateInterviewPanel(editingId, payload)
        : await masterApiService.addInterviewPanel(payload);

      if (!res?.success) {
        toast.error(res?.message || "Save failed");
        return false;
      }

      const uiItem = mapInterviewPanelsApiToUI(
        [res.data],
        committeeMap
      )[0];

      if (isEditing) {
        //  UPDATE IN PLACE
        setPanels(prev =>
          prev.map(p =>
            String(p.id) === String(editingId)
              ? { ...p, ...uiItem }
              : p
          )
        );
        toast.success(t("interviewPanel:interviewPanelUpdated"));
      } else {
        //  ADD ON TOP
        setPanels(prev => [uiItem, ...prev]);
        toast.success(t("interviewPanel:interviewPanelAdded"));
      }

      return true;
    } catch (err) {
      toast.error("Something went wrong");
      return false;
    }
  }, [formData, membersOptions, committeeMap]);

  const handleDelete = useCallback(async (id) => {
    const res = await masterApiService.deleteInterviewPanel(id);
    if (res?.success) {
      toast.success(t("interviewPanel:interviewPanelDeleted"));


      setPanels(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  }, [setPanels]);
useEffect(() => {
  initData();
}, []);
  return {
    panels, setPanels, loading, communityOptions, membersOptions, 
    formData, setFormData, errors, setErrors, editAssignedMembers, setEditAssignedMembers,
    initData, handleSave, handleDelete
  };
};