import { nodeApi } from "../../../core/service/apiService";

const committeeManagementService = {
  getAllusers: () =>
    nodeApi.get(
      `/getdetails/users/all`
    ),


};

export default committeeManagementService;
