import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { useLocations } from "../hooks/useLocations";

const LocationImportModal = ({
  t,
  onClose = () => {},
  onSuccess = () => {}
}) => {
  const { bulkAddLocations, loading } = useLocations();

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isExcel =
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel");

    if (isExcel) {
      setSelectedFile(file);
      setError("");
    } else {
      setError(t("support_xlsx_only"));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("validation:required"));
      return;
    }

    const result = await bulkAddLocations(selectedFile);

    if (result?.success) {
      onSuccess();
      onClose();
    } else {
      setError(result?.error || t("import_failed"));
    }
  };

  return (
    <div>
      <div
        className="import-area p-4 rounded"
        style={{ background: "#fceee9" }}
      >
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
            {t("upload_file")}
          </h5>
          <p className="text-muted small">
            {t("support_xlsx")}
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <input
          id="upload-location-xlsx"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="text-center mb-3">
          <label htmlFor="upload-location-xlsx">
            <Button
              variant="primary"
              as="span"
              className="btnupload"
              disabled={loading}
            >
              {selectedFile ? t("reupload_xlsx") : t("upload_xlsx")}
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
                {t("remove")}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mb-3 import-area small">
          {t("download_template")}:{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // call your location template API here
            }}
            className="text-primary text-decoration-none btnfont"
          >
            XLSX
          </a>
        </div>
      </div>

      {/* ✅ SAME FOOTER AS DEPARTMENT */}
      <div className="d-flex justify-content-end gap-2 modal-footer-custom">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        > 
          {t("cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? t("importing") : t("import")}
        </Button>
      </div>
    </div>
  );
};

export default LocationImportModal;
