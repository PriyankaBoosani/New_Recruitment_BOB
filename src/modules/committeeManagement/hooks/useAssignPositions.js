import { useState, useEffect } from "react";
import "../../../style/css/Committee.css";

export const useAssignPositions = (userId) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    requisitionId: "",
    positionId: "",
    panelType: "",
    members: []
  });

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API calls
        // const res = await masterApiService.getCommitteeAssignments();
        // setHistory(res.data || []);
        
        // Mock data
        setHistory([
          {
            id: 1,
            requisitionCode: 'REQ-2023-001',
            positionName: 'Senior Software Engineer',
            panelType: 'Technical Interview',
            members: ['John Doe', 'Jane Smith'],
            assignedDate: '2023-06-15T10:30:00',
            updatedDate: '2023-06-15T10:30:00'
          }
        ]);
      } catch (error) {
        console.error('Error fetching committee assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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

  const handleEdit = (item) => {
    // Set form data for editing
    setFormData({
      requisitionId: item.requisitionId || "",
      positionId: item.positionId || "",
      panelType: item.panelType || "",
      members: item.members || []
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return false;
    }
    
    try {
      setLoading(true);
      // Replace with actual API call
      // await masterApiService.deleteCommitteeAssignment(id);
      
      // Update local state
      setHistory(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      return false;
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
    handleEdit,
    handleDelete
  };
};
