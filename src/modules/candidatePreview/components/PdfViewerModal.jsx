import React from "react";
import { Modal, Spinner } from "react-bootstrap";
// import "../../style/css/PdfViewerModal.css";

const PdfViewerModal = ({ show, onHide, fileUrl, loading, title }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ height: "80vh", padding: 0 }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" />
          </div>
        ) : fileUrl ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            title="PDF Viewer"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <div className="text-center mt-5">
            Unable to load document
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PdfViewerModal;
