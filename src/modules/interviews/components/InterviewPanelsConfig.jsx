import React from "react";
import { Form } from "react-bootstrap";
import "../../../style/css/InterviewPanelsConfig.css";
import AddPanelModal from "../../interviews/components/AddPanelModal";
import DeleteConfirmModal from "../../interviews/components/DeleteConfirmModal";
import { useInterviewPanels } from "../../interviews/hooks/useInterviewPanels";
import { useTranslation } from "react-i18next";
import ApplySuccessModal from "../../interviews/components/ApplySuccessModal";



const InterviewPanelsConfig = ({
  startTime,
  onStartTimeChange,
  onImportPanel,
  onApplyAll
}) => {

  const {
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
  } = useInterviewPanels();

  const activeCount = panels.length;
  const { t } = useTranslation(["interviewSchedule", "common"]);
  const [showApplySuccess, setShowApplySuccess] = React.useState(false);
  const [scheduledCount, setScheduledCount] = React.useState(0);



  return (
    <>
      <div className="ipc-card mt-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="ipc-title d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event"></i>
            {t("panel_config_title")}
          </div>

          <div className="d-flex gap-2">
            <button className="ipc-btn-blue" onClick={onImportPanel}>
              <i className="bi bi-upload me-2"></i>
              {t("import_panel")}
            </button>

            <button
              className="ipc-btn-blue"
              onClick={() => {
                setOpenInfoIndex(null);
                setEditPanel(null);
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              {t("add_panel")}
            </button>
          </div>

        </div>

        <hr />

        {/* LABEL */}
        <div className="d-flex justify-content-between mb-2">
          <label className="ipc-label">
            {t("interview_panels")} <span className="text-danger">*</span>
          </label>

          <span className="ipc-count">
            {t("active_panels", { count: activeCount })}
          </span>
        </div>

        {/* PANEL CHIPS */}
        <div className="ipc-panel-box" ref={panelBoxRef}>

          {panels.map((p, i) => (
            <div key={i} className="ipc-panel-chip">

              <span className="ipc-panel-name">{p.name}</span>

              <i
                className="bi bi-people ipc-chip-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenInfoIndex(prev => prev === i ? null : i);
                }}
              />

              {openInfoIndex === i && (
                <>
                  <i
                    className="bi bi-pencil ipc-chip-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(p, i);
                    }}
                  />

                  <i
                    className="bi bi-trash ipc-chip-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenInfoIndex(null);
                      setDeleteIndex(i);
                    }}
                  />
                </>
              )}

              {openInfoIndex === i && (
                <div className="ipc-chip-popover">
                  <div className="ipc-pop-head">
                    <span>{t("date")}</span>
                    <span>{t("interviews")}</span>

                  </div>

                  {(p.slots || []).map((s, idx) => (
                    <div key={idx} className="ipc-pop-row">
                      <span>
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                      <span>{s.perDay} {t("per_day")}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}

        </div>

        {/* START TIME */}
        <div className="row mt-3 align-items-end">

          <div className="col-md-3">
            <Form.Label className="ipc-label">
              {t("start_time")} <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="ipc-time-input"
            />
          </div>

          <div className="col-md-3 ms-auto text-md-end mt-3 mt-md-0">
            <button className="ipc-apply-btn" onClick={() => {
              const count = onApplyAll?.();   // call your logic
              setScheduledCount(count || 0);
              setShowApplySuccess(true);
            }}
            >
              <i className="bi bi-check2-circle me-2"></i>
              {t("apply_to_all")}
            </button>
          </div>

        </div>

      </div>

      {/* MODALS */}

      <AddPanelModal
        show={showAddModal}
        mode={editPanel ? "edit" : "add"}
        initialPanel={editPanel?.name}
        initialRows={editPanel?.slots}
        onClose={() => setShowAddModal(false)}
        onSave={savePanel}
      />

      <DeleteConfirmModal
        show={deleteIndex !== null}
        name={panels[deleteIndex]?.name}
        onCancel={() => setDeleteIndex(null)}
        onConfirm={() => confirmDelete(deleteIndex)}
      />

      <ApplySuccessModal
        show={showApplySuccess}
        count={scheduledCount}
        onOk={() => setShowApplySuccess(false)}
      />



    </>
  );
};

export default InterviewPanelsConfig;
