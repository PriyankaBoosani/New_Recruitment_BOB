import React, { useState, useEffect, useRef } from "react";
import { Accordion, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../../style/css/PreviewModal.css";
import logo_Bob from "../../../assets/bob-logo.png";
import sign from "../../../assets/downloadIcon.png";
import viewIcon from "../../../assets/view_icon.png";
import downloadIcon from "../../../assets/downloadIcon.png";
import DocumentViewerModal from "../components/DocumentViewerModal";
import { useLocation, useNavigate } from "react-router-dom";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { toast } from "react-toastify";
import masterApiService from "../../master/services/masterApiService";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation, faCircleXmark } from "@fortawesome/free-solid-svg-icons";


const ApplicationForm = ({
  previewData,
  selectedJob,
  formErrors,
  setFormErrors,
  candidateId,
  positionId,
  applicationId,
  requisitionId,
  interviewScheduleId,
  requisitionTitle,
  positionName,
  selectedDate,
  zonalVerificationStatus,
  zonalSubmitBeforeDate,
  zonalHrComments,
  candidateStatus,
  isFromInterview
}) => {

  const { t } = useTranslation(["preview", "common", "validation"]);

  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(["0", "1", "2", "3"]);
  const [criteria, setCriteria] = useState({});
  const location = useLocation();
  const isInterviewView = location.state?.fromInterviewPool;
  const candidate = location.state?.candidate;

  const zonalInitRef = useRef(true);
  const isZonalAbsent =
    String(zonalVerificationStatus || "").toUpperCase() === "ZONAL_ABSENT";




  const deriveShortlistStatus = () => {
    const values = [
      screeningForm.isWorkCriteriaMet,
      screeningForm.isAgeCriteriaMet,
      screeningForm.isEducationCriteriaMet,
    ];

    if (values.includes("NO")) return "NO";                  // Highest priority
    if (values.includes("DISCREPANCY")) return "DEFAULT";    // Second priority
    if (values.every(v => v === "YES")) return "YES";        // All YES
    return "";
  };

  useEffect(() => {
  }, [candidate]);

  const [screeningForm, setScreeningForm] = useState({
    applicationId,
    candidateId,

    isWorkCriteriaMet: "",
    isAgeCriteriaMet: "",
    isEducationCriteriaMet: "",
    isShortlisted: "",

    workCriteriaRemark: "",
    ageCriteriaRemark: "",
    educationCriteriaRemark: "",
    finalScreeningRemark: "",
    zonalSubmitDate: "",

    submitBeforeDate: "",
    isScreeningCompleted: false,
    screeningId: null,
  });
  const [screeningDocuments, setScreeningDocuments] = useState([]);

  const formatLocation = (a, b) => {
    const values = [a, b].filter(v => v && v !== "-");
    return values.length ? values.join(", ") : "-";
  };


  const [screeningRemarks, setScreeningRemarks] = useState("");

  const user = useSelector((state) => state.user.user);
  const role = user?.role?.toLowerCase();
  // const isZonalHr = role === "zonal_hr";
  // const isInterviewer = role === "interviewer";


  const privileges = useSelector((state) => state.user.privileges);

  const isZonalHr = privileges?.Verification;
  const isInterviewer = privileges?.Interview;
  const isRecruiter = privileges?.canCandidateWorkflow; // or whatever recruiter privilege is
  const canCandidatePool = privileges?.["Candidate Pool"];
  const canInterviewPool = privileges?.["Interview Pool"];


  const mapDecisionToStatus = (val) => {
    const v = String(val || "").toUpperCase().trim();

    if (v === "YES") return "VERIFIED";
    if (v === "NO") return "REJECTED";
    if (v === "PROVISIONALLY_APPROVED") return "PROVISIONALLY_APPROVED";

    console.warn("⚠️ Unknown zonalDecision:", val);
    return "PENDING";
  };

  const mapStatusToDecision = (status) => {
    const s = String(status || "").toUpperCase().trim();

    if (s === "VERIFIED") return "YES";
    if (s === "REJECTED" || s === "ZONAL_REJECTED") return "NO";
    if (s === "PROVISIONALLY_APPROVED") return "PROVISIONALLY_APPROVED";
    return "";
  };

  useEffect(() => {
    if (!isZonalHr) return;

    if (zonalVerificationStatus) {
      setZonalDecision(mapStatusToDecision(zonalVerificationStatus));
    }

    if (zonalSubmitBeforeDate) {
      setScreeningForm(prev => ({
        ...prev,
        zonalSubmitDate: zonalSubmitBeforeDate.split("T")[0] // safe for input[type=date]
      }));
    }

    if (zonalHrComments) {
      setScreeningRemarks(zonalHrComments);
    }

  }, [
    zonalVerificationStatus,
    zonalSubmitBeforeDate,
    zonalHrComments,
    isZonalHr
  ]);


  const handleZonalSubmit = async () => {

    // -----------------------------------------
    // Helper Conditions
    // -----------------------------------------
    const allVerified = areAllDocumentsVerified();   // returns true/false
    const anyRejected = hasAnyRejectedDocument();    // returns true/false
    const hasPendingDocument = documentRows.some(doc => {
      const status = docStatusMap[doc.candidateDocumentId]?.status;
      return !status || status === "PENDING";
    });


    // -----------------------------------------
    // 1️⃣ Decision not selected
    // -----------------------------------------

    if (isZonalAbsent) {
      toast.info("Zonal Absent candidates cannot be processed.");
      return;
    }

    if (hasPendingDocument) {
      toast.warning(
        "All documents must be verified before submission."
      );
      return;
    }

    if (!zonalDecision) {
      toast.error("Please select decision");
      return;
    }
    // 🔴 Comments mandatory when decision = NO
    if (zonalDecision === "NO") {
      if (!screeningRemarks?.trim()) {
        setErrors(prev => ({
          ...prev,
          zonalComments: "This field is required"
        }));
        return;
      }
    }

    // -----------------------------------------
    // 2️⃣ All documents VERIFIED but decision = NO
    // -----------------------------------------
    if (zonalDecision === "NO" && allVerified) {
      toast.warning(
        "All documents are verified. Please select other decision instead."
      );
      return;
    }

    // -----------------------------------------
    // 3️⃣ Decision = YES but any document REJECTED
    // -----------------------------------------
    if (zonalDecision === "YES" && anyRejected) {
      toast.error(
        "Cannot approve. One or more documents are rejected."
      );
      return;
    }

    // -----------------------------------------
    // 4️⃣ Decision = PROVISIONAL but all VERIFIED
    // -----------------------------------------
    if (zonalDecision === "PROVISIONALLY_APPROVED" && allVerified) {
      toast.warning(
        "All documents are verified. Please select other decision instead."
      );
      return;
    }

    // -----------------------------------------
    // 5️⃣ PROVISIONAL requires future date
    // -----------------------------------------
    if (zonalDecision === "PROVISIONALLY_APPROVED") {

      let hasError = false;

      // 🔴 Comments mandatory
      if (!screeningRemarks?.trim()) {
        setErrors(prev => ({
          ...prev,
          zonalComments: "This field is required"
        }));
        hasError = true;
      }

      // 🔴 Date mandatory
      if (!screeningForm.zonalSubmitDate) {
        setErrors(prev => ({
          ...prev,
          zonalSubmitDate: "This field is required"
        }));
        hasError = true;
      } else {
        const selected = new Date(screeningForm.zonalSubmitDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selected <= today) {
          setErrors(prev => ({
            ...prev,
            zonalSubmitDate: "Must be future date"
          }));
          hasError = true;
        }
      }

      if (hasError) return;
    }



    // -----------------------------------------
    // 6️⃣ Show Loading Toast
    // -----------------------------------------
    const toastId = toast.loading("Submitting zonal verification...");

    try {

      const payload = {
        candidateId,
        applicationId,
        interviewScheduleId,
        zonalVerificationStatus: mapDecisionToStatus(zonalDecision),
        zonalSubmitBeforeDate: screeningForm.zonalSubmitDate || null,
        zonalHrComments: screeningRemarks || ""
      };

      await jobPositionApiService.submitOverallZonalVerification(payload);

      // -----------------------------------------
      // 7️⃣ Success Toast
      // -----------------------------------------
      toast.update(toastId, {
        render: "Zonal verification submitted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      sessionStorage.setItem("fromZonalSubmit", "true");

      navigate("/candidate-verification", {
        state: {
          requisition: location.state?.requisition,
          position: location.state?.position,
          preloadedCandidates: location.state?.candidates || [],
          selectedDate
        }
      });

    } catch (err) {

      // -----------------------------------------
      // 8️⃣ Error Toast
      // -----------------------------------------
      toast.update(toastId, {
        render: "Zonal submit failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      console.error(err);
    }
  };









  const data = previewData || {
    personalDetails: {},
    experienceSummary: {},
    documents: {},
    education: [],
    experience: []
  };
  const CRITERIA_OPTIONS = ["YES", "NO", "DISCREPANCY"];

  const documentRows = [
    ...(screeningDocuments.length > 0 ? screeningDocuments : data.documents?.allDocs || [])
  ].map(doc => ({
    ...doc,
    candidateDocumentId: doc.candidateDocumentId ?? doc.id
  }));

  const [photo, setPhoto] = useState()
  const [signature, setSignature] = useState()

  const allDocs = screeningDocuments.length > 0 ? screeningDocuments : data.documents.allDocs;
  console.log(screeningDocuments)
  console.log(data.documents.allDocs)

  const photoDoc = allDocs.find(doc => doc.name === "Photo");
  const signatureDoc = allDocs.find(doc => doc.name === "Signature");
  const birthDoc = allDocs.find(doc => doc.name === "Birth Certificate");
  const tenthDoc = allDocs.find(doc => doc.name === "10th Certificate");

  const photoUrl = photoDoc?.url || "";
  const signatureUrl = signatureDoc?.url || "";

  const normalizeCriteria = (val) => val === "DEFAULT" ? "" : val ?? "";

  useEffect(() => {
    if (!photoUrl) return;

    const fetchPhoto = async () => {
      try {
        const res = await masterApiService.getAzureBlobSasUrl(
          photoUrl,
          "candidate"
        );

        const trimmedUrl = res.trim();

        setPhoto(trimmedUrl);
      } catch (err) {
        console.error("Failed to load candidate photo", err);
      }
    };

    fetchPhoto();
  }, [photoUrl]);

  useEffect(() => {
    if (!signatureUrl) return;

    const fetchPhoto = async () => {
      try {
        const res = await masterApiService.getAzureBlobSasUrl(
          signatureUrl,
          "candidate"
        );

        const trimmedUrl = res.trim();

        setSignature(trimmedUrl);
      } catch (err) {
        console.error("Failed to load candidate photo", err);
      }
    };

    fetchPhoto();
  }, [signatureUrl]);

  const [showViewer, setShowViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docStatusMap, setDocStatusMap] = useState({});
  const [docStatusLoading, setDocStatusLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [docStatus, setDocStatus] = useState({});
  const [zonalDecision, setZonalDecision] = useState("");

  // const allDocsVerified =
  //   documentRows.length > 0 &&
  //   areAllDocumentsValidated();







  const refreshDocStatuses = async () => {
    try {
      setDocStatusLoading(true);

      let res;

      if (isZonalHr) {
        res = await jobPositionApiService.getZonalDocumentStatus(applicationId);
      } else {
        res = await jobPositionApiService.getScreeningCommitteeStatus(applicationId);
      }

      const map = {};
      const documents = [];

      (res.data || []).forEach((item) => {

        //   const isZonal = isZonalHr;
        //  const status =
        //   item.zonalHrDocStatus &&
        //   item.zonalHrDocStatus !== "PENDING"
        //     ? item.zonalHrDocStatus
        //     : item.docScreeningStatus;

        const isZonal = isZonalHr;

        const status = isZonalHr
          ? item.zonalHrDocStatus || "PENDING"
          : isInterviewer
            ? (item.zonalHrDocStatus && item.zonalHrDocStatus !== "PENDING"
              ? item.zonalHrDocStatus
              : item.docScreeningStatus || "PENDING")
            : item.docScreeningStatus || "PENDING";

        const comments = isZonal
          ? item.zonalHrDocComments
          : item.docScreeningComments;

        map[item.candidateDocumentId] = {
          status: status?.toUpperCase() || "PENDING",
          comments: comments,
          verificationId: item.verificationId,
        };

        documents.push({
          id: item.candidateDocumentId,
          candidateDocumentId: item.candidateDocumentId,
          name: item.displayName || item.fileName || "Document",
          fileName: item.fileName,
          url: item.fileUrl,
          status: status?.toUpperCase() || "PENDING",
          isValidationPending: item.isValidationPending,
          pendingChecks: item.pendingChecks || []
        });

      });

      setDocStatusMap(map);
      setScreeningDocuments(documents);

    } catch (e) {
      console.error("Failed to fetch document status", e);
    } finally {
      setDocStatusLoading(false);
    }
  };



  // const refreshDocStatuses = async () => {
  //   try {
  //     setDocStatusLoading(true);
  //     const res =
  //       await jobPositionApiService.getScreeningCommitteeStatus(
  //         applicationId
  //       );

  //     const map = {};
  //     (res.data || []).forEach((item) => {
  //       map[item.candidateDocumentId] = {
  //         status: item.docScreeningStatus?.toUpperCase() || "PENDING",
  //         comments: item.docScreeningComments,
  //         verificationId: item.verificationId,
  //       };
  //     });

  //     setDocStatusMap(map);
  //   } catch (e) {
  //     console.error("Failed to fetch document screening status", e);
  //   } finally {
  //     setDocStatusLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!applicationId) return;

    const fetchDiscrepancyDetails = async () => {
      try {
        const res =
          await jobPositionApiService.getCandidateDiscrepancyDetails(
            applicationId
          );

        const data = res?.data;

        if (!data) return; // no record → fresh form

        setScreeningForm(prev => ({
          ...prev,
          applicationId,
          candidateId,

          isWorkCriteriaMet: normalizeCriteria(data.isWorkCriteriaMet),
          isAgeCriteriaMet: normalizeCriteria(data.isAgeCriteriaMet),
          isEducationCriteriaMet: normalizeCriteria(data.isEducationCriteriaMet),
          isShortlisted: normalizeCriteria(data.isShortlisted),

          workCriteriaRemark: data.workCriteriaRemark ?? "",
          ageCriteriaRemark: data.ageCriteriaRemark ?? "",
          educationCriteriaRemark: data.educationCriteriaRemark ?? "",
          finalScreeningRemark: data.finalScreeningRemark ?? "",
          submitBeforeDate: data.submitBeforeDate ?? "",
          screeningId: data.screeningId ?? null,
        }));
      } catch (err) {
        console.error("Failed to fetch discrepancy details", err);
      }
    };

    fetchDiscrepancyDetails();
  }, [applicationId]);

  useEffect(() => {
    if (applicationId) {
      refreshDocStatuses();
    }
  }, [applicationId]);

  useEffect(() => {
    setScreeningForm(prev => ({
      ...prev,
      applicationId,
      candidateId,
    }));
  }, [applicationId, candidateId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "verified-pill";
      case "REJECTED":
        return "rejected-pill";
      default:
        return "pending-pill";
    }
  };

  // const handleRadioChange = (field, value) => {
  //   setScreeningForm(prev => {
  //     const updated = {
  //       ...prev,
  //       [field]: value,
  //     };

  //     return updated;
  //   });

  //   setErrors(prev => {
  //     const updated = { ...prev };
  //     delete updated[field];

  //     if (value === "YES") {
  //       if (field === "isWorkCriteriaMet") delete updated.workCriteriaRemark;
  //       if (field === "isAgeCriteriaMet") delete updated.ageCriteriaRemark;
  //       if (field === "isEducationCriteriaMet") delete updated.educationCriteriaRemark;
  //     }

  //     return updated;
  //   });
  // };

  const handleRadioChange = (field, value) => {
    setScreeningForm(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Always clear respective remark when radio changes
      if (field === "isWorkCriteriaMet") updated.workCriteriaRemark = "";
      if (field === "isAgeCriteriaMet") updated.ageCriteriaRemark = "";
      if (field === "isEducationCriteriaMet") updated.educationCriteriaRemark = "";

      return updated;
    });

    setErrors(prev => {
      const updated = { ...prev };

      delete updated[field];
      delete updated.workCriteriaRemark;
      delete updated.ageCriteriaRemark;
      delete updated.educationCriteriaRemark;

      return updated;
    });
  };

  // const handleInputChange = (field, value) => {
  //   setScreeningForm(prev => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   setErrors(prev => {
  //     const updated = { ...prev };

  //     delete updated[field];

  //     // special rule: shortlisted YES → remark no longer required
  //     if (field === "isShortlisted" && value === "YES") {
  //       delete updated.finalScreeningRemark;
  //     }

  //     return updated;
  //   });
  // };

  const handleInputChange = (field, value) => {
    setScreeningForm(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // 🔥 Clear remark when shortlist changes
      if (field === "isShortlisted") {
        updated.finalScreeningRemark = "";
      }

      return updated;
    });

    setErrors(prev => {
      const updated = { ...prev };

      delete updated[field];

      if (field === "isShortlisted") {
        delete updated.finalScreeningRemark;
      }

      return updated;
    });
  };

  const handleVerify = async (comment) => {
    if (!selectedDoc) return;

    try {

      if (isZonalHr) {

        await jobPositionApiService.verifyZonalDocument({
          candidateDocumentId: selectedDoc.candidateDocumentId,
          candidateId,
          applicationId,
          zonalHrDocStatus: "VERIFIED",
          // zonalHrDocComments: comment || ""
          zonalHrDocComments: ""
        });

      } else {

        // 🔹 DO NOT TOUCH — existing flow
        await jobPositionApiService.saveScreeningDecision({
          candidateDocumentId: selectedDoc.candidateDocumentId,
          candidateId,
          applicationId,
          docScreeningStatus: "VERIFIED",
          docScreeningComments: comment || "",
          verificationId: selectedDoc.verificationId,
        });

      }

      setShowViewer(false);
      setSelectedDoc(null);
      await refreshDocStatuses();

    } catch (err) {
      console.error("Verify failed", err);
    }
  };


  const handleReject = async (comment) => {
    if (!selectedDoc) return;

    try {

      if (isZonalHr) {

        await jobPositionApiService.verifyZonalDocument({
          candidateDocumentId: selectedDoc.candidateDocumentId,
          candidateId,
          applicationId,
          zonalHrDocStatus: "REJECTED",
          zonalHrDocComments: comment || ""
        });

      } else {

        // 🔹 existing screening API — untouched
        await jobPositionApiService.saveScreeningDecision({
          candidateDocumentId: selectedDoc.candidateDocumentId,
          candidateId,
          applicationId,
          docScreeningStatus: "REJECTED",
          docScreeningComments: comment || "",
          verificationId: selectedDoc.verificationId,
        });

      }

      setShowViewer(false);
      setSelectedDoc(null);
      await refreshDocStatuses();

    } catch (err) {
      console.error("Reject failed", err);
    }
  };


  const validateForm = () => {
    const newErrors = {};

    // Criteria validations
    if (!screeningForm.isWorkCriteriaMet) {
      newErrors.isWorkCriteriaMet = t("please_select_option");
    }

    if (!screeningForm.isAgeCriteriaMet) {
      newErrors.isAgeCriteriaMet = t("please_select_option");
    }

    if (!screeningForm.isEducationCriteriaMet) {
      newErrors.isEducationCriteriaMet = t("please_select_option");
    }

    // Work criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isWorkCriteriaMet === "NO" ||
      screeningForm.isWorkCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.workCriteriaRemark?.trim()) {
        newErrors.workCriteriaRemark = t("required");
      }
    }

    // Age criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isAgeCriteriaMet === "NO" ||
      screeningForm.isAgeCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.ageCriteriaRemark?.trim()) {
        newErrors.ageCriteriaRemark = t("required");
      }
    }

    // Education criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isEducationCriteriaMet === "NO" ||
      screeningForm.isEducationCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.educationCriteriaRemark?.trim()) {
        newErrors.educationCriteriaRemark = t("required");
      }
    }

    if (!disableShortlistedSection && !screeningForm.isShortlisted) {
      newErrors.isShortlisted = t("please_select_option");
    }

    if (hasAnyRejectedDocument()) {
      const allYes =
        screeningForm.isWorkCriteriaMet === "YES" &&
        screeningForm.isAgeCriteriaMet === "YES" &&
        screeningForm.isEducationCriteriaMet === "YES";

      if (allYes) {
        toast.error(
          "All criteria cannot be YES when any document is REJECTED"
        );
        return false;
      }
    }

    // const derivedStatus = deriveShortlistStatus();

    // if (derivedStatus === "NO") {
    //   if (!screeningForm.finalScreeningRemark?.trim()) {
    //     newErrors.finalScreeningRemark = t("validation:required");
    //   }
    // }

    if (screeningForm.isShortlisted === "NO") {
      if (!screeningForm.finalScreeningRemark?.trim()) {
        newErrors.finalScreeningRemark = t("validation:required");
      }
    }

    // Submit before date validation
    if (disableShortlistedSection) {
      if (!screeningForm.submitBeforeDate) {
        newErrors.submitBeforeDate = t("please_select_date");
      } else {
        const selectedDate = new Date(screeningForm.submitBeforeDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
          newErrors.submitBeforeDate = t("date_after_today");
        }
      }
    }

    setErrors(newErrors);

    // valid if no errors
    return Object.keys(newErrors).length === 0;
  };

  const areAllDocumentsValidated = () => {
    return documentRows.every(doc => {
      const status =
        docStatusMap[doc.candidateDocumentId]?.status;

      return status === "VERIFIED" || status === "REJECTED";
    });
  };

  const disableDocAction = isInterviewView;

  const allDocsVerified =
    documentRows.length > 0 &&
    areAllDocumentsValidated();


  const areAllDocumentsVerified = () => {
    if (!documentRows.length) return false;
    if (docStatusLoading) return false;

    return documentRows.every(doc => {
      const status = docStatusMap[doc.candidateDocumentId]?.status;
      return status === "VERIFIED";
    });
  };

  const areAllCriteriaYes = () => {
    return (
      screeningForm.isWorkCriteriaMet === "YES" &&
      screeningForm.isAgeCriteriaMet === "YES" &&
      screeningForm.isEducationCriteriaMet === "YES"
    );
  };

  const hasAnyRejectedDocument = () => {
    return documentRows.some(doc => {
      const status = docStatusMap[doc.candidateDocumentId]?.status;
      return status === "REJECTED";
    });
  };

  const countYesCriteria = () => {
    return [
      screeningForm.isWorkCriteriaMet,
      screeningForm.isAgeCriteriaMet,
      screeningForm.isEducationCriteriaMet,
    ].filter(v => v === "YES").length;
  };

  const baseDerived = deriveShortlistStatus();
  const derivedShortlist = baseDerived;

  const areAllCriteriaSelected =
    screeningForm.isWorkCriteriaMet &&
    screeningForm.isAgeCriteriaMet &&
    screeningForm.isEducationCriteriaMet;

  const disableShortlistedSection =
    !areAllCriteriaSelected || baseDerived === "DEFAULT";

  // const disableYesOption =
  //   disableShortlistedSection || derivedShortlist === "NO";

  // const disableNoOption =
  //   disableShortlistedSection || derivedShortlist === "YES";

  // const disableYesOption = disableShortlistedSection;
  const disableYesOption = disableShortlistedSection || !areAllCriteriaYes();
  const disableNoOption = disableShortlistedSection;

  const handleFinalSubmit = async () => {

    // 🔴 1️⃣ Hard stop: documents cannot be pending
    if (!areAllDocumentsValidated()) {
      toast.error("Please validate all documents");
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;

    // 🔴 2️⃣ Auto derive shortlist status
    const derivedShortlist = deriveShortlistStatus();

    const payload = {
      ...screeningForm,
      // isShortlisted: derivedShortlist || "NO",
      isScreeningCompleted: true,
    };


    try {
      await jobPositionApiService.saveCandidateDiscrepancyDetails(payload);
      toast.success("Screening submitted successfully");
      navigate("/candidate-workflow", { state: { requisitionId, positionId } })
    } catch (err) {
      console.error("Screening submit failed", err);
      toast.error("Submission failed");
    }
  };

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const minDate = getTomorrowDate();
  const minFutureDate = minDate;


  const handleDateChange = (e) => {
    let value = e.target.value;

    // Hard-stop: max length for YYYY-MM-DD is 10
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Always update state so typing doesn't feel broken
    setScreeningForm(prev => ({
      ...prev,
      submitBeforeDate: value,
    }));

    // Clear error while typing
    setErrors(prev => ({ ...prev, submitBeforeDate: undefined }));

    // ⛔ Do NOT validate until full date exists
    if (value.length < 10) return;

    // Enforce exact YYYY-MM-DD
    const strictDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!strictDateRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        submitBeforeDate: t("invalid_date"),
      }));
      return;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if (selectedDate <= today) {
      setErrors(prev => ({
        ...prev,
        submitBeforeDate: t("date_after_today"),
      }));
    }
  };

  useEffect(() => {
    if (!disableShortlistedSection) return;
    if (screeningForm.isScreeningCompleted) return; // 🔒 preserve backend value

    setScreeningForm(prev => ({
      ...prev,
      submitBeforeDate: "",
    }));

    setErrors(prev => ({
      ...prev,
      submitBeforeDate: undefined,
    }));

  }, [disableShortlistedSection, screeningForm.isScreeningCompleted]);

  useEffect(() => {
    const derived = deriveShortlistStatus();

    // if (derived === "YES") {
    //   setScreeningForm(prev => ({
    //     ...prev,
    //     isShortlisted: "YES",
    //     finalScreeningRemark: "",   // 🔥 CLEAR HERE
    //   }));

    //   setErrors(prev => ({
    //     ...prev,
    //     finalScreeningRemark: undefined,
    //   }));
    // }

    // if (derived === "NO") {
    //   setScreeningForm(prev => ({
    //     ...prev,
    //     isShortlisted: "NO",
    //   }));
    // }

    if (derived === "DEFAULT") {
      setScreeningForm(prev => {
        if (prev.isScreeningCompleted) return prev; // 🔒 preserve backend data

        return {
          ...prev,
          isShortlisted: "",
          finalScreeningRemark: "",
        };
      });

      setErrors(prev => ({
        ...prev,
        finalScreeningRemark: undefined,
        submitBeforeDate: undefined,
        isShortlisted: undefined,
      }));
    }

  }, [
    screeningForm.isWorkCriteriaMet,
    screeningForm.isAgeCriteriaMet,
    screeningForm.isEducationCriteriaMet
  ]);

  useEffect(() => {
    if (!areAllCriteriaYes() && screeningForm.isShortlisted === "YES") {
      setScreeningForm(prev => ({
        ...prev,
        isShortlisted: ""
      }));
    }
  }, [screeningForm.isWorkCriteriaMet,
  screeningForm.isAgeCriteriaMet,
  screeningForm.isEducationCriteriaMet]);

  const allDocsAreVerified = areAllDocumentsVerified();

  const isOptionDisabled = (option) => {
    if (option === "DISCREPANCY" && allDocsAreVerified) return true;
    return false;
  };

  useEffect(() => {
    if (!allDocsAreVerified) return;

    setScreeningForm(prev => ({
      ...prev,
      isWorkCriteriaMet:
        prev.isWorkCriteriaMet === "DISCREPANCY" ? "" : prev.isWorkCriteriaMet,
      isAgeCriteriaMet:
        prev.isAgeCriteriaMet === "DISCREPANCY" ? "" : prev.isAgeCriteriaMet,
      isEducationCriteriaMet:
        prev.isEducationCriteriaMet === "DISCREPANCY" ? "" : prev.isEducationCriteriaMet,
    }));
  }, [allDocsAreVerified]);




  useEffect(() => {
    if (zonalInitRef.current) {
      zonalInitRef.current = false;
      return;
    }

    if (zonalDecision !== "PROVISIONALLY_APPROVED") {
      setScreeningForm(prev => ({
        ...prev,
        zonalSubmitDate: ""
      }));

      setErrors(prev => ({
        ...prev,
        zonalSubmitDate: undefined
      }));
    }
  }, [zonalDecision]);

  const getPendingMessage = (doc) => {
    if (!doc?.pendingChecks?.length) {
      return "Validation pending";
    }

    const formatted = doc.pendingChecks
      .map(item => String(item).toUpperCase())
      .join(", ");

    return `Please verify the correctness of ${formatted}`;
  };

  const isBirthPending = birthDoc?.isValidationPending === true;
  const isTenthPending = tenthDoc?.isValidationPending === true;
  const isPending = isBirthPending || isTenthPending;
  return (
    <>
      <Accordion
        activeKey={activeAccordion}
        onSelect={(key) => setActiveAccordion(key)}
        alwaysOpen
        className="bob-accordion"
      >

        {/* === PERSONAL DETAILS === */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("personal_details")}</Accordion.Header>
          <Accordion.Body>
            <div className="personal-details-wrapper">
              <table className="table table-bordered bob-table w-100 mb-0">
                <tbody>
                  <tr>
                    <td className="fw-med" style={{ width: "20%" }}>{t("full_name")}</td>
                    <td className="fw-reg" colSpan={4} style={{ width: "60%" }}>
                      {data.personalDetails.fullName}
                    </td>

                    {/* ✅ Make photo span the full height of the table */}
                    {/* <td
                      rowSpan="3"
                      className="bob-photo-cell align-top text-center"
                      style={{ width: "20%", verticalAlign: "top" }}
                    >
                      <div className="bob-photo-box">
                        <img
                          src={photo}
                          alt="Applicant Photo"
                          className="img-fluid img1"
                        />

                        <img
                          src={signature}
                          alt="Signature"
                          className="img-fluid img2"
                        />
                      </div>
                    </td> */}



                    <td
                      rowSpan="3"
                      className="bob-photo-cell align-top text-center"
                      style={{ width: "20%", verticalAlign: "top" }}
                    >
                      <div className="photo-signature-wrapper">

                        {/* PHOTO BOX */}
                        <div className="photo-box">
                          {photo ? (
                            <img
                              src={photo}
                              alt="Applicant Photo"
                              className="photo-img"
                            />
                          ) : (
                            <div className="no-image">No Photo</div>
                          )}
                        </div>

                        {/* SIGNATURE BOX */}
                        <div className="signature-box">
                          {signature ? (
                            <img
                              src={signature}
                              alt="Signature"
                              className="signature-img"
                            />
                          ) : (
                            <div className="no-image">No Signature</div>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("address")}</td>
                    <td className="fw-reg" colSpan={4}>{data.personalDetails.address}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("permanent_address")}</td>
                    <td className="fw-reg" colSpan={4}>{data.personalDetails.permanentAddress}</td>
                  </tr>

                  <tr >
                    <td className="fw-med" >{t("mobile")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.mobile}</td>
                    <td className="fw-med">{t("email")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.email}</td>
                  </tr>

                  <tr >
                    <td className="fw-med">{t("mother_name")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.motherName || "-"}</td>
                    <td className="fw-med">{t("father_name")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.fatherName}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("gender")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.gender_name || "-"}</td>
                    <td className="fw-med">{t("religion")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.religion_name || "-"}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("category")}</td>
                    <td className="fw-reg" colSpan={2}  >{data.personalDetails.reservationCategory_name || "-"}</td>
                    <td className="fw-med">{t("caste")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.caste || "-"}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("dob")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {data.personalDetails.dob}
                      {/* {isPending ? (
                        // ❌ PENDING
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="dob-fail-tooltip">
                              Manual verification pending
                            </Tooltip>
                          }
                        >
                          <span>
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              style={{ color: "#dc3545" }}
                              className="ms-1"
                            />
                          </span>
                        </OverlayTrigger>

                      ) : (
                        // ✅ VERIFIED
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="dob-success-tooltip">
                              Verified
                            </Tooltip>
                          }
                        >
                          <span>
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              style={{ color: "#28a745" }}
                              className="ms-1"
                            />
                          </span>
                        </OverlayTrigger>
                      )} */}
                    </td>
                    <td className="fw-med">{t("age_cutoff")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.age || "-"}</td>

                    {/* <td className="fw-med">Nationality</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.nationality_name}</td> */}


                    {/* <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{previewData.personalDetails.age || "-"}</td> */}
                  </tr>

                  <tr>
                    <td className="fw-med">{t("ex_serviceman")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.exService || "N/A"}</td>
                    <td className="fw-med">{t("physical_disability")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.physicalDisability || "N"}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("exam_center")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {data.personalDetails.examCenter}
                    </td>
                    <td className="fw-med">{t("nationality")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.nationality_name}</td>
                  </tr>


                  {/* <tr>
                      <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.age || "-"}</td>
                      <td className="fw-med"></td>
                      <td className="fw-reg" colSpan={2}></td>
                    </tr> */}

                  <tr>
                    <td className="fw-med">{t("marital_status")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.maritalStatus_name}</td>
                    <td className="fw-med">{t("spouse_name")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.spouseName || "-"}</td>
                  </tr>
                  <tr>
                    {/* <td className="fw-med">{t("twin_sibling")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {data.personalDetails.isTwin === "Yes"
                        ? `Yes (${data.personalDetails.twinName})`
                        : "No"}
                    </td> */}
                    <td className="fw-med">{t("twin_sibling")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {data.personalDetails.isTwin === "Yes"
                        ? `Yes (${data.personalDetails.twinName})`
                        : "No"}
                    </td>

                    {/* <td className="fw-med">{t("twin_sibling")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.isTwin}</td> */}
                    {/* <td className="fw-med">Details</td>
                      <td className="fw-reg" colSpan={2}>{previewData.personalDetails.isTwin === "YES"
                        ? `${previewData.personalDetails.twinName} (${previewData.personalDetails.twinGender_name})`
                        : "-"}</td> */}
                    <td className="fw-med">{t("cibil_score")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.cibilScore}</td>
                  </tr>
                  <tr>
                    <td className="fw-med">{t("current_ctc")}</td>
                    <td className="fw-reg" colSpan={2}>{data.experienceSummary?.currentCtc || "-"}</td>
                    <td className="fw-med">{t("expected_ctc")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {data.personalDetails.expectedCtc}
                    </td>

                    {/* <td className="fw-med">Social Media Profile links</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.socialMediaProfileLink}</td> */}
                    {/* <td className="fw-med">Expected CTC</td>
                      <td className="fw-reg" colSpan={2}>{preferences.ctc ? `₹${Number(preferences.ctc).toLocaleString()}` : "-"}</td> */}
                  </tr>

                  {/* <tr>
                      <td className="fw-med">Location Preference 1</td>
                      <td className="fw-reg" colSpan={2}>{state1?.state_name || "-"}</td>
                      <td className="fw-med">Location Preference 2</td>
                      <td className="fw-reg" colSpan={2}>{state2?.state_name || "-"}</td>
                    </tr> */}

                  {/*<tr>
                       <td className="fw-med">Location Preference 3</td>
                      <td className="fw-reg" colSpan={2}>{state3?.state_name || "-"}</td> 
                      <td className="fw-med">Social Media Profile links</td>
                      <td className="fw-reg" colSpan={2}>{previewData.personalDetails.socialMediaProfileLink}</td>
                    </tr>*/}

                  <tr>

                    <td className="fw-med">{t("social_media_links")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.socialMediaProfileLink}</td>
                    <td className="fw-med">{t("location_pref1")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {formatLocation(
                        data.personalDetails.locationPreference1,
                        data.personalDetails.statePreference1
                      )}

                    </td>

                  </tr>

                  <tr>
                    <td className="fw-med">{t("location_pref2")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {formatLocation(
                        data.personalDetails.locationPreference2,
                        data.personalDetails.statePreference2
                      )}

                    </td>
                    <td className="fw-med">{t("location_pref3")}</td>
                    <td className="fw-reg" colSpan={2}>
                      {formatLocation(
                        data.personalDetails.locationPreference3,
                        data.personalDetails.statePreference3
                      )}
                    </td>

                  </tr>


                  <tr>
                    <td className="fw-med">{t("central_govt_employment")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.centralGovtEmployment || "No"}</td>
                    <td className="fw-med">{t("lower_post")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.servingLowerPost || "No"}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("riot_family_member")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.riotVictimFamily || "No"}</td>
                    <td className="fw-med">{t("religious_minority")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.minority || "No"}</td>
                  </tr>

                  <tr>
                    <td className="fw-med">{t("govt_service")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.servingInGovt || "No"}</td>
                    <td className="fw-med">{t("disciplinary_action")}</td>
                    <td className="fw-reg" colSpan={2}>{data.personalDetails.disciplinaryAction || "No"}</td>
                  </tr>

                  {/* {data.personalDetails.disciplinaryAction === "Yes" && (
                      <tr>
                        <td className="fw-med">Details of disciplinary proceedings, if Any</td>
                        <td className="fw-reg" colSpan={5}>{data.personalDetails.disciplinaryDetails || "N/A"}</td>
                      </tr>

                      
                    )} */}

                  {/* <tr>
                    <td className="fw-med">{t("disciplinary_details")}</td>
                    <td className="fw-reg" colSpan={5}>
                      {data.personalDetails.disciplinaryDetails}
                    </td>
                  </tr> */}

                </tbody>
              </table>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* === EDUCATION DETAILS === */}
        <Accordion.Item eventKey="1" className="edu-accordion">
          <Accordion.Header>{t("education_details")}</Accordion.Header>
          <Accordion.Body>
            <div>
              <table className="edu-table">
                <thead>
                  <tr>
                    <th style={{ width: "4rem" }}>{t("s_no")}</th>
                    <th>{t("education_level")}</th>
                    <th>{t("school_college")}</th>
                    <th>{t("university_name")}</th>
                    <th>{t("board")}</th>
                    <th>{t("specialization")}</th>
                    <th style={{ width: '10%' }}>{t("from_date")}</th>
                    <th style={{ width: '10%' }}>{t("to_date")}</th>
                    <th style={{ width: '9%' }}>{t("percentage_cgpa")}</th>
                  </tr>
                </thead>

                <tbody>
                  {(data.education || []).map((edu, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{edu.educationLevel_name || "-"}</td>
                      <td>{edu.institution || "-"}</td>
                      <td>{edu.universityName || "-"}</td>
                      <td>{edu.mandatoryQualification_name || "-"}</td>
                      <td>{edu.specialization_name || "-"}</td>
                      <td>{edu.startDate || "-"}</td>
                      <td>{edu.endDate || "-"}</td>
                      <td>{edu.percentage || "-"}</td>
                    </tr>
                  ))}


                  {(!data.education || data.education.length === 0) && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {t("no_education")}
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </Accordion.Body>
        </Accordion.Item>

        {/* === EXPERIENCE DETAILS === */}
        <Accordion.Item eventKey="2" className="exp-accordion">
          <Accordion.Header >
            {t("experience_details")}
          </Accordion.Header>

          <Accordion.Body>
            <table className="exp-table">
              <thead>
                <tr className="exp-table-header">
                  <th>{t("s_no")}</th>
                  <th>{t("organization")}</th>
                  <th>{t("post")}</th>
                  <th>{t("role")}</th>
                  <th>{t("from_date")}</th>
                  <th>{t("to_date")}</th>
                  <th>{t("duration")}</th>
                  <th>{t("work_profile")}</th>
                </tr>
              </thead>

              <tbody>
                {(data.experience || []).map((exp, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{exp.org}</td>
                    <td>{exp.designation}</td>
                    <td>{exp.department}</td>
                    <td>{exp.from}</td>
                    <td>{exp.to}</td>
                    <td>{exp.duration}</td>
                    <td>{exp.nature}</td>
                  </tr>
                ))}

                {(!data.experience || data.experience.length === 0) && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      {t("no_experience")}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>{t("documents_details")}</Accordion.Header>

          <Accordion.Body>

            <table className="bob-doc-table">

              {/* COLUMN WIDTH CONTROL */}
              <colgroup>
                <col style={{ width: "16.66%" }} />
                <col style={{ width: "16.66%" }} />
                <col style={{ width: "16.66%" }} />
                <col style={{ width: "16.66%" }} />
                <col style={{ width: "16.66%" }} />
                <col style={{ width: "16.66%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th style={{ width: "44%" }}>{t("file_type")}</th>
                  <th className="px-3" style={{ width: "5%" }}>{t("status")}</th>
                  <th className="text-center" style={{ width: "1%" }}>{t("action")}</th>

                  <th style={{ width: "44%" }}>{t("file_type")}</th>
                  <th className="px-3" style={{ width: "5%" }}>{t("status")}</th>
                  <th className="text-center" style={{ width: "1%" }}>{t("action")}</th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: Math.ceil(documentRows.length / 2) }).map(
                  (_, rowIndex) => {

                    const left = documentRows[rowIndex * 2];
                    const right = documentRows[rowIndex * 2 + 1];

                    const leftStatus =
                      docStatusMap[left?.candidateDocumentId]?.status || "PENDING";

                    const rightStatus =
                      docStatusMap[right?.candidateDocumentId]?.status || "PENDING";

                    return (
                      <tr key={rowIndex}>

                        {/* LEFT SIDE */}
                        {/* <td>{left?.name}</td> */}
                        <td>
                          {left?.name}

                          {left?.isValidationPending && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-left-${left.candidateDocumentId}`}>
                                  {getPendingMessage(left)}
                                </Tooltip>
                              }
                            >
                              <span>
                                <FontAwesomeIcon
                                  icon={faCircleExclamation}   // ⚠️ warning icon
                                  style={{ color: "#ffc107" }}
                                  className="ms-2"
                                />
                              </span>
                            </OverlayTrigger>
                          )}
                        </td>

                        <td>
                          {left && (
                            <span className={getStatusClass(leftStatus)}>
                              {t(leftStatus)}
                            </span>
                          )}
                        </td>

                        <td className="action-cell divider1">
                          {left && (
                            <>
                              <img
                                src={viewIcon}
                                alt={t("view")}
                                style={{
                                  cursor: disableDocAction ? "not-allowed" : "pointer",
                                  opacity: disableDocAction ? 0.4 : 1,
                                  pointerEvents: disableDocAction ? "none" : "auto",
                                  // marginLeft: "12px",

                                }}
                                onClick={() => {
                                  if (disableDocAction) return;

                                  setSelectedDoc({
                                    candidateDocumentId: left.candidateDocumentId,
                                    status: leftStatus,
                                    candidateId: previewData.candidateId,
                                    applicationId: previewData.applicationId,
                                    verificationId:
                                      docStatusMap[left.candidateDocumentId]?.verificationId,
                                    docScreeningComments:
                                      docStatusMap[left.candidateDocumentId]?.comments || "",
                                    name: left.name,
                                    fileUrl: left.url,
                                  });

                                  setShowViewer(true);
                                }}
                              />
                            </>
                          )}
                        </td>


                        {/* RIGHT SIDE */}
                        {/* <td>{right?.name || "-"}</td> */}
                        <td>
                          {right?.name || "-"}

                          {right?.isValidationPending && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-right-${right.candidateDocumentId}`}>
                                  {getPendingMessage(right)}
                                </Tooltip>
                              }
                            >
                              <span>
                                <FontAwesomeIcon
                                  icon={faCircleExclamation}
                                  style={{ color: "#ffc107" }}
                                  className="ms-2"
                                />
                              </span>
                            </OverlayTrigger>
                          )}
                        </td>

                        <td>
                          {right ? (
                            <span className={getStatusClass(rightStatus)}>
                              {t(rightStatus)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="action-cell">
                          {right ? (
                            <>
                              <img
                                src={viewIcon}
                                alt={t("view")}
                                style={{
                                  cursor: disableDocAction ? "not-allowed" : "pointer",
                                  opacity: disableDocAction ? 0.4 : 1,
                                  pointerEvents: disableDocAction ? "none" : "auto",
                                  // marginLeft: "12px",

                                }}
                                onClick={() => {
                                  if (disableDocAction) return;

                                  setSelectedDoc({
                                    candidateDocumentId: right.candidateDocumentId,
                                    candidateId: previewData.candidateId,
                                    applicationId: previewData.applicationId,
                                    verificationId:
                                      docStatusMap[right.candidateDocumentId]?.verificationId,
                                    docScreeningComments:
                                      docStatusMap[right.candidateDocumentId]?.comments || "",
                                    name: right.name,
                                    fileUrl: right.url,
                                  });

                                  setShowViewer(true);
                                }}
                              />
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </Accordion.Body>
        </Accordion.Item>

        {/* ================= CRITERIA SECTION ================= */}
        {canCandidatePool && !disableDocAction && !isFromInterview && (
          <Card className="criteria-main-card">

            <div className="criteria-wrapper">

              {/* WORK CRITERIA */}
              <div className="criteria-card">
                <label className="criteria-title">{t("work_criteria")}</label>

                <div className="criteria-radio mb-0">
                  {CRITERIA_OPTIONS.map(option => (
                    <label key={option} className={`radio-label ${isOptionDisabled(option) ? "disabled" : ""}`}>
                      <input
                        type="radio"
                        name="workCriteria"
                        checked={screeningForm.isWorkCriteriaMet === option}
                        onChange={() =>
                          handleRadioChange("isWorkCriteriaMet", option)
                        }
                        disabled={isOptionDisabled(option)}
                      />
                      <span className="custom-radio"></span>
                      {t(option)}
                    </label>
                  ))}
                </div>
                {errors.isWorkCriteriaMet && (
                  <small className="text-danger fs-12">
                    {errors.isWorkCriteriaMet}
                  </small>
                )}

                <textarea
                  // type="text"
                  className="criteria-remark mt-2"
                  placeholder={t("work_remark")}
                  value={screeningForm.workCriteriaRemark}
                  onChange={(e) =>
                    handleInputChange("workCriteriaRemark", e.target.value)
                  }
                  maxLength={2000}
                  rows={4}
                // disabled={screeningForm.isWorkCriteriaMet !== "DISCREPANCY"}
                />
                {errors.workCriteriaRemark && (
                  <small className="text-danger fs-12">
                    {errors.workCriteriaRemark}
                  </small>
                )}
              </div>

              {/* AGE CRITERIA */}
              <div className="criteria-card">
                <label className="criteria-title">{t("age_criteria")}</label>

                <div className="criteria-radio mb-0">
                  {CRITERIA_OPTIONS.map(option => (
                    <label key={option} className={`radio-label ${isOptionDisabled(option) ? "disabled" : ""}`}>
                      <input
                        type="radio"
                        name="ageCriteria"
                        checked={screeningForm.isAgeCriteriaMet === option}
                        onChange={() =>
                          handleRadioChange("isAgeCriteriaMet", option)
                        }
                        disabled={isOptionDisabled(option)}
                      />
                      <span className="custom-radio"></span>
                      {t(option)}
                    </label>
                  ))}
                </div>
                {errors.isAgeCriteriaMet && (
                  <small className="text-danger fs-12">
                    {errors.isAgeCriteriaMet}
                  </small>
                )}

                <textarea
                  // type="text"
                  className="criteria-remark mt-2"
                  placeholder={t("age_remark")}
                  value={screeningForm.ageCriteriaRemark}
                  onChange={(e) =>
                    handleInputChange("ageCriteriaRemark", e.target.value)
                  }
                  maxLength={2000}
                  rows={4}
                // disabled={screeningForm.isAgeCriteriaMet !== "DISCREPANCY"}
                />
                {errors.ageCriteriaRemark && (
                  <small className="text-danger fs-12">
                    {errors.ageCriteriaRemark}
                  </small>
                )}
              </div>

              {/* EDUCATION CRITERIA */}
              <div className="criteria-card">
                <label className="criteria-title"> {t("education_criteria")}</label>

                <div className="criteria-radio mb-0">
                  {CRITERIA_OPTIONS.map(option => (
                    <label key={option} className={`radio-label ${isOptionDisabled(option) ? "disabled" : ""}`}>
                      <input
                        type="radio"
                        name="educationCriteria"
                        checked={screeningForm.isEducationCriteriaMet === option}
                        onChange={() =>
                          handleRadioChange("isEducationCriteriaMet", option)
                        }
                        disabled={isOptionDisabled(option)}
                      />
                      <span className="custom-radio"></span>
                      {t(option)}
                    </label>
                  ))}
                </div>
                {errors.isEducationCriteriaMet && (
                  <small className="text-danger fs-12">
                    {errors.isEducationCriteriaMet}
                  </small>
                )}

                <textarea
                  // type="text"
                  className="criteria-remark mt-2"
                  placeholder={t("education_remark")}
                  value={screeningForm.educationCriteriaRemark}
                  onChange={(e) =>
                    handleInputChange("educationCriteriaRemark", e.target.value)
                  }
                  maxLength={2000}
                  rows={4}
                // disabled={screeningForm.isEducationCriteriaMet !== "DISCREPANCY"}
                />
                {errors.educationCriteriaRemark && (
                  <small className="text-danger fs-12">
                    {errors.educationCriteriaRemark}
                  </small>
                )}
              </div>

              {/* FINAL REMARK */}
              <div
                className={`criteria-card ${disableShortlistedSection ? "criteria-disabled" : ""
                  }`}
              >
                <label className="criteria-title">{t("shortlisted")}</label>

                <div className="criteria-radio mb-0">
                  {["YES", "NO"].map(option => {
                    const isDisabled =
                      (option === "YES" && disableYesOption) ||
                      (option === "NO" && disableNoOption);

                    return (
                      <label key={option} className={`radio-label ${isDisabled ? "disabled" : ""}`}>
                        <input
                          type="radio"
                          name="shortlisted"
                          value={option}
                          checked={screeningForm.isShortlisted === option}
                          disabled={isDisabled}
                          onChange={() => handleInputChange("isShortlisted", option)}
                        />
                        <span className="custom-radio"></span>
                        {option}
                      </label>
                    );
                  })}
                </div>
                {!disableShortlistedSection && errors.isShortlisted && (
                  <small className="text-danger fs-12">
                    {errors.isShortlisted}
                  </small>
                )}

                <textarea
                  // type="text"
                  className="criteria-remark mt-2"
                  placeholder={t("final_remark")}
                  value={screeningForm.finalScreeningRemark}
                  onChange={(e) =>
                    handleInputChange("finalScreeningRemark", e.target.value)
                  }
                  maxLength={2000}
                  rows={4}
                />
                {errors.finalScreeningRemark && (
                  <small className="text-danger fs-12">
                    {errors.finalScreeningRemark}
                  </small>
                )}
              </div>
            </div>

            {/* ================= SUBMIT ROW ================= */}
            <div className={`criteria-submit-row ${disableShortlistedSection ? 'justify-content-between' : 'justify-content-end'}`}>
              {!isZonalHr && disableShortlistedSection && (
                <div className="d-grid">
                  <label className="submit-label">{t("submit_before")}</label>
                  <input
                    type="date"
                    className="criteria-date"
                    min={minDate}
                    value={screeningForm.submitBeforeDate}
                    onChange={handleDateChange}
                  />
                  {errors.submitBeforeDate && (
                    <small className="text-danger mt-1 fs-12">
                      {errors.submitBeforeDate}
                    </small>
                  )}
                </div>
              )}

              <button
                className="btn-submit-orange"
                onClick={handleFinalSubmit}
              >
                {t("submit")}
              </button>
            </div>
          </Card>
        )}

        {isZonalHr && !isInterviewView && (
          <Card
            className={`criteria-main-card p-3 ${isZonalAbsent ? "criteria-disabled" : ""
              }`}
          >

            <label className="criteria-title mb-2">
              {t("all_docs_verified_q")}
            </label>



            {/* RADIO OPTIONS — same pattern as Shortlisted */}
            <div className="criteria-radio mb-3">
              {["YES", "NO", "PROVISIONALLY_APPROVED"].map((opt) => {

                const disableYes =
                  opt === "YES" && !areAllDocumentsVerified();

                const disableProvisionallyApproved =
                  opt === "PROVISIONALLY_APPROVED" && areAllDocumentsVerified();

                const isDisabled =
                  isZonalAbsent ||
                  !allDocsVerified ||
                  disableProvisionallyApproved ||
                  disableYes;



                return (
                  <label
                    key={opt}
                    className={`radio-label me-4 ${isDisabled ? "disabled" : ""}`}
                  >
                    <input
                      type="radio"
                      name="docVerified"
                      value={opt}
                      checked={zonalDecision === opt}
                      disabled={isDisabled}
                      onChange={(e) => {
                        const value = e.target.value;
                        setZonalDecision(value);
                        setErrors(prev => ({
                          ...prev,
                          zonalSubmitDate: undefined,
                          zonalComments: undefined
                        }));
                        if (value === "YES") {
                          setScreeningRemarks("");
                        }
                      }}
                    />
                    <span className="custom-radio"></span>
                    {t(opt)}
                  </label>
                );
              })}



            </div>


            {/* DATE */}

            {/* DATE - Show only for PROVISIONALLY APPROVED */}
            {zonalDecision === "PROVISIONALLY_APPROVED" && (
              <div className="submit-date-group d-flex flex-column">
                <label className="submit-label">{t("submit_before")}</label>

                <input
                  type="date"
                  className={`criteria-date ${errors.zonalSubmitDate ? "input-error" : ""}`}
                  min={minFutureDate}
                  value={screeningForm.zonalSubmitDate}
                  disabled={isZonalAbsent || !allDocsVerified}
                  onChange={(e) => {
                    setScreeningForm(prev => ({
                      ...prev,
                      zonalSubmitDate: e.target.value
                    }));

                    setErrors(prev => ({
                      ...prev,
                      zonalSubmitDate: undefined
                    }));
                  }}
                />

                {errors.zonalSubmitDate && (
                  <small className="text-danger mt-1">
                    {errors.zonalSubmitDate}
                  </small>
                )}
              </div>
            )}




            {/* REMARKS */}

            <div className="remarks-row">

              {/* LEFT SIDE */}
              <div className="remarks-left">

                <textarea
                  className={`remarks-box ${errors.zonalComments ? "input-error" : ""}`}
                  placeholder={t("enter_comments")}
                  rows={5}
                  disabled={docStatusLoading || isZonalAbsent}

                  value={screeningRemarks}
                  onChange={(e) => {
                    setScreeningRemarks(e.target.value);
                    setErrors(prev => ({
                      ...prev,
                      zonalComments: undefined
                    }));
                  }}
                />

                {/* Reserved error space */}
                <div className="remarks-error-space">
                  {errors.zonalComments && (
                    <small className="text-danger">
                      {errors.zonalComments}
                    </small>
                  )}
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="remarks-button">
                <button
                  className="btn-submit-orange"
                  disabled={docStatusLoading || isZonalAbsent}
                  onClick={handleZonalSubmit}
                >
                  {t("submit")}
                </button>
              </div>

            </div>







          </Card>
        )}


      </Accordion>
      <DocumentViewerModal
        show={showViewer}
        onHide={() => setShowViewer(false)}
        document={selectedDoc}
        onVerify={handleVerify}
        onReject={handleReject}
        isZonalAbsent={isZonalAbsent}

      />
    </>
  );
};

export default ApplicationForm;
