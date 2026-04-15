import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import interviewService from "../services/interviewService";

export const useInterviewPanels = (positionId,rows) => {

  const { t } = useTranslation("interviewSchedule");
  const [panels, setPanels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPanel, setEditPanel] = useState(null);
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const panelBoxRef = useRef(null);
  const [availablePanels, setAvailablePanels] = useState([]); // API
const [selectedPanels, setSelectedPanels] = useState([]);   // USER SELECTION

  useEffect(() => {
    const handleOutside = (e) => {
      if (!panelBoxRef.current) return;
      if (!panelBoxRef.current.contains(e.target)) {
        setOpenInfoIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
const savePanel = (data) => {
  console.log("data1111", data);
  try {
    const newPanel = {
      id: data.panelId || Date.now(),
      name: data.panelName,
      slots: data.slots
    };

    if (editPanel) {
      // ✅ UPDATE EXISTING
      setSelectedPanels(prev =>
        prev.map((p, i) =>
          i === editPanel.index ? newPanel : p
        )
      );

      toast.success("Panel updated successfully");
    } else {
      // ✅ ADD NEW
      setSelectedPanels(prev => [...prev, newPanel]);

      // ✅ REMOVE FROM AVAILABLE
      setAvailablePanels(prev =>
        prev.filter(p => p.name !== data.panelName)
      );

      toast.success("Panel added successfully");
    }

    setEditPanel(null);
    setShowAddModal(false);

  } catch {
    toast.error("Failed to save panel");
  }
};
const confirmDelete = (index) => {
  const deletedPanel = selectedPanels[index];

  // ✅ REMOVE FROM SELECTED
  setSelectedPanels(prev => prev.filter((_, i) => i !== index));

  // ✅ ADD BACK TO AVAILABLE
  setAvailablePanels(prev => [
    ...prev,
    { id: deletedPanel.id, name: deletedPanel.name }
  ]);

  setDeleteIndex(null);
  setOpenInfoIndex(null);

  toast.success("Panel deleted successfully");
};

const openEdit = (panel, index) => {
  setEditPanel({ ...panel, index });
  setShowAddModal(true);
};
//new for load the panles which are assigned in committe management
  const loadPanels = async (positionId) => {
  if (!positionId) return;

  try {
    //https://dev.bobjava.sentrifugo.com/recruiter-portal/api/v1/recruiter/interview-scheduling/get-assigned-panels
    const response = await interviewService.getPanelsByPosition(positionId);

    console.log("response1111", response);

    const apiList = response?.data?.interviewPanelList || [];

    const formatted = apiList.map((item, index) => ({
      id: item.interviewPanel?.interviewPanelId,
      name: item.interviewPanel?.panelName,
      slots: [],

      // 👇 store full data if needed later
      raw: item
    }));

setAvailablePanels(formatted);

  } catch (error) {
    console.error("Error loading panels:", error);
    setPanels([]);
  }
};
  useEffect(() => {
    loadPanels(positionId);
  }, [positionId]);

  return {
  availablePanels,
  selectedPanels,
    showAddModal,
    editPanel,
    openInfoIndex,
    deleteIndex,
    panelBoxRef,

    setShowAddModal,
    setEditPanel,
    setOpenInfoIndex,
    setDeleteIndex,
    savePanel,
    confirmDelete,
    openEdit
  };
};
