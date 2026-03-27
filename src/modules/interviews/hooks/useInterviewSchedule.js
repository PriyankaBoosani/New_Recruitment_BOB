import { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
export default function useInterviewSchedule() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const urlRequisitionId = urlParams.get('requisitionId');
  const urlPositionId = urlParams.get('positionId');
  const urlCandidateIds = urlParams.get('candidateIds');


  //new
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);

  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [loadingPositions, setLoadingPositions] = useState(false);

  const [schedule, setSchedule] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      regNo: "961344689",
      date: "",
      time: "",
      zone: "",
      panel: ""
    },
    {
      id: 2,
      name: "Priya Sharma",
      regNo: "961967129",
      date: "",
      time: "",
      zone: "",
      panel: ""
    },
    {
      id: 3,
      name: "Amit Patel",
      regNo: "961963464",
      date: "",
      time: "",
      zone: "",
      panel: ""
    }
  ]);

  const updateRow = (id, field, value) => {
    setSchedule(prev =>
      prev.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };


  
  //new functions
    const fetchRequisitions = async (searchText = "") => {
    setLoadingRequisitions(true);
    try {
      const res = await jobPositionApiService.getRequisitions(searchText);
      setRequisitions(res?.data || []);
    } catch (err) {
      console.error("Failed to load requisitions", err);
    } finally {
      setLoadingRequisitions(false);
    }
  };

    useEffect(() => {
      fetchRequisitions("");
    }, []);
  
   useEffect(() => {
    if (!selectedRequisitionId) {
      setPositions([]);
      setSelectedPositionId("");
      return;
    }

    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const res = await jobPositionApiService.getPositionsByReqId({
          requisitionId: selectedRequisitionId,
        });
        setPositions(res?.data || []);
      } catch (err) {
        console.error("Failed to load positions", err);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [selectedRequisitionId]);

  // Handle URL parameters for auto-population
  useEffect(() => {
    if (urlRequisitionId) {
      setSelectedRequisitionId(urlRequisitionId);
    }
  }, [urlRequisitionId]);

  useEffect(() => {
    if (urlPositionId) {
      setSelectedPositionId(urlPositionId);
    }
  }, [urlPositionId, selectedRequisitionId]); // Wait for positions to be loaded



   const handleRequisitionChange = async (e) => {
    const reqId = e.target.value;

    setSelectedRequisitionId(reqId);
  

    if (!reqId) {
      setPositions([]);
      return;
    }

    try {
      setLoadingPositions(true);

      const res = await jobPositionApiService.getPositionsByReqId({
        requisitionId: reqId,
      });

      setPositions(res?.data || []);
    } catch (err) {
      console.error("Failed to load positions", err);
      setPositions([]);
    } finally {
      setLoadingPositions(false);
    }
  };

  return {
    schedule,
    updateRow,
    setSchedule,
    requisitions,
    selectedRequisitionId,
    loadingRequisitions,
    positions,
    selectedPositionId,
    loadingPositions,
    handleRequisitionChange,
    setSelectedPositionId,
    urlRequisitionId,
    urlPositionId,
    urlCandidateIds
  };
}
