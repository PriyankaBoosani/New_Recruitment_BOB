// import { Table, Button } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import viewIcon from "../../../../../assets/view_icon.png";
// import downloadIcon from "../../../../../assets/downloadIcon.png";
// const GenericOrAnnexuresTable = ({
//   data = [],
//   onView,
//   onDownload,
//   onDelete,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   setItemsPerPage
// }) => {
//   const { t } = useTranslation(["genericOrAnnexures"]);
//   const rows = Array.isArray(data) ? data : [];
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(rows.length / itemsPerPage);
//   const paginate = (page) => setCurrentPage(page);
// const getVisiblePages = (currentPage, totalPages) => {
//     const windowSize = 3;

//     let start = currentPage - 1;
//     let end = currentPage + 2;

//     // Clamp to bounds
//     if (start < 1) {
//       start = 1;
//       end = Math.min(totalPages + 1, start + windowSize);
//     }

//     if (end > totalPages + 1) {
//       end = totalPages + 1;
//       start = Math.max(1, end - windowSize);
//     }

//     const pages = [];
//     for (let i = start; i < end; i++) {
//       pages.push(i);
//     }

//     return {
//       pages,
//       showStartEllipsis: start > 1,
//       showEndEllipsis: end <= totalPages
//     };
//   };
//   return (
//     <>
//       <div className="table-responsive">
//         <Table hover className="user-table">
//           <thead>
//             <tr>
//               <th style={{ width: "70px" }}>{t("s_no")}</th>
//               <th>{t("type")}</th>
//               <th>{t("file")}</th>
//               <th>{t("version")}</th>
//               <th style={{ width: "140px", textAlign: "center" }}>
//                 {t("actions")}
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRows.length > 0 ? (
//               currentRows.map((item, idx) => (
//                 <tr key={item.id}>
//                   <td>{indexOfFirstItem + idx + 1}</td>
//                   <td>{item?.type || "-"}</td>
//                   <td>{item?.fileName || "-"}</td>
//                   <td>{item?.version || "-"}</td>

//                   <td>
//                     <div className="action-buttons">
//                       <Button
//                         variant="link"
//                         className="action-btn view-btn"
//                         onClick={() => onView(item)}
//                       >
//                         <img src={viewIcon} alt={t("view")} className="icon-16" />
//                       </Button>

//                       <Button
//                         variant="link"
//                         className="action-btn edit-btn"
//                         onClick={() => onDownload(item)}
//                       >
//                         <img src={downloadIcon} alt={t("download")} className="icon-16" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   {t("no_records")}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>

//       {/* DROPDOWN LEFT + PAGINATION RIGHT */}
//       {rows.length > 0 && (
//         <div className="d-flex justify-content-end align-items-center gap-3 mt-2">

//           {/* Page size */}
//           <div className="d-flex align-items-center gap-2 user-actions">
//             <span
//               className="fw-semibold"
//               style={{ color: "var(--bs-heading-color)" }}
//             >
//               {t("page_size")}
//             </span>

//             <select
//               className="form-select form-select-sm"
//               style={{ width: "90px" }}
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//             >
//               {[5, 10, 15, 20, 25, 30].map(n => (
//                 <option key={n} value={n}>{n}</option>
//               ))}
//             </select>
//           </div>

//           {/* Pagination */}
//           <ul className="pagination mb-0">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 &laquo;
//               </button>
//             </li>

//             {(() => {
//               const {
//                 pages,
//                 showStartEllipsis,
//                 showEndEllipsis
//               } = getVisiblePages(currentPage, totalPages);

//               return (
//                 <>
//                   {/* Leading ellipsis */}
//                   {showStartEllipsis && (
//                     <li className="page-item disabled">
//                       <span className="page-link">…</span>
//                     </li>
//                   )}

//                   {/* Page numbers */}
//                   {pages.map(number => (
//                     <li
//                       key={number}
//                       className={`page-item ${currentPage === number ? "active" : ""}`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(number)}
//                       >
//                         {number}
//                       </button>
//                     </li>
//                   ))}

//                   {/* Trailing ellipsis */}
//                   {showEndEllipsis && (
//                     <li className="page-item disabled">
//                       <span className="page-link">…</span>
//                     </li>
//                   )}
//                 </>
//               );
//             })()}

//             <li
//               className={`page-item ${currentPage === totalPages ? "disabled" : ""
//                 }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 &raquo;
//               </button>
//             </li>
//           </ul>

//         </div>
//       )}

//     </>
//   );
// };

// export default GenericOrAnnexuresTable;






// import React, { useState } from "react";




// import { Container, Button } from "react-bootstrap";
// import { Plus } from "react-bootstrap-icons";
// import { toast } from "react-toastify";
// import { useTranslation } from "react-i18next";
// import { useGenericOrAnnexures } from "./hooks/useGenericOrAnnexures";
// import GenericOrAnnexuresTable from "./components/GenericOrAnnexuresTable";
// import GenericOrAnnexuresFormModal from "./components/GenericOrAnnexuresFormModal";
// import DeleteConfirmModal from "./components/DeleteConfirmModal";
// import masterApiService from "../../../master/services/masterApiService";
// import '../../../../style/css/user.css';
// import { validateGenericOrAnnexuresForm } from "../../../../shared/utils/genericOrAnnexures-validations";

// const GenericOrAnnexuresPage = () => {
//   const { t } = useTranslation(["genericOrAnnexures"]);

//   const {
//     items,
//     addItem,
//     deleteItem
//   } = useGenericOrAnnexures();

//   /* ================= STATE ================= */
//   const [showModal, setShowModal] = useState(false);
//   const [isViewing, setIsViewing] = useState(false);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [formData, setFormData] = useState({
//     type: "",
//     file: null
//   });

//   const [errors, setErrors] = useState({});

//   /* ================= INPUT CHANGE ================= */
//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]:
//         name === "file"
//           ? files?.[0] ?? value ?? null
//           : value
//     }));

//     // DO NOT auto-clear file errors here
//     if (name !== "file") {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };
//   /* ================= ADD ================= */
//   const openAdd = () => {
//     setIsViewing(false);
//     setFormData({ type: "", file: null });
//     setErrors({});
//     setShowModal(true);
//   };

//   /* ================= VIEW ================= */
//   const openView = (item) => {
//     setIsViewing(true);
//     setFormData({
//       type: item.type,
//       file: { name: item.fileName }

//     });
//     setShowModal(true);
//   };

//   /* ================= SAVE (ADD ONLY) ================= */
//   const handleSave = (e) => {
//     e.preventDefault();

//     const { valid, errors } = validateGenericOrAnnexuresForm(formData);

//     if (!valid) {
//       setErrors(errors);
//       return;
//     }

//     addItem(formData);

//     //  TOAST (EN + HI)
//     toast.success(
//       t("add_success", "File added successfully")
//     );

//     setShowModal(false);
//   };

//   const handleDownload = async (item) => {
//   if (!item?.fileUrl) {
//     console.error("No fileUrl present");
//     return;
//   }

//   try {
//     // 1️ Get SAS URL from backend
//     const sasUrl = await masterApiService.getAzureBlobSasUrl(item.fileUrl);

//     if (!sasUrl) {
//       throw new Error("SAS URL not returned");
//     }

//     // 2️ Let the browser download it (NO fetch, NO CORS)
//     const a = document.createElement("a");
//     a.href = sasUrl;
//     a.download = item.fileName || "download.pdf";
//     a.target = "_blank"; // optional, helps some browsers
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//   } catch (err) {
//     console.error("Download failed:", err);
//   }
// };
//   /* ================= DELETE ================= */
//   const openDeleteConfirm = (item) => {
//     setDeleteTarget(item);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     if (!deleteTarget) return;

//     deleteItem(deleteTarget.id);

//     //  TOAST (EN + HI)
//     toast.success(
//       t("delete_success", "File deleted successfully")
//     );

//     setShowDeleteModal(false);
//     setDeleteTarget(null);
//   };

//   return (
//     <Container fluid className="user-container">
//       {/* ===== HEADER ===== */}
//       <div className="user-header d-flex justify-content-between">
//         <h2>{t("title", "Generic / Annexures")}</h2>

//         <Button className="add-button" onClick={openAdd}>
//           <Plus size={20} /> {t("add", "Add")}
//         </Button>
//       </div>

//       {/* ===== TABLE ===== */}
//       <GenericOrAnnexuresTable
//         data={items}
//         onView={openView}
//         onDownload={handleDownload}
//         onDelete={openDeleteConfirm}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         itemsPerPage={itemsPerPage}
//         setItemsPerPage={setItemsPerPage}
//       />


//       {/* ===== ADD / VIEW MODAL ===== */}
//       <GenericOrAnnexuresFormModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         isViewing={isViewing}
//         formData={formData}
//         handleInputChange={handleInputChange}
//         errors={errors}
//         setErrors={setErrors}
//         handleSave={handleSave}
//       />

//       {/* ===== DELETE CONFIRM MODAL ===== */}
//       <DeleteConfirmModal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         onConfirm={confirmDelete}
//         target={{
//           name: deleteTarget?.file?.name || "-"
//         }}
//       />
//     </Container>
//   );
// };

// export default GenericOrAnnexuresPage;

