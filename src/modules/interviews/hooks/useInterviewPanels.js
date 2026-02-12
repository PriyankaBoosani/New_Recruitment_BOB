import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useInterviewPanels = () => {

  const { t } = useTranslation("interviewSchedule");
  const [panels, setPanels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPanel, setEditPanel] = useState(null);
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const panelBoxRef = useRef(null);

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
      if (editPanel) {
        setPanels(prev =>
          prev.map((p, i) =>
            i === editPanel.index
              ? { name: data.panelName, slots: data.slots }
              : p
          )
        );
        toast.success(t("toast_update_success"));
      } else {
        setPanels(prev => [
          ...prev,
          {
            name: data.panelName || `Panel ${prev.length + 1}`,
            slots: data.slots
          }
        ]);
        toast.success(t("toast_add_success"));
      }
      setEditPanel(null);
      setShowAddModal(false);
      setOpenInfoIndex(null);
    } catch {
      toast.error(
        editPanel
          ? t("toast_update_fail")
          : t("toast_add_fail")
      );
    }
  };

  const confirmDelete = (index) => {
    setPanels(prev => prev.filter((_, i) => i !== index));
    setDeleteIndex(null);
    setOpenInfoIndex(null);

    toast.success(t("toast_delete_success"));
  };

  const openEdit = (panel, index) => {
    setOpenInfoIndex(null);
    setEditPanel({ ...panel, index });
    setShowAddModal(true);
  };

  return {
    panels,
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
