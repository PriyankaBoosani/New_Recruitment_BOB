import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";

export default function ExtendOfferModal({
  show,
  onHide,
  selectedCandidates = [],
  isSingleMode = false,
  onExtendSuccess,
  onRejectSuccess,
  offerSelectAll,
  offerSelectedIds,
  excludedOfferIds,
  selectedPositionId,
  filters,
}) {
  const { t } = useTranslation(["candidateWorkflow", "common"]);

  const [extendedDate, setExtendedDate] = useState("");
  const [extendRemarks, setExtendRemarks] = useState("");
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [remarksError, setRemarksError] = useState(false);
  const [activeActionTab, setActiveActionTab] = useState("EXTEND");

  const todayString = () => new Date().toISOString().split("T")[0];

  // ADD THIS RIGHT NEXT TO todayString()
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!show) {
      setExtendedDate("");
      setExtendRemarks("");
      setCancelRemarks("");
      setDateError(false);
      setRemarksError(false);
      setActiveActionTab("EXTEND");
    }
  }, [show]);

  const candidate = selectedCandidates[0] || {};
  const status = candidate.status;

  const acceptBefore =
    candidate.rawAcceptBeforeDate || candidate.acceptBeforeDate;
  const extendedDateVal =
    candidate.rawExtensionDate ||
    candidate.rawExtendedOfferDate ||
    candidate.extensionDate;
  const joiningDateVal = candidate.rawJoiningDate || candidate.joiningDate;

  const today = todayString();

  const isAcceptBeforeExpired = acceptBefore ? acceptBefore <= today : false;
  const isExtendedDateExpired = extendedDateVal
    ? extendedDateVal <= today
    : false;
  const isJoiningDateExpired = joiningDateVal ? joiningDateVal <= today : false;

  const extendValidation = useMemo(() => {
    if (!isSingleMode) return { canProceed: true, reason: "" };

    // if (status === "OFFER_SENT") {
    //   if (!isAcceptBeforeExpired) {
    //     return {
    //       canProceed: false,
    //       reason:
    //         t("candidateWorkflow:accept_before_date_not_expired") ||
    //         "Cannot extend: Accept Before Date has not expired yet.",
    //     };
    //   }
    //   if (isJoiningDateExpired) {
    //     return {
    //       canProceed: false,
    //       reason:
    //         t("candidateWorkflow:joining_date_already_passed") ||
    //         "Cannot extend: Joining Date has already passed.",
    //     };
    //   }
    //   return { canProceed: true, reason: "" };
    // }

    // if (status === "OFFER_EXTENDED") {
    //   if (!isExtendedDateExpired) {
    //     return {
    //       canProceed: false,
    //       reason:
    //         t("candidateWorkflow:extended_date_not_expired") ||
    //         "Cannot extend: Extended Offer Date has not expired yet.",
    //     };
    //   }
    //   if (isJoiningDateExpired) {
    //     return {
    //       canProceed: false,
    //       reason:
    //         t("candidateWorkflow:joining_date_already_passed") ||
    //         "Cannot extend: Joining Date has already passed.",
    //     };
    //   }
    //   return { canProceed: true, reason: "" };
    // }

    return {
      canProceed: false,
      reason:
        t("candidateWorkflow:invalid_status_for_extend") ||
        "Extension is only permitted for candidates with Offer Sent or Offer Extended status.",
    };
  }, [
    isSingleMode,
    status,
    isAcceptBeforeExpired,
    isExtendedDateExpired,
    isJoiningDateExpired,
    t,
  ]);

  const rejectValidation = useMemo(() => {
    if (!isSingleMode) return { canProceed: true, reason: "" };

    if (status === "OFFER_SENT") {
      if (!isAcceptBeforeExpired) {
        return {
          canProceed: false,
          reason:
            t("candidateWorkflow:cannot_reject_before_accept_expired") ||
            "Cannot reject: Accept Before Date has not expired yet.",
        };
      }
      return { canProceed: true, reason: "" };
    }

    if (status === "OFFER_EXTENDED") {
      if (!isExtendedDateExpired) {
        return {
          canProceed: false,
          reason:
            t("candidateWorkflow:cannot_reject_before_extension_expired") ||
            "Cannot reject: Extended Offer Date has not expired yet.",
        };
      }
      return { canProceed: true, reason: "" };
    }

    return { canProceed: true, reason: "" };
  }, [isSingleMode, status, isAcceptBeforeExpired, isExtendedDateExpired, t]);

  const handleExtend = async () => {
    let hasError = false;

    // Validate date
    if (!extendedDate) {
      setDateError(true);
      hasError = true;
    } else if (extendedDate < getTomorrowString()) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }

    // Validate comments
    if (!extendRemarks || !extendRemarks.trim()) {
      setRemarksError(true);
      hasError = true;
    } else {
      setRemarksError(false);
    }

    // Stop if any field has validation error
    if (hasError) {
      return;
    }

    if (!extendValidation.canProceed) {
      toast.error(extendValidation.reason);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        extensionDate: extendedDate,
        extensionComments: extendRemarks,
        selection: {
          selectAll: offerSelectAll,
          positionIds: selectedPositionId,
          selectedIds: offerSelectAll ? [] : offerSelectedIds,
          statusList: filters?.status || [],
          excludedIds: offerSelectAll ? excludedOfferIds : [],
        },
      };

      const res = await jobPositionApiService.extendOfferAcceptDate(payload);

      if (res?.success === false) {
        toast.error(
          res?.data ||
            res?.message ||
            t("candidateWorkflow:failed_extend_offer_date") ||
            "Failed to extend offer date"
        );
        return;
      }

      toast.success(
        t("candidateWorkflow:offer_date_extended_success") ||
          "Offer date extended successfully"
      );

      onExtendSuccess?.();
      onHide();
    } catch (err) {
      toast.error(
        err?.response?.data?.data ||
          err?.response?.data?.message ||
          t("candidateWorkflow:failed_extend_offer_date") ||
          "Failed to extend offer date"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!cancelRemarks || !cancelRemarks.trim()) {
      setRemarksError(true);
      return;
    }

    setRemarksError(false);

    if (!rejectValidation.canProceed) {
      toast.error(rejectValidation.reason);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        cancellationComments: cancelRemarks,
        selection: {
          selectAll: offerSelectAll,
          positionIds: selectedPositionId,
          selectedIds: offerSelectAll ? [] : offerSelectedIds,
          statusList: filters?.status || [],
          excludedIds: offerSelectAll ? excludedOfferIds : [],
        },
      };

      const res = await jobPositionApiService.cancelOffers(payload);

      if (res?.success === false) {
        toast.error(
          res?.data ||
            res?.message ||
            t("candidateWorkflow:failed_reject_offer") ||
            "Failed to reject offer"
        );
        return;
      }

      toast.success(
        t("candidateWorkflow:offer_rejected_success") ||
          "Offer rejected successfully"
      );

      onRejectSuccess?.();
      onHide();
    } catch (err) {
      console.error("Cancel Offers Error:", err);

      const errorData = err?.response?.data || err?.data || err;

      toast.error(
        errorData?.data ||
          errorData?.message ||
          t("candidateWorkflow:failed_reject_offer") ||
          "Failed to reject offer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-16 fw-semibold blue-color">
          {t("candidateWorkflow:manage_offer_validity") ||
            "Manage Offer Validity"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Action Tabs */}
        <div className="d-flex border-bottom mb-4">
          <button
            type="button"
            className={`border-0 bg-transparent px-3 py-2 fs-13 fw-semibold ${
              activeActionTab === "EXTEND"
                ? "text-primary border-bottom border-primary"
                : "text-muted"
            }`}
            onClick={() => {
              setActiveActionTab("EXTEND");
              setDateError(false);
              setRemarksError(false);
            }}
          >
            {t("candidateWorkflow:extend_date") || "Extend Date"}
          </button>

          <button
            type="button"
            className={`border-0 bg-transparent px-3 py-2 fs-13 fw-semibold ${
              activeActionTab === "CANCEL"
                ? "text-danger border-bottom border-danger"
                : "text-muted"
            }`}
            onClick={() => {
              setActiveActionTab("CANCEL");
              setDateError(false);
              setRemarksError(false);
            }}
          >
            {t("candidateWorkflow:cancel_offer") || "Cancel Offer"}
          </button>
        </div>

        {/* EXTEND DATE TAB */}
        {activeActionTab === "EXTEND" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="fs-13 fw-normal blue-color">
                {t("candidateWorkflow:new_extended_offer_date") ||
                  "New Extended Offer Date"}{" "}
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                type="date"
                className={`fs-13 ${dateError ? "border-danger" : ""}`}
                min={getTomorrowString()}
                value={extendedDate}
                onChange={(e) => {
                  setExtendedDate(e.target.value);
                  if (e.target.value) {
                    setDateError(false);
                  }
                }}
              />

              {dateError && (
                <small className="text-danger mt-1 d-block fs-12">
                  {t("candidateWorkflow:select_extended_offer_date") ||
                    "New Extended Offer Date is required"}
                </small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fs-13 fw-normal blue-color">
                {t("candidateWorkflow:remarks_reason") || "Comments"}{" "}
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                className={`fs-13 ${remarksError ? "border-danger" : ""}`}
                placeholder={t("candidateWorkflow:enter_comments")}
                value={extendRemarks}
                onChange={(e) => {
                  setExtendRemarks(e.target.value);

                  if (e.target.value.trim()) {
                    setRemarksError(false);
                  }
                }}
              />

              {remarksError && (
                <small className="text-danger mt-1 d-block fs-12">
                  {t("candidateWorkflow:remarks_required_for_extension") ||
                    "Comments are mandatory"}
                </small>
              )}
            </Form.Group>
          </>
        )}

        {/* CANCEL OFFER TAB */}
        {activeActionTab === "CANCEL" && (
          <Form.Group className="mb-3">
            <Form.Label className="fs-13 fw-normal blue-color">
              {t("candidateWorkflow:remarks_reason") || "Comments / Reason"}{" "}
              <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              className={`fs-13 ${remarksError ? "border-danger" : ""}`}
              placeholder={t("candidateWorkflow:enter_reason")}
              value={cancelRemarks}
              onChange={(e) => {
                setCancelRemarks(e.target.value);

                if (e.target.value.trim()) {
                  setRemarksError(false);
                }
              }}
            />

            {remarksError && (
              <small className="text-danger mt-1 d-block fs-12">
                {t("candidateWorkflow:remarks_required_for_rejection") ||
                  "Comments / Reason are mandatory"}
              </small>
            )}
          </Form.Group>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end">
        {activeActionTab === "EXTEND" ? (
          <Button
            variant="primary"
            size="sm"
            className="orange-bg border-0 fw-bold rounded-3 px-4 py-2"
            disabled={loading}
            onClick={handleExtend}
          >
            {loading
              ? t("common:processing") || "Processing..."
              : t("candidateWorkflow:extend_date") || "Extend Date"}
          </Button>
        ) : (
          <Button
            variant="danger"
            size="sm"
            className="border-0 fw-bold rounded-3 px-4 py-2"
            disabled={loading}
            onClick={handleReject}
          >
            {loading
              ? t("common:processing") || "Processing..."
              : t("candidateWorkflow:cancel_offer") || "Cancel Offer"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
