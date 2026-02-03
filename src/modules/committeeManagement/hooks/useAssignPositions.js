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
const [availablePanels, setAvailablePanels] = useState([]);


useEffect(() => {
  fetchRequisitions();
  fetchPanels();
}, []);

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

      const res = await masterApiService.getInterviewPanels();
      console.log("RES 👉", res);
      const apiData = res || [];
      const mapped = mapPanelsApi(apiData);
      console.log("MAPPED 👉", mapped);
      setAvailablePanels(mapped);

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

  const payloads = [];

  Object.values(selectedCommittees).forEach((panels, index) => {
    panels.forEach((panel, seqIndex) => {
      payloads.push({
        positionId: selectedPosition,

        interviewPanels: {
          panelName: panel.name,
          description: panel.description || "",
          committee: {
            committeeName: panel.committeeName,
            committeeDesc: panel.committeeDesc || "",
            interviewCommitteeId: panel.interviewCommitteeId
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
        sequenceNo: seqIndex
      });
    });
  });

  console.log("PAYLOADS 👉", payloads);

  try {
    setLoading(true);

    for (const payload of payloads) {
      await committeeManagementService.assignPanelToPosition(payload);
    }

    toast.success("Committees assigned successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to assign committees");
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
handleAssignCommittees





  };
};
