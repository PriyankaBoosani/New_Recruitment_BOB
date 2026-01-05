// components/LocationTable.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Table, Button} from "react-bootstrap";
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
  const { t } = useTranslation(["location", "validation"]);


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <Table hover className="user-table">
     <thead>
  <tr>
    <th>{t("sno")}</th>
    <th>{t("cityy")}</th>
    <th>{t("location_name")}</th>
    <th style={{ textAlign: "center" }}>
      {t("actions")}
    </th>
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
      

  {filtered.length > 0 && totalPages > 1 && (
  <div className="pagination-container">
    <nav>
      <ul className="pagination">

        {/* << Previous */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          </li>
        ))}

        {/* >> Next */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>

      </ul>
    </nav>
  </div>
)}


      
    </>
  );
};

export default LocationTable;
