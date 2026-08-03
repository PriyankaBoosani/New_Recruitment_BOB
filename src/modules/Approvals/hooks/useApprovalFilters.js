import { useState } from "react";
import { toast } from "react-toastify";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { mapWorkflowApprovalCandidates } from "../mapper/candidateWorkflowApprovalMapper";

const useApprovalFilters = () => {
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
      console.log("Candidate Summary:", summaryRes.data);

      setCandidateSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load candidates");
    } finally {
      setLoadingCandidates(false);
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
  };
};

export default useApprovalFilters;
