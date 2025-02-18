import axios from "axios";
import { BEARER_TOKEN } from "../token/token"; // Import the token
import { setAuthToken } from "../auth/auth"; // Import setAuthToken

axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
setAuthToken(BEARER_TOKEN);

export default {
  getBranches: () =>
    axios.get(
      "/api/v5/branches?include[0]=sections&include[1]=sections.tables"
    ),
  updateBranchReservationStatus: (branchId, payload) => {
    return axios
      .put(`/api/v5/branches/${branchId}`, payload)
      .then((response) => {
        return response;
      });
  },
  updateBranchReservationSetting: (branchId, payload) => {
    return axios
      .put(`/api/v5/branches/${branchId}`, payload)
      .then((response) => {
        return response;
      });
  },
};
