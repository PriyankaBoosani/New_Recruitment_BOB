import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import interviewService from "../services/interviewService";

export const useInterviewPanels = (positionId, initialSelectedPanels = []) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPanel, setEditPanel] = useState(null);
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const panelBoxRef = useRef(null);
  const [availablePanels, setAvailablePanels] = useState([]); // API
  const [selectedPanels, setSelectedPanels] = useState(initialSelectedPanels); // USER SELECTION

  useEffect(() => {
    // ONLY INITIAL LOAD
    if (initialSelectedPanels?.length && selectedPanels.length === 0) {
      setSelectedPanels(initialSelectedPanels);
    }
  }, []);

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
    // NEW: support multi-select
    // If panelIds exists, use it.
    // Otherwise keep your existing single panelId behavior.
    const panelIds = Array.isArray(data.panelIds)
      ? data.panelIds
      : [data.panelId];

    // Keep existing duplicate check for single panel
    if (!editPanel && panelIds.length === 1) {
      const isDuplicate = selectedPanels.some(
        (p) => p.id === data.panelId
      );

      if (isDuplicate) {
        toast.error("Panel already selected");
        return;
      }
    }

    // NEW: check duplicates for multiple panels
    if (!editPanel && panelIds.length > 1) {
      const duplicatePanel = panelIds.find((id) =>
        selectedPanels.some(
          (p) => String(p.id) === String(id)
        )
      );

      if (duplicatePanel) {
        toast.error("Panel already selected");
        return;
      }
    }

    // EDIT MODE
    if (editPanel) {
      // Keep your existing edit behavior
      const newPanel = {
        id: data.panelId || Date.now(),
        name: data.panelName,
        slots: data.slots,
      };

      setSelectedPanels((prev) =>
        prev.map((p, i) =>
          i === editPanel.index ? newPanel : p
        )
      );
    }

    // ADD MODE
    else {
      // Existing single-panel behavior
      if (panelIds.length === 1) {
        const newPanel = {
          id: data.panelId || Date.now(),
          name: data.panelName,
          slots: data.slots,
        };

        setSelectedPanels((prev) => [
          ...prev,
          newPanel,
        ]);
      }

      // NEW multi-panel behavior
      else {
        const newPanels = panelIds.map((panelId) => {
          const panel = availablePanels.find(
            (p) => String(p.id) === String(panelId)
          );

          return {
            id: panelId,
            name: panel?.name || data.panelName,
            slots: data.slots,
          };
        });

        setSelectedPanels((prev) => [
          ...prev,
          ...newPanels,
        ]);
      }
    }

    setEditPanel(null);
    setShowAddModal(false);
  } catch {
    toast.error("Failed to save panel");
  }
};
  const confirmDelete = (index) => {
    setSelectedPanels((prev) => prev.filter((_, i) => i !== index));

    setDeleteIndex(null);

    setOpenInfoIndex(null);
  };

  const openEdit = (panel, index) => {
    const availablePanel = availablePanels.find((p) => p.id === panel.id);

    setEditPanel({
      ...panel,

      ranges: availablePanel?.ranges || [],

      index,
    });
    setShowAddModal(true);
  };
  //new for load the panles which are assigned in committe management
  const loadPanels = async (positionId) => {
    const positionIds = Array.isArray(positionId)
      ? positionId
      : positionId
        ? [positionId]
        : [];

    if (!positionIds.length) return;

    try {
      const response = await interviewService.getPanelsByPosition(positionIds);

      // ✅ FIXED PATH
      const apiList = response?.data || [];

      const groupedPanels = {};

      apiList.forEach((item) => {
        const panelId = item.interviewPanel?.interviewPanelId;

        // create panel once
        if (!groupedPanels[panelId]) {
          groupedPanels[panelId] = {
            id: panelId,

            name: item.interviewPanel?.panelName,

            members: (item.interviewPanel?.panelMembers || []).map((m) => ({
              name: m.panelMember?.name,
              role: m.panelMember?.role,
              email: m.panelMember?.email,
            })),

            slots: [],

            // ✅ IMPORTANT
            ranges: [],

            status: item.positionPanelStatus,

            canEdit: item.canEdit,
          };
        }

        // ✅ ADD ALL RANGES
        groupedPanels[panelId].ranges.push({
          startDate: item.startDate,

          endDate: item.endDate,

          positionPanelId: item.positionPanelId,
          positionName: item.positionName || "Position",
        });
      });

      const formatted = Object.values(groupedPanels);

      setAvailablePanels(formatted);
// Get panel name for already selected/ongoing panels
if (initialSelectedPanels?.length) {
  const updatedSelectedPanels = initialSelectedPanels.map(
    (selectedPanel) => {
      const matchedPanel = formatted.find(
        (panel) =>
          String(panel.id) === String(selectedPanel.id)
      );

      return {
        ...selectedPanel,
        name: matchedPanel?.name || selectedPanel.name || "",
      };
    }
  );

  setSelectedPanels(updatedSelectedPanels);
}
    
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
    openEdit,
  };
};
