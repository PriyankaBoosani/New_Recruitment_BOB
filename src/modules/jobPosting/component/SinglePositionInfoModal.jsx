import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "../../../style/css/ApprovedInfoModal.css";

const SinglePositionInfoModal = ({
    show,
    onHide,
    requisition,
    position,
}) => {
    console.log("requisition", requisition, position);


    const formatDate = (date) => {
        if (!date) return "-";

        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };
    const [showRemaining, setShowRemaining] = useState(false);

    useEffect(() => {
        if (show) {
            setShowRemaining(false);
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header closeButton className="approved-modal-header">
                <div className="w-100">
                    <div className="approved-header-row">
                        <span className="approved-header-id">
                            {requisition?.requisitionId} - {requisition?.code}
                        </span>

                        <span className="approved-header-date">
                            <i className="bi bi-calendar3 me-1"></i>
                            Start: {formatDate(requisition?.startDate)}
                        </span>

                        <span className="approved-header-divider">|</span>

                        <span className="approved-header-date">
                            <i className="bi bi-clock me-1"></i>
                            End: {formatDate(requisition?.endDate)}
                        </span>
                    </div>

                    {/* <div className="approved-header-position">
                        {position?.positionName || "-"}
                    </div> */}
                </div>
            </Modal.Header>

            <Modal.Body>

                {/* Stats */}
                <div className="approved-stats-container mb-3">
                    <div className="row g-2 small">

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Employment Type:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.employmentType || "-"}
                            </span>
                        </div>

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Contract Period:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.contractYears || "0"}
                            </span>
                        </div>

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Eligibility Age:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.eligibilityAge || "-"}
                            </span>
                        </div>

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Vacancies:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.vacancies || "-"}
                            </span>
                        </div>

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Department:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.departmentName || "-"}
                            </span>
                        </div>

                        <div className="col-md-4">
                            <span className="approved-stat-label">
                                Experience:
                            </span>{" "}
                            <span className="approved-stat-value">
                                {position?.mandatoryExperienceMonths || "-"}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Reservation */}
                {/* Category Wise Reservation (State-wise) */}
                {position?.reservationType === "STATE_WISE" ? (
                    <div className="approved-reservation-card">
                        <div className="approved-reservation-title">
                            Category Wise Reservation (State-wise)
                        </div>

                        <div className="table-responsive">
                            <table className="approved-reservation-table">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">State</th>
                                        <th rowSpan="2">City</th>
                                        <th colSpan="6">Category</th>
                                        <th colSpan="4">Disability</th>
                                    </tr>

                                    <tr>
                                        <th>SC</th>
                                        <th>ST</th>
                                        <th>OBC</th>
                                        <th>EWS</th>
                                        <th>GEN</th>
                                        <th>Total</th>
                                        <th>HI</th>
                                        <th>OC</th>
                                        <th>VI</th>
                                        <th>ID</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {position?.stateWiseReservation?.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.state}</td>
                                            <td>{row.city}</td>

                                            <td>{row.sc}</td>
                                            <td>{row.st}</td>
                                            <td>{row.obc}</td>
                                            <td>{row.ews}</td>
                                            <td>{row.gen}</td>
                                            <td>{row.total}</td>

                                            <td>{row.hi}</td>
                                            <td>{row.oc}</td>
                                            <td>{row.vi}</td>
                                            <td>{row.idd}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="approved-reservation-card">
                        <div className="approved-reservation-title">
                            Category Wise Reservation
                        </div>

                        <div className="table-responsive">
                            <table className="approved-reservation-table">
                                <thead>
                                    <tr>
                                        <th>SC</th>
                                        <th>ST</th>
                                        <th>OBC</th>
                                        <th>EWS</th>
                                        <th>GEN</th>
                                        <th>TOTAL</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{position?.nationalReservation?.sc ?? 0}</td>
                                        <td>{position?.nationalReservation?.st ?? 0}</td>
                                        <td>{position?.nationalReservation?.obc ?? 0}</td>
                                        <td>{position?.nationalReservation?.ews ?? 0}</td>
                                        <td>{position?.nationalReservation?.gen ?? 0}</td>
                                        <td>{position?.nationalReservation?.total ?? 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* <div className="approved-reservation-card">

                    <div className="approved-reservation-title">
                        {position?.reservationType === "STATE_WISE"
                            ? "Category Wise Reservation (State-wise)"
                            : "Category Wise Reservation"}
                    </div>

                    <div className="table-responsive">
                        <table className="approved-reservation-table">

                            {position?.reservationType === "STATE_WISE" ? (
                                <>
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">State</th>
                                            <th rowSpan="2">City</th>
                                            <th colSpan="6">Category</th>
                                            <th colSpan="4">Disability</th>
                                        </tr>

                                        <tr>
                                            <th>SC</th>
                                            <th>ST</th>
                                            <th>OBC</th>
                                            <th>EWS</th>
                                            <th>GEN</th>
                                            <th>Total</th>
                                            <th>HI</th>
                                            <th>OC</th>
                                            <th>VI</th>
                                            <th>ID</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {position?.stateWiseReservation?.map(
                                            (row, idx) => (
                                                <tr key={idx}>
                                                    <td>{row.state}</td>
                                                    <td>{row.city}</td>
                                                    <td>{row.sc}</td>
                                                    <td>{row.st}</td>
                                                    <td>{row.obc}</td>
                                                    <td>{row.ews}</td>
                                                    <td>{row.gen}</td>
                                                    <td>{row.total}</td>
                                                    <td>{row.hi}</td>
                                                    <td>{row.oc}</td>
                                                    <td>{row.vi}</td>
                                                    <td>{row.idd}</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </>
                            ) : (
                                <>
                                    <thead>
                                        <tr>
                                            <th>SC</th>
                                            <th>ST</th>
                                            <th>OBC</th>
                                            <th>EWS</th>
                                            <th>GEN</th>
                                            <th>TOTAL</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>{position?.reservation?.sc ?? 0}</td>
                                            <td>{position?.reservation?.st ?? 0}</td>
                                            <td>{position?.reservation?.obc ?? 0}</td>
                                            <td>{position?.reservation?.ews ?? 0}</td>
                                            <td>{position?.reservation?.gen ?? 0}</td>
                                            <td>{position?.reservation?.total ?? 0}</td>
                                        </tr>
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </div> */}

                {/* Candidates Onboarded / Remaining */}
                <div className="approved-onboarded-card">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="approved-onboarded-title mb-0">
                            {showRemaining
                                ? "Remaining Vacancies"
                                : "Candidates Onboarded"}
                        </div>
                        <div className="approved-info-toggle-switch form-check form-switch">
                            <input
                                className="approved-info-toggle-input form-check-input"
                                type="checkbox"
                                id="remaining-switch" checked={showRemaining} onChange={(e) => {


                                    // console.log(position?.stateWiseReservation);
                                    // console.log(position?.stateWiseOnboarded);
                                    setShowRemaining(e.target.checked)
                                }
                                }
                            />

                            <label
                                className="approved-info-toggle-label form-check-label"
                                htmlFor="remaining-switch"                            >
                                <span className="approved-info-toggle-text">
                                    Show Remaining Vacancies
                                </span>
                            </label>
                        </div>
                    </div>

                    {position?.reservationType === "STATE_WISE" ? (
                        <div className="table-responsive">
                            <table className="approved-onboarded-table">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">State</th>
                                        <th rowSpan="2">City</th>
                                        <th colSpan="6">Category</th>
                                        <th colSpan="4">Disability</th>
                                    </tr>
                                    <tr>
                                        <th>SC</th>
                                        <th>ST</th>
                                        <th>OBC</th>
                                        <th>EWS</th>
                                        <th>GEN</th>
                                        <th>Total</th>
                                        <th>HI</th>
                                        <th>OC</th>
                                        <th>VI</th>
                                        <th>ID</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(
                                        showRemaining
                                            ? position?.stateWiseRemaining
                                            : position?.stateWiseOnboarded
                                    )?.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.state}</td>
                                            <td>{row.city}</td>

                                            <td>{row.sc}</td>
                                            <td>{row.st}</td>
                                            <td>{row.obc}</td>
                                            <td>{row.ews}</td>
                                            <td>{row.gen}</td>
                                            <td>{row.total}</td>

                                            <td>{row.hi}</td>
                                            <td>{row.oc}</td>
                                            <td>{row.vi}</td>
                                            <td>{row.idd}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="approved-onboarded-table">
                                <thead>
                                    <tr>
                                        <th>SC</th>
                                        <th>ST</th>
                                        <th>OBC</th>
                                        <th>EWS</th>
                                        <th>GEN</th>
                                        <th>TOTAL</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.sc ?? 0) -
                                                (position?.nationalOnboarded?.sc ?? 0)
                                                : (position?.nationalOnboarded?.sc ?? 0)}
                                        </td>

                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.st ?? 0) -
                                                (position?.nationalOnboarded?.st ?? 0)
                                                : (position?.nationalOnboarded?.st ?? 0)}
                                        </td>

                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.obc ?? 0) -
                                                (position?.nationalOnboarded?.obc ?? 0)
                                                : (position?.nationalOnboarded?.obc ?? 0)}
                                        </td>

                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.ews ?? 0) -
                                                (position?.nationalOnboarded?.ews ?? 0)
                                                : (position?.nationalOnboarded?.ews ?? 0)}
                                        </td>

                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.gen ?? 0) -
                                                (position?.nationalOnboarded?.gen ?? 0)
                                                : (position?.nationalOnboarded?.gen ?? 0)}
                                        </td>

                                        <td>
                                            {showRemaining
                                                ? (position?.nationalReservation?.total ?? 0) -
                                                (position?.nationalOnboarded?.total ?? 0)
                                                : (position?.nationalOnboarded?.total ?? 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="approved-onboarded-card">
                    <div className="approved-onboarded-title mb-3">
                        Offers Sent
                    </div>

                    <div className="table-responsive">
                        <table className="approved-onboarded-table">
                            <thead>
                                <tr>
                                    <th rowSpan="2">State</th>
                                    <th rowSpan="2">City</th>
                                    <th colSpan="6">Category</th>
                                    <th colSpan="4">Disability</th>
                                </tr>
                                <tr>
                                    <th>SC</th>
                                    <th>ST</th>
                                    <th>OBC</th>
                                    <th>EWS</th>
                                    <th>GEN</th>
                                    <th>Total</th>
                                    <th>HI</th>
                                    <th>OC</th>
                                    <th>VI</th>
                                    <th>ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {position?.stateWiseOffersSent?.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.state}</td>
                                        <td>{row.city}</td>

                                        <td>{row.sc}</td>
                                        <td>{row.st}</td>
                                        <td>{row.obc}</td>
                                        <td>{row.ews}</td>
                                        <td>{row.gen}</td>
                                        <td>{row.total}</td>

                                        <td>{row.hi}</td>
                                        <td>{row.oc}</td>
                                        <td>{row.vi}</td>
                                        <td>{row.idd}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="approved-onboarded-card">
                    <div className="approved-onboarded-title mb-3">
                        Offers Accepted
                    </div>

                    <div className="table-responsive">
                        <table className="approved-onboarded-table">
                            <thead>
                                <tr>
                                    <th rowSpan="2">State</th>
                                    <th rowSpan="2">City</th>
                                    <th colSpan="6">Category</th>
                                    <th colSpan="4">Disability</th>
                                </tr>
                                <tr>
                                    <th>SC</th>
                                    <th>ST</th>
                                    <th>OBC</th>
                                    <th>EWS</th>
                                    <th>GEN</th>
                                    <th>Total</th>
                                    <th>HI</th>
                                    <th>OC</th>
                                    <th>VI</th>
                                    <th>ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {position?.stateWiseOffersAccepted?.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.state}</td>
                                        <td>{row.city}</td>

                                        <td>{row.sc}</td>
                                        <td>{row.st}</td>
                                        <td>{row.obc}</td>
                                        <td>{row.ews}</td>
                                        <td>{row.gen}</td>
                                        <td>{row.total}</td>

                                        <td>{row.hi}</td>
                                        <td>{row.oc}</td>
                                        <td>{row.vi}</td>
                                        <td>{row.idd}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <button
                    className="ok-btn"
                    onClick={onHide}
                >
                    OK
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default SinglePositionInfoModal;