import { useState, useEffect } from "react";
import "../../../style/css/Committee.css";
import masterApiService from "../../master/services/masterApiService";
import committeeManagementService from "../services/committeeManagementService";
import { mapPanelsApi } from "../mappers/InterviewPanelMapper";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useAssignPositions = (userId) => {
  const { t } = useTranslation(["interviewPanelCommittee"]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    requisitionId: "",
    positionId: "",
    panelType: "",
    members: []
  });


  const [requisitions, setRequisitions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isManuallyDirty, setIsManuallyDirty] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [allPanels, setAllPanels] = useState([]);
  const [availablePanels, setAvailablePanels] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(0);
  const [size] = useState(1000);

  const [panelErrors, setPanelErrors] = useState({});

  const [originalCommittees, setOriginalCommittees] = useState({
    SCREENING: [],
    INTERVIEW: [],
    COMPENSATION: []
  });
  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .toLowerCase()              // l1_pending
      .replace("_", " ")          // l1 pending
      .replace(/\b\w/g, c => c.toUpperCase()); // L1 Pending
  };
const validateSinglePanel = (panel, today) => {
  const errors = {};
  let isValid = true;

  if (!panel.startDate) {
    errors.startDate = "start_date_required";
    isValid = false;
  }

  if (!panel.endDate) {
    errors.endDate = "end_date_required";
    isValid = false;
  }

  if (panel.startDate && panel.endDate &&
      new Date(panel.endDate) < new Date(panel.startDate)) {
    errors.endDate = "end_before_start";
    isValid = false;
  }

  if (!panel.positionPanelId && panel.endDate &&
      new Date(panel.endDate) <= today) {
    errors.endDate = "end_future_required";
    isValid = false;
  }

  if (!panel.members?.length) {
    errors.members = "member_required";
    isValid = false;
  }

  return { errors, isValid };
};
 const validatePanels = () => {
  const errors = {};
  let isValid = true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Object.entries(selectedCommittees)
    .flatMap(([type, panels]) =>
      panels.map(panel => ({ type, panel }))
    )
    .forEach(({ type, panel }) => {
      const key = `${type}_${panel.id}`;
      const result = validateSinglePanel(panel, today);

      if (!result.isValid) {
        errors[key] = result.errors;
        isValid = false;
      }
    });

  setPanelErrors(errors);

  if (!isValid) {
    toast.error(t("fix_committee_errors"));
  }

  return isValid;
};


  useEffect(() => {
    fetchRequisitions();
  }, []);



  const fetchRequisitions = async () => {
    try {
      const res = await committeeManagementService.getRequisitions();

      setRequisitions(res?.data || []);
    } catch (err) {
      console.error("Failed to load requisitions", err);
    }

  };

  const handleRequisitionChange = async (e) => {
    const reqId = e.target.value;

    setSelectedRequisition(reqId);
    setSelectedPosition(""); // reset position

    // 🔥 RESET PANEL STATE
    setSelectedCommittees({
      SCREENING: [],
      INTERVIEW: [],
      COMPENSATION: []
    });

    setAvailablePanels(allPanels); // reset from source of truth
    setPanelErrors({});
    setActiveTab("SCREENING");

    if (!reqId) {
      setPositions([]);
      return;
    }

    try {
      const res = await committeeManagementService.getPositionsByRequisition(reqId);
      setPositions(res?.data || []);
    } catch (err) {
      console.error("Failed to load positions", err);
    }
  };
  const loadPositionData = async (positionId) => {
    if (!positionId) {
      setSelectedCommittees({
        SCREENING: [],
        INTERVIEW: [],
        COMPENSATION: []
      });
      setAvailablePanels([]);
      setAllPanels([]); // ✅ add this
      setPanelErrors({});
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Load all panels first
      const panelsRes = await masterApiService.getInterviewPanelsSearch({
        page,
        size
      });

      const apiData = panelsRes?.data?.content || [];
      const mappedPanels = mapPanelsApi(apiData);
      setAllPanels(mappedPanels);

      // 2️⃣ Load assigned panels
      const assignedRes =
        await committeeManagementService.getPanelsByPosition(selectedPosition);

      const responseData = assignedRes?.data ?? {};

      const interviewPanelList = responseData?.interviewPanelList ?? [];
      const screeningPanelList = responseData?.screeningPanelList ?? [];
      const compensationPanelList = responseData?.compensationPanelList ?? [];
      const getStatusBadge = (status = "") => {
        switch (status) {
          case "APPROVED":
            return "success";
          case "REJECTED":
            return "danger";
          case "L1_REJECTED":
          case "L2_REJECTED":
            return "danger";
          case "NEW":
            return "warning";
          case "L1_PENDING":
            return "yellowwarning";
          case "L1_APPROVED":
            return "info";
          default:
            return "secondary";
        }
      };


      const mapAssigned = (list) =>
        list.map(p => {
          const rawStatus = p.positionPanelStatus ?? "";
          const isLocked = p.positionPanelStatus === "L1_APPROVED";
          return {
            id: p.interviewPanel.interviewPanelId,
            positionPanelId: p.positionPanelId,
            name: p.interviewPanel.panelName,
            committeeName: p.interviewPanel.committee.committeeName.toUpperCase(),
            committeeId: p.interviewPanel.committee.interviewCommitteeId,
            members: p.interviewPanel.panelMembers.map(m => ({
              ...m.panelMember,
              interviewPanelMemberId: m.interviewPanelMemberId
            })),
            startDate: p.startDate || "",
            endDate: p.endDate || "",


            canEdit: !isLocked && p.canEdit !== false,
            //      canEdit:
            // committeeType === "INTERVIEW"
            //   ? p.canEdit !== false
            //   : false,

            // ✅ SAME PATTERN AS REQUISITION
            rawStatus,
            statusType: getStatusBadge(rawStatus),

            // display text
            positionPanelStatus: rawStatus
              .toLowerCase()
              .replace("_", " ")
              .replace(/^l1/, "L1")
          };
        });


      const assigned = {
        SCREENING: mapAssigned(screeningPanelList),
        INTERVIEW: mapAssigned(interviewPanelList),
        COMPENSATION: mapAssigned(compensationPanelList)
      };

      setSelectedCommittees({
        SCREENING: assigned?.SCREENING || [],
        INTERVIEW: assigned?.INTERVIEW || [],
        COMPENSATION: assigned?.COMPENSATION || []
      });
      setOriginalCommittees(assigned);

      // 3️⃣ Calculate available panels properly
      const assignedIds = Object.values(assigned)
        .flat()
        .map(p => p.id);

      const available = mappedPanels.filter(
        p => !assignedIds.includes(p.id)
      );

      setAvailablePanels(available);

    } catch (err) {
      console.error("Load Position Data Error:", err);
      toast.error(t("failed_load_panels"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    loadPositionData(selectedPosition);

  }, [selectedPosition]);

  // const isDirty = () => {
  //   return (
  //     JSON.stringify(selectedCommittees) !== JSON.stringify(originalCommittees) ||
  //     isManuallyDirty
  //   );
  // };
  const isPanelChanged = (panel, originalPanel) => {
    if (!originalPanel) return true; // new panel

    return (
      panel.startDate !== originalPanel.startDate ||
      panel.endDate !== originalPanel.endDate 
      // JSON.stringify(panel.members.map(m => m.userId).sort()) !==
      // JSON.stringify(originalPanel.members.map(m => m.userId).sort())
    );
  };
const hasPanelChanged = (panels, originalPanels) => {
  if (panels.length !== originalPanels.length) return true;

  return panels.some(panel => {
    const original = originalPanels.find(p => p.id === panel.id);
    return isPanelChanged(panel, original);
  });
};
const isDirty = () => {
  return Object.entries(selectedCommittees)
    .flatMap(([type, panels]) =>
      panels.map(panel => ({ type, panel }))
    )
    .some(({ type, panel }) => {
      const original = originalCommittees?.[type]?.find(p => p.id === panel.id);
      return isPanelChanged(panel, original);
    });
};
  // const fetchPanels = useCallback(async () => {
  //   try {
  //     setLoading(true);

  //     const res = await masterApiService.getInterviewPanelsSearch({
  //       page,
  //       size
  //     });

  //     const apiData = res?.data?.content || [];
  //     const mapped = mapPanelsApi(apiData);
  //     setAllPanels(mapped);
  //     setAvailablePanels(mapped); // reset source of truth

  //   } catch (error) {
  //     console.error("Fetch Panels Error:", error);
  //     toast.error("Failed to load panels");
  //   } finally {
  //     setLoading(false);
  //   }
  // });

  // const handleEdit = (item) => {
  //   // Set form data for editing
  //   setFormData({
  //     requisitionId: item.requisitionId || "",
  //     positionId: item.positionId || "",
  //     panelType: item.panelType || "",
  //     members: item.members || []
  //   });
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this assignment?')) {
  //     return false;
  //   }

  //   try {
  //     setLoading(true);
  //     // Replace with actual API call
  //     // await masterApiService.deleteCommitteeAssignment(id);

  //     // Update local state
  //     setHistory(prev => prev.filter(item => item.id !== id));
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting assignment:', error);
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [activeTab, setActiveTab] = useState("SCREENING");
  const [showHistory, setShowHistory] = useState(true);

  const [selectedCommittees, setSelectedCommittees] = useState({
    SCREENING: [],
    INTERVIEW: [],
    COMPENSATION: []
  });
  const [context, setContext] = useState({
    requisitionId: "1",
    positionId: "1"
  });

  const updateCommitteeDate = (type, id, field, value) => {
    setSelectedCommittees(prev => ({
      ...prev,
      [type]: prev[type].map(c =>
        c.id === id
          ? { ...c, [field]: value, isDirty: true } // ✅ KEY
          : c
      )
    }));

    setIsManuallyDirty(true);

    // 2️⃣ CLEAR validation error for this field
    const errorKey = `${type}_${id}`;

    setPanelErrors(prev => {
      if (!prev?.[errorKey]?.[field]) return prev;

      return {
        ...prev,
        [errorKey]: {
          ...prev[errorKey],
          [field]: ""
        }
      };
    });

  };
  const showError = (message, errors = []) => {
    setErrorMessage(message);
    setErrorList(Array.isArray(errors) ? errors : []);
    setShowErrorModal(true);
  };

  const buildPanelPayload = (panel, originalPanel, seqIndex) => {
  const isChanged =
    !originalPanel ||
    panel.startDate !== originalPanel.startDate ||
    panel.endDate !== originalPanel.endDate ||
    JSON.stringify(panel.members.map(m => m.userId).sort()) !==
    JSON.stringify(originalPanel.members.map(m => m.userId).sort());

  const actionEnum = !panel.positionPanelId
    ? "ADD"
    : isChanged
      ? "MODIFY"
      : null;

  const positionPanelStatus =
    !panel.positionPanelId || isChanged
      ? "L1_PENDING"
      : panel.rawStatus;

  return {
    positionId: null,
    actionEnum,
    positionPanelStatus,
    interviewPanel: {
      panelName: panel.name,
      description: panel.description || "",
      committee: {
        committeeName: panel.committeeName,
        committeeDesc: panel.committeeDesc || "",
        interviewCommitteeId: panel.committeeId
      },
      panelMembers: panel.members.map(m => ({
        panelId: panel.id,
        panelMember: {
          name: m.name,
          role: m.role,
          email: m.email,
          userId: m.userId
        },
        interviewPanelMemberId: m.interviewPanelMemberId
      })),
      interviewPanelId: panel.id
    },
    startDate: panel.startDate,
    endDate: panel.endDate,
    sequenceNo: seqIndex,
    positionPanelId: panel.positionPanelId
  };
};
const pushToPayload = (payload, type, panelPayload) => {
  if (type === "INTERVIEW") {
    payload.interviewPanelList.push(panelPayload);
  } else if (type === "SCREENING") {
    payload.screeningPanelList.push(panelPayload);
  } else if (type === "COMPENSATION") {
    payload.compensationPanelList.push(panelPayload);
  }
};

  const handleAssignCommittees = async () => {
    if (loading) return;
    if (!selectedPosition) {
      toast.error(t("select_requisition_position"));
      return;
    }
    const isValid = validatePanels();
    if (!isValid) return; // ❌ stop here

    try {
      setLoading(true);

      const payload = {
        interviewPanelList: [],
        screeningPanelList: [],
        compensationPanelList: []
      };

    Object.entries(selectedCommittees).flatMap(([committeeType, panels]) =>
          panels.map((panel, seqIndex) => ({
            committeeType,
            panel,
            seqIndex
          }))
        )
      .forEach(({ committeeType, panel, seqIndex }) => {
        if (!panel) return;

        const originalPanel = originalCommittees?.[committeeType]
          ?.find(p => p.id === panel.id);

        const panelPayload = buildPanelPayload(panel, originalPanel, seqIndex);

        pushToPayload(payload, committeeType, panelPayload);
      });

      const res = await committeeManagementService.assignPanelToPosition(
        selectedPosition,
        payload
      );
      if (res?.success) {
        toast.success(t("assign_success"));

        // ✅ Reload updated data
        await loadPositionData(selectedPosition);
        setIsManuallyDirty(false);
      } else {
        // toast.error(res?.message || "Failed to assign committees");
        showError(res?.message || t("validation_failed"), res?.data || []);
      }

    } catch (err) {
      setLoading(false);
      console.error("ASSIGN ERROR 👉", err);
      toast.error(
        err?.response?.data?.message ||
        t("assign_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK IMPORT ================= */

  const bulkImportPositionAssignments = async (file) => {
    setLoading(true);

    try {
      const res = await committeeManagementService.bulkImportPositionAssignments(file);

      if (!res.success) {
        return {
          success: false,
          error: res.message || "Validation failed",
          details: res.data || []
        };
      }


      // Success case - refresh data
      if (selectedPosition) {
        await loadPositionData(selectedPosition);
        setIsManuallyDirty(false);
      }
      toast.success(res?.message || "Position assignments imported successfully");
      return { success: true };

    } catch (err) {
      console.error("Bulk Import Error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Unexpected server error";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const downloadPositionAssignmentTemplate = async () => {
    try {
      const res = await committeeManagementService.downloadPositionAssignmentTemplate();
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PositionAssignments_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(t("interviewPanelCommittee:download_error") || 'Failed to download template');
    }
  };

  return {
    history,
    loading,
    formData,
    setFormData,
    // handleEdit,
    // handleDelete,

    handleRequisitionChange,
    requisitions,
    positions,
    selectedRequisition,
    selectedPosition,
    setSelectedPosition,
    availablePanels,
    setAvailablePanels,
    updateCommitteeDate,

    activeTab,
    setActiveTab,
    showHistory,
    setShowHistory,
    selectedCommittees,
    setSelectedCommittees,
    context,
    setContext,
    handleAssignCommittees,
    panelErrors,
    setPanelErrors,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
    setErrorMessage,
    errorList,
    setErrorList,
    isDirty,
    setIsManuallyDirty,
    bulkImportPositionAssignments,
    downloadPositionAssignmentTemplate,
    loadPositionData
  };
};
