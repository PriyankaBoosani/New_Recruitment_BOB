// src/modules/jobPostings/pages/UploadIndent.jsx
import React, { useRef, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import {
  Upload,
  CheckCircleFill,
  Eye,
  Download,
  Trash
} from "react-bootstrap-icons";
import Stepper from "../component/Stepper";
import "../../../style/css/UploadIndent.css";

const UploadIndent = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

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
                <CheckCircleFill className="success-icon" />
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>

              <div className="file-actions">
                <Button variant="light" size="sm">
                  <Eye />
                </Button>
                <Button variant="light" size="sm">
                  <Download />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            className="submit-btn"
            disabled={!file}
            onClick={handleSubmit}
          >
            Submit Indent for Approval
          </Button>
        </Card.Body>
      </Card>

      {/* Footer */}
      <div className="footer-actions">
        <Button variant="outline-secondary">← Back</Button>
        <Button variant="secondary" disabled>
          Next →
        </Button>
      </div>
    </Container>
  );
};

export default UploadIndent;
