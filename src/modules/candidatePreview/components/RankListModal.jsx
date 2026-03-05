import React from "react";
import { Modal } from "react-bootstrap";
import fileIcon from "../../../assets/upload-filled-file.png";
import deleteIcon from "../../../assets/delete_icon.png";
import { toast } from "react-toastify";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import Loader from "../../../shared/components/Loader";

const RankListModal = ({
  showRankListModal,
  setShowRankListModal,
  onUploadSuccess,
	selectedIds,
	setSelectedIds,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState([]);
  const fileInputRef = React.useRef(null);

  /* ---------------- FILE SELECT ---------------- */

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Only XLSX files are allowed");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationErrors([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- DOWNLOAD TEMPLATE ---------------- */

	const handleDownloadTemplate = async () => {
		if (!selectedIds?.length) {
			toast.error("Please select at least one candidate");
			return;
		}

		try {
				setLoading(true);
				const res = await jobPositionApiService.downloadRankListExcel(
					selectedIds
				);

				const blob = new Blob([res.data], {
				type:
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});

				const url = window.URL.createObjectURL(blob);
				const link = document.createElement("a");

				link.href = url;
				link.download = "Rank_List.xlsx";

				document.body.appendChild(link);
				link.click();
				link.remove();

				window.URL.revokeObjectURL(url);

				toast.success("Rank list downloaded successfully");
		} catch (err) {
				console.error(err);
				toast.error("Failed to download rank list");
		} finally {
				setLoading(false);
		}
	};

  /* ---------------- BULK UPLOAD ---------------- */

	const handleBulkUpload = async () => {
		if (!file) {
			toast.error("Please upload an XLSX file");
			return;
		}

		try {
			setLoading(true);
			setValidationErrors([]);

			const response = await jobPositionApiService.uploadRanksExcel(file);
			const res = response;

			if (res?.success === true) {
				toast.success(res.message || "Rank list uploaded successfully");

				if (typeof onUploadSuccess === "function") {
					await onUploadSuccess();
				}

				closeModal();
				setSelectedIds([]);
			} else {
				toast.error("Validation Failed");

				const errors = Array.isArray(res?.data)
					? res.data
					: [];
				setValidationErrors(errors);
			}

		} catch (err) {
			console.error(err);

			const apiResponse = err?.response;

			if (apiResponse?.success === false) {
				toast.error("Validation Failed");

				const errors = Array.isArray(apiResponse?.data)
					? apiResponse.data
					: [];

				setValidationErrors(errors);
			} else {
				toast.error("Upload Failed");
			}
		} finally {
			setLoading(false);
		}
	};

  /* ---------------- CLOSE ---------------- */

  const closeModal = () => {
    setShowRankListModal(false);
    setFile(null);
    setValidationErrors([]);
  };

  return (
    <Modal
      show={showRankListModal}
      onHide={closeModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="modalhead">
        <div className="d-grid">
          <h5 className="mb-1 blue-color fs-15">Upload Rank List</h5>
          <p className="text-muted fs-14 mb-0">
            Import rank list for selected position
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div
          className="text-center px-3 pt-3 pb-2 rounded"
          style={{ backgroundColor: "#FFF1E8" }}
        >
          <img src={fileIcon} width={60} className="mb-2" alt="file" />
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
          </div>

          {file && (
            <div className="form-control blue-border mt-4 d-flex align-items-center justify-content-between p-3">
              <input
                type="text"
                className="fs-13 border-0 w-100"
                value={file.name}
                readOnly
              />
              <img
                src={deleteIcon}
                alt="Remove file"
                width={22}
                className="cursor-pointer"
                onClick={handleRemoveFile}
              />
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mt-3">
              {validationErrors.map((err, idx) => (
                <p key={idx} className="text-danger fs-13 mb-1 text-center">
                  {err}
                </p>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-center gap-1 mt-4">
            <small className="text-muted fs-12">
              Download template:
            </small>
            <span
              className="blue-color fw-500 cursor-pointer fs-14"
              onClick={handleDownloadTemplate}
            >
              XLSX
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {loading && <Loader />}
      </Modal.Body>

      <Modal.Footer className="modalfoot">
        <button
          className="btn btn-light-grey shadow border fs-13 px-3"
          onClick={closeModal}
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

export default RankListModal;