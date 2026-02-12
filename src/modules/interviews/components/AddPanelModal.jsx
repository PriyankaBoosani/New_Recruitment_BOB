import React from "react";
import { Modal, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAddPanelModal } from "../../interviews/hooks/useAddPanelModal";
import "../../../style/css/InterviewPanelsConfig.css";

const AddPanelModal = ({
  show,
  onClose,
  onSave,
  mode = "add",
  initialPanel = "",
  initialRows = []
}) => {

  const { t } = useTranslation(["interviewSchedule", "common"]);

  const {
    panelName,
    setPanelName,
    rows,
    errors,
    addRow,
    removeRow,
    updateRow,
    handleSave,
    handleCancel
  } = useAddPanelModal({
    show,
    initialPanel,
    initialRows,
    onSave,
    onClose
  });

  return (
    <Modal show={show} onHide={handleCancel} centered dialogClassName="ap-modal">
      <Modal.Body className="ap-body">

        {/* HEADER */}
        <div className="ap-header">
          <div>
            <div className="ap-title">
              {mode === "edit" ? t("edit_title") : t("add_title")}
            </div>
            <div className="ap-sub">
              {mode === "edit" ? t("edit_sub") : t("add_sub")}
            </div>
          </div>

          <button className="ap-close" onClick={handleCancel}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* SELECT PANEL */}
        <Form.Group className="mb-4">
          <Form.Label className="ap-label">
            {t("select_panel")} <span>*</span>
          </Form.Label>

          <div className="ap-select-wrap">
            <Form.Select
              className="ap-input ap-no-arrow"
              disabled={mode === "edit"}
              value={panelName || ""}
              onChange={(e) => setPanelName(e.target.value)}
            >

              {/* ✅ placeholder */}
              <option value="">
                {t("select_panel_placeholder")}
              </option>

              <option value="Panel 1">Panel 1</option>
              <option value="Panel 2">Panel 2</option>
              <option value="Panel 3">Panel 3</option>
              <option value="Panel 4">Panel 4</option>
              <option value="Panel 5">Panel 5</option>

            </Form.Select>

            <i className="bi bi-chevron-down ap-select-icon" />
          </div>
        </Form.Group>

        {/* ROWS */}
        {rows.map((row, i) => (
          <div key={i} className="ap-row">

            {/* DATE */}
            <div>
              <Form.Label className="ap-label">
                {t("panel_date")} <span>*</span>
              </Form.Label>

              <div className="ap-icon-input">
                <input
                  type="date"
                  className={`ap-input ap-no-date ${
                    errors?.rows?.[i]?.date ? "ap-error" : ""
                  }`}
                  value={row.date}
                  onChange={(e) => updateRow(i, "date", e.target.value)}
                />
                <i className="bi bi-calendar3 ap-calendar" />
              </div>

              <div className="field-error">
                {errors?.rows?.[i]?.date ? t(errors.rows[i].date) : ""}
              </div>
            </div>

            {/* PER DAY */}
            <div>
              <Form.Label className="ap-label">
                {t("interviews_per_day")} <span>*</span>
              </Form.Label>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                placeholder={t("enter_interviews_per_day")}
                className={`ap-inputs ${
                  errors?.rows?.[i]?.perDay ? "ap-error" : ""
                }`}
                value={row.perDay}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  updateRow(i, "perDay", onlyNums);
                }}
              />

              <div className="field-error">
                {errors?.rows?.[i]?.perDay ? t(errors.rows[i].perDay) : ""}
              </div>
            </div>

            {/* ADD / DELETE */}
            <div className="ap-btn-col">
              {i === 0 ? (
                <button type="button" className="ap-plus" onClick={addRow}>
                  <i className="bi bi-plus-lg" />
                </button>
              ) : (
                <button
                  type="button"
                  className="ap-trash"
                  onClick={() => removeRow(i)}
                >
                  <i className="bi bi-trash" />
                </button>
              )}
            </div>

          </div>
        ))}

        {/* FOOTER */}
        <div className="ap-footer">
          <button className="ap-cancel" onClick={handleCancel}>
            {t("common:cancel")}
          </button>
          <button className="ap-save" onClick={handleSave}>
            {t("common:save")}
          </button>
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default AddPanelModal;
