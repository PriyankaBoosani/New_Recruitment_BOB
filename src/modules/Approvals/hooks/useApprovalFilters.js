import { useState } from "react";
import { toast } from "react-toastify";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { mapWorkflowApprovalCandidates } from "../mapper/candidateWorkflowApprovalMapper";
import { useTranslation } from "react-i18next";
const useApprovalFilters = () => {
  const { t } = useTranslation("approvalHistory");
  const [requisitionOptions, setRequisitionOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);

  const [loadingRequisitions, setLoadingRequisitions] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateSummary, setCandidateSummary] = useState(null);
  const [searchText, setSearchText] = useState("");
  const onSearch = (value) => {
    setSearchText(value);
  };
  const fetchRequisitions = async () => {
    try {
      setLoadingRequisitions(true);

      const res = await committeeManagementService.getRequisitions();
      const data = res?.data || [];

      const mapped = data.map((req) => ({
        label: `${req.requisitionCode} - ${req.requisitionTitle}`,
        value: req.id,
        raw: req,
      }));

      setRequisitionOptions(mapped);
    } catch {
      toast.error("Failed to load requisitions");
    } finally {
      setLoadingRequisitions(false);
    }
  };

  const fetchPositions = async (requisitionId) => {
    try {
      setLoadingPositions(true);

      const res =
        await committeeManagementService.getPositionsByRequisition(
          requisitionId
        );

      const data = res?.data || [];

      const mapped = data.map((item) => ({
        label: item.masterPositions?.positionName,
        value: item.jobPositions?.positionId,
        raw: {
          ...item.jobPositions,
          ...item.masterPositions,
        },
      }));

      setPositionOptions(mapped);
    } catch {
      toast.error("Failed to load positions");
    } finally {
      setLoadingPositions(false);
    }
  };

  const onRequisitionChange = async (req) => {
    const requisition = req?.raw || req;

    setSelectedRequisition(requisition);

    setSelectedPosition(null);
    setPositionOptions([]);
    setCandidates([]);

    if (!requisition?.id) return;

    await fetchPositions(requisition.id);
  };
  const onPositionChange = async (
    pos,
    stage = "SCREENING",
    search = searchText
  ) => {
    const position = pos?.raw || pos;

    setSelectedPosition(position);

    if (!position?.positionId) {
      setCandidates([]);
      return;
    }

    try {
      setLoadingCandidates(true);

      const payload = {
        searchText: search,
        page: 0,
        size: 10,
        positionIds: [position.positionId],
       
        status:
          stage === "SCREENING"
            ? ["SHORTLISTED", "REJECTED"]
            : ["QUALIFIED", "DISQUALIFIED"], // <-- only if interview API expects these
        stateId: "",
        categoryId: "",
        rank: false,
        score: false,
      };
      const res =
        stage === "SCREENING"
          ? await jobPositionApiService.getScreeingByPosition(payload)
          : await jobPositionApiService.getInterviewByPosition(payload);
      const mappedCandidates = mapWorkflowApprovalCandidates(res.data, stage);

      setCandidates(mappedCandidates);

      const summaryRes = await jobPositionApiService.getCandidateSummary(
        position.positionId,
        stage
      );

      setCandidateSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
      toast.error(t("failed_to_load_candidates"));
    } finally {
      setLoadingCandidates(false);
    }
  };
  const handleDownload = async (stage = "SCREENING") => {
    try {
      if (!selectedPosition?.positionId) {
        toast.info(t("please_select_position_to_download"));
        return;
      }

      const isScreening = stage.toUpperCase() === "SCREENING";

      const payload = {
        documentType: ".pdf",
        positionIds: [selectedPosition.positionId],
        screenName: isScreening ? "ScreeningApproval" : "InterviewApproval",
        candidateApplicationStatuses: isScreening
          ? ["SHORTLISTED", "REJECTED"]
          : [],
        interviewSchedulingStatuses: isScreening
          ? []
          : ["QUALIFIED", "DISQUALIFIED"],
      };


      const res = await jobPositionApiService.downloadCandidateDetails(payload);

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "candidate-details.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error(t("failed_to_download_pdf"));
    }
  };
  const selectedRequisitionOption = selectedRequisition
    ? {
        label: `${selectedRequisition.requisitionCode} - ${selectedRequisition.requisitionTitle}`,
        value: selectedRequisition.id,
        raw: selectedRequisition,
      }
    : null;

  const selectedPositionOption = selectedPosition
    ? {
        label: selectedPosition.positionName,
        value: selectedPosition.positionId,
        raw: selectedPosition,
        isLocationWise: true

      }
    : null;

  return {
    requisitionOptions,
    positionOptions,

    loadingRequisitions,
    loadingPositions,

    selectedRequisition,
    selectedPosition,

    selectedRequisitionOption,
    selectedPositionOption,

    fetchRequisitions,
    onRequisitionChange,
    onPositionChange,
    candidates,
    loadingCandidates,
    candidateSummary,
    searchText,
    onSearch,
    handleDownload,
  };
};

export default useApprovalFilters;
