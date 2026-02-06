import React from "react";
import { Modal } from "react-bootstrap";
import fileIcon from "../../../assets/upload-filled-file.png";
import { toast } from "react-toastify";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";

const SendToOfferPoolModal = ({
  showSendOfferModal,
  setShowSendOfferModal,
  offerCandidateIds,
  onBulkOfferSuccess,
}) => {
  const fileInputRef = React.useRef(null);
  const [file, setFile] = React.useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Only XLSX files are allowed");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleDownloadTemplate = async () => {
    try {
      // 🔴 Replace API when backend is ready
      const res = await jobPositionApiService.downloadOfferPoolTemplate();

      const blob = new Blob([res.data], {
        type:
          res.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "Offer_Pool_Template.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download template");
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please upload an XLSX file");
      return;
    }

    if (!offerCandidateIds?.length) {
      toast.error("No qualified candidates selected");
      return;
    }

    try {
      // 🔴 Replace API when backend is ready
      await jobPositionApiService.bulkSendToOfferPool({
        file,
        candidateIds: offerCandidateIds,
      });

      toast.success("Candidates sent to Offer Pool");
      setShowSendOfferModal(false);
      setFile(null);

      if (typeof onBulkOfferSuccess === "function") {
        onBulkOfferSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send candidates to Offer Pool");
    }
  };

  return (
    <Modal
      show={showSendOfferModal}
      onHide={() => {
        setShowSendOfferModal(false);
        setFile(null);
      }}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="modalhead">
        <div className="d-grid">
          <h5 className="mb-1 blue-color fs-15">
            Send to Offer Pool
          </h5>
          <p className="text-muted fs-14 mb-0">
            Upload offer details for qualified candidates
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div
          className="text-center px-3 pt-3 pb-2 rounded"
          style={{ backgroundColor: "#FFF1E8" }}
        >
          <img src={fileIcon} width={60} className="mb-2" />
          <p className="mb-1 fw-600 fs-15">Upload File</p>
          <small className="text-muted fs-13">
            Support for XLSX format
          </small>

          <div className="d-grid justify-content-center gap-2 mt-3">
            <button
              className="btn orange-bg text-white fs-13 rounded shadow px-3"
              onClick={() => fileInputRef.current.click()}
            >
              Upload XLSX
            </button>

            {file && (
              <div className="mt-1">
                <input
                  type="text"
                  className="form-control fs-13 blue-border p-3"
                  value={file.name}
                  readOnly
                />
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-1 justify-content-center mt-4">
            <small className="text-muted fs-12">
              Download template:
            </small>
            <p
              className="blue-color cursor-pointer mb-0 fs-15 fw-500"
              onClick={handleDownloadTemplate}
            >
              XLSX
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </Modal.Body>

      <Modal.Footer className="modalfoot">
        <button
          className="btn btn-light-grey shadow border fs-13 px-3"
          onClick={() => setShowSendOfferModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn orange-bg text-white shadow fs-13 px-4"
          onClick={handleBulkUpload}
          disabled={!file}
        >
          Import
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendToOfferPoolModal;
