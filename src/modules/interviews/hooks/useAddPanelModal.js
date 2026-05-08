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
      : [{
    date: "",
    perDay: "",
    duration: "15",
    startTime: "",
    endTime: ""
  }];

 // const [panelName, setPanelName] = useState("");
  const [panelId, setPanelId] = useState("");
  const [rows, setRows] = useState([
  {
    date: "",
    perDay: "",
    duration: "15",
    startTime: "",
    endTime: ""
  }
]);
  const [errors, setErrors] = useState({});

  /* ✅ Reset ONLY when modal opens */
useEffect(() => {
  if (!show) return;

  setPanelId(initialPanel || "");
  setRows(buildRows());
  setErrors({});

}, [initialPanel,show]);   // 🔥 ONLY show// 🔥 ONLY show — do NOT add initialRows 

// useEffect(() => {

//   setRows(prev =>
//     prev.map(row => {

//       // required fields
//       if (
//         !row.startTime ||
//         !row.endTime ||
//         !row.duration
//       ) {
//         return {
//           ...row,
//           perDay: ""
//         };
//       }

//       const start = new Date(`2000-01-01T${row.startTime}`);
//       const end = new Date(`2000-01-01T${row.endTime}`);

//       const diffMins = (end - start) / (1000 * 60);

//       // invalid range
//       if (diffMins <= 0) {
//         return {
//           ...row,
//           perDay: ""
//         };
//       }

//       const interviews = Math.floor(
//         diffMins / Number(row.duration)
//       );

//       return {
//         ...row,
//         perDay: interviews.toString()
//       };

//     })
//   );

// }, [rows.map(r => `${r.startTime}-${r.endTime}-${r.duration}`).join()]);




const selectedPanel = panels.find(
  p => String(p.id) === String(panelId)
);

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date)
    .toISOString()
    .split("T")[0];
};

const minDate = formatDate(selectedPanel?.startDate);
const maxDate = formatDate(selectedPanel?.endDate);

  /* ================= ADD ================= */

  const addRow = () => {
    setRows(prev => [
        ...prev,
        {
          date: "",
          perDay: "",
          duration: "15",
          startTime: "",
          endTime: ""
        }
      ]);
  };

  const removeRow = (i) => {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  };

  /* ================= UPDATE ================= */
const updateRow = (i, field, value) => {

  // ================= UPDATE ROW =================

  setRows(prev => {

    const copy = [...prev];

    copy[i] = {
      ...copy[i],
      [field]: value
    };

    const row = copy[i];

    // ================= LIVE TIME VALIDATION =================

    if (
      row.startTime &&
      row.endTime &&
      row.duration
    ) {

      const start = new Date(`2000-01-01T${row.startTime}`);
      const end = new Date(`2000-01-01T${row.endTime}`);

      const diffMins = (end - start) / (1000 * 60);

      // ❌ invalid time range
      if (diffMins <= 0) {

        row.perDay = "";

        setErrors(prevErrors => {

          const updated = { ...prevErrors };

          if (!updated.rows) {
            updated.rows = [];
          }

          if (!updated.rows[i]) {
            updated.rows[i] = {};
          }

          updated.rows[i].endTime =
            "validation:end_time_greater_than_start";

          return updated;
        });

      } else {

        // ✅ valid range → calculate interviews
        const interviews = Math.floor(
          diffMins / Number(row.duration)
        );

        row.perDay = interviews.toString();

        // clear end time validation
        setErrors(prevErrors => {

          const updated = { ...prevErrors };

          if (updated.rows?.[i]?.endTime) {
            delete updated.rows[i].endTime;

            // remove empty object
            if (
              Object.keys(updated.rows[i]).length === 0
            ) {
              delete updated.rows[i];
            }
          }

          return updated;
        });
      }
    }

    return copy;
  });

  // ================= CLEAR FIELD ERRORS =================

  setErrors(prevErrors => {

    const updated = { ...prevErrors };

    if (updated.rows?.[i]) {

      // clear current field error
      delete updated.rows[i][field];

      // clear dependent validations
      if (
        field === "startTime" ||
        field === "endTime" ||
        field === "duration"
      ) {
        delete updated.rows[i].perDay;
      }

      // remove empty row object
      if (
        Object.keys(updated.rows[i]).length === 0
      ) {
        delete updated.rows[i];
      }
    }

    // clear panel error when user selects panel
    if (field === "panelId") {
      delete updated.panelId;
    }

    return updated;
  });
};

const clearPanelError = () => {

  setErrors(prev => {

    const updated = { ...prev };

    delete updated.panelId;

    return updated;
  });

};

  /* ================= SAVE ================= */

  const handleSave = () => {
 const v = validatePanelModal({
  rows,
  panelId
});
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
    maxDate,    // ✅ ADD
    clearPanelError
  };
};
