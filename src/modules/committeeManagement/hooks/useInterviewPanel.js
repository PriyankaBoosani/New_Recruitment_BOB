import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import masterApiService from "../../master/services/masterApiService";
import committeeManagementService from "../services/committeeManagementService";
import { mapInterviewMembersApi } from "../mappers/interviewMembersMapper";
import { mapInterviewPanelsApiToUI, mapPanelToFormData,preparePanelPayload } from "../mappers/InterviewPanelMapper";




export const useInterviewPanel = () => {
  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    community: '',
    members: []
  });

  const [errors, setErrors] = useState({});
  const [editAssignedMembers, setEditAssignedMembers] = useState([]);

  /* ================= FETCH PANELS ================= */

  const fetchPanels = useCallback(async () => {
    try {
      setLoading(true);

      const res = await masterApiService.getInterviewPanels();
      const apiData = res || [];
      console.log("apiData", apiData);
      setPanels(mapInterviewPanelsApiToUI(apiData));

    } catch (error) {
      console.error("Fetch Panels Error:", error);
      toast.error("Failed to load panels");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= INIT DATA ================= */

  const initData = useCallback(async () => {
    try {
      setLoading(true);

      const [commRes, memRes] = await Promise.all([
        masterApiService.getMasterDropdownData(),
        committeeManagementService.getAllusers()
      ]);

      setCommunityOptions(
        (commRes?.data || []).map(c => ({
          id: c.interviewCommitteeId,
          name: c.committeeName
        }))
      );

      setMembersOptions(mapInterviewMembersApi(memRes));

    } catch (error) {
      console.error("Init Data Error:", error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async () => {
      const payload = preparePanelPayload(
        formData,
        communityOptions,
        membersOptions
      );

      console.log("FINAL PAYLOAD 👉", payload);

      try {

           if (formData.id) {
      // ✅ UPDATE MODE
      await masterApiService.updateInterviewPanel(
        formData.id,
        payload
      );

      toast.success("Panel updated successfully");
        fetchPanels();

        setFormData({
          name: "",
          community: "",
          members: []
        });

    } else {
        const res = await masterApiService.addInterviewPanel(payload);

      if (res?.interviewPanelId) {
        toast.success("Panel created successfully");

        fetchPanels();

        setFormData({
          name: "",
          community: "",
          members: []
        });

      } else {
        toast.error("Save failed");
      }

    } 
  }catch (err) {
      console.error("SAVE ERROR 👉", err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to create panel"
      );
    };
  }


  /* ================= DELETE ================= */

  const handleDelete = useCallback(async (id) => {
  console.log("DELETE ID 👉", id);

  try {
    const res = await masterApiService.deleteInterviewPanel(id);

    console.log("DELETE RES 👉", res);

    toast.success("Panel deleted successfully");

    fetchPanels(); // refresh table

  } catch (err) {
    console.error("DELETE ERROR 👉", err);

    toast.error(
      err?.response?.data?.message ||
      "Failed to delete panel"
    );
  }

}, [fetchPanels]);



//edit
  const handleEdit = async (panelId) => {
  try {
    const res = await masterApiService.getInterviewPanelById(panelId);

    const panel = res;

    const mappedForm = mapPanelToFormData(panel);

    setFormData(mappedForm);

  } catch (err) {
    toast.error("Failed to load panel details");
  }
};


  /* ================= EFFECT ================= */

  useEffect(() => {
    initData();
    fetchPanels();
  }, [initData, fetchPanels]); // ✅ FIXED

  return {
    panels,
    loading,
    communityOptions,
    membersOptions,
    formData,
    setFormData,
    errors,
    setErrors,
    // editAssignedMembers,
    // setEditAssignedMembers,

    initData,
    fetchPanels, // ✅ RETURNED
    handleSave,
    handleDelete,
    handleEdit
  };
};
