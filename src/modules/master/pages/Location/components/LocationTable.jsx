// components/LocationTable.jsx
import React from "react";
import { Table, Button, Pagination} from "react-bootstrap";
import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";


 const LocationTable = ({ data, searchTerm, onView, onEdit, onDelete, currentPage, setCurrentPage }) => {
  const itemsPerPage = 7;

  const filtered = data.filter(loc =>
    [loc.name, loc.cityName].some(v =>
      String(v || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <Table hover className="user-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>City</th>
            <th>Location</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {current.length ? (
            current.map((loc, idx) => (
              <tr key={loc.id}>
                <td>{indexOfFirst + idx + 1}</td>
                <td>{loc.cityName}</td>
                <td>{loc.name}</td>
              <td>
  <div className="action-buttons">

     <Button
      variant="link"
      className="action-btn view-btn"
      title="View"
      onClick={() => onView && onView(loc)}
    >
      <img src={viewIcon} alt="View" className="icon-16" />
    </Button>
    <Button
      variant="link"
      className="action-btn edit-btn"
      title="Edit"
      onClick={() => onEdit(loc)}
    >
      <img src={editIcon} alt="Edit" className="icon-16" />
    </Button>

    <Button
      variant="link"
      className="action-btn delete-btn"
      title="Delete"
      onClick={() => onDelete(loc)}
    >
      <img src={deleteIcon} alt="Delete" className="icon-16" />
    </Button>
  </div>
</td>

              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center">No records found</td></tr>
          )}
        </tbody>
      </Table>
      

      {totalPages > 1 && (
  <div className="d-flex justify-content-end mt-3">
    <Pagination>
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      />

      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i}
          active={currentPage === i + 1}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
    </Pagination>
  </div>
)}

      
    </>
  );
};

export default LocationTable;
