import React, { useState, useMemo, useEffect } from 'react'
import jobPositionApiService from '../../jobPosting/services/jobPositionApiService';
import { toast } from 'react-toastify';

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

const OfferPool = ({ selectedPositionId, selectedRequisitionId, filters, selectedIds, setSelectedIds, refreshKey, onOffersLoaded }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

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
					name: item.candidateFullName,
					categoryName: item.reservationCategory,
					score: item.finalScore,
					qnq:
						item.interviewSchedulingStatus === "QUALIFIED"
							? "Q"
							: "NQ",
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
						<th className="fs-14 fw-normal py-3 border-top sticky-col-1" scope="col" style={{ paddingLeft: '1rem', width: "200px", minWidth: "200px" }}>Candidate</th>
						<th className="fs-14 fw-normal py-3 border-top" style={{ paddingLeft: '1rem', width: "160px", minWidth: "160px" }} scope="col">Registration Number</th>
						<th className="fs-14 fw-normal py-3 border-top" style={{ paddingLeft: '2rem' }} scope="col">Caste</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Combined Score</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Q/NQ</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Status</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Select List</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Wait List</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Location</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Offer Release Date</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Accept Before Date</th>
						<th className="fs-14 fw-normal py-3 border-top" scope="col" style={{ paddingLeft: '1.25rem' }}>Joining Date</th>
						<th className="fs-14 fw-normal py-3 border-top sticky-col-action border-left" scope="col" style={{ paddingLeft: '1.25rem' }}>Action</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan="14" className="text-center py-4">
								Loading candidates...
							</td>
						</tr>
					) : paginatedOffers.length === 0 ? (
						<tr>
							<td colSpan="14" className="text-center py-4">
								No candidates found
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
									<p className="fw-normal fs-14 mb-0 py-2 text-muted">{c.qnq ? (c.qnq === "QUALIFIED" ? "Q" : "NQ") : "-"}</p>
								</td>
								<td className="align-content-center" style={{ paddingLeft: '1.25rem', alignContent: 'center' }}>
									<span
										className={`round_badge px-3 py-1 fs-12 rounded text-white ${
											OFFER_STATUS_CLASS_MAP[c.status] || "bg-secondary"
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
								<td className='align-content-center sticky-col-action' style={{ paddingLeft: '1.5rem' }}>
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
								</td>
							</tr>
						))
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
						Prev
					</button>

					<span className="fs-14">
						Page {page + 1} of {Math.ceil(totalElements / pageSize) || 1}
					</span>

					<button
						className="btn btn-sm btn-outline-secondary ms-2"
						disabled={(page + 1) * pageSize >= totalElements}
						onClick={() => setPage((prev) => prev + 1)}
					>
						Next
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
										Candidate Rank Details
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
											<InfoField label="Registration Number" value={selectedOffer.applicationNo} />
											<InfoField label="Name" value={selectedOffer.name} />
											<InfoField label="Caste" value={selectedOffer.categoryName} />
										</div>

										{/* Row 2 */}
										<div className="row pt-3">
											<InfoField label="Date of Birth" value={selectedOffer.dateOfBirth} />
											<InfoField label="Cut-Off Date" value={selectedOffer.cutOffDate} />
											<InfoField label="Age" value={selectedOffer.age} />
										</div>

										{/* Row 3 */}
										<div className="row">
											<InfoField label="Age Concession" value={selectedOffer.ageConcession} />
											<InfoField label="Q/NQ" value={selectedOffer.qnq} />
											<InfoField label="Shortlisted" value={selectedOffer.shortlisted} />
										</div>

										{/* Row 4 */}
										<div className="row">
											<InfoField label="Written Mark (out of 50)" value={selectedOffer.writtenMarks} />
											<InfoField label="Mark in Viva (out of 25)" value={selectedOffer.vivaMarks} />
											<InfoField label="Interview Conversion (to 100)" value={selectedOffer.interviewConversion} />
										</div>

										{/* Row 5 */}
										<div className="row">
											<InfoField label="Interview Score (out of 100)" value={selectedOffer.interviewScore} />
											<InfoField label="GD Score (out of 100)" value={selectedOffer.gdScore} />
											<InfoField label="Marks Conversion to Interview" value={selectedOffer.marksConversionToInterview} />
										</div>

										{/* Row 6 */}
										<div className="row">
											<InfoField label="Combined Score (OE + Written 60 and Interview 40)" value={selectedOffer.combinedScore} />
											<InfoField 
												label="Status" 
												value={OFFER_STATUS_LABEL_MAP[selectedOffer.status] || selectedOffer.status}
											/>
											<InfoField label="Select List" value={selectedOffer.selectList} />
										</div>

										{/* Row 7 */}
										<div className="row">
											<InfoField label="Wait List" value={selectedOffer.waitList} />
											<InfoField label="Location" value={selectedOffer.location} />
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
			)}
		</div>
  )
}

export default OfferPool