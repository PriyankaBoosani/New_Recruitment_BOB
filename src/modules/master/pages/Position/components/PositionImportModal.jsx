// src/modules/master/pages/Position/components/PositionImportModal.jsx
import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { usePositions } from "../hooks/usePositions";

const PositionImportModal = ({
  t,
  onClose = () => { },
  onSuccess = () => { }
}) => {
  const { bulkAddPositions, downloadPositionTemplate, loading } = usePositions();

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- FILE VALIDATION ---------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const isExcel =
      file &&
      (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      );

    if (isExcel) {
      setSelectedFile(file);
      setError("");
    } else {
      setError(t("position:invalid_file"));
    }
  };

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("position:no_file_selected"));
      return;
    }

    const result = await bulkAddPositions(selectedFile);

    if (result?.success) {
      onSuccess();
      onClose();
    } else {
      setError(result?.error || t("position:import_failed"));
    }
  };

  return (
    <div>
      {/* ===== Upload Card ===== */}
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
              marginBottom: "1rem"
            }}
          >
            <UploadIcon size={32} />
          </div>

          <h5 className="mb-2 uploadfile">
            {t("position:upload_file")}
          </h5>

          <p className="text-muted small">
            {t("position:support_xlsx")}
          </p>
        </div>

        {/* ===== Error ===== */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ===== File Input ===== */}
        <input
          id="upload-xlsx-position"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="text-center mb-3">
          <label htmlFor="upload-xlsx-position">
            <Button
              variant="primary"
              as="span"
              className="btnupload"
              disabled={loading}
            >
              {selectedFile
                ? t("position:reupload_xlsx")
                : t("position:upload_xlsx")}
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
                {t("position:remove")}
              </Button>
            </div>
          )}
        </div>

        {/* ===== Template Download ===== */}
        <div className="text-center mb-3 import-area small">
          {t("position:download_template")}:
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadPositionTemplate();
            }}
            className="text-primary text-decoration-none btnfont"
            style={{ cursor: "pointer" }}
          >
            {" "}XLSX
          </a>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="d-flex justify-content-end gap-2 modal-footer-custom">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        >
          {t("position:cancel")}
        </Button>

        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? t("position:importing")
            : t("position:import")}
        </Button>
      </div>
    </div>
  );
};

export default PositionImportModal;
