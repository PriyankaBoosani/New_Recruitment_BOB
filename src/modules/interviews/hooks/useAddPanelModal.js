import { useState, useEffect } from "react";
import { validatePanelModal } from "../../interviews/validations/panelModalValidation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


export const useAddPanelModal = ({
  show,
  initialPanel,
  initialRows,
  onSave,
  onClose
}) => {
  const { t } = useTranslation("interviewSchedule");


  const buildRows = () =>
    initialRows && initialRows.length
      ? initialRows.map(r => ({ ...r })) // clone edit rows
      : [{ date: "", perDay: "" }];

  const [panelName, setPanelName] = useState("");
  const [rows, setRows] = useState([{ date: "", perDay: "" }]);
  const [errors, setErrors] = useState({});

  /* ✅ Reset ONLY when modal opens */
  useEffect(() => {
    if (!show) return;

    setPanelName(initialPanel || "");
    setRows(buildRows());
    setErrors({});

  }, [show]);   // 🔥 ONLY show — do NOT add initialRows here

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

    onSave({ panelName, slots: rows });
    onClose();
  };

  /* ================= CANCEL ================= */

  const handleCancel = () => {
    onClose();
  };

  return {
    panelName,
    setPanelName,
    rows,
    errors,
    addRow,
    removeRow,
    updateRow,
    handleSave,
    handleCancel
  };
};
