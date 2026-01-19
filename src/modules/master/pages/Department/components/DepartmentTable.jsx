import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const DepartmentTable = ({ data, searchTerm, onEdit, onView, onDelete, currentPage, setCurrentPage,  pageSize,
  setPageSize }) => {
    const { t } = useTranslation(["department"]);
    // const itemsPerPage = 7;

    // Filter logic
    const filteredDepts = data.filter(dept => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) return true;

  return (
    dept.name?.toLowerCase().includes(term) ||
    dept.description?.toLowerCase().includes(term)
  );
});

    const indexOfLastDept = currentPage * pageSize;
const indexOfFirstDept = indexOfLastDept - pageSize;
const totalPages = Math.ceil(filteredDepts.length / pageSize);

   
    const currentDepts = filteredDepts.slice(indexOfFirstDept, indexOfLastDept);

    // Pagination logic
  

    const paginate = (num) => setCurrentPage(num);

    return (
        <>
            <div className="table-responsive">
                <Table hover className="user-table">
                    <thead>
                        <tr>
                            <th>{t("department:s.no.")}</th>
                            <th>{t("department:name")}</th>
                            <th>{t("department:description")}</th>
                            <th style={{ textAlign: "center" }}>{t("department:actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDepts.length > 0 ? (
                            currentDepts.map((dept, idx) => (
                                <tr key={dept.id}>
                                    <td>{indexOfFirstDept + idx + 1}</td>
                                    <td data-label="Name:">&nbsp;{dept.name}</td>
                                    <td data-label="Description:">&nbsp;{dept.description}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button variant="link" className="action-btn view-btn" title="View" onClick={() => onView(dept)}>
                                                <img src={viewIcon} alt="View" className="icon-16" />
                                            </Button>
                                            <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => onEdit(dept)}>
                                                <img src={editIcon} alt="Edit" className='icon-16' />
                                            </Button>
                                            <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => onDelete(dept)}>
                                                <img src={deleteIcon} alt="Delete" className='icon-16' />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">{t("department:no_records")}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>


          


            {filteredDepts.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-2">
 
    {/* <span className="me-2">Rows per page:</span> */}
    <Form.Select
      size="sm"
      style={{ width: "90px" }}
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
      <option value={20}>20</option>
      <option value={25}>25</option>
      <option value={30}>30</option>
    </Form.Select>
 
                <div className="pagination-container">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button onClick={() => paginate(number)} className="page-link">{number}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
                 </div>
            )}
        </>
    );
};

export default DepartmentTable;