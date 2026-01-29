import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "../../../style/css/PreviewModal.css";
import masterApiService from "../../master/services/masterApiService";

const DocumentViewerModal = ({
  show,
  onHide,
  document,
  onVerify,
  onReject,
}) => {
  const [comment, setComment] = useState("");
  const [sasUrl, setSasUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !document?.fileUrl) return;

    let cancelled = false;

    const fetchSasUrl = async () => {
      try {
        setLoading(true);
        setSasUrl(null);

        const res = await masterApiService.getAzureBlobSasUrl(
          document.fileUrl,
          "candidate"
        );

        if (!cancelled) {
          setSasUrl(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch SAS URL", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSasUrl();

    return () => {
      cancelled = true;
    };
  }, [show, document]);

  useEffect(() => {
    if (show && document) {
      setComment(document.docScreeningComments || "");
    } else {
      setComment("");
      setSasUrl(null);
    }
  }, [show, document]);

  const getFileType = (url) => {
    if (!url) return "";
    return url.split("?")[0].split(".").pop().toLowerCase();
  };

  const fileType = getFileType(sasUrl);

  if (!document) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="doc-viewer-dialog"
    >
      <div className="doc-viewer-container">
        {/* header */}
        <div className="doc-viewer-header">
          <span className="doc-viewer-title">{document.name}</span>
          <button className="doc-viewer-close" onClick={onHide}>
            ×
          </button>
        </div>

        {/* content */}
        <div className="doc-viewer-content">
          {loading && <div className="text-center">Loading document...</div>}

          {!loading && sasUrl && (
            <>
              {/* IMAGES */}
              {["png", "jpg", "jpeg"].includes(fileType) && (
                <img
                  src={sasUrl}
                  alt={document.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}

              {/* PDF */}
              {fileType === "pdf" && (
                <iframe
                  src={`${sasUrl}#toolbar=0&navpanes=0`}
                  title={document.name}
                  className="doc-pdf-frame"
                />
              )}

              {/* DOC / DOCX / OTHERS */}
              {["doc", "docx"].includes(fileType) && (
                <div className="text-center p-4">
                  <p>This file cannot be previewed in browser.</p>
                  <a
                    href={sasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Download File
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* footer */}
        <div className="doc-viewer-footer">
          <input
            type="text"
            placeholder="Enter comments..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="doc-viewer-actions">
            <button
              className="btn-reject"
              onClick={() => onReject(comment)}
            >
              Rejected
            </button>

            <button
              className="btn-verify"
              onClick={() => onVerify(comment)}
            >
              Verified
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};


export default DocumentViewerModal;
