import { useEffect, useState, useCallback } from "react";
import jobPositionApiService from "../services/jobPositionApiService";

export const useJobPositionById = (positionId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
//const res = await jobPositionApiService.getPositionById(positionId);
  const fetchPosition = useCallback(async () => {
  if (!positionId) return;

  setLoading(true);

  try {
    // ✅ MOCK RESPONSE (no API call)
    const res = {
  "success": true,
  "message": "Job Positions Fetched Successfully",
  "data": {
  "requisitionId": "a57a0f14-aa5c-4cec-b136-7fdcd99fac3a",
  "deptId": "a25c3eb9-abec-4fe3-bff8-7a0d2620add6",
  "masterPositionId": "96e7f202-4339-4664-ac67-269d5ba5d306",
  "totalVacancies": 2,
  "eligibilityAgeMin": 27,
  "eligibilityAgeMax": 37,
  "employmentType": "ca12b10b-8ea5-4982-9f20-840a6e598f5c",
  "gradeId": "bc247a02-d7fc-4e3d-b3a4-9a46bbdca3a6",
  "cutOffDate": "2026-04-30",
  "contractYears": 0,
  "isLocationPreferenceEnabled": false,
  "isLocationWise": false,
  "mandatoryEducation": "Education Requirements:\n(Full Time Any Graduation AND Full Time Arts & Humanities PhD)\nOR\n(Full Time Any Post-Graduation [Duration: 5, GPA: 9.3, %: 96])\nCertifications: (Certified Chief Information Security Officer AND Certified Information Security Manager)",
  "preferredEducation": "",
  "mandatoryEduRulesJson": {
    "mandatoryEducations": {
      "operator": "OR",
      "groups": [
        {
          "operator": "AND",
          "conditions": [
            {
              "educationType": "c8e82c05-d5ab-41bf-a1da-43e2787d9886",
              "qualification": "18bf2a23-302e-45ac-8ea5-784dd5e0cd88",
              "specialization": "",
              "duration": "",
              "gpa": "",
              "percentage": ""
            },
            {
              "educationType": "c8e82c05-d5ab-41bf-a1da-43e2787d9886",
              "qualification": "6f18a9fa-388d-4a8f-ba49-d5be5014cc7e",
              "specialization": "",
              "duration": "",
              "gpa": "",
              "percentage": ""
            }
          ]
        },
        {
          "operator": "AND",
          "conditions": [
            {
              "educationType": "c8e82c05-d5ab-41bf-a1da-43e2787d9886",
              "qualification": "02d4d088-1230-44ec-bb11-5611a1d9636c",
              "specialization": "",
              "duration": "5",
              "gpa": "9.3",
              "percentage": "96"
            }
          ]
        }
      ]
    },
    "mandatoryCertificationIds": {
      "operator": "OR",
      "groups": [
        {
          "operator": "AND",
          "conditions": [
            "f974ba71-0a4a-47e3-a3f2-e6c6107acc7e",
            "7f4eb351-5f03-46c7-92d5-f8f000608aad"
          ]
        }
      ]
    }
  },
  "preferredEduRulesJson": {
    "preferredEducations": {
      "operator": "OR",
      "groups": []
    },
    "preferredCertifications": {
      "operator": "OR",
      "groups": []
    }
  },
  "isMandatoryExpMonthsEduWise": true,
  "isPreferredExpMonthsEduWise": false,
  "mandatoryEducationLevelExperiences": {
    "58166d28-dbcc-447c-9fc7-ad4d56a87560": 13
  },
  "preferredEducationLevelExperiences": {},
  "mandatoryExperienceMonths": null,
  "preferredExperienceMonths": 25,
  "mandatoryExperience": "Minimum -06- Year experience in software development.",
  "preferredExperience": "Minimum -06- Year experience in software development.",
  "rolesResponsibilities": "NA",
  "isMedicalRequired": true,
  "approvedBy": "bdd7b6af-bb14-42c2-847c-8bdb2741a8f4",
  "approvedOn": "2026-04-09",
  "indentOthers": null,
  "cibilScore": 0,
  "positionStatus": "Draft",
  "positionRequiredDocuments": [],
  "positionStateDistributions": [],
  "positionCategoryNationalDistributions": [
    {
      "reservationCategoryId": "69bf3f47-2cf9-4e0d-90a9-2e77a1752b6b",
      "disabilityCategoryId": null,
      "vacancyCount": 1,
      "isDisability": false
    },
    {
      "reservationCategoryId": "29bd3e88-cbd3-4d68-b4aa-e8a86865715d",
      "disabilityCategoryId": null,
      "vacancyCount": 1,
      "isDisability": false
    }
  ]

}
};

    // ✅ CORRECT
    setData(res.data);

  } catch (e) {
    console.error("Failed to fetch position", e);
  } finally {
    setLoading(false);
  }
}, [positionId]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  return {
    data,
    loading,
    refetch: fetchPosition, // 🔑 THIS IS WHAT YOU WERE MISSING
  };
};
