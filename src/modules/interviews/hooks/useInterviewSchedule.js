import { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import interviewService from "../services/interviewService";
import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";
import masterApiService from "../../master/services/masterApiService";
export default function useInterviewSchedule() {

  const navigate = useNavigate();

const location = useLocation();
  // Parse URL parameters

const passedCandidates = location.state?.candidates || [];
const requisitionId = location.state?.requisitionId || "";
const positionId = location.state?.positionId || "";

  //new
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState("");
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);

  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [loadingPositions, setLoadingPositions] = useState(false);
const [schedule, setSchedule] = useState([]);
const [scheduleApiData, setScheduleApiData] = useState([]);

const [allInterviewCentres, setAllInterviewCentres] = useState([]);

  const updateRow = (id, field, value) => {
    setSchedule(prev =>
      prev.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  console.log("passedcandidates",passedCandidates)


  
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

      const fetchCentres = async () => {
        const centreRes = await masterApiService.getAllInterviewCenters();
        console.log("centreRes", centreRes?.data)

         if (centreRes?.data) {

          const zonalOfficeCentres =
            centreRes.data.filter(
              c => c.organizationType === "Zonal Office"
            );

          setAllInterviewCentres(zonalOfficeCentres);
        }
      };
      
      fetchCentres();
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
    if (requisitionId) {
      setSelectedRequisitionId(requisitionId);
    }
  }, [requisitionId]);

useEffect(() => {
  if (positionId && positions.length > 0) {
    setSelectedPositionId(positionId);
  }
  
}, [positionId, positions]);



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


useEffect(() => {
  if (passedCandidates.length > 0) {
    const formatted = passedCandidates.map((c, index) => ({
      id: c.id,
      name: c.name,
      regNo: c.regNo,
      date: "",
      time: "",
      zone: "",
      panel: ""
    }));

    setSchedule(formatted);
  }
}, [passedCandidates]);

const formatTime = (time) => {
  
  if (!time) return "00:00:00";
  return time.length === 5 ? `${time}:00` : time;
}
const formatTimeRange = (startStr, endStr) => {
  if (!startStr) return "";

  const format = (time) => {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const start = format(startStr);
  const end = endStr ? format(endStr) : "";

  return end ? `${start} - ${end}` : start;
};


const applySchedule = async ({ selectedPanels,positionId, candidates = passedCandidates, zonalChangeMap = {} }) => {
  try {
    console.log("selectedPanels",selectedPanels)
   // console.log("FINAL TIME SENT 👉", formatTime(startTime));
   console.log("zonalChangeMap", zonalChangeMap);
    // ✅ Build payload
    // const payload = {
    //   schedulingPanelModel: {
    //     applicationIds: passedCandidates.map(c => c.id),
    //     positionId
    //   },
    //   panelScheduleModelList: selectedPanels.flatMap(panel =>
    //     (panel.slots || []).map(slot => ({
    //       panelId: panel.id,
    //       panelDate: slot.date,
    //       interviewPerDay: Number(slot.perDay),
    //       startTime: formatTime(startTime)   // 🔥 IMPORTANT FIX
    //     }))
    //   )
    // };


    
const updatedZonalChangeMap = {};

// add all centres
candidates.forEach((candidate) => {

  const centreId = candidate.interviewCenterId;

  updatedZonalChangeMap[centreId] =
    zonalChangeMap[centreId] || centreId;

});

   const payload = {

  schedulingPanelModel: {

    applicationIds:
      candidates.map(c => c.id),

    positionIds: positionId

  },

  panelScheduleModelList:

  selectedPanels

    ? selectedPanels.flatMap(panel =>

        (panel.slots || []).map(slot => ({

          panelId: panel.id,

          panelDate: slot.date,

          interviewPerDay:
            Number(slot.perDay),

          startTime:
            formatTime(slot.startTime),

          endTime:
            formatTime(slot.endTime),

          durationInMinutes:
            Number(slot.duration)

        }))

      )

    : [],

  zonalChangeMap: updatedZonalChangeMap
};
    console.log("FINAL PAYLOAD 👉", payload);//return false;

    // ✅ Call API
   const res = await interviewService.allocatePanels(payload);
   console.log("data12345",res.data);
    if (!res?.success) {
      return { success: false, message: res.data };
    }
    setScheduleApiData(res.data);   // 🔥 IMPORTANT

    // ✅ Convert response → table rows
    const rows = res.data.map(item => {
      const start = item.interviewScheduleStaging?.interviewStartAt;
       const end = item.interviewScheduleStaging?.interviewEndAt;

      return {
        id: item.application?.id,
        name: item.fullName,
        regNo: item.application?.applicationNo,
        date: formatDateDDMMYYYY(start?.split("T")[0]) || "-",
        time: formatTimeRange(start, end),
        zone: item.interviewCentres?.zone,
        panel: item.interviewPanels?.panelName
      };
    });

    // ✅ Update table
    setSchedule(rows);

    return { success: true, rows };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

const scheduleInterview = async () => {
  try {
//console.log("scheduleApiData", scheduleApiData);return false;
    const res = await interviewService.scheduleInterview(scheduleApiData);

    if (!res?.success) {
      return { success: false, message: res.message };
    }

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to schedule interviews" };
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
    requisitionId,
    positionId,
    passedCandidates,
    applySchedule,
    scheduleApiData,
    scheduleInterview,
    allInterviewCentres
  };
}
