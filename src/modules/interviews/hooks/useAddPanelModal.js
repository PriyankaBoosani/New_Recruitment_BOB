import { useState, useEffect } from "react";
import { validatePanelModal } from "../../interviews/validations/panelModalValidation";


export const useAddPanelModal = ({
  show,
  initialPanel,
  initialRows,
  onSave,
  onClose,
  panels
}) => {

  const buildRows = () =>
    initialRows && initialRows.length
      ? initialRows.map(r => ({ ...r })) // clone edit rows
      : [{ date: "", perDay: "" }];

 // const [panelName, setPanelName] = useState("");
  const [panelId, setPanelId] = useState("");
  const [rows, setRows] = useState([{ date: "", perDay: "" }]);
  const [errors, setErrors] = useState({});

  /* ✅ Reset ONLY when modal opens */
useEffect(() => {
  if (!show) return;

  setPanelId(initialPanel || "");
  setRows(buildRows());
  setErrors({});

}, [initialPanel,show]);   // 🔥 ONLY show// 🔥 ONLY show — do NOT add initialRows 



const selectedPanel = panels.find(p => p.id === panelId);
const minDate = selectedPanel?.startDate || "";
const maxDate = selectedPanel?.endDate || "";

  /* ================= ADD ================= */

  const addRow = () => {
    setRows(prev => [...prev, { date: "", perDay: "" }]);
  };

  const removeRow = (i) => {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  };

  /* ================= UPDATE ================= */

  const updateRow = (i, field, value) => {
    setRows(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });

    // live error clear
    if (errors?.rows?.[i]?.[field]) {
      const e = { ...errors };
      delete e.rows[i][field];
      setErrors(e);
    }
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
  const v = validatePanelModal({ rows });
  setErrors(v);

  if (v.rows?.length) return;

  // ✅ FIND SELECTED PANEL
  const selectedPanel = panels.find(p => p.id === panelId);

  onSave({
    panelId,
    panelName: selectedPanel?.name,   // ✅ FIX HERE
    slots: rows
  });

  onClose();
};

  /* ================= CANCEL ================= */

  const handleCancel = () => {
    onClose();
  };

  return {
    panelId,
    setPanelId,
    rows,
    errors,
    addRow,
    removeRow,
    updateRow,
    handleSave,
    handleCancel,
    minDate,   // ✅ ADD
    maxDate    // ✅ ADD
  };
};
