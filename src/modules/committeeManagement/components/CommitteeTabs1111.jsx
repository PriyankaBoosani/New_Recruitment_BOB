const CommitteeTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "SCREENING", label: "Screening Committee" },
    { key: "INTERVIEW", label: "Interview Committee" },
    { key: "COMPENSATION", label: "Compensation Committee" }
  ];

  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`tab ${activeTab === t.key ? "active" : ""}`}
          onClick={() => setActiveTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default CommitteeTabs;
