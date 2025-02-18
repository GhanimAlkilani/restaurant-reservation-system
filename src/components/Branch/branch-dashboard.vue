<template>
  <div>
    <fdcs-alert ref="Alert" />
    <b-navbar class="navColor" type="light" variant="light">
      <b-navbar-brand href="#">
        <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f37d-fe0f.svg"
          class="d-inline-block align-center imageLogo" alt="Restaurant Reservation">
        <strong>
          {{ this.local.title.branchDashboardTitle }}
        </strong>
      </b-navbar-brand>
      <b-navbar-nav align-right class="ml-auto">

      </b-navbar-nav>
    </b-navbar>
    <b-button @click="DisableReservation" class="disable">Disable Reservation</b-button>

    <div>

      <b-button @click="showModal" variant="light" class="addBranch">Add Branch</b-button>

      <b-table :fields="fieldsWithCheckbox" :items="acceptReservationsBranches" :busy="tableBusy" show-empty
        class="mt-3 cursorPointer" outlined @row-clicked="handleRowClick">
        <template #head(select)>
          <b-form-checkbox :indeterminate="isIndeterminate" :checked="selectAll"
            @change="toggleSelectAll"></b-form-checkbox>
        </template>
        <template #cell(select)="data">
          <b-form-checkbox v-model="data.item.selected" @change="updateSelectAllState"></b-form-checkbox>
        </template>

        <template #table-busy>
          <div class="text-center text-secondary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #empty="scope">
          <div>
            <h4>{{ scope.emptyText }}</h4>
          </div>
        </template>
      </b-table>
    </div>

    <fdcs-modal modal-title="Branches" :show-save-button="true" :modalShow="modalShow" size="md"
      :show-cancel-button="true" save-button-color="#5830c5" cancel-button-color="white" save-button-text-color="white"
      cancel-button-text-color="black" cancelBorderColor="black" ok-title="Save" cancel-title="Close" @save="handleSave"
      @cancel="handleCancel">
      <template v-slot:modalContent>
        <multi-dropdown v-model="selectedItems" :options="notAcceptReservationsBranches" text="Select Branches">
        </multi-dropdown>
      </template>
    </fdcs-Modal>

    <fdcs-modal :modal-title="`Edit ${this.selectedBranch?.name || ''} Reservation Settings`" :show-save-button="true"
      :modalShow="settingModalShow" size="md" :show-cancel-button="true" save-button-color="#440099"
      cancel-button-color="white" save-button-text-color="white" cancel-button-text-color="black"
      cancelBorderColor="black" ok-title="Save" cancel-title="Close" @save="handleSettingSave"
      @cancel="handleSettingCancel">
      <template v-slot:modalContent>
        <branch-setting :tables="selectedBranchTables" :formSetting="formSetting"
          @update-form-setting="updateFormSetting" />
      </template>
    </fdcs-Modal>


  </div>
</template>


<script>
import FdcsModal from '../shared/fdcs-modal.vue';
import MultiDropdown from '../shared/multi-dropdown.vue'
import BranchSetting from './branch-setting.vue'
import { mapActions } from 'vuex';
import FdcsAlert from '../shared/fdcs-alert.vue';


