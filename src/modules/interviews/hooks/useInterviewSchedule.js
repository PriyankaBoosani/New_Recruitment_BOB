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
          setAllInterviewCentres(centreRes.data);
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
   const payload = {

  schedulingPanelModel: {

    applicationIds:
      candidates.map(c => c.id),

    positionIds: [positionId]

  },

  panelScheduleModelList:
    selectedPanels.flatMap(panel =>

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

    ),

  zonalChangeMap
};
    console.log("FINAL PAYLOAD 👉", payload);

    // ✅ Call API
   const res = await interviewService.allocatePanels(payload);

//     const res={
//   "success": true,
//   "message": "Interview Schedulings created successfully",
//   "data": [
//     {
//       "fullName": "Ananya Singh",
//       "application": {
//         "createdDate": "2026-05-08T10:48:58.223521",
//         "modifiedDate": "2026-05-08T12:46:45.488859",
//         "id": "f38f0213-ec04-406e-bcfe-9ef2f15297de",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T10:48:58.113474",
//         "updatedDate": null,
//         "candidateId": "8919ef9e-7eb6-45e3-8dd8-c345f838ccf7",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000595",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "f38f0213-ec04-406e-bcfe-9ef2f15297de",
//         "candidateId": "8919ef9e-7eb6-45e3-8dd8-c345f838ccf7",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T09:00:00",
//         "interviewEndAt": "2026-05-11T09:15:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "HYDERABAD,ZO HYDERABAD",
//         "organizationType": "Zonal Office",
//         "zone": "HYDERABAD,ZO HYDERABAD",
//         "zonalStateId": "485a56f5-ea9d-41b2-88c1-954b80640770",
//         "alpha": "ZOHYDE",
//         "interviewCentreId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9"
//       }
//     },
//     {
//       "fullName": "Amelia Ram Miller",
//       "application": {
//         "createdDate": "2026-05-08T13:05:33.737672",
//         "modifiedDate": "2026-05-08T13:09:24.664964",
//         "id": "abb77c05-97b8-495d-9b47-5ccd4b2bc221",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T13:05:33.736672",
//         "updatedDate": null,
//         "candidateId": "a9fccf63-50de-4dc9-ad52-7ce0e2f61875",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000597",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "abb77c05-97b8-495d-9b47-5ccd4b2bc221",
//         "candidateId": "a9fccf63-50de-4dc9-ad52-7ce0e2f61875",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T09:15:00",
//         "interviewEndAt": "2026-05-11T09:30:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "HYDERABAD,ZO HYDERABAD",
//         "organizationType": "Zonal Office",
//         "zone": "HYDERABAD,ZO HYDERABAD",
//         "zonalStateId": "485a56f5-ea9d-41b2-88c1-954b80640770",
//         "alpha": "ZOHYDE",
//         "interviewCentreId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9"
//       }
//     },
//     {
//       "fullName": "John Doe",
//       "application": {
//         "createdDate": "2026-05-08T13:03:54.53576",
//         "modifiedDate": "2026-05-08T13:10:18.32538",
//         "id": "ebe791c4-1d41-4db9-9981-f00c50ea9a7b",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T13:03:54.53576",
//         "updatedDate": null,
//         "candidateId": "3b9cf1fc-e0fb-4b98-957f-a5ea60f81c8a",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000596",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "ebe791c4-1d41-4db9-9981-f00c50ea9a7b",
//         "candidateId": "3b9cf1fc-e0fb-4b98-957f-a5ea60f81c8a",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T09:30:00",
//         "interviewEndAt": "2026-05-11T09:45:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "HYDERABAD,ZO HYDERABAD",
//         "organizationType": "Zonal Office",
//         "zone": "HYDERABAD,ZO HYDERABAD",
//         "zonalStateId": "485a56f5-ea9d-41b2-88c1-954b80640770",
//         "alpha": "ZOHYDE",
//         "interviewCentreId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9"
//       }
//     },
//     {
//       "fullName": "Allvar Mahesh",
//       "application": {
//         "createdDate": "2026-05-07T16:01:07.089747",
//         "modifiedDate": "2026-05-08T13:11:29.777276",
//         "id": "ede93cac-74ff-494a-9787-e45e253660f0",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-07T16:01:07.089613",
//         "updatedDate": null,
//         "candidateId": "cc919748-6d36-4e74-99e3-52bb4007a77f",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000593",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "ede93cac-74ff-494a-9787-e45e253660f0",
//         "candidateId": "cc919748-6d36-4e74-99e3-52bb4007a77f",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T09:45:00",
//         "interviewEndAt": "2026-05-11T10:00:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "0298bfcd-3506-42fd-99ee-550a6dcc1808",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "AHMEDABAD,ZO AHMEDABAD",
//         "organizationType": "Zonal Office",
//         "zone": "AHMEDABAD,ZO AHMEDABAD",
//         "zonalStateId": "209c288a-a051-4219-a96b-c3e5d3788813",
//         "alpha": "ZONGUJ",
//         "interviewCentreId": "0298bfcd-3506-42fd-99ee-550a6dcc1808"
//       }
//     },
//     {
//       "fullName": "Vamshi Krishna V",
//       "application": {
//         "createdDate": "2026-05-08T20:17:36.746279",
//         "modifiedDate": "2026-05-08T20:59:39.99312",
//         "id": "8cb6fe84-3abc-4c4e-82be-0a1df05af2ed",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:17:36.746125",
//         "updatedDate": null,
//         "candidateId": "6db04b78-5f36-4ac0-be5a-f7df2885b3c6",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000600",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "8cb6fe84-3abc-4c4e-82be-0a1df05af2ed",
//         "candidateId": "6db04b78-5f36-4ac0-be5a-f7df2885b3c6",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T10:00:00",
//         "interviewEndAt": "2026-05-11T10:15:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "HYDERABAD,ZO HYDERABAD",
//         "organizationType": "Zonal Office",
//         "zone": "HYDERABAD,ZO HYDERABAD",
//         "zonalStateId": "485a56f5-ea9d-41b2-88c1-954b80640770",
//         "alpha": "ZOHYDE",
//         "interviewCentreId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9"
//       }
//     },
//     {
//       "fullName": "Priyanka Bhusani",
//       "application": {
//         "createdDate": "2026-05-08T20:35:50.939516",
//         "modifiedDate": "2026-05-08T21:03:16.229506",
//         "id": "ee11f189-6eb5-4746-ac72-0c5c3d178e5c",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:35:50.939183",
//         "updatedDate": null,
//         "candidateId": "9ad69959-af28-4969-8e70-95c1d4bc38d2",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000605",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "ee11f189-6eb5-4746-ac72-0c5c3d178e5c",
//         "candidateId": "9ad69959-af28-4969-8e70-95c1d4bc38d2",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T10:15:00",
//         "interviewEndAt": "2026-05-11T10:30:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "99d45f93-3c24-469b-97ec-a90ca3170c85",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "BENGALURU,ZO BENGALURU",
//         "organizationType": "Zonal Office",
//         "zone": "BENGALURU,ZO BENGALURU",
//         "zonalStateId": "fece53f3-f85c-49dc-89b1-ed146d4115a2",
//         "alpha": "ZOAPKA",
//         "interviewCentreId": "99d45f93-3c24-469b-97ec-a90ca3170c85"
//       }
//     },
//     {
//       "fullName": "Abhi Ram",
//       "application": {
//         "createdDate": "2026-05-08T20:30:01.208918",
//         "modifiedDate": "2026-05-08T21:01:38.486185",
//         "id": "8c0338af-9649-4378-bc44-07ff1f191c14",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:30:01.20872",
//         "updatedDate": null,
//         "candidateId": "a8914816-509a-4d03-bf2d-e4ad19ebbe02",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000602",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "8c0338af-9649-4378-bc44-07ff1f191c14",
//         "candidateId": "a8914816-509a-4d03-bf2d-e4ad19ebbe02",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T10:30:00",
//         "interviewEndAt": "2026-05-11T10:45:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "HYDERABAD,ZO HYDERABAD",
//         "organizationType": "Zonal Office",
//         "zone": "HYDERABAD,ZO HYDERABAD",
//         "zonalStateId": "485a56f5-ea9d-41b2-88c1-954b80640770",
//         "alpha": "ZOHYDE",
//         "interviewCentreId": "8912951c-0adf-4696-a6d8-db8fe5e5c9d9"
//       }
//     },
//     {
//       "fullName": "Vamshi Krishna V",
//       "application": {
//         "createdDate": "2026-05-08T20:34:47.069633",
//         "modifiedDate": "2026-05-08T21:02:27.166629",
//         "id": "35a1c38e-b825-4cfe-a44f-68418929e182",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:34:47.069512",
//         "updatedDate": null,
//         "candidateId": "11ab5fd4-15a0-4073-bed5-465f29f1cb80",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000604",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "35a1c38e-b825-4cfe-a44f-68418929e182",
//         "candidateId": "11ab5fd4-15a0-4073-bed5-465f29f1cb80",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T10:45:00",
//         "interviewEndAt": "2026-05-11T11:00:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "99d45f93-3c24-469b-97ec-a90ca3170c85",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "BENGALURU,ZO BENGALURU",
//         "organizationType": "Zonal Office",
//         "zone": "BENGALURU,ZO BENGALURU",
//         "zonalStateId": "fece53f3-f85c-49dc-89b1-ed146d4115a2",
//         "alpha": "ZOAPKA",
//         "interviewCentreId": "99d45f93-3c24-469b-97ec-a90ca3170c85"
//       }
//     },
//     {
//       "fullName": "sai Krishna D",
//       "application": {
//         "createdDate": "2026-05-08T20:32:25.483619",
//         "modifiedDate": "2026-05-08T21:00:31.188736",
//         "id": "b5ddb263-7090-421a-b208-2a6321d83f48",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:32:25.483492",
//         "updatedDate": null,
//         "candidateId": "0e998417-fcd4-429a-82f4-6a010179660b",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000603",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "b5ddb263-7090-421a-b208-2a6321d83f48",
//         "candidateId": "0e998417-fcd4-429a-82f4-6a010179660b",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T11:00:00",
//         "interviewEndAt": "2026-05-11T11:15:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "99d45f93-3c24-469b-97ec-a90ca3170c85",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "BENGALURU,ZO BENGALURU",
//         "organizationType": "Zonal Office",
//         "zone": "BENGALURU,ZO BENGALURU",
//         "zonalStateId": "fece53f3-f85c-49dc-89b1-ed146d4115a2",
//         "alpha": "ZOAPKA",
//         "interviewCentreId": "99d45f93-3c24-469b-97ec-a90ca3170c85"
//       }
//     },
//     {
//       "fullName": "Harsha Tatapudi",
//       "application": {
//         "createdDate": "2026-05-08T20:36:50.839216",
//         "modifiedDate": "2026-05-08T20:58:48.823023",
//         "id": "bcb1abde-6902-4a9a-95cc-5d86634db0f9",
//         "applicationStatus": "SCHEDULED",
//         "applicationDate": "2026-05-08T20:36:50.839055",
//         "updatedDate": null,
//         "candidateId": "ffaa70f7-a13d-4ae9-ba2e-f00868495153",
//         "positionId": "c0d98aee-556e-45ac-adb6-e1370cfe4daa",
//         "applicationNo": "APP-2026-000606",
//         "isAbsent": false,
//         "statusReason": null,
//         "paymentStatus": "SUCCESS"
//       },
//       "interviewSchedule": {
//         "interviewScheduleId": null,
//         "applicationId": "bcb1abde-6902-4a9a-95cc-5d86634db0f9",
//         "candidateId": "ffaa70f7-a13d-4ae9-ba2e-f00868495153",
//         "panelId": "93b59192-13b9-4832-8a3b-f5c31149b18a",
//         "interviewStartAt": "2026-05-11T11:15:00",
//         "interviewEndAt": "2026-05-11T11:30:00",
//         "interviewDurationMinutes": 15,
//         "meetingLink": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA0YWIyN2ItNGJmNS00MjcwLWE2NzctMGViNDMwMzNkNzcx%40thread.v2/0?context=%7b%22Tid%22%3a%224cd7fc36-b4ef-4723-a374-ef6697059338%22%2c%22Oid%22%3a%2265d36c21-7c27-43e3-95d1-3defa82fd3da%22%7d",
//         "zonalOfficeId": "99d45f93-3c24-469b-97ec-a90ca3170c85",
//         "finalScore": null,
//         "interviewStatus": "SCHEDULED",
//         "zonalVerificationStatus": "PENDING",
//         "zonalSubmitBeforeDate": null,
//         "zonalHrComments": null,
//         "createdDate": null,
//         "modifiedDate": null
//       },
//       "interviewPanels": {
//         "createdDate": "2026-05-05T12:29:59.107194",
//         "modifiedDate": "2026-05-05T12:29:59.107194",
//         "panelName": "May05InterviewPanel",
//         "description": "",
//         "committee": {
//           "createdDate": null,
//           "modifiedDate": null,
//           "committeeName": null,
//           "committeeDesc": null,
//           "interviewCommitteeId": "816cf3c2-8a37-41b3-b449-b3a5fa4a3481"
//         },
//         "panelMembers": null,
//         "interviewPanelId": "93b59192-13b9-4832-8a3b-f5c31149b18a"
//       },
//       "interviewCentres": {
//         "createdDate": null,
//         "modifiedDate": null,
//         "interviewCentre": "BENGALURU,ZO BENGALURU",
//         "organizationType": "Zonal Office",
//         "zone": "BENGALURU,ZO BENGALURU",
//         "zonalStateId": "fece53f3-f85c-49dc-89b1-ed146d4115a2",
//         "alpha": "ZOAPKA",
//         "interviewCentreId": "99d45f93-3c24-469b-97ec-a90ca3170c85"
//       }
//     }
//   ]
// }

  //  const res=

    if (!res?.success) {
      return { success: false, message: res.data };
    }
    setScheduleApiData(res.data);   // 🔥 IMPORTANT

    // ✅ Convert response → table rows
    const rows = res.data.map(item => {
      const start = item.interviewSchedule?.interviewStartAt;
       const end = item.interviewSchedule?.interviewEndAt;

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
