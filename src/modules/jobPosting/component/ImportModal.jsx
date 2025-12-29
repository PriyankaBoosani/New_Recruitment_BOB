import React, { useState } from "react";
import { Button, Alert, Modal } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { usePositionsImport } from "../hooks/usePositionsImport";

const ImportModal = ({ show, onHide, onSuccess = () => {} }) => {
  const { t } = useTranslation(["jobPosting", "common"]);
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
      setError(t("jobPosting:invalid_file"));
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("jobPosting:no_file_selected"));
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("jobPosting:import_positions")}</Modal.Title>
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
              {t("jobPosting:upload_positions")}
            </h5>

            <p className="text-muted small">
              {t("jobPosting:support_xlsx")}
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
                  ? t("jobPosting:reupload_xlsx")
                  : t("jobPosting:upload_xlsx")}
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
                  {t("jobPosting:remove")}
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mb-3 import-area small">
            {t("jobPosting:download_template")}{" "}
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
          {t("common:cancel")}
        </Button>

        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading
            ? t("jobPosting:importing")
            : t("jobPosting:import")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
