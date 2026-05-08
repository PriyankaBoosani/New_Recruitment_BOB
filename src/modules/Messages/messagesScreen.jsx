import React, { useRef, useEffect } from "react";
import DropdownStrip from "../candidatePreview/components/DropdownStrip";
import MessageCard from "../Messages/components/messageCard";
import { useMessages } from "../Messages/hooks/useMessages";
import { mapMessagesData } from "../Messages/mappers/messagesMappers";
import "../../style/css/MessageCard.css";
import { useTranslation } from "react-i18next";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import masterApiService from "../master/services/masterApiService";
import { toast } from "react-toastify";

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
  const [allMessages, setAllMessages] = React.useState([]);  // ✅ ADD THIS
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const filterRef = useRef(null);



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

  // const statusCounts = messagesData.reduce((acc, item) => {
  //   acc[item.rawStatus] = (acc[item.rawStatus] || 0) + 1;
  //   return acc;
  // }, {});

  const statusCounts = (allMessages || []).reduce((acc, item) => {
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
      (!selectedStatus || item.rawStatus === selectedStatus) &&
      (!searchText || matchesSearch)
    );
  });
  // const ALL_STATUSES = [
  //   "PENDING",
  //   "L1_PENDING",
  //   "L1_APPROVED",
  //   "L1_REJECTED",
  //   "L2_APPROVED",
  //   "L2_REJECTED",
  //   "REJECTED"
  // ];


  const fetchMessages = async (payload, pageNo = page, pageSize = size) => {
    try {
      setLoadingMessages(true);

      const res = await candidateWorkflowServices.getMessageHistory(
        payload,
        pageNo,
        pageSize
      );


      const responseData = res?.data;


      setApiMessages(responseData?.content || []);
      setTotalPages(responseData?.page.totalPages || 0);
      setTotalElements(responseData?.page.totalElements || 0);


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

  React.useEffect(() => {
    if (selectedPositionId) {

      toggleRow(null);

      fetchMessages({
        positionsIds: [selectedPositionId],
        requestTypeIds: [],
        statusList: selectedStatus ? [selectedStatus] : []
      }, 0, size);
    }
  }, [selectedPositionId, selectedStatus]);

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
    const msgs = await fetchThreadMessages(id);
    setThreadMessagesMap((prev) => ({
      ...prev,
      [id]: msgs,
    }));

    toggleRow(id);
  };
  React.useEffect(() => {
    if (selectedPositionId) {

      fetchMessages({
        positionsIds: selectedPositionId ? [selectedPositionId] : [],
        requestTypeIds: [], // optional (can pass selected later)
        statusList: selectedStatus ? [selectedStatus] : []
        // statusList: []
      }, page, size);
    }
  }, [page, size]);


  React.useEffect(() => {
    setPage(0);
  }, [selectedPositionId, selectedStatus, searchText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleSubmitApproval = async (threadId, status, comment) => {
    try {
      const payload = {
        conversationThreadId: [threadId],
        status,
        comments: comment || ""
      };

      await candidateWorkflowServices.submitForApproval(payload);

      if (status === "L1_PENDING") {
        toast.success("Approved successfully");
      } else if (status === "REJECTED") {
        toast.success("Rejected successfully");
      }


      const latestMessages = await fetchThreadMessages(threadId);

      setThreadMessagesMap(prev => ({
        ...prev,
        [threadId]: latestMessages?.data || latestMessages || []
      }));


      setApiMessages(prev =>
        prev.map(item =>
          item.conversationThreadId === threadId
            ? { ...item, status }
            : item
        )
      );

    } catch (err) {
      console.error("Submit approval error", err);

      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const fetchAllMessagesForCounts = async () => {
    try {
      const res = await candidateWorkflowServices.getMessageHistory(
        {
          positionsIds: selectedPositionId ? [selectedPositionId] : [],
          requestTypeIds: [],
          statusList: []   // ✅ ALWAYS ALL
        },
        0,
        1000
      );

      setAllMessages(res?.data?.content || []);
    } catch (err) {
      console.error("Count API error", err);
    }
  };
  React.useEffect(() => {
    if (selectedPositionId) {
      fetchAllMessagesForCounts();
    }
  }, [selectedPositionId]);

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (page <= 1) {
      return [0, 1, 2];
    }

    if (page >= totalPages - 2) {
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    }

    return [page - 1, page, page + 1];
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


                    setSelectedPositionId("");


                    setApiMessages([]);


                    fetchPositions(id);
                  }}

                  onPositionChange={(value) => {
                    setSelectedPositionId(value);
                    setPage(0);
                    const ids = value ? [value] : [];
                    fetchMessages({
                      positionsIds: value ? [value] : [],
                      requestTypeIds: [],
                      statusList: selectedStatus ? [selectedStatus] : []
                    }, 0, size); //ALL_STATUSES
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
                  ref={filterRef}
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

                    {selectedStatus === "PENDING" && "Pending"}
                    {selectedStatus === "L1_PENDING" && "L1 Pending"}
                    {selectedStatus === "L1_APPROVED" && "L1 Approved"}
                    {selectedStatus === "L1_REJECTED" && "L1 Rejected"}
                    {selectedStatus === "L2_APPROVED" && "L2 Approved"}
                    {selectedStatus === "L2_REJECTED" && "L2 Rejected"}
                    {selectedStatus === "REJECTED" && "Rejected"}
                    {!selectedStatus && t("messages:all_status")}

                    <i className={`bi ms-2 ${isFilterOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                  </div>

                  {isFilterOpen && (
                    <div className="filter-dropdown">

                      {/* ALL */}
                      <div
                        className={`filter-item ${!selectedStatus ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("");
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("messages:all")}
                        {/* <span>{totalElements}</span> */}
                        {/* <span>{messagesData.length}</span> */}
                      </div>

                      {/* PENDING */}
                      <div
                        className={`filter-item pending ${selectedStatus === "PENDING" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("PENDING");
                          setIsFilterOpen(false);
                        }}
                      >
                        Pending
                      </div>

                      {/* L1 PENDING */}
                      <div
                        className={`filter-item ${selectedStatus === "L1_PENDING" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("L1_PENDING");
                          setIsFilterOpen(false);
                        }}
                      >
                        L1 Pending
                        {/* <span>{statusCounts["L1_PENDING"] || 0}</span> */}
                      </div>

                      {/* L1 APPROVED */}
                      <div
                        className={`filter-item approved ${selectedStatus === "L1_APPROVED" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("L1_APPROVED");
                          setIsFilterOpen(false);
                        }}
                      >
                        L1 Approved
                        {/* <span>{statusCounts["L1_APPROVED"] || 0}</span> */}
                      </div>

                      {/* L1 REJECTED */}
                      <div
                        className={`filter-item rejected ${selectedStatus === "L1_REJECTED" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("L1_REJECTED");
                          setIsFilterOpen(false);
                        }}
                      >
                        L1 Rejected
                        {/* <span>{statusCounts["L1_REJECTED"] || 0}</span> */}
                      </div>

                      {/* L2 APPROVED */}
                      <div
                        className={`filter-item approved ${selectedStatus === "L2_APPROVED" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("L2_APPROVED");
                          setIsFilterOpen(false);
                        }}
                      >
                        L2 Approved
                        {/* <span>{statusCounts["L2_APPROVED"] || 0}</span> */}
                      </div>

                      {/* L2 REJECTED */}
                      <div
                        className={`filter-item rejected ${selectedStatus === "L2_REJECTED" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("L2_REJECTED");
                          setIsFilterOpen(false);
                        }}
                      >
                        L2 Rejected
                        {/* <span>{statusCounts["L2_REJECTED"] || 0}</span> */}
                      </div>

                      {/* FINAL REJECTED */}
                      <div
                        className={`filter-item rejected ${selectedStatus === "REJECTED" ? "active" : ""}`}
                        onClick={() => {
                          setSelectedStatus("REJECTED");
                          setIsFilterOpen(false);
                        }}
                      >
                        Rejected
                        {/* <span>{statusCounts["REJECTED"] || 0}</span> */}
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
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>

                <div
                  className="card text-center p-4"
                  style={{
                    width: "350px",
                    borderRadius: "12px",
                    border: "1px solid #E0E0E0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                  }}
                >
                  <div className="mb-2">
                    <i className="bi bi-inbox" style={{ fontSize: "28px", color: "#A0A0A0" }}></i>
                  </div>

                  <div className="fw-semibold text-muted">
                    {t("messages:no_data")}
                  </div>

                  <small className="text-muted">
                    No messages available for selected filters
                  </small>
                </div>

              </div>
            )}
          </div>
          <div className="d-flex justify-content-end align-items-center gap-3 col px-3 py-3 border-top">

            {/* Page size */}
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold pagesize" style={{ color: "#162B75" }}>
                Page size:
              </span>

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

                {/* PREV */}
                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  >
                    «
                  </button>
                </li>

                {/* LEFT DOTS */}
                {page > 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {/* PAGE NUMBERS (ONLY 3) */}
                {getVisiblePages().map((i) => (
                  <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(i)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                {/* RIGHT DOTS */}
                {page < totalPages - 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {/* NEXT */}
                <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
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