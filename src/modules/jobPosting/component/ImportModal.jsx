import React, { useState } from "react";
import { Button, Alert, Modal } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { usePositionsImport } from "../hooks/usePositionsImport";
import "../../../style/css/modalimport.css";

const ImportModal = ({ show, onHide, onSuccess = () => {} }) => {
  const { t } = useTranslation(["position", "common"]);
  const { bulkAddPositions, downloadPositionTemplate, loading } =
    usePositionsImport();

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

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
      setError(t("position:invalid_file"));
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("position:no_file_selected"));
      return;
    }

    const result = await bulkAddPositions(selectedFile);

    if (result.success) {
      onSuccess();
      onHide();
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modalimport">
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

          {error && <Alert variant="danger">{error}</Alert>}

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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                downloadPositionTemplate();
              }}
              className="text-primary text-decoration-none btnfont"
            >
              XLSX
            </a>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
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
