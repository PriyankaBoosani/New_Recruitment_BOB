import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

import { useUsers } from "./hooks/useUsers";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";

const UserPage = () => {
  const { t } = useTranslation(["user", "validation"]);
  const {
    users,
    addUser,
    deleteUser,
    loading
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchError, setSearchError] = useState("");


  const openAdd = () => {
    setShowModal(true);
  };

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("users")}</h2>

        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            {/* <Form.Control
              placeholder={t("search_by_user")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            /> */}
            <Form.Control
  placeholder={t("search_by_user")}
  value={searchTerm}
  onChange={(e) => {
    const value = e.target.value;

    //  allow alphabets, numbers, @, and space
    if (!/^[A-Za-z0-9@\s]*$/.test(value)) {
      return; // block invalid characters
    }

    setSearchTerm(value);
    setCurrentPage(1);
  }}
  className="search-input"
/>


          </div>

          <Button className="add-button" onClick={openAdd}>
            <Plus size={20} /> {t("add")}
          </Button>
        </div>
      </div>

      <UserTable
        data={users}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onDelete={(u) => {
          setDeleteTarget(u);
          setShowDelete(true);
        }}
      />

<UserFormModal
  show={showModal}
  onHide={() => setShowModal(false)}
  onSave={async (data) => {
    await addUser(data);
    setCurrentPage(1);  
  }}
  existingUsers={users}
/>







      {/* <DeleteConfirmModal
        show={showDelete}
        target={deleteTarget}
        onHide={() => setShowDelete(false)}
        onConfirm={() => {
          deleteUser(deleteTarget.id);
          setShowDelete(false);
        }}
      /> */}
    </Container>
  );
};

export default UserPage;
