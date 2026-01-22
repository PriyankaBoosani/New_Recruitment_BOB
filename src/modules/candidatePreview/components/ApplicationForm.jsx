import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import "../../../style/css/PreviewModal.css";
import logo_Bob from "../../../assets/bob-logo.png";
import sign from "../../../assets/downloadIcon.png";
import viewIcon from "../../../assets/view_icon.png";
import downloadIcon from "../../../assets/downloadIcon.png";

const dummyDocuments = [
  { name: "ID Proof" },
  { name: "SSC Certificate" },
  { name: "Resume" },
  { name: "Inter Certificate" },
  { name: "Caste Certificate" },
  { name: "Experience Certificate" },
  { name: "Salary Slip 1" },
  { name: "Aadhaar card" },
  { name: "Salary Slip 2" },
  { name: "Pan Card" },
];

const ApplicationForm = ({
  previewData,
  selectedJob,
  formErrors,
  setFormErrors,
}) => {

  const [activeAccordion, setActiveAccordion] = useState(["0"]);
  const [criteria, setCriteria] = useState({});

  const data = previewData || {
    personalDetails: {},
    experienceSummary: {},
    documents: {},
  };

  const photoUrl = data.documents?.photo?.[0]?.url || logo_Bob;
  const signatureUrl = data.documents?.signature?.[0]?.url || sign;

  return (
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
      <tr>
        <td>1</td>
        <td>State Board of Secondary Education</td>
        <td>Jsm High School</td>
        <td>10th/SSC/Matriculation</td>
        <td>-</td>
        <td>11-06-2019</td>
        <td>11-06-2020</td>
        <td>85%</td>
      </tr>

      <tr>
        <td>2</td>
        <td>State Board of Intermediate Education</td>
        <td>Sri Chaitanya</td>
        <td>Intermediate</td>
        <td>-</td>
        <td>11-06-2020</td>
        <td>11-06-2022</td>
        <td>95%</td>
      </tr>

      <tr>
        <td>3</td>
        <td>Computer Science and Engineering</td>
        <td>NIT Warangal</td>
        <td>Bachelor of Technology</td>
        <td>-</td>
        <td>11-06-2022</td>
        <td>11-06-2025</td>
        <td>89%</td>
      </tr>
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
        {[
          {
            org: "Tech Solutions Pvt. Ltd.",
            post: "Software Engineer",
            role: "IT Development",
            from: "July 2015",
            to: "March 2017",
            duration: "1 Yr 8 Months",
            desc: "Full-stack development, API design, database management",
          },
          {
            org: "Digital Innovations Inc.",
            post: "Product Analyst",
            role: "Product Management",
            from: "April 2017",
            to: "August 2019",
            duration: "2 Yrs 4 Months",
            desc: "Market research, product roadmap planning, stakeholder management",
          },
          {
            org: "FinTech Global Solutions",
            post: "Product Manager",
            role: "Digital Banking",
            from: "September 2019",
            to: "December 2021",
            duration: "2 Yrs 3 Months",
            desc: "Digital product strategy, UX optimization, agile project management",
          },
          {
            org: "PayTech Innovations",
            post: "Senior Product Manager",
            role: "Digital Commerce",
            from: "January 2022",
            to: "Present",
            duration: "2 Yrs 11 Months",
            desc: "Leading ONDC integration, digital payment solutions, cross-functional team leadership",
          },
        ].map((exp, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{exp.org}</td>
            <td>{exp.post}</td>
            <td>{exp.role}</td>
            <td>{exp.from}</td>
            <td>{exp.to}</td>
            <td>{exp.duration}</td>
            <td>{exp.desc}</td>
          </tr>
        ))}
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
        {dummyDocuments.map((doc, index) => {
          if (index % 2 !== 0) return null;
          const right = dummyDocuments[index + 1];

          return (
            <tr key={index}>
              {/* LEFT */}
              <td>{doc.name}</td>
              <td>
                <span className="verified-pill">Verified</span>
              </td>
              <td className="action-cell">
                <img src={viewIcon} alt="View" />
                <img src={downloadIcon} alt="Download" />
              </td>

              {/* RIGHT */}
              {right ? (
                <>
                  <td>{right.name}</td>
                  <td>
                    <span className="verified-pill">Verified</span>
                  </td>
                  <td className="action-cell">
                    <img src={viewIcon} alt="View" />
                    <img src={downloadIcon} alt="Download" />
                  </td>
                </>
              ) : (
                <>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </>
              )}
            </tr>
          );
        })}
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
  );
};

export default ApplicationForm;
