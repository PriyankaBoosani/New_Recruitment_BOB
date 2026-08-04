import React, { useState } from "react";
import { Container } from "react-bootstrap";

import ApprovalHeader from "../components/ApprovalHeader";
import ApprovalStats from "../components/ApprovalStats";
import ScreeningApprovalTable from "../components/ScreeningApprovalTable";
import InterviewApprovalTable from "../components/InterviewApprovalTable";
import ApprovalPagination from "../components/ApprovalPagination";
import ApprovalCommentModal from "../components/ApprovalCommentModal";
import { useEffect } from "react";
import useApprovalFilters from "../hooks/useApprovalFilters";
import PdfViewerModal from "../../candidatePreview/components/PdfViewerModal";

import "../../../style/css/ScreeningApproval.css";
import "../../../style/css/CandidateScreening.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import masterApiService from "../../master/services/masterApiService";
import candidateWorkflowServices from "../../candidatePreview/services/CandidateWorkflowServices";
export default function Approval() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "screening"
  );
  const handleViewProfile = (candidate) => {
    navigate("/candidate-preview", {
      state: {
        candidate,
        requisition: selectedRequisitionOption?.raw,
        position: selectedPositionOption?.raw,

        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        positionId: candidate.positionId,
        candidatePositionId: candidate.positionId,
        requisitionId: selectedRequisitionOption?.value,

        page,
        pageSize,

        selectedRequisitionOption,
        selectedPositionOption,

        fromApproval: true,
        activeTab,

        // Add these
        fromInterviewPool: true,
        from: "/candidate-interviewer",
      },
    });
  };
  const handleViewFile = async (candidate) => {
    if (!candidate.fileUrl) {
      toast.error("candidateWorkflow:no_document_available");
      return;
    }

    try {
      setLoadingPdf(true);
      const res = await masterApiService.getAzureBlobSasUrl(
        candidate.fileUrl,
        "candidate"
      );

      const sasUrl = res || res?.data;

      if (!sasUrl) throw new Error("Invalid SAS URL");

      setPdfUrl(sasUrl.trim());
      setShowPdfViewer(true);
    } catch (err) {
      console.error(err);
      toast.error("failed_open_document");
    } finally {
      setLoadingPdf(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 42,
      height: 42,
    }),
  };
  const {
    requisitionOptions,
    positionOptions,

    loadingRequisitions,
    loadingPositions,

    selectedRequisitionOption,
    selectedPositionOption,

    fetchRequisitions,
    onRequisitionChange,
    onPositionChange,
    candidates,
    candidateSummary,
    loadingCandidates,
    searchText,
    onSearch,
    handleDownload,
  } = useApprovalFilters();
  useEffect(() => {
    fetchRequisitions();
  }, []);

  useEffect(() => {
    if (!requisitionOptions.length) return;

    const reqOption =
      location.state?.selectedRequisitionOption ||
      requisitionOptions.find(
        (r) => r.value === location.state?.requisition?.id
      );

    if (reqOption) {
      onRequisitionChange(reqOption);
    }

    setPage(location.state?.page ?? 0);
    setPageSize(location.state?.pageSize ?? 5);
  }, [requisitionOptions]);
  useEffect(() => {
    if (!positionOptions.length) return;

    const posOption =
      location.state?.selectedPositionOption ||
      (() => {
        const positionId =
          location.state?.position?.raw?.positionId ||
          location.state?.position?.positionId;

        return positionOptions.find((p) => p.value === positionId);
      })();

    if (posOption) {
      onPositionChange(
        posOption,
        activeTab === "screening" ? "SCREENING" : "INTERVIEW"
      );
    }
  }, [positionOptions]);

  useEffect(() => {
    if (!selectedPositionOption) return;

    const timer = setTimeout(() => {
      onPositionChange(
        selectedPositionOption,
        activeTab === "screening" ? "SCREENING" : "INTERVIEW",
        searchText
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText, activeTab]);

  const currentData = candidates;
  const pageInfo = {
    totalElements: currentData.length,
    totalPages: Math.ceil(currentData.length / pageSize),
  };

  const paginatedData = currentData.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const getVisiblePages = (currentPage, totalPages) => {
    const pages = [];

    for (
      let i = Math.max(0, currentPage - 1);
      i < Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }

    return { pages };
  };

  const handleApprove = () => {
    setActionType("approve");
    setShowCommentModal(true);
  };

  const handleReject = () => {
    setActionType("reject");
    setShowCommentModal(true);
  };

  const handleApprovalAction = async (comment) => {
    try {
      const payload = {
        positionIds: [selectedPositionOption.value],
        stage: activeTab === "screening" ? "SCREENING" : "INTERVIEW",
        action: actionType === "approve" ? "APPROVE" : "REJECT",
        comments: comment,
      };

      console.log("Approval Payload:", payload);

      const res =
        await candidateWorkflowServices.submitScreeningForApproval(payload);

      // Check API success
      if (!res?.success) {
        toast.error(res?.message || "Failed to process approval.");
        return;
      }

      toast.success(
        res?.message ||
          (actionType === "approve"
            ? "Approved Successfully"
            : "Rejected Successfully")
      );

      setShowCommentModal(false);

      // Refresh candidates & summary
      onPositionChange(
        selectedPositionOption,
        activeTab === "screening" ? "SCREENING" : "INTERVIEW"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to process approval."
      );
    }
  };

  return (
    <div className="screening-page">
      <Container fluid className="screening-approval-page">
        <div className="requisition-request-header">
          <ApprovalHeader
            selectStyles={selectStyles}
            requisitionOptions={requisitionOptions}
            positionOptions={positionOptions}
            selectedRequisitionOption={selectedRequisitionOption}
            selectedPositionOption={selectedPositionOption}
            loadingRequisitions={loadingRequisitions}
            loadingPositions={loadingPositions}
            onRequisitionChange={onRequisitionChange}
            onPositionChange={onPositionChange}
            activeTab={activeTab}
            searchText={searchText}
            onSearch={onSearch}
          />
        </div>

        <div className="tabs-identifier">
          <div className="card rounded border-0">
            <div className="card-header bg-transparent border-0 p-0 px-1 candidate-screening-tabs-header">
              <ul className="nav nav-tabs border-0 pt-2 pb-3 px-2 tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link fs-14 ${
                      activeTab === "screening"
                        ? "orange-color orange-bottom-border"
                        : "text-muted"
                    }`}
                    onClick={() => {
                      setActiveTab("screening");
                      setPage(0);
                    }}
                    type="button"
                  >
                    Screening Approval
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link fs-14 ${
                      activeTab === "interview"
                        ? "orange-color orange-bottom-border"
                        : "text-muted"
                    }`}
                    onClick={() => {
                      setActiveTab("interview");
                      setPage(0);
                    }}
                    type="button"
                  >
                    Interview Approval
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="requisition-page-content">
          <ApprovalStats
            total={candidateSummary?.totalCandidates ?? candidates.length}
            approved={
              activeTab === "screening"
                ? (candidateSummary?.shortlistedCandidates ??
                  candidates.filter((c) => c.result === "Shortlisted").length)
                : (candidateSummary?.qualifiedCandidates ??
                  candidates.filter((c) => c.result === "Qualified").length)
            }
            rejected={
              activeTab === "screening"
                ? (candidateSummary?.rejectedCandidates ??
                  candidates.filter((c) => c.result === "Rejected").length)
                : (candidateSummary?.disqualifiedCandidates ??
                  candidates.filter((c) => c.result === "Disqualified").length)
            }
            approvedLabel={
              activeTab === "screening" ? "Shortlisted" : "Qualified"
            }
            rejectedLabel={
              activeTab === "screening" ? "Not Shortlisted" : "Disqualified"
            }
            workflowStatus={candidateSummary?.workflowStatus}
            onApprove={handleApprove}
            onReject={handleReject}
            onDownload={() =>
              handleDownload(
                activeTab === "screening" ? "SCREENING" : "INTERVIEW"
              )
            }
          />

          {activeTab === "screening" ? (
            <ScreeningApprovalTable
              candidates={paginatedData}
              loading={loadingCandidates}
              onViewProfile={handleViewProfile}
              onViewResume={handleViewFile}
            />
          ) : (
            <InterviewApprovalTable
              candidates={paginatedData}
              loading={loadingCandidates}
              onViewProfile={handleViewProfile}
              onViewResume={handleViewFile}
            />
          )}

          <ApprovalPagination
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            pageInfo={pageInfo}
            getVisiblePages={getVisiblePages}
          />

          <ApprovalCommentModal
            show={showCommentModal}
            actionType={actionType}
            onClose={() => setShowCommentModal(false)}
            onConfirm={handleApprovalAction}
          />
        </div>
        <PdfViewerModal
          show={showPdfViewer}
          onHide={() => {
            setShowPdfViewer(false);
            setPdfUrl(null);
          }}
          fileUrl={pdfUrl}
          loading={loadingPdf}
          title="candidateWorkflow:candidate_resume"
        />
      </Container>
    </div>
  );
}
