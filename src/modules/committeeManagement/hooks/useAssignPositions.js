import { useState, useEffect,useCallback } from "react";
import "../../../style/css/Committee.css";
import masterApiService from "../../master/services/masterApiService";
import committeeManagementService from "../services/committeeManagementService";
import {mapPanelsApi } from "../mappers/InterviewPanelMapper";
import { toast } from "react-toastify";
export const useAssignPositions = (userId) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    requisitionId: "",
    positionId: "",
    panelType: "",
    members: []
  });


const [requisitions, setRequisitions] = useState([]);
const [positions, setPositions] = useState([]);

const [selectedRequisition, setSelectedRequisition] = useState("");
const [selectedPosition, setSelectedPosition] = useState("");
const [allPanels, setAllPanels] = useState([]);
const [availablePanels, setAvailablePanels] = useState([]);


 /* ================= PAGINATION ================= */

  const [page, setPage] = useState(0);
  const [size] = useState(1000);
  const [totalPages, setTotalPages] = useState(0);

  const [panelErrors, setPanelErrors] = useState({});

const validatePanels = () => {
  const errors = {};
  let isValid = true;

  Object.entries(selectedCommittees).forEach(([type, panels]) => {
    panels.forEach(panel => {
      const key = `${type}_${panel.id}`;
      errors[key] = {};

      if (!panel.startDate) {
        errors[key].startDate = "Start date is required";
        isValid = false;
      }

      if (!panel.endDate) {
        errors[key].endDate = "End date is required";
        isValid = false;
      }

      if (
        panel.startDate &&
        panel.endDate &&
        new Date(panel.endDate) < new Date(panel.startDate)
      ) {
        errors[key].endDate = "End date cannot be before start date";
        isValid = false;
      }

      // Remove empty error objects
      if (Object.keys(errors[key]).length === 0) {
        delete errors[key];
      }
    });
  });

  setPanelErrors(errors);

   if (!isValid) {
    toast.error("Please fix the highlighted errors before assigning committees");
  }
  return isValid;
};


useEffect(() => {
  fetchRequisitions();
  fetchPanels();
}, []);

useEffect(() => {
  if (!selectedPosition) return;

  // 🔥 RESET EVERYTHING RELATED TO PREVIOUS POSITION
  setSelectedCommittees({
    SCREENING: [],
    INTERVIEW: [],
    COMPENSATION: []
  });

  setPanelErrors({});
}, [selectedPosition]);

// 2️⃣ Fetch assigned panels for new position
useEffect(() => {
  if (!selectedPosition) return;

  fetchAssignedPanels(selectedPosition);
}, [selectedPosition]);
const fetchAssignedPanels = async (positionId) => {
  try {
    setLoading(true);

    const res =
      await committeeManagementService.getPanelsByPosition(positionId);
      console.log("RES 👉", res);

    const {
      interviewPanelList = [],
      screeningPanelList = [],
      compensationPanelList = []
    } = res?.data || {};

    const mapAssigned = (list) =>
      list.map(p => ({
        id: p.interviewPanel.interviewPanelId,
        positionPanelId: p.positionPanelId, 
        name: p.interviewPanel.panelName,
        committeeName: p.interviewPanel.committee.committeeName.toUpperCase(),
        committeeId: p.interviewPanel.committee.interviewCommitteeId,
        members: p.interviewPanel.panelMembers.map(m => ({
          ...m.panelMember,
          interviewPanelMemberId: m.interviewPanelMemberId
        })),
        startDate: p.startDate || "",
        endDate: p.endDate || ""
      }));

    const assigned = {
      SCREENING: mapAssigned(screeningPanelList),
      INTERVIEW: mapAssigned(interviewPanelList),
      COMPENSATION: mapAssigned(compensationPanelList)
    };
console.log("ASSIGNED 👉", assigned);
    // 1️⃣ SET SELECTED COMMITTEES
    setSelectedCommittees(assigned);

    // 2️⃣ REMOVE FROM AVAILABLE PANELS
    const assignedIds = Object.values(assigned)
      .flat()
      .map(p => p.id);

    setAvailablePanels(prev =>
      allPanels.filter(p => !assignedIds.includes(p.id))
    );

  } catch (err) {
    console.error("Failed to fetch assigned panels", err);
  } finally {
    setLoading(false);
  }
};

const fetchRequisitions = async () => {
  try {
    const res = await committeeManagementService.getRequisitions();

    setRequisitions(res?.data || []);
  } catch (err) {
    console.error("Failed to load requisitions", err);
  }
  
};

