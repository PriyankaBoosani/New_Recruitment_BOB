import React from "react";
import { Modal, Table, Spinner } from "react-bootstrap";
import "../../../style/css/ApprovalHistoryModal.css";
import { useTranslation } from "react-i18next";

// 1. Format date with time for regular history
const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}.${minutes}${ampm}`;
};

// 2. Format date ONLY (removes time like 2.43pm)
const formatDateOnly = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const formatStatusLabel = (status = "") =>
  status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ApprovalHistoryModal = ({
  show,
  onClose,
  historyData = [],
  loading = false,
  title,
  subtitle,
}) => {
  const historyArray = Array.isArray(historyData) ? historyData : [];
  const { t } = useTranslation(["approvalHistory", "candidateWorkflow"]);

  const hasExtensionDateColumn = historyArray.some(
    (item) => item.extensionDate !== undefined
  );

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      className="approval-history-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="approval-history-title">
            {title || t("approvalHistory:approval_history")}
          </Modal.Title>
          <p className="approval-history-subtitle">
            {subtitle || t("approvalHistory:track_approvals_and_decisions")}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="approval-history-table">
              <thead>
                <tr>
                  <th className="text-white fs-14 fw-normal blue-bg">
                    {hasExtensionDateColumn
                      ? t("candidateWorkflow:extended_by") || "Extended By"
                      : t("approvalHistory:approver")}
                  </th>
                  <th className="text-white fs-14 fw-normal blue-bg">
                    {hasExtensionDateColumn
                      ? t("candidateWorkflow:extended_on") || "Extended On"
                      : t("approvalHistory:approval_date")}
                  </th>
                  <th className="text-white fs-14 fw-normal blue-bg">
                    {t("approvalHistory:status")}
                  </th>

                  {hasExtensionDateColumn && (
                    <th className="text-white fs-14 fw-normal blue-bg">
                      {t("candidateWorkflow:offer_extended_date") || "Extended Date"}
                    </th>
                  )}

                  <th className="text-white fs-14 fw-normal blue-bg">
                    {t("approvalHistory:comments")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {historyArray.length > 0 ? (
                  [...historyArray]
                    .sort(
                      (a, b) => new Date(b.actionDate) - new Date(a.actionDate)
                    )
                    .map((item) => (
                      <tr key={item.approvalId}>
                        <td className="fw-normal fs-14 mb-0">
                          {item.approverName || "-"}
                        </td>

                        <td className="fw-normal fs-14 mb-0">
                          {hasExtensionDateColumn
                            ? formatDateOnly(item.actionDate)
                            : formatDateTime(item.actionDate)}
                        </td>

                        <td className="fw-normal fs-14 mb-0">
                          {formatStatusLabel(item.status)}
                        </td>

                        {hasExtensionDateColumn && (
                          <td className="fw-normal fs-14 mb-0">
                            {item.extensionDate || "-"}
                          </td>
                        )}

                        <td className="fw-normal fs-14 mb-0">
                          {item.comments || "-"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={hasExtensionDateColumn ? 5 : 4}
                      className="text-center py-4 text-muted fs-14"
                    >
                      {t("approvalHistory:no_history_available")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ApprovalHistoryModal;