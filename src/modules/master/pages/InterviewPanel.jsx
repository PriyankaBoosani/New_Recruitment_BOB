// src/pages/InterviewPanel.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateInterviewPanelForm } from '../../../shared/utils/interviewpanel-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';
import { useTranslation } from "react-i18next";
import masterApiService from "../services/masterApiService";
import { mapInterviewMembersApi } from "../mappers/interviewMembersMapper";
import { toast } from 'react-toastify';
const InterviewPanel = () => {
  const { t } = useTranslation(["interviewPanel"]);

  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual');
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  const [committeeMap, setCommitteeMap] = useState({});

  const [editAssignedMembers, setEditAssignedMembers] = useState([]);

  // ✅ members = array of STRING NAMES only
  const [formData, setFormData] = useState({
    name: '',
    community: '',
    members: []
  });

  const [errors, setErrors] = useState({});

  // ----- File helpers (same as Department)
  const onSelectCSV = (file) => setSelectedCSVFile(file ?? null);
  const onSelectXLSX = (file) => setSelectedXLSXFile(file ?? null);
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

 const fetchInterviewMembers = async () => {
    const res = await masterApiService.getActiveInterviewMembers();
    const mapped = mapInterviewMembersApi(res);
    setMembersOptions(mapped);
  };

  const fetchPanels = async (committeeMapObj) => {
    const panelRes = await masterApiService.getInterviewPanels();
    const apiList = Array.isArray(panelRes?.data) ? panelRes.data : [];

    const mappedPanels = apiList.map(item => {
      const panel = item.interviewPanelsDTO || {};
      const interviewers = item.interviewerDTOs || [];

      return {
        id: panel.interviewPanelId,
        name: panel.panelName || "-",
        community: committeeMapObj[panel.committeeId] || "-",
        members: interviewers.length
          ? interviewers.map(i => i.name).join(", ")
          : "-"
      };
    });

    setPanels(mappedPanels);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const committeeRes = await masterApiService.getMasterDropdownData();
      const list = Array.isArray(committeeRes?.data) ? committeeRes.data : [];

      const map = {};
      list.forEach(c => {
        map[c.interviewCommitteeId] = c.committeeName;
      });

      setCommitteeMap(map);
      setCommunityOptions(list.map(c => ({
        id: c.interviewCommitteeId,
        name: c.committeeName
      })));

      await fetchPanels(map);
      await fetchInterviewMembers();

      setLoading(false);
    };

    init();
  }, []);


  // import wrapper using shared helper (mirrors Department: simple mapping, no validation)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: panels,
      setList: setPanels,
      mapRow: (row) => ({
        name: (row.name ?? row.panel_name ?? row['panel'] ?? '').trim(),
        members: (row.members ?? row.panel_members ?? row['member_list'] ?? '').trim(),
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  // clear per-field error on change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // toggle selection for a member (keeps formData.members as an array)
  // ✅ FIX: toggle by NAME not object
  const toggleMember = (member) => {
    const name = member.name;

    setFormData(prev => {
      const exists = prev.members.includes(name);
      return {
        ...prev,
        members: exists
          ? prev.members.filter(m => m !== name)
          : [...prev.members, name]
      };
    });
  };

  const removeMemberPill = (e, name) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== name)
    }));
  };

  /* ============================
     SAVE
  ============================ */
 const handleSave = async (e) => {
  e.preventDefault();
  setErrors({});
  setLoading(true);

  try {
    // 1️⃣ Validation
    const result = validateInterviewPanelForm({
      name: formData.name,
      members: formData.members,
      community:formData.community
    });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    // 2️⃣ Convert member names → IDs
    const interviewerIds = membersOptions
      .filter(m => formData.members.includes(m.name))
      .map(m => m.id);

    if (!interviewerIds.length) {
      toast.error("Selected interviewers are invalid.");
      return;
    }

    // 3️⃣ Payload (SAME for add & update)
    const payload = {
      interviewPanelsDTO: {
        isActive: true,
        panelName: formData.name,
        description: "",
        committeeId: formData.community,
        interviewPanelId: isEditing ? editingId : ""
      },
      interviewerIds
    };

    // 4️⃣ ADD vs UPDATE API
    let res;
    if (isEditing) {
      // ✅ UPDATE (PUT)
      res = await masterApiService.updateInterviewPanel(editingId,payload);
    } else {
      // ✅ ADD (POST)
      res = await masterApiService.addInterviewPanel(payload);
    }

    // 5️⃣ Handle API failure
    if (!res?.success) {
      toast.error(res?.message || "Failed to save interview panel");
      return;
    }

    // 6️⃣ Success toast
    toast.success(
      isEditing
        ? "Interview panel updated successfully"
        : "Interview panel created successfully"
    );

    // 7️⃣ Close & reset
    setShowAddModal(false);
    setFormData({ name: "", community: "", members: [] });
    setIsEditing(false);
    setEditingId(null);

    // 8️⃣ Refresh list
    await fetchPanels(committeeMap);

  } catch (error) {
    console.error("Save interview panel failed", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', community: '', members: [] });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

 const openEdit = async (p) => {
  try {
    setLoading(true);
    setIsEditing(true);
    setEditingId(p.id);
    setActiveTab("manual");

    // 1️⃣ Call GET API
    const res = await masterApiService.getInterviewPanelById(p.id);

    if (!res?.success) {
      toast.error("Failed to fetch panel details");
      return;
    }

    const panelDTO = res.data?.interviewPanelsDTO || {};
    const interviewers = res.data?.interviewerDTOs || [];

    // 2️⃣ Convert interviewerDTOs → member names
    const membersArray = interviewers
      .map(i => i.name)
      .filter(Boolean);

        // ✅ STORE CURRENTLY ASSIGNED MEMBERS
    setEditAssignedMembers(membersArray);

    // 3️⃣ Populate form
    setFormData({
      name: panelDTO.panelName || "",
      community: panelDTO.committeeId || "",
      members: membersArray
    });

    setErrors({});
    setShowAddModal(true);

  } catch (error) {
    console.error("Edit panel load failed", error);
    toast.error("Something went wrong while loading panel");
  } finally {
    setLoading(false);
  }
};
const availableMembersOptions = membersOptions.filter(m => {
  // ADD MODE → only unassigned
  if (!isEditing) {
    return m.assigned === false;
  }

  // EDIT MODE →
  // allow unassigned OR already assigned to this panel
  return (
    m.assigned === false ||
    editAssignedMembers.includes(m.name)
  );
});
//   const handleSave = async (e) => {
//   e.preventDefault();
//   setErrors({});
//   setLoading(true);

//   try {
//     // 1️⃣ Validation
//     const payloadForValidation = {
//       name: formData.name,
//       members: formData.members
//     };

//     const result = validateInterviewPanelForm(payloadForValidation);

//     if (!result.valid) {
//       setErrors(result.errors);
//       return;
//     }

//     const normalized = result.normalized;

//     // 2️⃣ Convert members → IDs
//     const interviewerIds = membersOptions
//       .filter(m => normalized.members.includes(m.name))
//       .map(m => m.id);

//     // 3️⃣ Backend payload
//     const payload = {
//       interviewPanelsDTO: {
//         isActive: true,
//         panelName: normalized.name,
//         description: "",
//         committeeId: formData.community,
//         interviewPanelId: ""
//       },
//       interviewerIds
//     };

//     // 4️⃣ SAVE API CALL
//     const res = await masterApiService.addInterviewPanel(payload);

//     if (!res?.success) {
//       throw new Error(res?.message || "Save failed");
//     }

//     // 5️⃣ Close modal
//     setShowAddModal(false);

//     // 6️⃣ Reset form
//     setFormData({ name: "", community: "", members: [] });
//     setIsEditing(false);
//     setEditingId(null);

//     // 7️⃣ Re-fetch panels list
//     await fetchPanels(committeeMap);

//   } catch (error) {
//     console.error("Save interview panel failed", error);
//   } finally {
//     setLoading(false);
//   }
// };


  //delete handlers
  const openDeleteModal = (p) => {
    setDeleteTarget({ id: p.id, name: p.name });
    setShowDeleteModal(true);
  };
 const confirmDelete = async () => {
  if (!deleteTarget?.id) return;

  setLoading(true);

  try {
    // 1️⃣ Call DELETE API
    const res = await masterApiService.deleteInterviewPanel(deleteTarget.id);

    // 2️⃣ Handle API failure
    if (!res?.success) {
      toast.error(res?.message || "Failed to delete interview panel");
      return;
    }

    // 3️⃣ Success toast
    toast.success("Interview panel deleted successfully");

    // 4️⃣ Update UI (remove deleted row)
    setPanels(prev => prev.filter(p => p.id !== deleteTarget.id));

    // OR (recommended if backend has logic)
    // await fetchPanels(committeeMap);

    // 5️⃣ Close modal
    setShowDeleteModal(false);
    setDeleteTarget(null);

  } catch (error) {
    console.error("Delete interview panel failed", error);
    toast.error("Something went wrong while deleting panel");
  } finally {
    setLoading(false);
  }
};

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // filtering & pagination
  const filtered = panels.filter(p =>
    [p.name, p.members].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  // small inline styles for pills and checkmark (adjust in CSS if preferred)
  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: 16,
    background: '#eef2f7',
    color: '#333',
    marginRight: 6,
    marginBottom: 6,
    fontSize: 13
  };
  const pillCloseStyle = {
    display: 'inline-block',
    marginLeft: 8,
    cursor: 'pointer',
    fontWeight: 700
  };

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>{t("interviewPanel:title")}</h2>


          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder={t("interviewPanel:search_placeholder")}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>

            <Button variant="primary" className="add-button" onClick={openAdd}>
              <Plus size={20} className="me-1" /> {t("interviewPanel:add")}
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>{t("interviewPanel:sno")}</th>


                <th>{t("interviewPanel:panel_name")}</th>
                <th>{t("interviewPanel:community")}</th>
                <th>{t("interviewPanel:panel_members")}</th>
                <th style={{ textAlign: "center" }}>{t("interviewPanel:actions")}</th>
              </tr>
            </thead>


            <tbody>
              {current.length ? current.map((p, i) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + i + 1}</td>
                  <td data-label="Panel Name:">{p.name}</td>
                  <td data-label="Community:">{p.community || "-"}</td>

                  <td data-label="Panel Members:">{p.members}</td>

                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn"><img src={viewIcon} className="icon-16" alt="view" /></Button>
                      <Button variant="link" className="action-btn edit-btn" onClick={() => openEdit(p)}><img src={editIcon} className="icon-16" alt="edit" /></Button>
                      <Button variant="link" className="action-btn delete-btn" onClick={() => openDeleteModal(p)}><img src={deleteIcon} className="icon-16" alt="delete" /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr> <td colSpan="5" className="text-center">
                  {t("interviewPanel:no_records")}
                </td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <li key={n} className={`page-item ${n === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(n)}>{n}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Modal */}
        <Modal
          show={showAddModal}
          onHide={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
          scrollable
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>
                {isEditing ? t("interviewPanel:edit") : t("interviewPanel:added")}
              </Modal.Title>

              <p className="small text-muted para">
                {t("interviewPanel:choose_add_method")}
              </p>
            </div>
          </Modal.Header>
          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button
                  variant={activeTab === "manual" ? "light" : "outline-light"}
                  className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
                  onClick={() => setActiveTab("manual")}
                >
                  {t("interviewPanel:manual_entry")}
                </Button>

                <Button
                  variant={activeTab === "import" ? "light" : "outline-light"}
                  className={`tab-button ${activeTab === "import" ? "active" : ""}`}
                  onClick={() => setActiveTab("import")}
                >
                  {t("interviewPanel:import_file")}
                </Button>
              </div>
            )}

            {activeTab === "manual" ? (
              <Form onSubmit={handleSave} noValidate>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        committe   <span className="text-danger">*</span>
                      </Form.Label>

                      <Form.Select
                        name="community"
                        value={formData.community}
                        onChange={handleInput}
                        className="form-control-custom"
                      >
                        <option value="">Select Community</option>
                        {communityOptions.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>

                      <ErrorMessage>{errors.community}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        {t("interviewPanel:panel_name")} <span className="text-danger">*</span>
                      </Form.Label>

                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleInput}
                        placeholder={t("interviewPanel:enter_panel_name")}
                        className="form-control-custom"
                      />

                      <ErrorMessage>{errors.name}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        {t("interviewPanel:panel_members")} <span className="text-danger">*</span>
                      </Form.Label>

                      <Dropdown autoClose="outside">
                        <Dropdown.Toggle
                          id="members-dropdown"
                          className="form-control-custom d-flex align-items-center justify-content-between buttonnonebg"
                          style={{ minHeight: 48, padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}
                        >
                          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', flex: 1 }}>
                            {Array.isArray(formData.members) && formData.members.length > 0 ? (
                              formData.members.map(m => (
                                <div key={m} style={pillStyle} className="hovbg" onClick={(e) => e.stopPropagation()}>
                                  <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}>
                                    {m}
                                  </span>
                                  <span
                                    style={pillCloseStyle}
                                    onClick={(e) => removeMemberPill(e, m)}
                                    aria-hidden
                                  >
                                    ×
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div style={{ color: '#9aa0a6' }}>
                                {t("interviewPanel:select_members")}
                              </div>
                            )}
                          </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ minWidth: 300, maxHeight: '86px', overflowY: 'auto', padding: '0.5rem' }}>
                          <div className="small text-muted mb-2 px-1">
                            {t("interviewPanel:select_members_hint")}
                          </div>

                          {availableMembersOptions.map(m => {
                            const selected = Array.isArray(formData.members) && formData.members.includes(m.name);
                            return (
                              <div
                                key={m}
                                role="button"
                                onClick={() => toggleMember(m)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 10px',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  background: selected ? '#f5fbff' : 'transparent',
                                  marginBottom: 6
                                }}
                              >
                                <div>{m.name}</div>
                                <div style={{ width: 20, textAlign: 'center' }}>
                                  {selected ? <span>✓</span> : null}
                                </div>
                              </div>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>

                      <ErrorMessage>{errors.members}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setIsEditing(false);
                      setEditingId(null);
                    }}
                  >
                    {t("interviewPanel:cancel")}
                  </Button>

                  <Button variant="primary" type="submit">
                    {isEditing ? t("interviewPanel:update") : t("interviewPanel:save")}
                  </Button>
                </Modal.Footer>
              </Form>
            ) : (
              <>
                <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
                  <div className="text-center mb-3">
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        background: "#fff",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Upload size={32} />
                    </div>

                    <h5 className="uploadfile">
                      {t("interviewPanel:upload_file")}
                    </h5>

                    <p className="small text-muted">
                      {t("interviewPanel:supported_formats")}
                    </p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <div>
                      <input
                        id="panel-csv"
                        type="file"
                        accept=".csv,text/csv"
                        style={{ display: 'none' }}
                        onChange={(e) => onSelectCSV(e.target.files[0] ?? null)}
                      />
                      <label htmlFor="panel-csv">
                        <Button variant="light" as="span" className="btnfont">
                          <i className="bi bi-upload me-1"></i>
                          {t("interviewPanel:upload_csv")}
                        </Button>
                      </label>
                    </div>

                    <div>
                      <input
                        id="panel-xlsx"
                        type="file"
                        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        style={{ display: 'none' }}
                        onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)}
                      />
                      <label htmlFor="panel-xlsx">
                        <Button variant="light" as="span" className="btnfont">
                          <i className="bi bi-upload me-1"></i>
                          {t("interviewPanel:upload_xlsx")}
                        </Button>
                      </label>
                    </div>

                    <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                    <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
                  </div>

                  <div className="text-center mt-4 small">
                    {t("interviewPanel:download_template")}:&nbsp;
                    <Button variant="link" className="btnfont" onClick={() => downloadTemplate('csv')}>
                      CSV
                    </Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" className="btnfont" onClick={() => downloadTemplate('xlsx')}>
                      XLSX
                    </Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setActiveTab('manual');
                    }}
                  >
                    {t("interviewPanel:cancel")}
                  </Button>

                  <Button variant="primary" onClick={handleImport}>
                    {t("interviewPanel:import")}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Body>

        </Modal>

        {/* Delete confirmation */}
        <Modal show={showDeleteModal} onHide={cancelDelete} centered dialogClassName="delete-confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              {t("interviewPanel:confirm_delete")}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{t("interviewPanel:delete_confirm_msg")}</p>

            {deleteTarget && (
              <div className="delete-confirm-user">
                <strong>{deleteTarget.name}</strong>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cancelDelete}>
              {t("interviewPanel:cancel")}
            </Button>

            <Button variant="danger" onClick={confirmDelete}>
              {t("interviewPanel:delete")}
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </Container>
  );
};

export default InterviewPanel;
