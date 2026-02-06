import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import fileIcon from "../../../assets/upload-filled-file.png"
import uploadIcon from "../../../assets/upload-blue-icon.png"
import deleteIcon from "../../../assets/delete_icon.png"
import { t } from 'i18next';
import { toast } from 'react-toastify';
import jobPositionApiService from '../../jobPosting/services/jobPositionApiService';
import Loader from '../../../shared/components/Loader'

const ScheduleInterviewModal = ({ showScheduleModal, setShowScheduleModal, applicationIds, onBulkScheduleSuccess }) => {
  const [activeTab, setActiveTab] = React.useState("import");
	const [loading, setLoading] = React.useState(false)
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
			setLoading(true)
			const res = await jobPositionApiService.downloadInterviewScheduleTemplate();

			const blob = new Blob([res.data], {
				type: res.headers["content-type"] ||
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = "Interview_Schedule_Template.xlsx";
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			toast.success("Template downloaded successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to download template");
		} finally {
			setLoading(false)
		}
	};

	const handleBulkUpload = async () => {
		if (!file) {
			toast.error("Please upload an XLSX file");
			return;
		}

		if (!applicationIds?.length) {
			toast.error("No candidates selected");
			return;
		}

		try {
			setLoading(true)
			await jobPositionApiService.bulkScheduleInterviews({
				file,
				applicationIds,
			});

			toast.success("Interviews scheduled successfully");
			setShowScheduleModal(false);
			setFile(null);
			if (typeof onBulkScheduleSuccess === "function") {
				onBulkScheduleSuccess();
			}
		} catch (err) {
			console.error(err);
			toast.error("Bulk scheduling failed");
		} finally {
			setLoading(false)
		}
	};

	const handleRemoveFile = () => {
		setFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

  return (
    <div>
		<Modal
			show={showScheduleModal}
			onHide={() => {
				setShowScheduleModal(false);
				setFile(null);
			}}
			centered
			backdrop="static"
		>
			<Modal.Header className='d-flex justify-content-between modalhead' closeButton>
				<div className='d-grid'>
					<h5 className="mb-1 blue-color fs-15">Schedule Interview</h5>
					<p className='text-muted fs-14 mb-0'>Schedule interviews for selected candidates</p>
				</div>
				{/* <div>
					<button type="button" class="btn-close" aria-label="Close"></button>
				</div> */}
			</Modal.Header>

			<Modal.Body>
				{/* Tabs */}
				{/* <div className="d-flex justify-content-center mb-3">
					<button className="btn btn-light me-2 px-4">Manual Entry</button>
					<button className="btn btn-outline-primary px-4">Import File</button>
				</div> */}
				{/* <div className="tab-buttons mb-4">
					<Button
						variant={activeTab === "manual" ? "light" : "outline-light"}
						className={`tab-button ${activeTab === "manual" ? "active" : ""
						}`}
						onClick={() => setActiveTab("manual")}
					>
						Manual Entry
					</Button>

					<Button
						variant={activeTab === "import" ? "light" : "outline-light"}
						className={`tab-button ${activeTab === "import" ? "active" : ""
						}`}
						onClick={() => setActiveTab("import")}
					>
						Import File
					</Button>
				</div> */}

				{/* Upload box */}
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
						{/* <button className="btn btn-outline-secondary fs-14">
							Upload CSV
						</button> */}
						<button className="btn orange-bg text-white fs-13 rounded shadow px-3" onClick={() => fileInputRef.current.click()}>
							Upload XLSX
						</button>
					</div>

					{file && (
						<div className="form-control blue-border mt-1 d-flex align-items-center gap-2 p-3 justify-content-between mt-4">
							<input
								type="text"
								className="fs-13 border-0"
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
					
					<div className='d-flex align-items-center gap-1 justify-content-center mt-4'>
						<small className="d-block text-muted d-flex justify-content-center gap-1 fs-12">
							Download template: 
						</small>
						<p className='blue-color cursor-pointer mb-0 fs-15 fw-500'>
							{/* <b>CSV</b> | */}
							<p className='blue-color fw-500 mb-0' onClick={handleDownloadTemplate}>XLSX</p>
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
				{loading && (
					<Loader />
				)}
			</Modal.Body>

			<Modal.Footer className='modalfoot'>
				<button
					className="btn btn-light-grey shadow border fs-13 px-3"
					onClick={() => setShowScheduleModal(false)}
				>
					Cancel
				</button>
				<button className="btn orange-bg text-white shadow fs-13 px-4" onClick={handleBulkUpload} disabled={!file}>
					Import
				</button>
			</Modal.Footer>
		</Modal>
    </div>
  )
}

export default ScheduleInterviewModal