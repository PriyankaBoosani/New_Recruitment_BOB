import { useState } from "react";

export default function useInterviewSchedule() {
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

  return {
    schedule,
    updateRow,
    setSchedule
  };
}