const handleRequisitionChange = async (e) => {
  const reqId = e.target.value;

  setSelectedRequisition(reqId);
  setSelectedPosition(""); // reset position

  if (!reqId) return;

  try {
    const res = await committeeManagementService.getPositionsByRequisition(reqId);

    setPositions(res?.data || []);

  } catch (err) {
    console.error("Failed to load positions", err);
  }
};

  // Mock data for now - replace with actual API calls
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       // Replace with actual API calls
  //       // const res = await masterApiService.getCommitteeAssignments();
  //       // setHistory(res.data || []);
        
  //       // Mock data
  //       setHistory([
  //         {
  //           id: 1,
  //           requisitionCode: 'REQ-2023-001',
  //           positionName: 'Senior Software Engineer',
  //           panelType: 'Technical Interview',
  //           members: ['John Doe', 'Jane Smith'],
  //           assignedDate: '2023-06-15T10:30:00',
  //           updatedDate: '2023-06-15T10:30:00'
  //         }
  //       ]);
  //     } catch (error) {
  //       console.error('Error fetching committee assignments:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [userId]);

  const handleAssign = async () => {
    if (!formData.requisitionId || !formData.positionId) return;
    
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await masterApiService.assignCommittee({
      //   ...formData,
      //   assignedBy: userId
      // });
      
      // Update local state with the new assignment
      const newAssignment = {
        id: Date.now(), // Temporary ID
        requisitionCode: formData.requisitionCode || 'REQ-2023-XXX',
        positionName: formData.positionName || 'Position Name',
        panelType: formData.panelType || 'Interview Panel',
        members: formData.members || [],
        assignedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      
      setHistory(prev => [newAssignment, ...prev]);
      
      // Reset form
      setFormData({
        requisitionId: "",
        positionId: "",
        panelType: "",
        members: []
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning committee:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

 

 const fetchPanels = useCallback(async () => {
    try {
      setLoading(true);

      const res = await masterApiService.getInterviewPanelsSearch({
        page,
        size
      });

      console.log("RES 👉", res);
      const apiData = res?.data?.content || [];
      const mapped = mapPanelsApi(apiData);
      console.log("MAPPED 👉", mapped);
       setAllPanels(mapped);
    setAvailablePanels(mapped); // reset source of truth

    } catch (error) {
      console.error("Fetch Panels Error:", error);
      toast.error("Failed to load panels");
    } finally {
      setLoading(false);
    }
  });

  // const handleEdit = (item) => {
  //   // Set form data for editing
  //   setFormData({
  //     requisitionId: item.requisitionId || "",
  //     positionId: item.positionId || "",
  //     panelType: item.panelType || "",
  //     members: item.members || []
  //   });
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this assignment?')) {
  //     return false;
  //   }
    
  //   try {
  //     setLoading(true);
  //     // Replace with actual API call
  //     // await masterApiService.deleteCommitteeAssignment(id);
      
  //     // Update local state
  //     setHistory(prev => prev.filter(item => item.id !== id));
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting assignment:', error);
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [activeTab, setActiveTab] = useState("SCREENING");
  const [showHistory, setShowHistory] = useState(true);

  const [selectedCommittees, setSelectedCommittees] = useState({
    SCREENING: [],
    INTERVIEW: [],
    COMPENSATION: []
  });
  const [context, setContext] = useState({
    requisitionId: "1",
    positionId: "1"
  });

  const updateCommitteeDate = (type, id, field, value) => {
  setSelectedCommittees(prev => ({
    ...prev,
    [type]: prev[type].map(c =>
      c.id === id ? { ...c, [field]: value } : c
    )
  }));
};
const handleAssignCommittees = async () => {
  if (!selectedPosition) {
    toast.error("Please select a position");
    return;
  }
   const isValid = validatePanels();
  if (!isValid) return; // ❌ stop here

  try {
    setLoading(true);

    const payload = {
      interviewPanelList: [],
      screeningPanelList: [],
      compensationPanelList: []
    };
    console.log("SELECTED COMMITTEES 👉", selectedCommittees);

    Object.entries(selectedCommittees).forEach(
      ([committeeType, panels]) => {
        panels.forEach((panel, seqIndex) => {
          const panelPayload = {
            positionId: null,
            interviewPanel: {
              panelName: panel.name,
              description: panel.description || "",
              committee: {
                committeeName: panel.committeeName,
                committeeDesc: panel.committeeDesc || "",
                interviewCommitteeId: panel.committeeId
              },
              panelMembers: panel.members.map(m => ({
                panelId: panel.id,
                panelMember: {
                  name: m.name,
                  role: m.role,
                  email: m.email,
                  userId: m.userId
                },
                interviewPanelMemberId: m.interviewPanelMemberId
              })),
              interviewPanelId: panel.id
            },
            startDate: panel.startDate,
            endDate: panel.endDate,
            sequenceNo: seqIndex,
            positionPanelId: panel.positionPanelId
          };

          if (committeeType === "INTERVIEW") {
            payload.interviewPanelList.push(panelPayload);
          } else if (committeeType === "SCREENING") {
            payload.screeningPanelList.push(panelPayload);
          } else if (committeeType === "COMPENSATION") {
            payload.compensationPanelList.push(panelPayload);
          }
        });
      }
    );

    console.log("FINAL PAYLOAD 👉", payload);

    await committeeManagementService.assignPanelToPosition(
      selectedPosition,
      payload
    );

    toast.success("Committees assigned successfully");
  } catch (err) {
    console.error("ASSIGN ERROR 👉", err);
    toast.error(
      err?.response?.data?.message ||
      "Failed to assign committees"
    );
  } finally {
    setLoading(false);
  }
};


  return {
    history,
    loading,
    formData,
    setFormData,
    handleAssign,
    // handleEdit,
    // handleDelete,

handleRequisitionChange,
requisitions,
positions,
selectedRequisition,
selectedPosition,
setSelectedPosition,
availablePanels,
setAvailablePanels,
updateCommitteeDate,

activeTab,
setActiveTab,
showHistory,
setShowHistory,
selectedCommittees,
setSelectedCommittees,
context,
setContext,
handleAssignCommittees,
panelErrors,
setPanelErrors





  };
};
