import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
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

const ApplicationForm = ({
  previewData,
  selectedJob,
  formErrors,
  setFormErrors,
  candidateId,
  positionId,
  applicationId,
  requisitionId
}) => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(["0", "1", "2", "3"]);
  const [criteria, setCriteria] = useState({});
  const location = useLocation();
  const candidate = location.state?.candidate;
  console.log("candidateId: ", candidateId)
  console.log("applicationId: ", applicationId)

  useEffect(() => {
    console.log("Loaded Candidate:", candidate);
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

    submitBeforeDate: "",
    isScreeningCompleted: false,
    screeningId: null,
  });

  const data = previewData || {
    personalDetails: {},
    experienceSummary: {},
    documents: {},
    education: [],
    experience: []
  };
  const CRITERIA_OPTIONS = ["YES", "NO", "DISCREPANCY"];

   const documentRows = [
    ...(data.documents?.identityProofs || []),
    ...(data.documents?.educationCertificates || []),
    ...(data.documents?.communityCertificates || []),
    ...(data.documents?.disabilityCertificates || []),
    ...(data.documents?.payslips || []),
    ...(data.documents?.resume || [])
  ].map(doc => ({
  ...doc,
  candidateDocumentId: doc.candidateDocumentId ?? doc.id
}));

  const [photo, setPhoto] = useState()
  const [signature, setSignature] = useState()
  const photoUrl = data.documents?.photo?.[0]?.url || logo_Bob;
  console.log("photoUrl", photoUrl);
  const signatureUrl = data.documents?.signature?.[0]?.url || sign;
  console.log("signatureUrl", signatureUrl);

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


  const refreshDocStatuses = async () => {
    try {
      setDocStatusLoading(true);
      const res =
        await jobPositionApiService.getScreeningCommitteeStatus(
          applicationId
        );

      const map = {};
      (res.data || []).forEach((item) => {
        map[item.candidateDocumentId] = {
          status: item.docScreeningStatus?.toUpperCase() || "PENDING",
          comments: item.docScreeningComments,
          verificationId: item.verificationId,
        };
      });

      setDocStatusMap(map);
    } catch (e) {
      console.error("Failed to fetch document screening status", e);
    } finally {
      setDocStatusLoading(false);
    }
  };

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
  //   setScreeningForm(prev => ({ ...prev, [field]: value }));
  //   setErrors(prev => ({ ...prev, [field]: undefined }));
  // };

  const handleRadioChange = (field, value) => {
    setScreeningForm(prev => {
      const updated = { ...prev, [field]: value };

      if (value === "YES") {
        if (field === "isWorkCriteriaMet") updated.workCriteriaRemark = "";
        if (field === "isAgeCriteriaMet") updated.ageCriteriaRemark = "";
        if (field === "isEducationCriteriaMet") updated.educationCriteriaRemark = "";
      }

      return updated;
    });

    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleInputChange = (field, value) => {
    setScreeningForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };
  
  const handleVerify = async (comment) => {
    console.log("selectedDoc", selectedDoc);
    if (!selectedDoc) return;

    try {
      await jobPositionApiService.saveScreeningDecision({
        candidateDocumentId: selectedDoc.candidateDocumentId,
        candidateId: candidateId,
        applicationId: applicationId,
        docScreeningStatus: "VERIFIED",
        docScreeningComments: comment || "",
        verificationId: selectedDoc.verificationId,
      });

      setShowViewer(false);
      setSelectedDoc(null);

      // 🔁 REFRESH backend truth
      await refreshDocStatuses();
    } catch (err) {
      console.error("Verify failed", err);
    }
  };

  const handleReject = async (comment) => {
    console.log("selectedDoc", selectedDoc);
    if (!selectedDoc) return;

    try {
      await jobPositionApiService.saveScreeningDecision({
        candidateDocumentId: selectedDoc.candidateDocumentId,
        candidateId: candidateId,
        applicationId: applicationId,
        docScreeningStatus: "REJECTED",
        docScreeningComments: comment || "",
        verificationId: selectedDoc.verificationId,
      });

      setShowViewer(false);
      setSelectedDoc(null);

      // 🔁 REFRESH backend truth
      await refreshDocStatuses();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Criteria validations
    if (!screeningForm.isWorkCriteriaMet) {
      newErrors.isWorkCriteriaMet = "Please select an option";
    }

    if (!screeningForm.isAgeCriteriaMet) {
      newErrors.isAgeCriteriaMet = "Please select an option";
    }

    if (!screeningForm.isEducationCriteriaMet) {
      newErrors.isEducationCriteriaMet = "Please select an option";
    }

    // Work criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isWorkCriteriaMet === "NO" ||
      screeningForm.isWorkCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.workCriteriaRemark?.trim()) {
        newErrors.workCriteriaRemark = "Required";
      }
    }

    // Age criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isAgeCriteriaMet === "NO" ||
      screeningForm.isAgeCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.ageCriteriaRemark?.trim()) {
        newErrors.ageCriteriaRemark = "Required";
      }
    }

    // Education criteria remark mandatory if NO or DISCREPANCY
    if (
      screeningForm.isEducationCriteriaMet === "NO" ||
      screeningForm.isEducationCriteriaMet === "DISCREPANCY"
    ) {
      if (!screeningForm.educationCriteriaRemark?.trim()) {
        newErrors.educationCriteriaRemark = "Required";
      }
    }

    if (!disableShortlistedSection && !screeningForm.isShortlisted) {
      newErrors.isShortlisted = "Please select an option";
    }

    if (screeningForm.isShortlisted === "NO") {
      if (!screeningForm.finalScreeningRemark?.trim()) {
        newErrors.finalScreeningRemark = "Required";
      }
    }

    // Submit before date validation
    if (disableShortlistedSection) {
      if (!screeningForm.submitBeforeDate) {
        newErrors.submitBeforeDate = "Please select a date";
      } else {
        const selectedDate = new Date(screeningForm.submitBeforeDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
          newErrors.submitBeforeDate = "Date must be after today";
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

  const disableShortlistedSection = !areAllDocumentsVerified() || !areAllCriteriaYes();

  useEffect(() => {
    if (disableShortlistedSection && screeningForm.isShortlisted) {
      setScreeningForm(prev => ({
        ...prev,
        isShortlisted: "",
        finalScreeningRemark: "",
      }));
    }
  }, [disableShortlistedSection]);

  const handleFinalSubmit = async () => {
    if (!areAllDocumentsValidated()) {
      toast.error("Please validate all the documents");
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;

    const rejectedExists = hasAnyRejectedDocument();
    const yesCount = countYesCriteria();

    if (rejectedExists && yesCount === 3) {
      toast.error(
        "All criteria cannot be YES when any document is Rejected"
      );
      return;
    }

    const payload = {
      ...screeningForm,
      isScreeningCompleted: true,
    };

    console.log("FINAL SCREENING PAYLOAD", payload);

    try {
      await jobPositionApiService.saveCandidateDiscrepancyDetails(payload);
      toast.success("Screening submitted successfully");
      navigate("/candidate-workflow", {state: {requisitionId, positionId}})
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
        submitBeforeDate: "Invalid date format (YYYY-MM-DD)",
      }));
      return;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setErrors(prev => ({
        ...prev,
        submitBeforeDate: "Date must be after today",
      }));
    }
  };

  useEffect(() => {
    if (!disableShortlistedSection) {
      setScreeningForm(prev => ({
        ...prev,
        submitBeforeDate: "",
      }));

      setErrors(prev => ({
        ...prev,
        submitBeforeDate: undefined,
      }));
    }
  }, [disableShortlistedSection]);

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
            <Accordion.Header>Personal Details</Accordion.Header>
            <Accordion.Body>
              <div className="personal-details-wrapper">
                <table className="table table-bordered bob-table w-100 mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-med" style={{ width: "20%" }}>Full Name</td>
                      <td className="fw-reg" colSpan={4} style={{ width: "60%" }}>
                        {data.personalDetails.fullName}
                      </td>

                      {/* ✅ Make photo span the full height of the table */}
                      <td
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
                      </td>
                    </tr>

                    <tr>
                      <td className="fw-med">Address</td>
                      <td className="fw-reg" colSpan={4}>{data.personalDetails.address}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Permanent Address</td>
                      <td className="fw-reg" colSpan={4}>{data.personalDetails.permanentAddress}</td>
                    </tr>

                    <tr >
                      <td className="fw-med" >Mobile</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.mobile}</td>
                      <td className="fw-med">Email</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.email}</td>
                    </tr>

                    <tr >
                      <td className="fw-med">Mother’s Name</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.motherName || "-"}</td>
                      <td className="fw-med">Father’s Name</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.fatherName}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Gender</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.gender_name || "-"}</td>
                      <td className="fw-med">Religion</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.religion_name || "-"}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Category</td>
                      <td className="fw-reg" colSpan={2}  >{data.personalDetails.reservationCategory_name || "-"}</td>
                      <td className="fw-med">Caste/Community</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.caste || "-"}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Date of Birth</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.dob}</td>
                       <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.age || "-"}</td>

                      {/* <td className="fw-med">Nationality</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.nationality_name}</td> */}


                      {/* <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{previewData.personalDetails.age || "-"}</td> */}
                    </tr>

                    <tr>
                      <td className="fw-med">Ex-serviceman</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.exService || "N/A"}</td>
                      <td className="fw-med">Physical Disability</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.physicalDisability || "N"}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Exam Center</td>
                      <td className="fw-reg" colSpan={2}>
                        {data.personalDetails.examCenter}
                      </td>
                      <td className="fw-med">Nationality</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.nationality_name}</td>
                    </tr>


                    {/* <tr>
                      <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.age || "-"}</td>
                      <td className="fw-med"></td>
                      <td className="fw-reg" colSpan={2}></td>
                    </tr> */}

                    <tr>
                      <td className="fw-med">Marital Status</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.maritalStatus_name}</td>
                      <td className="fw-med">Name of Spouse</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.spouseName || "-"}</td>
                    </tr>
                    <tr>
                      <td className="fw-med">Twin Sibling</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.isTwin}</td>
                      {/* <td className="fw-med">Details</td>
                      <td className="fw-reg" colSpan={2}>{previewData.personalDetails.isTwin === "YES"
                        ? `${previewData.personalDetails.twinName} (${previewData.personalDetails.twinGender_name})`
                        : "-"}</td> */}
                      <td className="fw-med">CIBIL Score</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.cibilScore}</td>
                    </tr>
                    <tr>
                      <td className="fw-med">Current CTC</td>
                      <td className="fw-reg" colSpan={2}>{data.experienceSummary?.currentCtc || "-"}</td>
                       <td className="fw-med">Expected CTC</td>
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

                       <td className="fw-med">Social Media Profile links</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.socialMediaProfileLink}</td> 
                                    <td className="fw-med">Location Preference 1</td>
                                    <td className="fw-reg" colSpan={2}>
                                      {data.personalDetails.locationPreference1}
                                    </td>
                                   
                                  </tr>

                                  <tr>
                                     <td className="fw-med">Location Preference 2</td>
                                    <td className="fw-reg" colSpan={2}>
                                      {data.personalDetails.locationPreference2}
                                    </td>
                                    <td className="fw-med">Location Preference 3</td>
                                    <td className="fw-reg" colSpan={2}>
                                      {data.personalDetails.locationPreference3}
                                    </td>
                                   
                                  </tr>


                    <tr>
                      <td className="fw-med">Already secured regular employment under the Central Govt. in civil post?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.centralGovtEmployment || "No"}</td>
                      <td className="fw-med">Serving at a post lower than the one advertised?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.servingLowerPost || "No"}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Family member of those who died in 1984 riots?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.familyMember1984 || "No"}</td>
                      <td className="fw-med">Belong to Religious Minority Community?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.religiousMinority || "No"}</td>
                    </tr>

                    <tr>
                      <td className="fw-med">Whether serving in Govt./ quasi Govt./ Public Sector Undertaking?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.servingInGovt || "No"}</td>
                      <td className="fw-med">Disciplinary action in any of your previous/ Current Employment?</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.disciplinaryAction || "No"}</td>
                    </tr>

                    {data.personalDetails.disciplinaryAction === "Yes" && (
                      <tr>
                        <td className="fw-med">Details of disciplinary proceedings, if Any</td>
                        <td className="fw-reg" colSpan={5}>{data.personalDetails.disciplinaryDetails || "N/A"}</td>
                      </tr>

                      
                    )}

                    <tr>
          <td className="fw-med">Details of disciplinary proceedings, if Any</td>
          <td className="fw-reg" colSpan={5}>
            {data.personalDetails.disciplinaryDetails}
          </td>
        </tr>

                  </tbody>
                </table>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* === EDUCATION DETAILS === */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Education Details</Accordion.Header>
            <Accordion.Body>
             <div className="edu-table-wrapper">
              <table className="edu-table">
                <thead>
                  <tr>
                    <th>S. No</th>
                    <th>Education Level</th>
                    <th>School/College</th>
                    <th>Degree</th>
                    <th>Specialization</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

   <tbody>
  {(data.education || []).map((edu, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{edu.educationLevel_name || "-"}</td>
      <td>{edu.institution || "-"}</td>
      <td>{edu.mandatoryQualification_name || "-"}</td>
      <td>{edu.specialization_name || "-"}</td>
      <td>{edu.startDate || "-"}</td>
      <td>{edu.endDate || "-"}</td>
      <td>{edu.percentage ? `${edu.percentage}%` : "-"}</td>
    </tr>
  ))}

  {(!data.education || data.education.length === 0) && (
    <tr>
      <td colSpan="8" className="text-center">
        No education details available
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
    Experience Details
  </Accordion.Header>

  <Accordion.Body>
    <table className="exp-table">
      <thead>
        <tr className="exp-table-header">
          <th>S. No</th>
          <th>Organization</th>
          <th>Post</th>
          <th>Role</th>
          <th>From Date</th>
          <th>To Date</th>
          <th>Duration</th>
          <th>Brief Description of work profile</th>
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
        No experience details available
      </td>
    </tr>
  )}
