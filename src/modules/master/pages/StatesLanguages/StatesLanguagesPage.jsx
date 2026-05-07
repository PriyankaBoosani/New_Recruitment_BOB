import React from "react";
import { Form, Button } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";

import StatesLanguagesModal from "../../../master/pages/StatesLanguages/components/StatesLanguagesModal";
import StatesLanguagesTable from "../../../master/pages/StatesLanguages/components/StatesLanguagesTable";

import { useStateLanguages } from "../../../master/pages/StatesLanguages/hooks/useStateLanguages";

const StatesLanguagesPage = () => {

  const {
    stateLangList,
    showModal,
    searchTerm,
    formData,
    errors,
    isEditMode,
    isViewing,

    // ✅ FIX: ADD THESE
    getStateName,
    getLanguageNames,

    setSearchTerm,

    handleAddClick,
    handleCloseModal,
    saveStateLanguage,
    handleEditClick,
    handleViewClick,
    handleChange
  } = useStateLanguages();

  return (
    <div className="px-4 py-3 border rounded bg-white">

      {/* HEADER */}
      <div className="user-header d-flex justify-content-between align-items-center mb-3">
        <h2>States & Languages</h2>

        <div className="d-flex align-items-center gap-3">

          {/* SEARCH */}
          <div className="position-relative">
            <Search
              size={16}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)"
              }}
            />

            <Form.Control
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "30px", width: "220px" }}
            />
          </div>

          {/* ADD */}
          <Button className="add-button" onClick={handleAddClick}>
            <Plus size={18} /> Add
          </Button>

        </div>
      </div>

      <StatesLanguagesTable
        data={stateLangList}
        onEdit={handleEditClick}
        onView={handleViewClick}
      />

      {/* MODAL */}
      {/* <StatesLanguagesModal
        show={showModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        onChange={handleChange}
        saveData={saveStateLanguage}
        isViewing={isViewing}
        isEditing={isEditMode}
        errors={errors}
      /> */}
      <StatesLanguagesModal
        show={showModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        onChange={handleChange}
        saveData={saveStateLanguage}
        isViewing={isViewing}
        isEditing={isEditMode}
        errors={errors}

        states={stateLangList}      // ✅ ADD THIS
        languages={stateLangList.flatMap(s =>
          s.languageIds.map((id, i) => ({
            languageId: id,
            languageName: s.languageNames[i]
          }))
        )}                          // ✅ TEMP FIX
      />

    </div>
  );
};

export default StatesLanguagesPage;