import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import interviewService from "../services/interviewService";

export const useInterviewPanels = (
  positionId,
  initialSelectedPanels = []
) => {

  const { t } = useTranslation("interviewSchedule");
  const [panels, setPanels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPanel, setEditPanel] = useState(null);
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const panelBoxRef = useRef(null);
  const [availablePanels, setAvailablePanels] = useState([]); // API
const [selectedPanels, setSelectedPanels] =
  useState(initialSelectedPanels);  // USER SELECTION


  useEffect(() => {

  if (
    initialSelectedPanels?.length
  ) {
    setSelectedPanels(
      initialSelectedPanels
    );
  }

}, [initialSelectedPanels]);

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
  try {
    const isDuplicate = selectedPanels.some(
      p => p.id === data.panelId
    );

    // ❌ BLOCK duplicate (only in ADD mode)
    if (!editPanel && isDuplicate) {
      toast.error("Panel already selected");
      return;
    }

    const newPanel = {
      id: data.panelId || Date.now(),
      name: data.panelName,
      slots: data.slots
    };

    if (editPanel) {
      setSelectedPanels(prev =>
        prev.map((p, i) =>
          i === editPanel.index ? newPanel : p
        )
      );

      //toast.success("Panel updated successfully");
    } else {
      setSelectedPanels(prev => [...prev, newPanel]);

      setAvailablePanels(prev =>
        prev.filter(p => p.id !== data.panelId) // 🔥 better than name
      );

      //toast.success("Panel added successfully");
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

  //toast.success("Panel deleted successfully");
};

const openEdit = (panel, index) => {
  setEditPanel({ ...panel, index });
  setShowAddModal(true);
};
//new for load the panles which are assigned in committe management
  const loadPanels = async (positionId) => {
  if (!positionId) return;

  try {
    const response = await interviewService.getPanelsByPosition(positionId);

    console.log("response1111", response);

    // ✅ FIXED PATH
    const apiList = response?.data || [];

    const formatted = apiList.map((item) => ({
      id: item.interviewPanel?.interviewPanelId,
      name: item.interviewPanel?.panelName,

      // ✅ Optional: map members (useful for UI later)
      members: (item.interviewPanel?.panelMembers || []).map(m => ({
        name: m.panelMember?.name,
        role: m.panelMember?.role,
        email: m.panelMember?.email
      })),

      // ✅ Keep slots empty for now
      slots: [],

      // ✅ Extra useful fields
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.positionPanelStatus,
      canEdit: item.canEdit,

      raw: item
    }));

    // ✅ SET AVAILABLE PANELS
    setAvailablePanels(formatted);

    // ❗ OPTIONAL: If you want already assigned panels pre-selected
    // setSelectedPanels(formatted);

  } catch (error) {
    console.error("Error loading panels:", error);
    setAvailablePanels([]); // ✅ fix wrong state
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
