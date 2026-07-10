import api from "../../../services/api";

const getCandidates = (payload) =>
  api.post(
    "/candidate-screening/get-candidate-details",
    payload
  );

export default {
  getCandidates,
};