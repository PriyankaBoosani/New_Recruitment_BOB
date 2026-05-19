import React from "react";
import { FaEye, FaPen } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

export default function ExaminationCutoffTable({
  rows = [],
  onView,
  onEdit,
   page,
  setPage,

  pageSize,
  setPageSize,

  totalPages,
  totalElements,
  statusFilter={statusFilter},
  setStatusFilter={setStatusFilter}
}) {

  /* ================= DUMMY DATA ================= */



 const tableRows = rows || [];

  return (
    <div className="cutoff-table-wrapper bg-white rounded-4">

      {/* HEADER */}
<div className="d-flex justify-content-between align-items-center mb-3">

 <h5 className="table-main-heading m-0">
  Position Wise Cutoff Configuration
</h5>

  <div className="d-flex align-items-center gap-2">

    {/* STATUS FILTER */}

  <button
      className="btn btn-light border"
      style={{
        height: "38px",
        minWidth: "100px"
      }}
      onClick={() => {

        setStatusFilter([]);

      }}
    >
      Clear All
    </button>
    

    <select
      className="form-select"
      style={{
        width: "180px",
        height: "38px"
      }}
      value={statusFilter[0] || ""}
      onChange={(e) => {

        const value =
          e.target.value;

        if (!value) {

          setStatusFilter([]);

          return;
        }

        setStatusFilter([value]);

      }}
    >

      <option value="">
        All Status
      </option>

      <option value="L1_PENDING">
        L1 Pending
      </option>

      <option value="L2_PENDING">
        L2 Pending
      </option>

      <option value="APPROVED">
        Approved
      </option>

      <option value="REJECTED">
        Rejected
      </option>

    </select>

    {/* CLEAR ALL */}

  

  </div>

</div>

      {/* TABLE */}

      <div className="table-responsive">

        <table className="table align-middle cutoff-custom-table">

          <thead>

            <tr>

              <th rowSpan={2}>
                Position
              </th>

              <th rowSpan={2}>
                Total Marks
              </th>

            <th
  colSpan={4}
  className="text-center"
>
  Category Wise Cut-off (%)
</th>

              <th
                rowSpan={2}
                className="weightage-column"
              >
                Written Exam Weightage
              </th>

              <th rowSpan={2}>
                Status
              </th>

              <th rowSpan={2}>
                Actions
              </th>

            </tr>

            <tr>

            <th>SC/ST</th>

<th>OBC</th>

<th>EWS</th>

<th>UR</th>

            </tr>

          </thead>

          <tbody>

            {tableRows.length > 0 ? (

              tableRows.map(
                (item, index) => (

                  <tr key={index}>

                    <td>
                   {item.positionName ||
  item.positionId}
                    </td>

                    <td>
                   {item.totalMarks}
                    </td>

                    <td>
                   {
  item.sections?.[0]
    ?.categoryPassMarks?.find(
      cat =>
        cat.categoryId ===
        "69bf3f47-2cf9-4e0d-90a9-2e77a1752b6b"
    )?.passMark || 0
}
%
                    </td>

                    <td>
                    {
  item.sections?.[0]
    ?.categoryPassMarks?.find(
      cat =>
        cat.categoryId ===
        "b5b949b3-3b1a-4f27-96a2-3e1e2390b72b"
    )?.passMark || 0
}
%
                    </td>

                    <td>
{
  item.sections?.[0]
    ?.categoryPassMarks?.find(
      cat =>
        cat.categoryId ===
        "a56f2294-d032-4598-b994-44480da4fc2e"
    )?.passMark || 0
}
%
</td>

                    <td>
                    {
  item.sections?.[0]
    ?.categoryPassMarks?.find(
      cat =>
        cat.categoryId ===
        "0a02efbd-11fe-498b-b8db-9bb76cae18a1"
    )?.passMark || 0
}
%
                    </td>

                    <td>
                      <span className="fw-semibold">
                        {
                          item.writtenExamWeightage
                        }
                        %
                      </span>
                    </td>

                    <td>

                      <span
                        className={`status-pill ${
                          item.status?.includes(
                            "Approved"
                          )
                            ? "approved"
                            : "pending"
                        }`}
                      >
                       {item.status?.replaceAll(
  "_",
  " "
)}
                      </span>

                    </td>

                    <td>

                    <div className="d-flex justify-content-center align-items-center gap-2 w-100">

                        {/* VIEW */}

                        <button
                          className="icon-btn"
                          onClick={() =>
                            onView &&
                            onView(item)
                          }
                        >
                          <FaEye size={13} />
                        </button>

                        {/* EDIT */}

                        <button
                          className="icon-btn"
                          onClick={() =>
                            onEdit &&
                            onEdit(item)
                          }
                        >
                          <FaPen size={13} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )

            ) : (

              <tr>

                <td
                  colSpan={8}
                  className="text-center py-4"
                >
                  No configurations found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

{/* ================= FOOTER ================= */}

<div className="d-flex justify-content-between align-items-center px-3 py-2 table-footer">

  {/* Showing text */}

  <span className="text-muted fs-13">

    {totalElements > 0
      ? `Showing ${
          page * pageSize + 1
        }–${Math.min(
          (page + 1) * pageSize,
          totalElements
        )} of ${totalElements}`
      : "Showing 0"}

  </span>

  {/* Pagination */}

  <div className="d-flex gap-2 align-items-center">

    <select
      className="form-select form-select-sm"
      style={{ width: 80 }}
      value={pageSize}
      onChange={(e) => {

        setPageSize(
          Number(e.target.value)
        );

        setPage(0);

      }}
    >
      <option value={10}>10</option>

      <option value={20}>20</option>

      <option value={50}>50</option>
    </select>

    <button
      className="btn btn-sm btn-outline-secondary"
      disabled={page === 0}
      onClick={() =>
        setPage(prev => prev - 1)
      }
    >
      Prev
    </button>

    <button
      className="btn btn-sm btn-outline-secondary"
      disabled={
        page + 1 >= totalPages
      }
      onClick={() =>
        setPage(prev => prev + 1)
      }
    >
      Next
    </button>

  </div>

</div>

    </div>
  );
}