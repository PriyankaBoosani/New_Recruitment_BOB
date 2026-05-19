import React, { useState } from "react";

import {
  useCandidateImport
} from "../hooks/useCandidateImport";

import {
  Button,
  Alert
} from "react-bootstrap";

import {
  Upload as UploadIcon
} from "react-bootstrap-icons";

const CandidateImportModal = ({
  t,
  onClose = () => {},
  onSuccess = () => {}
}) => {

  /* =========================
     STATES
  ========================== */

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [errorDetails, setErrorDetails] =
    useState([]);

  /* =========================
     HOOK
  ========================== */

  const {

    bulkImportCandidates,

    downloadCandidateTemplate,

    loading

  } = useCandidateImport();

  /* =========================
     FILE CHANGE
  ========================== */

  const handleFileChange = (e) => {

    const file =
      e.target.files[0];

    const isExcel =
      file &&
      (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||

        file.type ===
          "application/vnd.ms-excel"
      );

    if (isExcel) {

      setSelectedFile(file);

      setError("");

      setErrorDetails([]);

    } else {

      setError(
        "Please upload valid XLSX file"
      );

    }

  };

  /* =========================
     HANDLE IMPORT
  ========================== */

  const handleUpload =
    async () => {

      if (!selectedFile) {

        setError(
          "Please select file"
        );

        return;
      }

      const result =
        await bulkImportCandidates(
          selectedFile
        );

      if (result.success) {

        onSuccess();

        onClose();

      } else {

        setError(
          result.error
        );

        setErrorDetails(
          result.details || []
        );

      }

    };

  return (

    <div>

      {/* =========================
          IMPORT AREA
      ========================== */}

      <div
        className="p-4 rounded"
        style={{
          background: "#FCEEE9"
        }}
      >

        {/* ICON + TITLE */}

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

          <h5
            className="mb-2"
            style={{
              fontWeight: "600"
            }}
          >
            Upload Candidates
          </h5>

          <p className="text-muted small">
            Support for XLSX formats
          </p>

        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (

          <Alert variant="danger">

            <div>{error}</div>

            {errorDetails.length > 0 && (

              <div
                className="mt-2"
                style={{
                  maxHeight: "150px",
                  overflowY: "auto"
                }}
              >

                <ul className="mb-0">

                  {errorDetails.map(
                    (msg, idx) => (

                      <li key={idx}>
                        {msg}
                      </li>

                    )
                  )}

                </ul>

              </div>

            )}

          </Alert>

        )}

        {/* =========================
            FILE INPUT
        ========================== */}

        <input
          id="upload-candidates-xlsx"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />

        {/* =========================
            UPLOAD BUTTON
        ========================== */}

        <div className="text-center mb-3">

          <label htmlFor="upload-candidates-xlsx">

            <Button
              variant="primary"
              as="span"
              disabled={loading}
              style={{
                background:
                  "#F97316",
                border: "none"
              }}
            >

              {selectedFile
                ? "Reupload XLSX"
                : "Upload XLSX"}

            </Button>

          </label>

          {/* FILE NAME */}

          {selectedFile && (

            <div className="mt-2">

              <small className="text-muted d-block">

                {selectedFile.name}

              </small>

              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={() => {

                  setSelectedFile(null);

                  setError("");

                  setErrorDetails([]);

                }}
                disabled={loading}
              >
                Remove
              </Button>

            </div>

          )}

        </div>

        {/* =========================
            DOWNLOAD TEMPLATE
        ========================== */}

        <div className="text-center small">

          Download template:

          <button
            type="button"
            onClick={
              downloadCandidateTemplate
            }
            className="btn btn-link p-0 text-primary text-decoration-none"
            style={{
              cursor: "pointer"
            }}
            disabled={loading}
          >
            {" "}XLSX
          </button>

        </div>

      </div>

      {/* =========================
          FOOTER
      ========================== */}

      <div className="d-flex justify-content-end gap-2 mt-3">

        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#F97316",
            border: "none"
          }}
        >

          {loading
            ? "Importing..."
            : "Import"}

        </Button>

      </div>

    </div>

  );

};

export default CandidateImportModal;