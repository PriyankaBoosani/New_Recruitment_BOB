import React, { useState } from "react";
import { Button, Alert, Modal } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { usePositionsImport } from "../hooks/usePositionsImport";
import "../../../style/css/modalimport.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImportModal = ({ show, onHide, requisitionId, onSuccess = () => { }
}) => {
  if (!requisitionId) {
    throw new Error("ImportModal requires requisitionId");
  }
  const { t } = useTranslation(["position", "common"]);
  const navigate = useNavigate();
  const { bulkImport, downloadPositionTemplate, loading } =
    usePositionsImport();

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isExcel =
      file &&
      (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      );

    if (!isExcel) {
      setErrors(t("position:invalid_file"));
      return;
    }

    setSelectedFile(file);
    setErrors("");
  };
  const resetModalState = () => {
    setSelectedFile(null);
    setErrors([]);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrors([t("position:no_file_selected")]);
      return;
    }

    const result = await bulkImport(requisitionId, selectedFile);

    if (result.success) {
      toast.success("Positions imported successfully");

      resetModalState();
      onHide();

      //  REDIRECT TO JOB LISTING PAGE
      navigate("/job-posting");

    } else {
      const errorMsg =
        Array.isArray(result.details) && result.details.length > 0
          ? "Import failed"
          : result.error || "Import failed";

      toast.error(errorMsg);

      if (Array.isArray(result.details)) {
        setErrors(result.details);
      } else {
        setErrors([errorMsg]);
      }
    }
  };

  return (
    <Modal show={show} onHide={() => {
      resetModalState();
      onHide();
    }} centered className="modalimport">
      <Modal.Header closeButton>
        <Modal.Title className="f16 bluecol">Import Positions</Modal.Title>

      </Modal.Header>

      <Modal.Body>
        <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
          <div className="text-center mb-3">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                marginBottom: "1rem",
              }}
            >
              <UploadIcon size={32} />
            </div>

            <h5 className="mb-2 uploadfile">
              Upload File
            </h5>

            <p className="text-muted small">
              Support for XLSX formats
            </p>
          </div>

          {errors.length > 0 && (
            <Alert variant="danger" className="alertoverlay">
              <ul className="mb-0 ps-3">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}
          <input
            id="upload-xlsx"
            type="file"
            accept=".xlsx,.xls"
            hidden
            disabled={loading}
            onChange={handleFileChange}
          />

          <div className="text-center mb-3">
            <label htmlFor="upload-xlsx">
              <Button
                variant="primary"
                as="span"
                className="btnupload"
                disabled={loading}
              >
                {selectedFile
                  ? "Reupload XLSX"
                  : "Upload XLSX"}
              </Button>
            </label>

            {selectedFile && (
              <div className="mt-2">
                <small className="text-muted d-block">
                  {selectedFile.name}
                </small>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSelectedFile(null)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="text-center m-0 import-area small">
            Download Template{" "}
           
            <button
            type="button"
            onClick={downloadPositionTemplate}
            className="btn btn-link p-0 text-primary text-decoration-none btnfont"
            style={{ cursor: 'pointer' }}
            disabled={loading}
          >
            {" "}XLSX
          </button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={() => {
            resetModalState();
            onHide();
          }}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading
            ? "Importing..."
            : "Import"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
