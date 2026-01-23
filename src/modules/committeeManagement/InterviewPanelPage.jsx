import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage"; // 👈 ADD
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";

const InterviewPanelPage = () => {
  const [activeTab, setActiveTab] = useState("MANAGE"); // 👈 TAB STATE

  const {
    panels,
    loading,
    communityOptions,
    membersOptions,
    initData,
    handleSave,
    handleDelete,
    formData,
    setFormData
  } = useInterviewPanel();

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="committee-page">
      {/* ===== Tabs ===== */}
      <div className="committee-tabs">
        <button
          className={`tab ${activeTab === "MANAGE" ? "active" : ""}`}
          onClick={() => setActiveTab("MANAGE")}
        >
          Manage Panels
        </button>

        <button
          className={`tab ${activeTab === "ASSIGN" ? "active" : ""}`}
          onClick={() => setActiveTab("ASSIGN")}
        >
          Assign to Positions
        </button>
      </div>

      {/* ===== Content ===== */}
      {activeTab === "MANAGE" && (
        <div className="committee-content">
          <div className="panel-form-card">
            <InterviewPanelFormModal
              communityOptions={communityOptions}
              membersOptions={membersOptions}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
            />
          </div>

          <div className="panel-table-card">
            <InterviewPanelTable
              panels={panels}
              loading={loading}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {activeTab === "ASSIGN" && <AssignPositionsPage />}
    </div>
  );
};

export default InterviewPanelPage;
