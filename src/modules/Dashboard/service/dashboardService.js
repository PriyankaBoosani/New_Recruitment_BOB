import { api } from "../../../core/service/apiService";

const dashboardService = {
  getDashboardFilters: () =>
    api.get("/recruiter/dashboard/filters"),

  getDashboardDetails: (payload) =>
    api.post("/recruiter/dashboard/details", payload),
};

export default dashboardService;