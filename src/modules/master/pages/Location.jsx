// src/pages/Location.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { validateLocationForm } from '../../../shared/utils/location-validations';
import { useEffect } from 'react';
import masterApiService from "../services/masterApiService";
import { mapLocationsFromApi, mapLocationToApi } from '../mappers/locationMapper';
import { mapCitiesFromApi } from '../mappers/cityMapper';
import { useTranslation } from "react-i18next";

// Shared upload utilities (FileMeta, downloadTemplate, importLocations)
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';
const Location = () => {
  const { t } = useTranslation(["location"]);

  const [cityOptions, setCityOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rawLocations, setRawLocations] = useState([]);




  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual'); // manual | import
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  const [formData, setFormData] = useState({
    cityId: '',
    name: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCities();
    fetchLocationsRaw();
  }, []);


  const fetchCities = async () => {
    try {
      const res = await masterApiService.getallCities();

      const apiData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const mapped = mapCitiesFromApi(apiData);
      setCityOptions(mapped);

    } catch (err) {
      console.error('City fetch failed', err);
    }
  };

  const fetchLocationsRaw = async () => {
    try {
      const res = await masterApiService.getAllLocations();

      const apiData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      // ✅ NEWEST FIRST (assuming higher location_id = newer)
      const sorted = [...apiData].sort(
        (a, b) => b.location_id - a.location_id
      );

      setRawLocations(sorted);
    } catch (err) {
      console.error('Location fetch failed', err);
    }
  };

  useEffect(() => {
    if (!rawLocations.length || !cityOptions.length) return;

    const mapped = mapLocationsFromApi(rawLocations, cityOptions);
    setLocations(mapped);
  }, [rawLocations, cityOptions]);



  // Import wrapper — calls the shared importLocations (simple append)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: locations,
      setList: setLocations,
      mapRow: (row) => {
        // accept various header names
        const get = (r, ...keys) => {
          for (const k of keys) {
            if (Object.prototype.hasOwnProperty.call(r, k) && String(r[k] ?? '').trim() !== '') return String(r[k]).trim();
          }
          return '';
        };
        const cityRaw = get(row, 'city', 'cityname', 'city_name', 'town');
        const locationRaw = get(row, 'location', 'name', 'loc', 'location_name');
        return {
          cityId: null,
          cityName: cityRaw,
          name: locationRaw || 'Unnamed Location'
        };
      },
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingLocationId(null);
    setFormData({ cityId: '', name: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (loc) => {
    setIsEditing(true);
    setEditingLocationId(loc.id);
    setFormData({
      cityId: loc.cityId || '',
      name: loc.name || ''
    });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});

    const { valid, errors: vErrors } = validateLocationForm(
      formData,
      locations,
      isEditing ? editingLocationId : null
    );


    try {
      const payload = mapLocationToApi(formData);

      if (isEditing) {
        await masterApiService.updateLocation(editingLocationId, payload);
      } else {
        await masterApiService.addLocation(payload);
      }

      // ✅ refresh from server
      await fetchLocationsRaw();

      setShowAddModal(false);
      setIsEditing(false);
      setEditingLocationId(null);
    } catch (err) {
      console.error('Save location failed', err);
    }
  };



  const openDeleteModal = (loc) => {
    setDeleteTarget({ id: loc.id, name: loc.name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await masterApiService.deleteLocation(deleteTarget.id);

      // ✅ refresh list
      await fetchLocationsRaw();
    } catch (err) {
      console.error('Delete failed', err);
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };


  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Filter & pagination
  const filtered = locations.filter(loc =>
    [loc.name, loc.cityName].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>{t("locations")}</h2>          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>

            <Button variant="primary" className="add-button" onClick={openAddModal}>
              <Plus size={20} /> {t("add")}
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>{t("s_no")}</th>
                <th>{t("city_name")}</th>
                <th>{t("location_name")}</th>
                <th style={{ width: "120px", textAlign: "center" }}>{t("actions")}</th>

              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? (
                current.map((loc, idx) => (
                  <tr key={loc.id}>
                    <td>{indexOfFirst + idx + 1}</td>
                    <td data-label="City Name:">&nbsp;{loc.cityName}</td>
                    <td data-label="Location Name:">&nbsp;{loc.name}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="link" className="action-btn view-btn" title="View">
                          <img src={viewIcon} alt="View" className="icon-16" />
                        </Button>
                        <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(loc)}>
                          <img src={editIcon} alt="Edit" className="icon-16" />
                        </Button>
                        <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(loc)}>
                          <img src={deleteIcon} alt="Delete" className="icon-16" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No locations found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button onClick={() => setCurrentPage(number)} className="page-link">{number}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          show={showAddModal}
          onHide={() => { setShowAddModal(false); setIsEditing(false); setEditingLocationId(null); }}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
          scrollable
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{isEditing ? t("edit") : t("add")}</Modal.Title>
              <p className="mb-0 small text-muted para">                {t("choose_add_method")}
              </p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button variant={activeTab === 'manual' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>{t("manual_entry")}</Button>
                <Button variant={activeTab === 'import' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>{t("import_file")}</Button>
              </div>
            )}

            {activeTab === 'manual' ? (
              <Form onSubmit={handleSave}>
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formCity" className="form-group">
                      <Form.Label className="form-label">{t("city_name")} <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="cityId" value={formData.cityId} onChange={handleInputChange} className="form-control-custom">
                        <option value="">{t("select_city")}</option>
                        {cityOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Form.Select>
                      <ErrorMessage>{errors.cityId}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formLocationName" className="form-group">
                      <Form.Label className="form-label">{t("location_name")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder={t("enter_location_name")}
                      />
                      <ErrorMessage>{errors.name}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingLocationId(null); }}>{t("cancel")}</Button>
                  <Button variant="primary" type="submit">
                    {isEditing ? t("update") : t("save")}
                  </Button>
                </Modal.Footer>
              </Form>
            ) : (
              <>
                <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
                  <div className="text-center mb-3">
                    <div style={{ width: 72, height: 72, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', marginBottom: '1rem' }}>
                      <Upload size={32} />
                    </div>
                    <h5 className="mb-2 uploadfile">{t("upload_file")}</h5>
                    <p className="text-muted small">{t("support_csv_xlsx")}</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <input id="upload-csv" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> {t("upload_csv")}</Button>
                      </label>
                    </div>

                    {/* show selected files */}
                    <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
                    <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
                  </div>

                  <div className="text-center mt-4 small">
                    {t("download_template")}:&nbsp;

                    <Button variant="link" onClick={() => downloadTemplate(['city', 'location'], ['Bengaluru', 'Whitefield'], 'locations-template')} className="btnfont">CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['city', 'location'], ['Bengaluru', 'Whitefield'], 'locations-template')} className="btnfont">XLSX</Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setActiveTab('manual'); }}>  {t("cancel")}</Button>
                  <Button variant="primary" onClick={handleImport}>{t("import")}</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation */}
        <Modal show={showDeleteModal} onHide={cancelDelete} centered dialogClassName="delete-confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title>{t("confirm_delete")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t("delete_message")}</p>
            {deleteTarget && <div className="delete-confirm-user"><strong>{deleteTarget.name}</strong></div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cancelDelete}>   {t("cancel")}</Button>
            <Button variant="danger" onClick={confirmDelete}>              {t("delete")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default Location;
