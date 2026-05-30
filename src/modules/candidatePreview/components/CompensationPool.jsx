import React, { useState, useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Person, FileText } from "react-bootstrap-icons";
import briefcaseIcon from "../../../assets/breifcase.png";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import { toast } from "react-toastify";
import "../../../style/css/Compensationpool.css";

export default function CompensationPool({
  candidates = [],
  selectedIds = [],
  setSelectedIds = () => {},
  page = 0,
  pageSize = 10,
  totalElements = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onViewFile,
  selectedRequisitionId,
  selectedPositionId,
  requisition,
  position,
  refetch = () => {},
  triggerRefresh = () => {},
  panelData,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const canEditCompensation =
    selectedCandidate?.status === "SUBMITTED" ||
    selectedCandidate?.status === "RENEGOTIATE";

  const canEditManagerCompensation =
    selectedCandidate?.status !== "NEW" &&
    selectedCandidate?.status !== "APPROVED" &&
    selectedCandidate?.status !== "RENEGOTIATE" &&
    selectedCandidate?.status !== "REJECTED"; //  ADD THIS

  const formatNumberWithCommas = (value) => {
    const numeric = value.replace(/[^0-9]/g, ""); // allow only digits
    return numeric ? Number(numeric).toLocaleString("en-IN") : "";
  };

  const navigate = useNavigate();

  const [managerForm, setManagerForm] = useState({
    fixedPay: "",
    variablePay: "",
    joiningBonus: "",
    recruiterComments: "",
    panelComments: "",
  });

  const user = useSelector((state) => state.user.user);

  const role = user?.role?.toLowerCase();

  const privileges = useSelector((state) => state.user.privileges);

  const canCompensationPool = privileges?.["Compensation Pool"];
  const canVerification = privileges?.Verification;

  const [fixedPay, setFixedPay] = useState("");
  const [variablePay, setVariablePay] = useState("");
  const [expectedCTC, setExpectedCTC] = useState("");

  const userEmail = user?.email?.toLowerCase();
  const userRole = user?.role?.toLowerCase();

  const isRecruiter = userRole === "recruiter";
  const isCommitteeMember = userRole === "committee_member";

  const isCTCMatching =
    Number(fixedPay || 0) + Number(variablePay || 0) === Number(expectedCTC);

  const isTodayWithinRange = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return today >= start && today <= end;
  };

  const isUserInCompensationPanel =
    Array.isArray(panelData?.compensationPanelList) &&
    panelData.compensationPanelList.some(
      (panel) =>
        Array.isArray(panel?.interviewPanel?.panelMembers) &&
        panel.interviewPanel.panelMembers.some((member) => {
          const apiEmail = member?.panelMember?.email?.toLowerCase();
          const apiRole = member?.panelMember?.role?.toLowerCase();

          return apiEmail === userEmail && apiRole === userRole;
        })
    );

  const isManager = !isRecruiter; // or use specific privilege if needed

  const getNegotiationClass = (status) => {
    switch (status) {
      case "APPROVED":
      case "SUBMITTED":
        return "neg-green";

      case "PENDING":
      case "NEW":
        return "neg-orange";

      default:
        return "neg-orange";
    }
  };

  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);

  const [saveClicked, setSaveClicked] = useState(false);
  const [managerSaveClicked, setManagerSaveClicked] = useState(false);

  const allSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : candidates.map((c) => c.id));
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [showCompModal, setShowCompModal] = useState(false);
  // const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [formData, setFormData] = useState({
    fixedPay: "",
    variablePay: "",
    joiningBonus: "",
    recruiterComments: "",
    panelComments: "",
  });

  //  const isRecruiterFormValid =
  //   formData.fixedPay &&
  //   formData.variablePay &&
  //   formData.joiningBonus;

  const isManagerFormValid =
    managerForm.fixedPay && managerForm.variablePay && managerForm.joiningBonus;

  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedCandidates = useMemo(() => {
    if (!sortConfig.key) return candidates;

    return [...candidates].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [candidates, sortConfig]);

  const parseAmount = (val) => Number(String(val).replace(/,/g, "")) || 0;

  const handleManagerAction = async (actionType) => {
    try {
      setManagerSaveClicked(true);

      if (!managerForm.panelComments?.trim()) {
        toast.error("Comments are required");
        return;
      }

      const fixed =
        parseAmount(managerForm.fixedPay) || selectedCandidate.fixedPay || 0;

      const variable =
        parseAmount(managerForm.variablePay) ||
        selectedCandidate.variablePay ||
        0;

      const expected = Number(selectedCandidate?.expectedCtc || 0);

      if (!managerForm.fixedPay) {
        toast.error("Fixed Pay is required");
        return;
      }

      // if (fixed + variable !== expected) {
      //   toast.error("Fixed Pay + Variable Pay should be equal to Expected CTC");
      //   return;
      // }
      const payload = {
        compensation: {
          candidateId: selectedCandidate.candidateId,
          candidateProfile: selectedCandidate.candidateProfile,
          application: selectedCandidate.application,
          interviewScheduleId: selectedCandidate.interviewScheduleId,
          submitBeforeDate: selectedCandidate.submitBeforeDate,

          currentCtc: selectedCandidate.currentCtc ?? 0,
          expectedCtc: selectedCandidate.expectedCtc ?? 0,
          fixedPay:
            parseAmount(managerForm.fixedPay) ||
            selectedCandidate.fixedPay ||
            0,

          variablePay:
            parseAmount(managerForm.variablePay) ||
            selectedCandidate.variablePay ||
            0,

          joiningBonus:
            parseAmount(managerForm.joiningBonus) ||
            selectedCandidate.joiningBonus ||
            0,
          agreedCtc:
            (parseAmount(managerForm.fixedPay) || 0) +
            (parseAmount(managerForm.variablePay) || 0),

          hike: selectedCandidate?.hike || 0,

          recruiterComments: selectedCandidate.recruiterComments || "", //  IMPORTANT
          panelComments: managerForm.panelComments || "",
          compensationStatus: selectedCandidate.status,
          candidateCompensationId: selectedCandidate.id,
        },
        action: actionType,
      };

      console.log(" Payload:", payload);
      const res =
        await candidateWorkflowServices.addCompensationDetails(payload);

      console.log(" FULL RES:", res);

      //  Normalize response properly (simple + reliable)
      const responseData =
        res?.data?.success !== undefined
          ? res.data
          : res?.success !== undefined
            ? res
            : res?.data || res;

      console.log(" NORMALIZED:", responseData);

      //  Strict success check
      if (responseData?.success === true) {
        toast.success(responseData?.message || "Success");

        setShowManagerModal(false);
        refetch();
        triggerRefresh();
      } else {
        const errorMsg =
          typeof responseData === "string"
            ? responseData
            : responseData?.data ||
              responseData?.message ||
              "Something went wrong";

        toast.error(errorMsg);
        setShowManagerModal(false);
      }
    } catch (err) {
      console.error(" FULL ERROR:", err);

      const errorMsg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast.error(errorMsg);
    }
  };

  //   const handleSaveCompensation = async () => {
  //   try {
  //    const payload = {
  //   compensation: {
  //     candidateId: selectedCandidate.candidateId,
  //     candidateProfile: selectedCandidate.candidateProfile,
  //     application: selectedCandidate.application,
  //     interviewScheduleId: selectedCandidate.interviewScheduleId,
  //     submitBeforeDate: selectedCandidate.submitBeforeDate,

  //     currentCtc: selectedCandidate.currentCtc ?? 0,
  //     expectedCtc: selectedCandidate.expectedCtc ?? 0,

  //     fixedPay: Number(formData.fixedPay) || 0,
  //     variablePay: Number(formData.variablePay) || 0,
  //     joiningBonus: Number(formData.joiningBonus) || 0,

  //     agreedCtc:
  //       (Number(formData.fixedPay) || 0) +
  //       (Number(formData.variablePay) || 0),

  //     hike:
  //       selectedCandidate.currentCtc
  //         ? ((Number(formData.fixedPay) - selectedCandidate.currentCtc) /
  //             selectedCandidate.currentCtc) *
  //           100
  //         : 0,

  //     recruiterComments: formData.recruiterComments || "",
  // panelComments: formData.panelComments || "",

  //     compensationStatus: selectedCandidate.status,
  //     candidateCompensationId: selectedCandidate.id,
  //   },
  //   action: "SUBMIT",
  // };

  //     console.log("🔥 Compensation Save Payload:", payload);

  //     await candidateWorkflowServices.addCompensationDetails(payload);

  //     toast.success("Compensation saved successfully");

  //     setShowRecruiterModal(false);
  //     refetch();
  //      triggerRefresh();

  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to save compensation");
  //   }
  // };

  // const handleCompensationClick = (c) => {
  //   setSelectedCandidate(c);

  //   //  Normalize user values
  //   const userEmail = user?.email?.toLowerCase();
  //   const userRole = user?.role?.toLowerCase();

  //   const isRecruiter = userRole === "recruiter";
  //   const isCommitteeMember = userRole === "committee_member";

  //   //  SAFE + CORRECT PANEL CHECK (email + role)
  //   const isUserInPanel =
  //     Array.isArray(panelData?.compensationPanelList) &&
  //     panelData.compensationPanelList.some(panel =>
  //       Array.isArray(panel?.interviewPanel?.panelMembers) &&
  //       panel.interviewPanel.panelMembers.some(member => {
  //         const apiEmail = member?.panelMember?.email?.toLowerCase();
  //         const apiRole = member?.panelMember?.role?.toLowerCase();

  //         return apiEmail === userEmail && apiRole === userRole;
  //       })
  //     );

  //   // ===== FINAL DECISION =====

  //   //  Committee Member + match → Manager Modal
  //   if (isCommitteeMember && isUserInPanel && canCompensationPool) {
  //     setShowManagerModal(true);
  //   }

  //   //  Recruiter + match → Manager Modal
  //   else if (isRecruiter && isUserInPanel) {
  //     setShowManagerModal(true);
  //   }

  //   //  Recruiter + NOT match → Recruiter Modal
  //   else if (isRecruiter && !isUserInPanel) {
  //     setShowRecruiterModal(true);
  //   }

  //   //  Optional fallback
  //   else {
  //     console.warn("No matching condition for modal");
  //   }
  // };

  // const handleCompensationClick = (c) => {
  //   setSelectedCandidate(c);

  //   const userEmail = user?.email?.toLowerCase();
  //   const userRole = user?.role?.toLowerCase();

  //   const isRecruiter = userRole === "recruiter";
  //   const isCommitteeMember = userRole === "committee_member";

  //   // ✅ Panel check
  //   const matchedPanel = panelData?.compensationPanelList?.find(panel =>
  //     panel?.interviewPanel?.panelMembers?.some(member => {
  //       const apiEmail = member?.panelMember?.email?.toLowerCase();
  //       const apiRole = member?.panelMember?.role?.toLowerCase();
  //       return apiEmail === userEmail && apiRole === userRole;
  //     })
  //   );

  //   const isUserInPanel = !!matchedPanel;

  //   //  DATE CHECK
  //   let isWithinDateRange = false;

  //   if (matchedPanel?.startDate && matchedPanel?.endDate) {
  //     const today = new Date();
  //     const start = new Date(matchedPanel.startDate);
  //     const end = new Date(matchedPanel.endDate);

  //     // normalize time
  //     start.setHours(0,0,0,0);
  //     end.setHours(23,59,59,999);

  //     isWithinDateRange = today >= start && today <= end;
  //   }

  //   // ===== FINAL DECISION =====

  //   // Committee Member + match → Manager Modal
  //   if (isCommitteeMember && isUserInPanel && canCompensationPool) {
  //     setShowManagerModal(true);
  //   }

  //   //  Recruiter + match + DATE VALID → Manager Modal
  //   else if (isRecruiter && isUserInPanel && isWithinDateRange) {
  //     setShowManagerModal(true);
  //   }

  //   //  Recruiter + match BUT DATE INVALID → Recruiter Modal
  //   else if (isRecruiter && isUserInPanel && !isWithinDateRange) {
  //     setShowRecruiterModal(true);
  //   }

  //   //  Recruiter + NOT match → Recruiter Modal
  //   else if (isRecruiter && !isUserInPanel) {
  //     setShowRecruiterModal(true);
  //   }

  //   else {
  //     console.warn("No matching condition for modal");
  //   }
  // };

  const handleCompensationClick = (c) => {
    console.log("====================================");
    console.log("COMPENSATION CLICKED");
    console.log("====================================");

    setSelectedCandidate(c);

    const userEmail = user?.email?.toLowerCase();
    const userRole = user?.role?.toLowerCase();

    const isRecruiter = userRole === "recruiter";
    const isCommitteeMember = userRole === "committee_member";

    console.log("LOGIN USER EMAIL:", userEmail);
    console.log("LOGIN USER ROLE:", userRole);

    console.log("isRecruiter:", isRecruiter);
    console.log("isCommitteeMember:", isCommitteeMember);

    console.log("canCompensationPool:", canCompensationPool);

    // PANEL CHECK
    const matchedPanel = panelData?.compensationPanelList?.find((panel) =>
      panel?.interviewPanel?.panelMembers?.some((member) => {
        const apiEmail = member?.panelMember?.email?.toLowerCase();

        const apiRole = member?.panelMember?.role?.toLowerCase();

        console.log("----------- PANEL MEMBER -----------");
        console.log("API EMAIL:", apiEmail);
        console.log("API ROLE:", apiRole);

        console.log("EMAIL MATCH:", apiEmail === userEmail);

        console.log("ROLE MATCH:", apiRole === userRole);

        return apiEmail === userEmail && apiRole === userRole;
      })
    );

    const isUserInPanel = !!matchedPanel;

    console.log("MATCHED PANEL:", matchedPanel);
    console.log("isUserInPanel:", isUserInPanel);

    // DATE CHECK
    let isWithinDateRange = false;

    if (matchedPanel?.startDate && matchedPanel?.endDate) {
      const today = new Date();
      const start = new Date(matchedPanel.startDate);
      const end = new Date(matchedPanel.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      isWithinDateRange = today >= start && today <= end;

      console.log("TODAY:", today);
      console.log("START DATE:", start);
      console.log("END DATE:", end);
    } else {
      console.log("DATE CHECK FAILED -> startDate or endDate missing");
    }

    console.log("isWithinDateRange:", isWithinDateRange);

    console.log("====================================");
    console.log("CHECKING CONDITIONS");
    console.log("====================================");

    // CONDITION 1
    console.log(
      "Condition 1 -> Committee Member + Panel + Privilege:",
      isCommitteeMember && isUserInPanel && canCompensationPool
    );

    // CONDITION 2
    console.log(
      "Condition 2 -> Recruiter + Panel + Valid Date:",
      isRecruiter && isUserInPanel && isWithinDateRange
    );

    // CONDITION 3
    console.log(
      "Condition 3 -> Recruiter + Panel + Invalid Date:",
      isRecruiter && isUserInPanel && !isWithinDateRange
    );

    // CONDITION 4
    console.log(
      "Condition 4 -> Recruiter + NOT In Panel:",
      isRecruiter && !isUserInPanel
    );

    // ===== FINAL DECISION =====

    if (isCommitteeMember && isUserInPanel && canCompensationPool) {
      console.log("OPENING MANAGER MODAL -> Committee Member");

      setShowManagerModal(true);
    } else if (isRecruiter && isUserInPanel && isWithinDateRange) {
      console.log("OPENING MANAGER MODAL -> Recruiter + Valid Date");

      setShowManagerModal(true);
    } else if (isRecruiter && isUserInPanel && !isWithinDateRange) {
      console.log("OPENING RECRUITER MODAL -> Invalid Date");

      setShowRecruiterModal(true);
    } else if (isRecruiter && !isUserInPanel) {
      console.log("OPENING RECRUITER MODAL -> User Not In Panel");

      setShowRecruiterModal(true);
    } else {
      console.log("NO MODAL OPENED");

      console.log({
        userEmail,
        userRole,
        isRecruiter,
        isCommitteeMember,
        isUserInPanel,
        isWithinDateRange,
        canCompensationPool,
      });

      console.warn("No matching condition for modal");
    }

    console.log("====================================");
  };

  const canEditManagerFields = isUserInCompensationPanel && isRecruiter;

  const handleSaveCompensation = async () => {
    try {
      setSaveClicked(true);

      //  REQUIRED FIELD VALIDATION
      // if (!formData.fixedPay) {
      //   toast.error("Fixed Pay is required");
      //   return;
      // }
      if (!formData.fixedPay || !formData.recruiterComments?.trim()) {
        return;
      }

      //  ADD THIS BLOCK (no changes to your logic)
      const fixed = parseAmount(formData.fixedPay) || 0;
      const variable = parseAmount(formData.variablePay) || 0;
      const expected = Number(selectedCandidate?.expectedCtc || 0);

      // if (fixed + variable !== expected) {
      //   toast.error("Fixed Pay + Variable Pay should be equal to Expected CTC");
      //   return;
      // }
      const payload = {
        compensation: {
          candidateId: selectedCandidate.candidateId,
          candidateProfile: selectedCandidate.candidateProfile,
          application: selectedCandidate.application,
          interviewScheduleId: selectedCandidate.interviewScheduleId,
          submitBeforeDate: selectedCandidate.submitBeforeDate,

          currentCtc: selectedCandidate.currentCtc ?? 0,
          expectedCtc: selectedCandidate.expectedCtc ?? 0,

          fixedPay: parseAmount(formData.fixedPay) || 0,
          variablePay: parseAmount(formData.variablePay) || 0,
          joiningBonus: parseAmount(formData.joiningBonus) || 0,

          agreedCtc:
            (parseAmount(formData.fixedPay) || 0) +
            (parseAmount(formData.variablePay) || 0),

          hike: selectedCandidate?.hike || 0,

          recruiterComments: formData.recruiterComments || "",
          panelComments: formData.panelComments || "",

          compensationStatus: selectedCandidate.status,
          candidateCompensationId: selectedCandidate.id,
        },
        action: "SUBMIT",
      };

      console.log(" Payload:", payload);

      const res =
        await candidateWorkflowServices.addCompensationDetails(payload);

      console.log(" FULL RES:", res);

      //  Normalize response (same as manager API)
      const responseData =
        res?.data?.success !== undefined
          ? res.data
          : res?.success !== undefined
            ? res
            : res?.data || res;

      console.log(" NORMALIZED:", responseData);

      //     if (!formData.fixedPay || !formData.variablePay || !formData.joiningBonus) {
      //   toast.error("All compensation fields are required");
      //   return;
      // }

      //  SUCCESS CASE
      if (responseData?.success === true) {
        toast.success(
          responseData?.message || "Compensation saved successfully"
        );

        setShowRecruiterModal(false);
        refetch();
        triggerRefresh();
      } else {
        //  ERROR CASE
        const errorMsg =
          responseData?.data || responseData?.message || "Something went wrong";

        toast.error(errorMsg);
      }
    } catch (err) {
      console.error(" ERROR:", err);

      const errorMsg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast.error(errorMsg);
    }
  };

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <>
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          {/* ================= HEADER ================= */}
          <thead className="bg-light">
            <tr>
              <th
                className="fs-14 fw-normal py-3"
                style={{ paddingLeft: "1rem" }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>

              <th
                className="fs-14 fw-normal py-3"
                onClick={() => requestSort("name")}
              >
                Candidate {sortIcon("name")}
              </th>

              <th
                className="fs-14 fw-normal py-3"
                onClick={() => requestSort("currentCtc")}
              >
                Current CTC {sortIcon("currentCtc")}
              </th>

              <th
                className="fs-14 fw-normal py-3"
                onClick={() => requestSort("expectedCtc")}
              >
                Expected CTC {sortIcon("expectedCtc")}
              </th>

              <th
                className="fs-14 fw-normal py-3"
                onClick={() => requestSort("hike")}
              >
                Expected Hike % {sortIcon("hike")}
              </th>

              <th
                className="fs-14 fw-normal py-3"
                onClick={() => requestSort("agreedCtc")}
              >
                Agreed CTC {sortIcon("agreedCtc")}
              </th>

              <th className="fs-14 fw-normal py-3">Comments</th>

              <th className="fs-14 fw-normal py-3">Status</th>

              <th className="text-center fs-14 fw-normal py-3">Actions</th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted fs-14">
                  No candidates in compensation pool
                </td>
              </tr>
            ) : (
              sortedCandidates.map((c) => (
                <tr key={c.id}>
                  {/* Checkbox */}
                  <td
                    className="align-content-center"
                    style={{ paddingLeft: "1rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleRow(c.id)}
                    />
                  </td>

                  {/* Candidate */}
                  <td className="align-content-center">
                    <p className="fw-normal fs-14 mb-0">{c.name}</p>
                    <p className="text-muted fs-12 mb-0">
                      Reg No: {c.regNo || "-"}
                    </p>
                  </td>

                  <td className="fs-14 align-content-center">
                    {c.currentCtc || "-"}
                  </td>
                  <td className="fs-14 align-content-center">
                    {c.expectedCtc || "-"}
                  </td>

                  <td className="fs-14 align-content-center">
                    {c.hike !== null && c.hike !== undefined
                      ? `${Number(c.hike).toFixed(2)}%`
                      : "-"}
                  </td>
                  <td className="fs-14 align-content-center">
                    {c.agreedCtc || "-"}
                  </td>

                  <td className="fs-14 align-content-center">
                    {isRecruiter
                      ? c.recruiterComments || "-"
                      : c.panelComments || "-"}
                  </td>

                  {/*  SAME BADGE STYLE AS INTERVIEW */}
                  <td className="align-content-center">
                    <span
                      className={`round_badge px-3 py-1 fs-12 rounded ${getNegotiationClass(c.negotiation)}`}
                    >
                      {c.negotiation}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-center align-content-center">
                    {/* Profile */}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>View Profile</Tooltip>}
                    >
                      <Person
                        className="me-3 cursor-pointer"
                        onClick={() => {
                          navigate("/candidate-preview", {
                            state: {
                              candidate: c,
                              applicationId: c.applicationId,

                              positionId: selectedPositionId,
                              positionIds: selectedPositionId,

                              requisitionId: selectedRequisitionId,

                              fromCompensationPool: true,
                              activeTab: "COMPENSATION_POOL",
                              candidatePositionId: c.positionId,

                              requisition: requisition
                                ? {
                                    requisition_code:
                                      requisition.requisition_code,
                                    requisition_title:
                                      requisition.requisition_title,
                                    registration_start_date:
                                      requisition.registration_start_date,
                                    registration_end_date:
                                      requisition.registration_end_date,
                                  }
                                : null,

                              position:
                                position?.map?.((p) => ({
                                  positionId: p.positionId,
                                  positionName: p.positionName,
                                  isLocationWise: p.isLocationWise,
                                })) || [],
                            },
                          });
                        }}
                      />
                    </OverlayTrigger>

                    {/* Document */}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>View Resume</Tooltip>}
                    >
                      <FileText
                        className="me-3 cursor-pointer"
                        onClick={() => {
                          if (onViewFile) {
                            onViewFile(c);
                          } else {
                            console.log("Resume clicked", c);
                          }
                        }}
                      />
                    </OverlayTrigger>

                    {/*  Compensation (NEW ICON) */}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Compensation Details</Tooltip>}
                    >
                      <span>
                        <img
                          src={briefcaseIcon}
                          alt="Compensation"
                          className="cursor-pointer"
                          style={{ width: "18px", height: "18px" }}
                          onClick={() => {
                            setSaveClicked(false);

                            setFormData({
                              fixedPay: "",
                              variablePay: "",
                              joiningBonus: "",
                              recruiterComments: "",
                              panelComments: "",
                            });

                            setSelectedCandidate(c);

                            //  Prefill recruiter form
                            setFormData({
                              fixedPay: c.fixedPay
                                ? Number(c.fixedPay).toLocaleString("en-IN")
                                : "",
                              variablePay: c.variablePay
                                ? Number(c.variablePay).toLocaleString("en-IN")
                                : "",
                              joiningBonus: c.joiningBonus
                                ? Number(c.joiningBonus).toLocaleString("en-IN")
                                : "",
                              recruiterComments: c.recruiterComments || "",
                              panelComments: c.panelComments || "",
                            });

                            //  Prefill manager form
                            setManagerForm({
                              fixedPay: c.fixedPay
                                ? Number(c.fixedPay).toLocaleString("en-IN")
                                : "",
                              variablePay: c.variablePay
                                ? Number(c.variablePay).toLocaleString("en-IN")
                                : "",
                              joiningBonus: c.joiningBonus
                                ? Number(c.joiningBonus).toLocaleString("en-IN")
                                : "",
                              recruiterComments: c.recruiterComments || "",
                              panelComments: c.panelComments || "",
                            });

                            handleCompensationClick(c);
                          }}
                        />
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
          <div className="fs-14 text-muted">
            Showing {page * pageSize + 1}–
            {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select fs-14"
              style={{ width: "90px" }}
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
            >
              {[10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              Prev
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={(page + 1) * pageSize >= totalElements}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={showRecruiterModal}
        onHide={() => {
          setShowRecruiterModal(false);
          setSaveClicked(false);
        }}
        centered
        backdrop="static"
        dialogClassName="custom-modal compensation-modal"
        size="lg"
        //size="xl"
      >
        <Modal.Header closeButton className="custom-modal-header border-0">
          <Modal.Title className="fw-semibold fs-5">
            Agreed Compensation
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">
                Fixed Pay <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${
                  saveClicked && !formData.fixedPay ? "is-invalid" : ""
                }`}
                placeholder="Enter Value"
                value={formData.fixedPay}
                disabled={!canEditCompensation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fixedPay: formatNumberWithCommas(e.target.value),
                  })
                }
              />
              {!formData.fixedPay && (
                <div className="invalid-feedback">Fixed Pay is required</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Variable Pay</label>
              <input
                className="form-control"
                placeholder="Enter Value"
                value={formData.variablePay}
                disabled={!canEditCompensation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    variablePay: formatNumberWithCommas(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Joining Bonus</label>
              <input
                className="form-control"
                placeholder="Enter Value"
                value={formData.joiningBonus}
                disabled={!canEditCompensation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    joiningBonus: formatNumberWithCommas(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-medium">
                {" "}
                Comments <span className="text-danger">*</span>{" "}
              </label>
              <textarea
                className={`form-control ${
                  saveClicked && !formData.recruiterComments?.trim()
                    ? "is-invalid"
                    : ""
                }`}
                rows={3}
                placeholder="Enter Comment"
                value={formData.recruiterComments}
                disabled={!canEditCompensation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recruiterComments: e.target.value,
                  })
                }
              />

              {saveClicked && !formData.recruiterComments?.trim() && (
                <div className="invalid-feedback d-block">
                  Comments are required
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-2">
          <Button
            variant="light"
            className="px-4"
            onClick={() => {
              setShowRecruiterModal(false);
              setSaveClicked(false);
            }}
          >
            Cancel
          </Button>

          <Button
            style={{ backgroundColor: "#f36f21", border: "none" }}
            className="btn-save text-white"
            onClick={handleSaveCompensation}
            disabled={!canEditCompensation}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showManagerModal}
        onHide={() => setShowManagerModal(false)}
        centered
        backdrop="static"
        dialogClassName="custom-modal compensation-modal"
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold fs-5">
            Approve / Reject / Re-negotiate Compensation
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                Fixed Pay <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${
                  managerSaveClicked && !managerForm.fixedPay
                    ? "is-invalid"
                    : ""
                }`}
                value={managerForm.fixedPay}
                disabled={!canEditManagerFields}
                onChange={(e) =>
                  setManagerForm({
                    ...managerForm,
                    fixedPay: formatNumberWithCommas(e.target.value),
                  })
                }
              />
              {/* {!managerForm.fixedPay && (
    <div className="invalid-feedback">Fixed Pay is required</div>
  )}   */}
            </div>

            <div className="col-md-6">
              <label className="form-label">Variable Pay</label>
              <input
                className="form-control"
                value={managerForm.variablePay}
                disabled={!canEditManagerFields}
                onChange={(e) =>
                  setManagerForm({
                    ...managerForm,
                    variablePay: formatNumberWithCommas(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Joining Bonus</label>
              <input
                className="form-control"
                value={managerForm.joiningBonus}
                disabled={!canEditManagerFields}
                onChange={(e) =>
                  setManagerForm({
                    ...managerForm,
                    joiningBonus: formatNumberWithCommas(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">
                Comments <span className="text-danger">*</span>{" "}
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={managerForm.panelComments} //  correct
                disabled={!canEditManagerCompensation}
                onChange={(e) =>
                  setManagerForm({
                    ...managerForm,
                    panelComments: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-end gap-1">
          {/*  APPROVE */}
          <Button
            style={{ backgroundColor: "#28a745", border: "none" }}
            onClick={() => handleManagerAction("APPROVE")}
            disabled={!canEditManagerCompensation}
          >
            Approve
          </Button>

          {/*  REJECT */}
          <Button
            style={{ backgroundColor: "#f36f21", border: "none" }}
            onClick={() => handleManagerAction("REJECT")}
            disabled={!canEditManagerCompensation}
          >
            Reject
          </Button>

          {/*  RENEGOTIATE */}
          <Button
            style={{ backgroundColor: "#3f51b5", border: "none" }}
            onClick={() => handleManagerAction("RENEGOTIATE")}
            disabled={!canEditManagerCompensation}
          >
            Re-negotiate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
