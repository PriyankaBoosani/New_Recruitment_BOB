import React, { useState, useMemo, useEffect } from 'react'
import jobPositionApiService from '../../jobPosting/services/jobPositionApiService';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import masterApiService from "../../master/services/masterApiService"
import { Modal, Button } from "react-bootstrap";
import { FaUsers, FaUserTie, FaFileSignature, FaUserCheck, FaBars, FaListOl, FaExternalLinkAlt } from "react-icons/fa";

const OFFER_STATUS_CLASS_MAP = {
	OFFER_AWAITED: "bg-warning",
	OFFER_SENT: "bg-primary",
	OFFER_REJECTED: "bg-danger",
	OFFER_ACCEPTED: "bg-success",
};

const OFFER_STATUS_LABEL_MAP = {
	OFFER_AWAITED: "Offer Awaited",
	OFFER_SENT: "Offer Sent",
	OFFER_REJECTED: "Offer Rejected",
	OFFER_ACCEPTED: "Offer Accepted",
};

const OfferPool = ({ selectedPositionId, selectedRequisitionId, filters, selectedIds, setSelectedIds, refreshKey, onOffersLoaded, offerTemplateId, acceptBeforeDate, joiningDate }) => {
	const { t } = useTranslation(["candidateWorkflow", "common"]);
	const [offers, setOffers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState("");
	const [showPreview, setShowPreview] = useState(false);

	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	// const [selectedIds, setSelectedIds] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedOffer, setSelectedOffer] = useState(null);

	const formatDate = (value) => {
		if (!value) return "-";

		const d = new Date(value);

		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();

		return `${day}-${month}-${year}`;
	};

	const handleClose = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setShowPreview(false);
		setPreviewUrl("");
	};


	const handleCandidatePreview = async (
		templateId,
		applicationId
	) => {
		try {

			const res =
				await masterApiService.candidatePreview(
					templateId,
					applicationId
				);


			const file = new Blob([res.data], { type: "application/pdf" });
			const fileURL = URL.createObjectURL(file);

			// Option 2 (better): show in modal
			setPreviewUrl(fileURL);
			setShowPreview(true);

		} catch (err) {

			console.error(err);

			toast.error(
				t("candidateWorkflow:wentwrong")
			);
		}
	};

	const handleCandidateOfferPreview = async (
		offerFileUrl
	) => {
		try {
			const encodedPath = encodeURIComponent(offerFileUrl);

			const res = await masterApiService.getMessagesAzureBlobSasUrl(encodedPath);

			const fileUrl = res;

			if (fileUrl) {
				setPreviewUrl(fileUrl);     // ✅ set URL
				setShowPreview(true);   // ✅ open modal
			}
		} catch (err) {

			console.error(err);

			toast.error(
				t("candidateWorkflow:wentwrong")
			);
		}
	};

	const toggleRow = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((x) => x !== id)
				: [...prev, id]
		);
	};

	const fetchOffers = async () => {
		if (!selectedPositionId) {
			setOffers([]);
			return;
		}

		try {
			setLoading(true);
			const res = await jobPositionApiService.getOffersByPosition(
				selectedPositionId
			);

			const rawList = res?.data || [];
			const mapped = rawList.map((item) => {
				const offer = item.candidateOffersDTO;

				return {
					id: offer.candidateOfferId,
					applicationNo: item.regNo,
					applicationId: offer.applicationId,
					offerFileUrl: offer.offerFileUrl,
					name: item.candidateFullName,
					categoryName: item.reservationCategory,
					score: item.finalScore,
					qnq: offer.qualified === true ? "Q" : "NQ",
					status: offer.status,
					selectList: offer.selectList,
					waitList: offer.waitList,
					location: item.location,
					designation: item.designationName,
					offerReleaseDate: formatDate(offer.offerReleaseDate),
					acceptBeforeDate: formatDate(offer.acceptBeforeDate),
					joiningDate: formatDate(offer.joiningDate),
				};
			});

			setOffers(mapped);
			if (typeof onOffersLoaded === "function") {
				onOffersLoaded(mapped);
			}
		} catch (err) {
			toast.error("Failed to load offers");
		} finally {
			setLoading(false);
		}
	};

	// FETCH OFFERS DIRECTLY HERE
	useEffect(() => {
		fetchOffers();
	}, [selectedPositionId, refreshKey]);

	// APPLY STATUS FILTER LOCALLY
	const filteredOffers = useMemo(() => {
		if (!filters.status || filters.status.length === 0) {
			return offers;
		}

		return offers.filter((o) =>
			filters.status.includes(o.status)
		);
	}, [offers, filters.status]);

	const totalElements = filteredOffers.length;

	const paginatedOffers = useMemo(() => {
		const start = page * pageSize;
		return filteredOffers.slice(start, start + pageSize);
	}, [filteredOffers, page, pageSize]);

	/* ---------- Selection logic ---------- */
	// const allSelected =
	// 	paginatedOffers.length > 0 && selectedIds.length === offers.length;

	const allSelected =
		paginatedOffers.length > 0 &&
		filteredOffers.length > 0 &&
		selectedIds.length === filteredOffers.length;

	// const toggleSelectAll = () => {
	// 	if (allSelected) {
	// 		setSelectedIds([]);
	// 	} else {
	// 		setSelectedIds(offers.map((o) => o.id));
	// 	}
	// };

	const toggleSelectAll = () => {
		if (allSelected) {
			setSelectedIds([]);
		} else {
			setSelectedIds(filteredOffers.map((o) => o.id));
		}
	};

	const totalPages = Math.ceil(totalElements / pageSize);

	const InfoField = ({ label, value }) => (
		<div className="col-12 col-md-4 mb-3">
			<p className="fw-400 fs-13 mb-1" style={{ color: '#8e939f' }}>{label}</p>
			<p className="fs-14">{value || "-"}</p>
		</div>
	);

	useEffect(() => {
		setPage(0);
	}, [pageSize]);

	useEffect(() => {
		setPage(0);
	}, [filters.status]);

	useEffect(() => {
		const totalPages = Math.ceil(filteredOffers.length / pageSize);
		if (page >= totalPages && totalPages > 0) {
			setPage(totalPages - 1);
		}
	}, [filteredOffers, pageSize, page]);

	return (
		<div className="card-body p-0 d-none d-md-block">
			<div className="table-responsive m-0" style={{ overflowX: "auto" }}>
				<table className="table table-hover mb-0" style={{ minWidth: "1600px", whiteSpace: "nowrap" }}>
					<thead className="bg-light">
						<tr className='align-content-center'>
							<th
								className="sticky-col-checkbox border-top"
								style={{ width: "50px", minWidth: "50px", paddingLeft: '1.5rem' }}
							>
								{/* <input
								type="checkbox"
								style={{ marginBottom: '0.75rem' }}
								checked={allSelected}
								onChange={toggleSelectAll}
							/> */}
							</th>
							<th className="fs-14 fw-normal py-3 border-top sticky-col-1" scope="col" style={{ paddingLeft: '1rem', width: "200px", minWidth: "200px" }}>{t("candidateWorkflow:candidate")}</th>
							<th className="fs-14 fw-normal py-3 border-top" style={{ paddingLeft: '1rem', width: "160px", minWidth: "160px" }} scope="col">{t("candidateWorkflow:registration_number")}</th>
							<th className="fs-14 fw-normal py-3 border-top" style={{ paddingLeft: '2rem' }} scope="col">{t("candidateWorkflow:caste")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:combined_score")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:qnq")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:status")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:select_list")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:wait_list")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("common:location")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:offer_release_date")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:accept_before_date")}</th>
							<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("candidateWorkflow:joining_date")}</th>
							<th className="fs-14 fw-normal py-3 border-top sticky-col-action border-left" scope="col" style={{ paddingLeft: '1.25rem' }}>{t("common:action")}</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="14" className="text-center py-4">
									{t("loading_candidates")}
								</td>
							</tr>
						) : paginatedOffers.length === 0 ? (
							<tr>
								<td colSpan="14" className="text-center py-4">
									{t("no_candidates_found")}
								</td>
							</tr>
						) : (
							paginatedOffers.map((c) => (
								<tr key={c.id}>
									<td
										className="sticky-col-checkbox"
										style={{ width: "50px", minWidth: "50px", paddingLeft: '1.5rem' }}
									>
										<input
											type="checkbox"
											style={{ marginTop: '0.75rem' }}
											checked={selectedIds.includes(c.id)}
											onChange={() => toggleRow(c.id)}
											disabled={c.status !== "OFFER_AWAITED"}
										/>
									</td>
									<td className='align-content-center sticky-col-1' style={{ paddingLeft: '1rem', width: "200px", minWidth: "200px" }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.name}</p>
									</td>
									<td className='align-content-center'>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted" style={{ paddingLeft: '0.5rem', width: "160px", minWidth: "160px" }}>{c.applicationNo}</p>
									</td>
									<td className='align-content-center'>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted" style={{ paddingLeft: '1.5rem' }}>{c.categoryName || "-"}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.score || "-"}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.qnq || "-"}</p>
									</td>
									<td className="align-content-center" style={{ paddingLeft: '1.25rem', alignContent: 'center' }}>
										<span
											className={`round_badge px-3 py-1 fs-12 rounded text-white ${OFFER_STATUS_CLASS_MAP[c.status] || "bg-secondary"
												}`}
										>
											{OFFER_STATUS_LABEL_MAP[c.status] || c.status}
										</span>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.selectList || "-"}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.waitList || "-"}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.location || "-"}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.offerReleaseDate}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.acceptBeforeDate}</p>
									</td>
									<td className='align-content-center' style={{ paddingLeft: '1.25rem' }}>
										<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.joiningDate}</p>
									</td>
									{/* <td className='align-content-center sticky-col-action' style={{ paddingLeft: '1.5rem' }}>
										<OverlayTrigger
											placement="bottom"
											overlay={
												<Tooltip id={`tooltip-${c.id}`}>
													{t("common:view_details")}
												</Tooltip>
											}
										>
											<button
											className="btn btn-sm btn-outline-secondary border-0"
											onClick={() => {
												setSelectedOffer(c);
												setShowModal(true);
										}}
										style={{ backgroundColor: '#eff6ff' }}
									>
										<i className="bi bi-eye" style={{ color: 'black' }}></i>
									</button>
											
										</OverlayTrigger>
									</td> */}
									<td className='align-content-center sticky-col-action' style={{ paddingLeft: '1.5rem' }}>

										{/* File Button Tooltip */}
										<OverlayTrigger
											placement="bottom"
											overlay={
												<Tooltip id={`tooltip-file-${c.id}`}>
													{t("common:view_file")}
												</Tooltip>
											}
										>
											<button
												className="btn btn-sm btn-outline-secondary border-0 me-2"
												onClick={() => {

													if (c.status === "OFFER_SENT" || c.status === "OFFER_ACCEPTED") {
														handleCandidateOfferPreview(
															c.offerFileUrl // applicationId
														);

													} else {
														if (!offerTemplateId) {
															toast.error(t("candidateWorkflow:OfferTemplate"));
															return;
														}

														handleCandidatePreview(
															offerTemplateId,
															c.applicationId // applicationId
														);

													}

													// if (!acceptBeforeDate) {
													// 	toast.error(t("candidateWorkflow:BeforeDate"));
													// 	return;
													// }

													// if (!joiningDate) {
													// 	toast.error(t("candidateWorkflow:JoiningDate"));
													// 	return;
													// }


												}}
												style={{ backgroundColor: '#eff6ff' }}
											>
												<i className="bi bi-file-text" style={{ color: 'black' }}></i>
											</button>
										</OverlayTrigger>

										{/* Eye Button Tooltip */}
										<OverlayTrigger
											placement="bottom"
											overlay={
												<Tooltip id={`tooltip-${c.id}`}>
													{t("common:view_details")}
												</Tooltip>
											}
										>
											<button
												className="btn btn-sm btn-outline-secondary border-0"
												onClick={() => {
													setSelectedOffer(c);
													setShowModal(true);
												}}
												style={{ backgroundColor: '#eff6ff' }}
											>
												<i className="bi bi-eye" style={{ color: 'black' }}></i>
											</button>
										</OverlayTrigger>

									</td>
								</tr>

							)

							)
						)}
					</tbody>
				</table>
			</div>

			<div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
				<div>
					<select
						className="form-select form-select-sm"
						style={{ width: "120px" }}
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>

				<div>
					<button
						className="btn btn-sm btn-outline-secondary me-2"
						disabled={page === 0}
						onClick={() => setPage((prev) => prev - 1)}
					>
						{t("candidateWorkflow:prev")}
					</button>

					<span className="fs-14">
						{t("candidateWorkflow:page")} {page + 1} {t("candidateWorkflow:of")} {Math.ceil(totalElements / pageSize) || 1}
					</span>

					<button
						className="btn btn-sm btn-outline-secondary ms-2"
						disabled={(page + 1) * pageSize >= totalElements}
						onClick={() => setPage((prev) => prev + 1)}
					>
						{t("candidateWorkflow:next")}
					</button>
				</div>
			</div>

			{showModal && selectedOffer && (
				<>
					<div className="modal fade show d-block" tabIndex="-1">
						<div className="modal-dialog modal-xl modal-dialog-centered">
							<div className="modal-content rounded-4 border-0">

								{/* Header */}
								<div className="modal-header border-0 pb-0">
									<p className="modal-title fs-16 fw-500 mb-0 blue-color py-2">
										{t("candidateWorkflow:candidate_rank_details")}
									</p>
									<button
										type="button"
										className="btn-close"
										onClick={() => setShowModal(false)}
									/>
								</div>

								{/* Body */}
								<div className="modal-body pt-2">
									<div className="container-fluid rounded p-4 pb-1 shadow-sm" style={{ backgroundColor: '#f7f8fb' }}>

										{/* Row 1 */}
										<div className="row pt-2">
											<InfoField label={t("candidateWorkflow:registration_number")} value={selectedOffer.applicationNo} />
											<InfoField label={t("common:name")} value={selectedOffer.name} />
											<InfoField label={t("candidateWorkflow:caste")} value={selectedOffer.categoryName} />
										</div>

										{/* Row 2 */}
										<div className="row pt-3">
											<InfoField label={t("candidateWorkflow:date_of_birth")} value={selectedOffer.dateOfBirth} />
											<InfoField label={t("candidateWorkflow:cutoff_date")} value={selectedOffer.cutOffDate} />
											<InfoField label={t("candidateWorkflow:age")} value={selectedOffer.age} />
										</div>

										{/* Row 3 */}
										<div className="row">
											<InfoField label={t("candidateWorkflow:age_concession")} value={selectedOffer.ageConcession} />
											<InfoField label={t("candidateWorkflow:qnq")} value={selectedOffer.qnq} />
											<InfoField label={t("candidateWorkflow:shortlisted")} value={selectedOffer.shortlisted} />
										</div>

										{/* Row 4 */}
										<div className="row">
											<InfoField label={t("candidateWorkflow:written_mark")} value={selectedOffer.writtenMarks} />
											<InfoField label={t("candidateWorkflow:viva_mark")} value={selectedOffer.vivaMarks} />
											<InfoField label={t("candidateWorkflow:interview_conversion")} value={selectedOffer.interviewConversion} />
										</div>

										{/* Row 5 */}
										<div className="row">
											<InfoField label={t("candidateWorkflow:interview_score")} value={selectedOffer.interviewScore} />
											<InfoField label={t("candidateWorkflow:gd_score")} value={selectedOffer.gdScore} />
											<InfoField label={t("candidateWorkflow:marks_conversion_to_interview")} value={selectedOffer.marksConversionToInterview} />
										</div>

										{/* Row 6 */}
										<div className="row">
											<InfoField label={t("candidateWorkflow:combined_score_details")} value={selectedOffer.combinedScore} />
											<InfoField
												label={t("candidateWorkflow:status")}
												value={OFFER_STATUS_LABEL_MAP[selectedOffer.status] || selectedOffer.status}
											/>
											<InfoField label={t("candidateWorkflow:select_list")} value={selectedOffer.selectList} />
										</div>

										{/* Row 7 */}
										<div className="row">
											<InfoField label={t("candidateWorkflow:wait_list")} value={selectedOffer.waitList} />
											<InfoField label={t("common:location")} value={selectedOffer.location} />
										</div>

									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Backdrop */}
					<div
						className="modal-backdrop fade show"
						onClick={() => setShowModal(false)}
					/>
				</>
			)},

			<Modal
				show={showPreview}
				onHide={handleClose}
				size="xl"
				centered
			>
				{/* HEADER */}
				<Modal.Header closeButton className="border-0 pb-2">
					<div className="w-100 d-flex justify-content-between align-items-center">
						<div>
							<h6 className="mb-0 fw-semibold">
								{"Preview Offer"}
							</h6>
						</div>

						{/* ACTION BUTTONS */}
						<div className="d-flex gap-4 align-items-center" style={{
							paddingRight: "15px"
						}}>
							{previewUrl && (
								<a
									href={previewUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-sm btn-outline-primary"
								> <FaExternalLinkAlt />
								</a>
							)}
						</div>
					</div>
				</Modal.Header>

				{/* BODY */}
				<Modal.Body
					style={{
						height: "85vh",
						background: "#f8f9fa",
						padding: "10px",
						borderRadius: "10px",
					}}
				>
					{previewUrl ? (
						<iframe
							src={previewUrl}
							width="100%"
							height="100%"
							title="PDF Preview"
							style={{
								border: "none",
								borderRadius: "8px",
								background: "#fff",
							}}
						/>
					) : (
						<div className="d-flex justify-content-center align-items-center h-100 text-muted">
							No preview available
						</div>
					)}
				</Modal.Body>
			</Modal>

		</div>

	)


}

export default OfferPool