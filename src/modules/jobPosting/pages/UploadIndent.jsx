// src/modules/jobPostings/pages/UploadIndent.jsx
import React, { useRef, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import {
  Upload,
  CheckCircleFill,
  
  Download
  
} from "react-bootstrap-icons";
import Stepper from "../component/Stepper";
import "../../../style/css/UploadIndent.css";
import { useNavigate, useParams } from "react-router-dom";
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import tickIcon from "../../../assets/tickIcon.png";
import downloadIcon from "../../../assets/downloadIcon.png";




const UploadIndent = () => {
  const navigate = useNavigate();
  const { requisitionId } = useParams(); // optional if you use IDs in URL

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    console.log("Submitting indent file:", file);
    setIsSubmitted(true);
  };

  return (
    <Container fluid className="upload-indent-page">
      {/* Stepper */}
      <Stepper currentStep="UPLOAD_INDENT" />

      {/* Upload Card */}
      <Card className="upload-card">
        <Card.Body>
          <h6 className="upload-title">Upload Indent</h6>

          {/* STATE 1 – Upload Box */}
          {!file && (
            <div className="upload-box" onClick={handleUploadClick}>
              <Upload size={40} />
              <p className="upload-text">Drag & drop your file here, or</p>
              <span className="upload-link">Click to Upload</span>
              <p className="upload-hint">
                Supported formats: PDF, DOC, DOCX (Max 5 MB)
              </p>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* STATE 2 – Uploaded File */}
          {file && (
            <div className="uploaded-file-box">
              <div className="file-info">
                <img src={tickIcon} alt="tickIcon" className="tickIcon"/>
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>

              <div className="file-actions">


                <Button variant="link" className="action-btn view-btn">
                  <img src={viewIcon} className="icon-16" alt="View" />

                </Button>
                <Button variant="link" className="action-btn download-btn">
                  <img src={downloadIcon} className="icon-16" alt="Download" />
                </Button>
                {!isSubmitted && (
                  <Button
                    variant="link"
                    
                    onClick={handleRemoveFile}
                    className="action-btn delete-btn"
                  >
                                                                        <img src={deleteIcon} className="icon-16" alt="Delete" />
                    
                  </Button>
                )}

              </div>
            </div>
          )}

          {!isSubmitted ? (
            <div className="submit-btn-wrapper">
              <Button
                variant={file ? "primary" : "outline-primary"}
                disabled={!file}
                onClick={handleSubmit}
                className="submit-btn"
              >
                Submit Indent for Approval
              </Button>
            </div>
          ) : (
            <div className="pending-approval">
              <span className="pending-icon">⏳</span>
              <div>
                <div className="pending-title">Pending for Approval</div>
                <div className="pending-text">
                  Your indent has been submitted and is awaiting for approval.
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Footer */}
      <div className="footer-actions">
        <Button className="backbtn"
          variant="outline-secondary"
          onClick={() => navigate(`/job-posting/create-requisition`)}
        >
          ← Back
        </Button>

        <Button variant="secondary" disabled className="btnNext">
          Next →
        </Button>
      </div>
    </Container>
  );
};

export default UploadIndent;
