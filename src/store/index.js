import Vue from "vue";
import Vuex from "vuex";
import api from "../api/api";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    getBranches() {
      return api.getBranches();
    },

    updateBranchReservationStatus(context, { branchId, payload }) {
      return api.updateBranchReservationStatus(branchId, payload);
    },

    updateBranchReservationSetting(context, { branchId, payload }) {
      return api.updateBranchReservationSetting(branchId, payload);
    },
  },
});