export default {
  components: {
    FdcsModal,
    MultiDropdown,
    BranchSetting,
    FdcsAlert,
  },

  data() {
    return {
      formSetting: {
        duration: null,
        tables: [],
        timeSlots: {
          Saturday: [],
          Sunday: [],
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
        },
      },
      tableBusy: false,
      selectAll: false,
      isIndeterminate: false,
      modalShow: false,
      settingModalShow: false,
      selectedBranch: null,
      totalNumberOfTables: 0,
      branchesDetails: [],
      acceptReservationsBranches: [],
      acceptReservationsBranchesIds: [],
      notAcceptReservationsBranches: [],
      selectedItems: [],
      selectedBranchTables: [],
      reservationSetting: [],
      fields: ['Branch', 'Reference', 'NumberOfTables', 'ReservationDuration'],
    }
  },
  computed: {
    fieldsWithCheckbox() {
      return [{ key: 'select', label: '' }, ...this.fields];
    },
  },

  mounted() {
    this.tableBusy = true;
    this.getBranchesDetails();
  },

  methods: {
    ...mapActions(['getBranches', 'updateBranchReservationStatus', 'updateBranchReservationSetting']),

    updateFormSetting(newFormSetting) {
      this.formSetting = { ...this.formSetting, ...newFormSetting };
    },
    saveReservationSetting() {
      if (!this.validateSaveSetting()) {
        return;
      }
      this.settingModalShow = false;
      const selectedBranchSetting = {
        reservation_duration: 0,
        reservation_times: {
          saturday: [],
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        },
      };
      selectedBranchSetting.reservation_duration = this.formSetting.duration;
      selectedBranchSetting.reservation_times = Object.keys(this.formSetting.timeSlots)
        .reduce((acc, day) => {
          acc[day.toLowerCase()] = this.formSetting.timeSlots[day]
            .map(slot => [this.formatTime(slot.start, 'HH:mm'), this.formatTime(slot.end, 'HH:mm')]);
          return acc;
        }, {});
      return this.updateReservationSetting(this.selectedBranch.id, selectedBranchSetting);
    },
    getBranchesDetails() {
      this.getBranches().then((res) => {
        if (res)
          this.branchesDetails = this.normalizeResponse(res);
        this.acceptReservationsBranches = this.branchesDetails
          .filter(item => item.accepts_reservations)
          .map(item => ({
            id: item.id,
            Branch: item.name,
            Reference: item.reference,
            NumberOfTables: this.getTotalNumberOfTables(item.id),
            ReservationDuration: item.reservation_duration
          }));
        this.notAcceptReservationsBranches = this.branchesDetails
          .filter(item => !item.accepts_reservations)
          .map(item => ({ ...item }));

      }).catch((error) => {
        this.$refs.Alert.showAlert(`${this.local.alertMessages.branchGettingFailed} (${error})`, 'error');
      }).finally(() => {
        this.tableBusy = false;
      });


    },
    updateReservationStatus(status) {
      if (!this.validateUpdateBranchReservationStatus()) {
        return;
      }
      this.modalShow = false;
      const payload = {
        accepts_reservations: status,
      };
      this.tableBusy = true;
      const reservationAccept = status;
      const promises = (reservationAccept ? this.selectedItems : this.acceptReservationsBranchesIds).map(branch =>
        this.$store.dispatch('updateBranchReservationStatus', { branchId: branch.id, payload })
      );
      Promise.all(promises)
        .then((results) => {
          results.forEach(result => {
            if (result && result.status === 200) {
              if (reservationAccept == true)
                this.$refs.Alert.showAlert(this.local.alertMessages.branchAdded, 'success');
              else
                this.$refs.Alert.showAlert(this.local.alertMessages.branchDisabled, 'success')
            } else {
              this.$refs.Alert.showAlert(`${this.local.alertMessages.branchUpdateFailed} (${result.statusText})`, 'error');

            }
          });
        })
        .catch((error) => {
          this.$refs.Alert.showAlert(`${this.local.alertMessages.branchUpdateFailed} (${error})`, 'error');
        }).finally(() => {
          this.resetData();
          this.getBranchesDetails();
        });
    },
    updateReservationSetting(branchId, payload) {
      this.tableBusy = true;
      this.$store.dispatch('updateBranchReservationSetting', { branchId, payload })
        .then((result) => {
          if (result && result.status === 200) {
            this.$refs.Alert.showAlert(this.local.alertMessages.settingUpdated, 'success')
          } else {
            this.$refs.Alert.showAlert(`${this.local.alertMessages.settingUpdatedFailed} (${result.statusText})`, 'error')
          }
        })
        .catch((error) => {
          this.$refs.Alert.showAlert(`${this.local.alertMessages.settingUpdatedFailed} (${error})`, 'error');

        }).finally(() => {
          this.resetData();
          this.getBranchesDetails();
        });
    },
    DisableReservation() {
      this.acceptReservationsBranchesIds = this.acceptReservationsBranches
        .filter(item => item.selected)
        .map(item => ({ id: item.id }));
      if (this.acceptReservationsBranchesIds.length === 0)
        this.$refs.Alert.showAlert(this.local.alertMessages.branchNotSelected, 'error')
      else
        this.updateReservationStatus(false)
    },
    getTotalNumberOfTables(branchId) {
      const branch = this.branchesDetails.find(s => s.id === branchId);
      if (!branch) {
        return 0;
      }
      const totalWorkingTables = branch.sections
        .reduce((sum, section) => {
          const workingTablesCount =
            section.tables.filter(table => table.accepts_reservations === true).length;
          return sum + workingTablesCount;
        }, 0);
      return totalWorkingTables;
    },
    setSelectedBranchDetails(selected) {
      this.selectedBranch = this.branchesDetails
        .find(item => item.accepts_reservations && item.id == selected.id)
      this.setSelectedBranchTables(this.selectedBranch);
    },
    setSelectedBranchTables(branch) {
      if (!branch) {
        return 0;
      }
      this.selectedBranchTables = branch.sections.flatMap(section =>
        section.tables
          .map(table => ({
            id: table.id,
            name: table.name
          }))
      );
    },
    showModal() {
      this.modalShow = true;
    },
    resetFormSetting() {
      this.formSetting.duration = null;
      this.formSetting.tables = [];
      Object.keys(this.formSetting.timeSlots).forEach((day) => {
        this.formSetting.timeSlots[day] = [];
      });
    },
    showSettingModal() {
      this.resetFormSetting()
      this.settingModalShow = true;
    },
    validateUpdateBranchReservationStatus() {
      if ((this.acceptReservationsBranchesIds.length || this.selectedItems.length) === 0) {
        return this.$refs.Alert.showAlert(this.local.alertMessages.branchNotSelected, 'error')
      }
      else
        return true;
    },
    handleSave() {
      this.updateReservationStatus(true)
      this.selectedItems = [];
    },
    handleCancel() {
      this.modalShow = false;
      this.selectedItems = [];
    },
    handleRowClick(item) {
      if (item.NumberOfTables === 0)
        return this.$refs.Alert.showAlert(this.local.alertMessages.noTablesAvailable, 'error')
      this.setSelectedBranchDetails(item);
      this.showSettingModal()
    },
    handleSettingCancel() {
      this.settingModalShow = false;
    },
    validateSaveSetting() {
      const isDurationEmpty = this.formSetting.duration === null;
      const hasAnyDayWithValue = Object.values(this.formSetting.timeSlots)
        .some(times => times.length > 0);
      const isTablesEmpty = this.formSetting.tables.length === 0;
      if (isDurationEmpty) {
        return this.$refs.Alert.showAlert(this.local.alertMessages.durationNotEntered, 'error');
      }
      if (isTablesEmpty) {
        return this.$refs.Alert.showAlert(this.local.alertMessages.tablesNotSelected, 'error')
      }
      if (!hasAnyDayWithValue) {
        return this.$refs.Alert.showAlert(this.local.alertMessages.timeNotEntered, 'error')
      }
      return true;
    },
    handleSettingSave() {
      this.saveReservationSetting();
    },
    normalizeResponse(response) {
      return response?.data?.data || [];
    },
    resetData() {
      this.acceptReservationsBranches = [];
      this.notAcceptReservationsBranches = [];
      this.acceptReservationsBranchesIds = [];
      this.branchesDetails = [];
      this.selectedItems = [];
      this.selectAll = false;
      this.isIndeterminate = false;
    },
    toggleSelectAll(checked) {
      this.selectAll = checked;
      this.isIndeterminate = false;
      this.acceptReservationsBranches.forEach((store) => (store.selected = checked));
    },
    updateSelectAllState() {
      const selectedCount = this.acceptReservationsBranches.filter((store) => store.selected).length;
      if (selectedCount === this.acceptReservationsBranches.length) {
        this.selectAll = true;
        this.isIndeterminate = false;
      } else if (selectedCount === 0) {
        this.selectAll = false;
        this.isIndeterminate = false;
      } else {
        this.selectAll = false;
        this.isIndeterminate = true;
      }
    },
  }
};
</script>


<style scoped>
.addBranch {
  float: right;
  margin: 10px;
}

.disable {
  float: right;
  margin: 10px;
  background-color: #5830c5;
  --bs-btn-hover-bg: #440099;
}

.cursorPointer {
  cursor: pointer;
}

.imageLogo {
  width: 50px;
  margin-left: 10px;
}

.navColor {
  border-color: #440099;
  border-bottom: 5px;
}

.navbar-expand {
  flex-wrap: nowrap;
  justify-content: flex-start;
}
</style>