import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";
import { useInterviewPanel } from './hooks/useInterviewPanel';
import InterviewPanelTable from './components/InterviewPanelTable';
import InterviewPanelFormModal from './components/InterviewPanelFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import '../../../../style/css/user.css';

const InterviewPanelPage = () => {
  const { t } = useTranslation(["interviewPanel"]);
  const logic = useInterviewPanel();
  
  // Local UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);


  useEffect(() => { logic.initData(); }, []);

  const filtered = logic.panels.filter(p =>
    [p.name, p.members].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );




  const handleOpenEdit = (panel) => {
    setIsViewing(false); 
    setIsEditing(true);
    setSelectedPanel(panel);
    logic.setEditAssignedMembers(panel.memberNames);
    logic.setFormData({ name: panel.name, community: panel.communityId, members: panel.memberNames });
    setShowFormModal(true);
  };

  const handleSavePanel = async (e) => {
    e.preventDefault();
    const success = await logic.handleSave(isEditing, selectedPanel?.id);
    if (success) setShowFormModal(false);
  };


  const handleOpenView = (panel) => {
  setIsViewing(true);
  setIsEditing(false);
  setSelectedPanel(panel);

  logic.setEditAssignedMembers(panel.memberNames || []);
  logic.setFormData({
    name: panel.name,
    community: panel.communityId,
    members: panel.memberNames || []
  });

  logic.setErrors({});
  setShowFormModal(true);
};


  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>{t("title")}</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control 
              className='search-input'
                placeholder={t("search_placeholder")} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            {/* <Button className='add-button' onClick={() => { setIsEditing(false); logic.setFormData({name:'', community:'', members:[]}); setShowFormModal(true); }}>
              <Plus size={20} /> {t("add")}
            </Button> */}

            <Button
              className='add-button'
              onClick={() => {
                setIsViewing(false);
                setIsEditing(false);
                setSelectedPanel(null);

                //  RESET EVERYTHING RELATED TO FORM
                logic.setFormData({
                  name: '',
                  community: '',
                  members: []
                });

                logic.setEditAssignedMembers([]); //  THIS IS THE KEY FIX
                logic.setErrors({});               // optional but recommended

                setShowFormModal(true);
              }}
              
            > <Plus size={20} /> {t("add")}</Button>
          </div>
        </div>

        <InterviewPanelTable 
          data={filtered.slice((currentPage-1)*7, currentPage*7)} 
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(p) => { setSelectedPanel(p); setShowDeleteModal(true); }}
          startIndex={(currentPage-1)*7}
          t={t}
        />

        <InterviewPanelFormModal 
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          formData={logic.formData}
          setFormData={logic.setFormData}
          errors={logic.errors}
          communityOptions={logic.communityOptions}
          membersOptions={logic.membersOptions}
            panels={logic.panels}    
          editAssignedMembers={logic.editAssignedMembers}
          isViewing={isViewing}
          isEditing={isEditing}
          onSave={handleSavePanel}
          t={t}
        />

        <DeleteConfirmModal 
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await logic.handleDelete(selectedPanel.id);
            setShowDeleteModal(false);
          }}
          targetName={selectedPanel?.name}
          t={t}
        />
      </div>
    </Container>
  );
};

export default InterviewPanelPage;