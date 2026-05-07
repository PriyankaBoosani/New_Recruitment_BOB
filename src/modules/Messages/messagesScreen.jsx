import React from "react";
import DropdownStrip from "../candidatePreview/components/DropdownStrip";
import MessageCard from "../Messages/components/messageCard";
import { useMessages } from "../Messages/hooks/useMessages";
import { mapMessagesData } from "../Messages/mappers/messagesMappers";
import "../../style/css/MessageCard.css";
import { useTranslation } from "react-i18next";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import masterApiService from "../master/services/masterApiService";

const Messages = () => {
  const { t } = useTranslation(["messages", "common"]);
  const {
    selectedRequisitionId,
    selectedPositionId,
    date,
    openRow,
    setSelectedRequisitionId,
    setSelectedPositionId,
    setDate,
    toggleRow,
  } = useMessages();

  // ✅ EXISTING
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [requisitions, setRequisitions] = React.useState([]);
  const [loadingRequisitions, setLoadingRequisitions] = React.useState(false);
  const [positions, setPositions] = React.useState([]);
  const [loadingPositions, setLoadingPositions] = React.useState(false);
  const [requestTypes, setRequestTypes] = React.useState([]);
  const [threadMessagesMap, setThreadMessagesMap] = React.useState({});
  const [totalElements, setTotalElements] = React.useState(0);

  // const messagesData = mapMessagesData(rawData);
  const [apiMessages, setApiMessages] = React.useState([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);


  const selectedRequisitionName = requisitions.find(r => r.id === selectedRequisitionId)?.requisitionTitle || "";

  const selectedPositionName =
    positions.find(
      p => p.jobPositions?.positionId === selectedPositionId
    )?.masterPositions?.positionName || "";


  const messagesData = mapMessagesData(
    apiMessages,
    selectedRequisitionId,
    selectedPositionId,
    selectedRequisitionName,
    selectedPositionName,
    requestTypes,
    threadMessagesMap
  );

  // ✅ ✅ NEW: DYNAMIC COUNTS (ONLY ADD THIS)
  const statusCounts = messagesData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const filteredMessages = messagesData.filter((item) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(search) ||
      item.regNo?.toLowerCase().includes(search) ||
      item.requisitionName?.toLowerCase().includes(search) ||
      item.positionName?.toLowerCase().includes(search) ||
      item.type?.toLowerCase().includes(search);

    return (
      selectedPositionId &&
      (!selectedRequisitionId ||
        item.requisitionId === selectedRequisitionId) &&
      (!selectedPositionId ||
        item.positionId === selectedPositionId) &&
      (!selectedStatus || item.status === selectedStatus) &&
      (!searchText || matchesSearch)   // ✅ SEARCH CONDITION
    );
  });


  // const fetchMessages = async (positionIds) => {
  //   try {
  //     setLoadingMessages(true);

  //     const res = await candidateWorkflowServices.getMessageHistory(positionIds);

  //     // setApiMessages(res?.data || []);
  //     setApiMessages(res?.data?.content || []);
  //     setTotalPages(res?.data?.totalPages || 0);

  //   } catch (err) {
  //     console.error("Messages API error", err);
  //   } finally {
  //     setLoadingMessages(false);
  //   }
  // };

  const fetchMessages = async (payload, pageNo = page, pageSize = size) => {
    try {
      setLoadingMessages(true);

      const res = await candidateWorkflowServices.getMessageHistory(
        payload,
        pageNo,
        pageSize
      );

      // setApiMessages(res?.data?.content || []);
      // setTotalPages(res?.data?.totalPages || 0);
      // setTotalElements(res?.data?.totalElements || 0);   // ✅ ADD THIS
      const responseData = res?.data;   // ✅ CHANGE THIS

      setApiMessages(responseData?.content || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalElements(responseData?.totalElements || 0);
    } catch (err) {
      console.error("Messages API error", err);
    } finally {
      setLoadingMessages(false);
    }
  };
  const fetchPositions = async (requisitionId, search = "") => {
    try {
      setLoadingPositions(true);

      const res = await candidateWorkflowServices.getPositionsByRequisitionId(
        requisitionId,
        search
      );



      setPositions(res?.data || []);

    } catch (err) {
      console.error("Positions API error", err);
    } finally {
      setLoadingPositions(false);
    }
  };
  React.useEffect(() => {
    fetchRequisitions();
    fetchRequestTypes();
  }, []);

  const fetchRequisitions = async (search = "") => {
    try {
      setLoadingRequisitions(true);

      const res = await candidateWorkflowServices.getRequisitions(search);



      // 👇 adjust based on API response structure
      setRequisitions(res?.data || []);

    } catch (err) {
      console.error("Requisition API error", err);
    } finally {
      setLoadingRequisitions(false);
    }
  };

  const fetchRequestTypes = async () => {
    try {
      const res = await masterApiService.getRequestTypes();

      if (res?.success) {
        setRequestTypes(res.data);
      }
    } catch (err) {
      console.error("RequestTypes API error", err);
    }
  };

  const fetchThreadMessages = async (threadId) => {
    try {
      const res = await candidateWorkflowServices.getMessagesByThreadId(threadId);


      return res?.data || [];
    } catch (err) {
      console.error("Thread messages error", err);
      return [];
    }
  };
  const handleToggle = async (id) => {
    if (!threadMessagesMap[id]) {
      const msgs = await fetchThreadMessages(id);

      setThreadMessagesMap((prev) => ({
        ...prev,
        [id]: msgs,
      }));
    }

    toggleRow(id);
  };

  React.useEffect(() => {
    if (selectedPositionId) {
      // fetchMessages([selectedPositionId], page, size);
      fetchMessages({
        positionsIds: selectedPositionId ? [selectedPositionId] : [],
        requestTypeIds: [], // optional (can pass selected later)
        statusList: selectedStatus ? [selectedStatus.toUpperCase()] : []
      }, page, size);
    }
  }, [page, size]);
  React.useEffect(() => {
    if (selectedPositionId) {
      fetchMessages({
        positionsIds: [selectedPositionId],
        requestTypeIds: [],
        statusList: selectedStatus ? [selectedStatus.toUpperCase()] : []
      }, 0, size);
    }
  }, [selectedPositionId]);

  React.useEffect(() => {
    setPage(0);
  }, [selectedPositionId, selectedStatus, searchText]);

  const handleSubmitApproval = async (threadId, status) => {
  try {
    const payload = {
      conversationThreadId: [threadId], // ✅ must be array with single id
      status,                           // "L1_PENDING" or "REJECTED"
      comments: "test"                  // or from input box
    };

    await candidateWorkflowServices.submitForApproval(payload);

    // 🔄 Refresh list after action
    fetchMessages({
      positionsIds: selectedPositionId ? [selectedPositionId] : [],
      requestTypeIds: [],
      statusList: selectedStatus ? [selectedStatus.toUpperCase()] : []
    }, page, size);

  } catch (err) {
    console.error("Submit approval error", err);
  }
};

  return (
    <div className="container-fluid py-3 px-3"
      style={{ background: "#F5F7FA", minHeight: "100vh" }}>
      <div className="card" style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E0E0E0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="card-body p-0 d-flex flex-column" style={{ height: "100%" }}>

          {/* HEADER */}
          <div id="msg-card-1">
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
              <div>
                <h6 className="blue-color fw-semibold mb-0"> {t("messages:message_history")}</h6>
                <small className="text-muted">
                  {t("messages:manage_communications")}
                </small>
              </div>

              <div className="msg-search-box">
                <i className="bi bi-search msg-search-icon"></i>
                <input
                  type="text"
                  placeholder={t("messages:search")}
                  className="msg-search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="px-3 pt-3" id="msg-card-1">
            <div className="d-flex align-items-end gap-3 w-100 flex-wrap">

              {/* LEFT */}
              <div className="d-flex flex-wrap gap-3 flex-grow-1 align-items-end">

                {/* DROPDOWNS */}
                <DropdownStrip
                  requisitions={requisitions}
                  positions={positions}
                  selectedRequisitionId={selectedRequisitionId}
                  selectedPositionId={selectedPositionId}
                  loadingRequisitions={loadingRequisitions}
                  loadingPositions={loadingPositions}
                  onRequisitionChange={(e) => {
                    const id = e.target.value;

                    setSelectedRequisitionId(id);

                    // ✅ CLEAR POSITION
                    setSelectedPositionId("");

                    // ✅ CLEAR MESSAGES
                    setApiMessages([]);

                    // ✅ FETCH NEW POSITIONS
                    fetchPositions(id);
                  }}

                  onPositionChange={(value) => {
                    setSelectedPositionId(value);
                    setPage(0);   // ✅ reset page
                    const ids = value ? [value] : [];
                    fetchMessages({
                      positionsIds: value ? [value] : [],
                      requestTypeIds: [],
                      statusList: selectedStatus ? [selectedStatus.toUpperCase()] : []
                    }, 0, size);
                  }}
                  onRequisitionSearch={(val) => fetchRequisitions(val)}
                />

                {/* <div style={{ minWidth: "180px", maxWidth: "220px", flex: 1 }}>
                  <label className="fs-14 blue-color">
                    {t("messages:extend_submission_date")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("messages:select_date")}
                    className="form-control submission-input mt-1"
                    value={date || ""}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div style={{ minWidth: "120px" }}>
                  <button
                    className="btn submit-btn w-100"
                    style={{ height: "38px" }}
                  >
                    {t("messages:submit")}
                  </button>
                </div> */}

                <div
                  className="filter-wrapper"
                  style={{
                    marginLeft: "auto",
                    minWidth: "160px",
                    display: "flex",
                    alignItems: "flex-end"
                  }}
                >

                  <div
                    className="filter-header"
                    style={{ height: "38px", display: "flex", alignItems: "center" }}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <i className="bi bi-funnel"></i>
                    {selectedStatus ? t(`messages:${selectedStatus.toLowerCase()}`) : t("messages:all_status")}
                    <i className={`bi ms-2 ${isFilterOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                  </div>

                  {isFilterOpen && (
                    <div className="filter-dropdown">

                      <div
                        className={`filter-item ${!selectedStatus ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("");
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("messages:all")}<span>{messagesData.length}</span>
                      </div>

                      <div
                        className={`filter-item pending ${selectedStatus === "Pending" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("Pending");
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("messages:pending")} <span>{statusCounts["Pending"] || 0}</span>
                      </div>

                      <div
                        className={`filter-item approved ${selectedStatus === "Approved" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("Approved");
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("messages:approved")} <span>{statusCounts["Approved"] || 0}</span>
                      </div>

                      <div
                        className={`filter-item rejected ${selectedStatus === "Rejected" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("Rejected");
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("messages:rejected")} <span>{statusCounts["Rejected"] || 0}</span>
                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT: FILTER */}


            </div>
          </div>


          {/* LIST */}
          <div
            className="px-3 py-3 flex-grow-1"
            style={{ overflowY: "auto", minHeight: "300px" }}
          >
            {filteredMessages.length > 0 ? (
              filteredMessages.map((item) => (
                <MessageCard
                  key={item.id}
                  item={item}
                  isOpen={openRow === item.id}
                  onToggle={handleToggle}
                   onSubmitApproval={handleSubmitApproval} 
                />
              ))
            ) : (
              <div
                className="text-center text-muted mt-5"
                style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {t("messages:no_data")}
              </div>
            )}
          </div>
        <div className="d-flex justify-content-end align-items-center gap-3 col px-3 py-3 border-top">

  {/* Page Size */}
  <div className="d-flex align-items-center gap-2">
    <span className="fw-semibold pagesize">Page size:</span>
    <select
      className="form-select form-select-sm"
      style={{ width: "90px" }}
      value={size}
      onChange={(e) => {
        setSize(Number(e.target.value));
        setPage(0);
      }}
    >
      {[5, 10, 15, 20, 25, 30].map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>

  {/* Pagination */}
  <nav aria-label="Page navigation">
    <ul className="pagination mb-0 justify-content-center">

      {/* « Prev */}
      <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
        <button
          className="page-link"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          «
        </button>
      </li>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => {

        // show first, last, and near current
        if (
          i === 0 ||
          i === totalPages - 1 ||
          Math.abs(i - page) <= 1
        ) {
          return (
            <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            </li>
          );
        }

        // show dots
        if (i === page - 2 || i === page + 2) {
          return (
            <li key={i} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          );
        }

        return null;
      })}

      {/* » Next */}
      <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          »
        </button>
      </li>

    </ul>
  </nav>
</div>

        </div>
      </div>
    </div>
  );
};

export default Messages;