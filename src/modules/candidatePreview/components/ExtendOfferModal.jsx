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
}) {
  const { t } = useTranslation(["candidateWorkflow", "common"]);

  const [extendedDate, setExtendedDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [remarksError, setRemarksError] = useState(false);

  const todayString = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!show) {
      setExtendedDate("");
      setRemarks("");
      setDateError(false);
      setRemarksError(false);
    }
  }, [show]);

  const candidate = selectedCandidates[0] || {};
  const status = candidate.status;

  const acceptBefore = candidate.rawAcceptBeforeDate || candidate.acceptBeforeDate;
  const extendedDateVal =
    candidate.rawExtensionDate ||
    candidate.rawExtendedOfferDate ||
    candidate.extensionDate;
  const joiningDateVal = candidate.rawJoiningDate || candidate.joiningDate;

  const today = todayString();

  const isAcceptBeforeExpired = acceptBefore ? acceptBefore <= today : false;
  const isExtendedDateExpired = extendedDateVal ? extendedDateVal <= today : false;
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
    if (!extendedDate) {
      setDateError(true);
      toast.error(
        t("candidateWorkflow:select_extended_offer_date") ||
          "Please select an extended offer date"
      );
      return;
    }

    if (extendedDate <= todayString()) {
      setDateError(true);
      toast.error(
        t("candidateWorkflow:extended_date_greater_than_today") ||
          "Extended date must be greater than today"
      );
      return;
    }

    setDateError(false);

    if (!extendValidation.canProceed) {
      toast.error(extendValidation.reason);
      return;
    }

    try {
      setLoading(true);

      // UPDATED PAYLOAD HERE
      const payload = selectedCandidates.map((c) => ({
        offerId: c.candidateOfferId || c.id,
        extensionDate: extendedDate,
        extensionComments: remarks || "", // Added extensionComments field
      }));

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
    if (!remarks || !remarks.trim()) {
      setRemarksError(true);
      toast.error(
        t("candidateWorkflow:remarks_required_for_rejection") ||
          "Remarks / Reason are mandatory for rejection"
      );
      return;
    }

    setRemarksError(false);

    if (!rejectValidation.canProceed) {
      toast.error(rejectValidation.reason);
      return;
    }

    try {
      setLoading(true);

      const offerIds = selectedCandidates.map(
        (c) => c.candidateOfferId || c.id
      );
      
      // Updated payload mapping 'remarks' to the 'comments' key as required
      const payload = {
        comments: remarks,
        offerIds: offerIds,
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
      console.error("Cancel Offers Error Catch:", err);

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
          {t("candidateWorkflow:manage_offer_validity") || "Manage Offer Validity"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="fs-14 text-muted mb-3">
          {t("candidateWorkflow:managing_offer_for") || "Managing offer for"}{" "}
          <strong>{selectedCandidates.length}</strong>{" "}
          {selectedCandidates.length === 1
            ? t("candidateWorkflow:candidate") || "candidate"
            : t("candidateWorkflow:candidates") || "candidate(s)"}.
        </p>

        {/* Date Input for Extension */}
        <Form.Group className="mb-3">
          <Form.Label className="fs-13 fw-normal blue-color">
            {t("candidateWorkflow:new_extended_offer_date") ||
              "New Extended Offer Date"}{" "}
            <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="date"
            className={`fs-13 ${dateError ? "border-danger" : ""}`}
            min={todayString()}
            value={extendedDate}
            onChange={(e) => {
              setExtendedDate(e.target.value);
              if (e.target.value) setDateError(false);
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
            {t("candidateWorkflow:remarks_reason") || "Remarks / Reason"}{" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            className={`fs-13 ${remarksError ? "border-danger" : ""}`}
            placeholder={
              t("candidateWorkflow:enter_remarks") ||
              "Enter remarks (mandatory for rejection)"
            }
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (e.target.value.trim()) setRemarksError(false);
            }}
          />
          {remarksError && (
            <small className="text-danger mt-1 d-block fs-12">
              {t("candidateWorkflow:remarks_required_for_rejection") ||
                "Remarks / Reason are mandatory for rejection"}
            </small>
          )}
        </Form.Group>
      </Modal.Body>

     <Modal.Footer className="d-flex justify-content-end">
  {/* Both Reject and Extend buttons rendered side-by-side */}
  <div className="d-flex gap-2 align-items-center">
    <Button
      variant="danger"
      size="sm"
      className="border-0 fw-bold rounded-3 px-3 py-2 d-flex align-items-center justify-content-center"
      style={{ minWidth: "125px" }}
      disabled={loading}
      onClick={handleReject}
    >
      {loading
        ? t("common:processing") || "Processing..."
        : t("candidateWorkflow:reject_offer") || "Reject Offer"}
    </Button>

    <Button
      variant="primary"
      size="sm"
      className="orange-bg border-0 fw-bold rounded-3 px-3 py-2 d-flex align-items-center justify-content-center"
      style={{ minWidth: "125px" }}
      onClick={handleExtend}
      disabled={loading}
    >
      {loading
        ? t("common:processing") || "Processing..."
        : t("candidateWorkflow:extend_date") || "Extend Date"}
    </Button>
  </div>
</Modal.Footer>
    </Modal>
  );
}