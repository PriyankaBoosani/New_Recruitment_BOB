import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import uploadIcon from "../../../assets/upload-blue-icon.png"
import { t } from 'i18next';

const ScheduleInterviewModal = ({ showScheduleModal, setShowScheduleModal }) => {
  const [activeTab, setActiveTab] = React.useState("import");

  return (
    <div>
			<Modal
				show={showScheduleModal}
				onHide={() => setShowScheduleModal(false)}
				centered
				backdrop="static"
			>
				<Modal.Header closeButton>
					<h5 className="mb-1 blue-color">Schedule Interview</h5>
				</Modal.Header>

				<Modal.Body>
					{/* Tabs */}
					{/* <div className="d-flex justify-content-center mb-3">
						<button className="btn btn-light me-2 px-4">Manual Entry</button>
						<button className="btn btn-outline-primary px-4">Import File</button>
					</div> */}
					<div className="tab-buttons mb-4">
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
          </div>

					{/* Upload box */}
					<div
						className="text-center p-4 rounded"
						style={{ backgroundColor: "#FFF1E8" }}
					>
						<img src={uploadIcon} width={40} className="mb-2" />
						<p className="mb-1 fw-500">Upload File</p>
						<small className="text-muted">
							Support for CSV and XLSX formats
						</small>

						<div className="d-flex justify-content-center gap-2 mt-3">
							<button className="btn btn-outline-secondary fs-14">
								Upload CSV
							</button>
							<button className="btn orange-bg text-white fs-14">
								Upload XLSX
							</button>
						</div>

						<small className="d-block mt-2 text-muted d-flex justify-content-center gap-1">
							Download template: <p className='blue-color cursor-pointer'><b>CSV</b> | <b>XLSX</b></p>
						</small>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<button
						className="btn btn-light"
						onClick={() => setShowScheduleModal(false)}
					>
						Cancel
					</button>
					<button className="btn orange-bg text-white">
						Import
					</button>
				</Modal.Footer>
			</Modal>
    </div>
  )
}

export default ScheduleInterviewModal