import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import "../../../style/css/PreviewModal.css";
import logo_Bob from "../../../assets/bob-logo.png";
import sign from "../../../assets/downloadIcon.png";
import viewIcon from "../../../assets/view_icon.png";
import downloadIcon from "../../../assets/downloadIcon.png";
import DocumentViewerModal from "../components/DocumentViewerModal";
import { useLocation } from "react-router-dom";

const ApplicationForm = ({
  previewData,
  selectedJob,
  formErrors,
  setFormErrors,
}) => {

  const [activeAccordion, setActiveAccordion] = useState(["0", "1", "2", "3"]);
  const [criteria, setCriteria] = useState({});
  const location = useLocation();
  const candidate = location.state?.candidate;

  useEffect(() => {
    console.log("Loaded Candidate:", candidate);
  }, [candidate]);

  const data = previewData || {
    personalDetails: {},
    experienceSummary: {},
    documents: {},
    education: [],
    experience: []
  };


   const documentRows = [
    ...(data.documents?.identityProofs || []),
    ...(data.documents?.educationCertificates || []),
    ...(data.documents?.communityCertificates || []),
    ...(data.documents?.disabilityCertificates || []),
    ...(data.documents?.payslips || []),
    ...(data.documents?.resume || [])
  ];

  const photoUrl = data.documents?.photo?.[0]?.url || logo_Bob;
  const signatureUrl = data.documents?.signature?.[0]?.url || sign;

  const [showViewer, setShowViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docStatus, setDocStatus] = useState({});
  
  const handleVerify = (comment) => {
    setDocStatus((prev) => ({
      ...prev,
      [selectedDoc.name]: "Verified",
    }));
    setShowViewer(false);
  };

  const handleReject = (comment) => {
    setDocStatus((prev) => ({
      ...prev,
      [selectedDoc.name]: "Rejected",
    }));
    setShowViewer(false);
  };

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
                            src={photoUrl || logo_Bob}
                            alt="Applicant Photo"
                            className="img-fluid img1"
                          />

                          <img
                            src={signatureUrl || sign}
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
                      <td className="fw-med">Nationality</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.nationality_name}</td>


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
                      <td className="fw-med">Age (as on cut-off date)</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.age || "-"}</td>
                      <td className="fw-med"></td>
                      <td className="fw-reg" colSpan={2}></td>
                    </tr>

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
                      <td className="fw-med">Social Media Profile links</td>
                      <td className="fw-reg" colSpan={2}>{data.personalDetails.socialMediaProfileLink}</td>
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
                    <th>Onboard/University</th>
                    <th>School/college</th>
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


            return (
              <tr key={rowIndex}>
                {/* LEFT COLUMN */}
                <td>{left?.name}</td>
                <td>
                  {left && (
                    <span
                      className={
                        docStatus[left.name] === "Verified"
                          ? "verified-pill"
                          : docStatus[left.name] === "Rejected"
                          ? "rejected-pill"
                          : "pending-pill"
                      }
                    >
                      {docStatus[left.name] || "Pending"}
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
                          setSelectedDoc({
                            name: left.name,
                            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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
                    <span
                      className={
                        docStatus[right.name] === "Verified"
                          ? "verified-pill"
                          : docStatus[right.name] === "Rejected"
                          ? "rejected-pill"
                          : "pending-pill"
                      }
                    >
                      {docStatus[right.name] || "Pending"}
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
                            name: right.name,
                            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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


<Card className="criteria-main-card">
  <div className="criteria-wrapper">
    {[
      "Work criteria fulfilled?",
      "Age criteria fulfilled?",
      "Education criteria fulfilled?",
      "Shortlisted?",
    ].map((label) => (
      <div className="criteria-card" key={label}>
        <label className="criteria-title">{label}</label>

        <div className="criteria-radio">
          {["Yes", "No", "Discrepancy"].map((opt) => (
            <label
              key={opt}
              className={`radio-label ${
                label === "Shortlisted?" ? "disabled" : ""
              }`}
            >
              <input
                type="radio"
                name={label}
                disabled={label === "Shortlisted?"}
              />
              <span className="custom-radio"></span>
              {opt}
            </label>
          ))}
        </div>

        <input
          type="text"
          className="criteria-remark"
          placeholder="Remarks"
          disabled={label === "Shortlisted?"}
        />
      </div>
    ))}
  </div>

  {/* ===== SUBMIT ROW ===== */}
  <div className="criteria-submit-row">
    <div>
      <label className="submit-label">Submit Before</label>
      <input
        type="date"
        className="criteria-date"
      />
    </div>

    <button className="btn-submit-orange">Submit</button>
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
