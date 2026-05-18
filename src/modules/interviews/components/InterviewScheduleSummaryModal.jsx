import React from "react";
import { Modal, Table } from "react-bootstrap";

const InterviewScheduleSummaryModal = ({
  show,
  onClose,
  candidates = [],
  selectedPanels=[],
  availablePanels = []
}) => {

  // ZONE SUMMARY
  const zoneMap = {};

  candidates.forEach(candidate => {

   const zone =
  candidate.zone || "N/A";

    zoneMap[zone] =
      (zoneMap[zone] || 0) + 1;
  });

  const zoneDetails =
    Object.entries(zoneMap).map(
      ([zone, count]) => ({
        zone,
        count
      })
    );

  return (

    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >

      <Modal.Header closeButton>
        <Modal.Title>
          View Summary
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* ZONE DETAILS */}

        <h5 className="mb-3">
          Zone Details
        </h5>
         <div className="summary-total-count">
          Total Candidates : {candidates.length}
        </div>


        <Table bordered hover responsive>

          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Candidates</th>
            </tr>
          </thead>

            <tbody>

              {zoneDetails.length > 0 ? (
                zoneDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.zone}</td>
                    <td>{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No zone details available
                  </td>
                </tr>
              )}

            </tbody>

          </Table>

          {/* PANEL DETAILS */}

          <h5 className="mt-4 mb-3">
            Panel Details
          </h5>

          <Table bordered hover responsive>

        <thead>
            <tr>
              <th>Panel Name</th>
              <th>Panel Members</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>

          <tbody>

            {availablePanels.length > 0 ? (

              availablePanels.map((panel, index) => (

                <tr key={index}>

                  {/* PANEL NAME */}
                  <td>
                    {panel.name}
                  </td>

                  {/* MEMBERS */}
                  <td>

                    {(panel.members || [])
                      .map(member => member.name)
                      .join(", ")}

                  </td>

                  {/* START DATE */}
                  <td>
                    {panel.startDate}
                  </td>

                  {/* END DATE */}
                  <td>
                    {panel.endDate}
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="4" className="text-center">
                  No panel details available
                </td>
              </tr>

            )}

          </tbody>

        </Table>

      </Modal.Body>

    </Modal>
  );
};

export default InterviewScheduleSummaryModal;