</tbody>

    </table>
  </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Documents Details</Accordion.Header>
            <Accordion.Body>

              <table className="bob-doc-table">
                <thead>
                  <tr>
                    <th>File Type</th>
                    <th>Status</th>
                    <th>Action</th>

                    <th>File Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.from({ length: Math.ceil(documentRows.length / 2) })
          .map(
                    (_, rowIndex) => {
                    const left = documentRows[rowIndex * 2];
                    const right = documentRows[rowIndex * 2 + 1];
                    const leftStatus =
                      docStatusMap[left?.candidateDocumentId]?.status || "PENDING";

                    const rightStatus =
                      docStatusMap[right?.candidateDocumentId]?.status || "PENDING";

                      return (
                        <tr key={rowIndex}>
                          {/* LEFT COLUMN */}
                          <td>{left?.name}</td>
                          <td>
                            {left && (
                              <span className={getStatusClass(leftStatus)}>
                                {leftStatus}
                              </span>
                            )}
                          </td>
                          <td className="action-cell">
                            {left && (
                              <>
                                <img
                                  src={viewIcon}
                                  alt="View"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    console.log("VIEW CLICKED", left);
                                    setSelectedDoc({
                                      candidateDocumentId: left.candidateDocumentId,
                                      candidateId: previewData.candidateId,
                                      applicationId: previewData.applicationId,
                                      verificationId: docStatusMap[left.candidateDocumentId]?.verificationId,
                                      docScreeningComments:
                                        docStatusMap[left.candidateDocumentId]?.comments || "",
                                      name: left.name,
                                      fileUrl: left.url,
                                    });
                                    setShowViewer(true);
                                  }}
                                />
                                <img
                                  src={downloadIcon}
                                  alt="Download"
                                  style={{ cursor: "pointer" }}
                                />
                              </>
                            )}
                          </td>

                          {/* RIGHT COLUMN */}
                          <td>{right?.name || "-"}</td>
                          <td>
                            {right ? (
                              <span className={getStatusClass(rightStatus)}>
                                {rightStatus}
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
                                  alt="View"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedDoc({
                                      candidateDocumentId: right.candidateDocumentId,
                                      candidateId: previewData.candidateId,
                                      applicationId: previewData.applicationId,
                                      verificationId: docStatusMap[right.candidateDocumentId]?.verificationId,
                                      docScreeningComments:
                                        docStatusMap[right.candidateDocumentId]?.comments || "",
                                      name: right.name,
                                      fileUrl: right.url,
                                    });
                                    setShowViewer(true);
                                  }}
                                />
                                <img
                                  src={downloadIcon}
                                  alt="Download"
                                  style={{ cursor: "pointer" }}
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
      <Card className="criteria-main-card">
        <div className="criteria-wrapper">

          {/* WORK CRITERIA */}
          <div className="criteria-card">
            <label className="criteria-title">Work criteria fulfilled?</label>

            <div className="criteria-radio mb-0">
              {CRITERIA_OPTIONS.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="workCriteria"
                    checked={screeningForm.isWorkCriteriaMet === option}
                    onChange={() =>
                      handleRadioChange("isWorkCriteriaMet", option)
                    }
                  />
                  <span className="custom-radio"></span>
                  {option}
                </label>
              ))}
            </div>
            {errors.isWorkCriteriaMet && (
              <small className="text-danger fs-12">
                {errors.isWorkCriteriaMet}
              </small>
            )}

            <input
              type="text"
              className="criteria-remark mt-2"
              placeholder="Work criteria remark"
              value={screeningForm.workCriteriaRemark}
              onChange={(e) =>
                handleInputChange("workCriteriaRemark", e.target.value)
              }
              maxLength={2000}
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
            <label className="criteria-title">Age criteria fulfilled?</label>

            <div className="criteria-radio mb-0">
              {CRITERIA_OPTIONS.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="ageCriteria"
                    checked={screeningForm.isAgeCriteriaMet === option}
                    onChange={() =>
                      handleRadioChange("isAgeCriteriaMet", option)
                    }
                  />
                  <span className="custom-radio"></span>
                  {option}
                </label>
              ))}
            </div>
            {errors.isAgeCriteriaMet && (
              <small className="text-danger fs-12">
                {errors.isAgeCriteriaMet}
              </small>
            )}

            <input
              type="text"
              className="criteria-remark mt-2"
              placeholder="Age criteria remark"
              value={screeningForm.ageCriteriaRemark}
              onChange={(e) =>
                handleInputChange("ageCriteriaRemark", e.target.value)
              }
              maxLength={2000}
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
            <label className="criteria-title">Education criteria fulfilled?</label>

            <div className="criteria-radio mb-0">
              {CRITERIA_OPTIONS.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="educationCriteria"
                    checked={screeningForm.isEducationCriteriaMet === option}
                    onChange={() =>
                      handleRadioChange("isEducationCriteriaMet", option)
                    }
                  />
                  <span className="custom-radio"></span>
                  {option}
                </label>
              ))}
            </div>
            {errors.isEducationCriteriaMet && (
              <small className="text-danger fs-12">
                {errors.isEducationCriteriaMet}
              </small>
            )}

            <input
              type="text"
              className="criteria-remark mt-2"
              placeholder="Education criteria remark"
              value={screeningForm.educationCriteriaRemark}
              onChange={(e) =>
                handleInputChange("educationCriteriaRemark", e.target.value)
              }
              maxLength={2000}
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
            className={`criteria-card ${
              disableShortlistedSection ? "criteria-disabled" : ""
            }`}
          >
            <label className="criteria-title">Shortlisted?</label>

            <div className="criteria-radio mb-0">
              {["YES", "NO"].map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="shortlisted"
                    checked={screeningForm.isShortlisted === option}
                    onChange={() =>
                      handleInputChange("isShortlisted", option)
                    }
                  />
                  <span className="custom-radio"></span>
                  {option}
                </label>
              ))}
            </div>
            {!disableShortlistedSection && errors.isShortlisted && (
              <small className="text-danger fs-12">
                {errors.isShortlisted}
              </small>
            )}

            <input
              type="text"
              className="criteria-remark mt-2"
              placeholder="Final remark"
              value={screeningForm.finalScreeningRemark}
              onChange={(e) =>
                handleInputChange("finalScreeningRemark", e.target.value)
              }
              maxLength={2000}
            />
          </div>
        </div>

        {/* ================= SUBMIT ROW ================= */}
        <div className={`criteria-submit-row ${disableShortlistedSection ? 'justify-content-between' : 'justify-content-end'}`}>
          {disableShortlistedSection && (
            <div className="d-grid">
              <label className="submit-label">Submit Before</label>
              <input
                type="date"
                className="criteria-date"
                min={minDate}
                value={screeningForm.submitBeforeDate}
                onChange={handleDateChange}
              />
              {errors.submitBeforeDate && (
                <small className="text-danger fs-12">
                  {errors.submitBeforeDate}
                </small>
              )}
            </div>
          )}

          <button
            className="btn-submit-orange"
            onClick={handleFinalSubmit}
          >
            Submit
          </button>
        </div>
      </Card>
        </Accordion>
       <DocumentViewerModal
          show={showViewer}
          onHide={() => setShowViewer(false)}
          document={selectedDoc}
          onVerify={handleVerify}
          onReject={handleReject}
        />
      </>
  );
};

export default ApplicationForm;
