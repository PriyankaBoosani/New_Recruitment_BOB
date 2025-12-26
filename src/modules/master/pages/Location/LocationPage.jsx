// LocationPage.jsx
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

import { useLocations } from "./hooks/useLocations";
import { validateLocationForm } from "../../../../shared/utils/location-validations";
import LocationTable from "./components/LocationTable";
import LocationFormModal from "./components/LocationFormModal";
import DeleteConfirmModal from "../Location/components/DeleteConfirmModal";


const LocationPage = () => {
  const { t } = useTranslation(["location", "validation"]);
  const {
    locations,
    cities,
    addLocation,
    updateLocation,
    deleteLocation,
    fetchLocations
  } = useLocations();



  const [formData, setFormData] = useState({
  name: '',
  cityId: null,
  cityName: ''
});

const [errors, setErrors] = useState({});


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [editingId, setEditingId] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);


  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  
  

const openAdd = () => {
  setIsEditing(false);
  setEditingLocation(null);
  setFormData({ name: '', cityId: null, cityName: '' });
  setErrors({});
  setShowModal(true);
};

const openEdit = (loc) => {
  setIsEditing(true);
  setEditingLocation(loc);
  setFormData({
    name: loc.name ?? '',
    cityId: loc.cityId ?? null,
    cityName: loc.cityName ?? ''
  });
  setErrors({});
  setShowModal(true);
};


const handleSave = async (e) => {
  e.preventDefault();

  const { valid, errors: vErrors } =
    validateLocationForm(formData, {
      existing: locations,
      currentId: isEditing ? editingLocation?.id : null
    });

  if (!valid) {
    setErrors(vErrors);
    return;
  }

  try {
    if (isEditing) {
      await updateLocation(editingLocation.id, formData);
    } else {
      await addLocation(formData);
      setCurrentPage(1); // show newest record
    }

    setShowModal(false);
  } catch (err) {
    console.error("Save failed", err);
  }
};

return (
  <Container fluid className="user-container">
    <div className="user-header">
      <h2>{t("locations")}</h2>

      <div className="user-actions">
        <div className="search-box">
          <Search className="search-icon" />
          <Form.Control
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <Button className="add-button" onClick={openAdd}>
          <Plus size={20} /> {t("add")}
        </Button>
      </div>
    </div>


      <LocationTable
        data={locations}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEdit={openEdit}
        onDelete={(loc) => {
          setDeleteTarget(loc);
          setShowDelete(true);
        }}
      />

<LocationFormModal
  show={showModal}
  onHide={() => setShowModal(false)}
  isEditing={isEditing}
  formData={formData}
  setFormData={setFormData}
  errors={errors}
  cities={cities}
  setErrors={setErrors}
  handleSave={handleSave}
  t={t}
    onSuccess={() => {
          fetchLocations();     // refresh list immediately
          setShowModal(false); // ensure modal closes
        }}
/>



      <DeleteConfirmModal
        show={showDelete}
        target={deleteTarget}
        onHide={() => setShowDelete(false)}
        onConfirm={() => {
          deleteLocation(deleteTarget.id);
          setShowDelete(false);
        }}
      />
    </Container>
  );
};

export default LocationPage;
