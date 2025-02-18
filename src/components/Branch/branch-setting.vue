<template>
    <b-container class="menu">
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Duration" label-for="duration">
                <b-form-input id="duration" type="number" v-model.number="localFormSetting.duration"
                    @input="emitFormSetting" required></b-form-input>
            </b-form-group>
            <div class="dropDown">

                <multi-dropdown :options="tables" @tables-selected="handleTableSelection" text="Select Tables">
                </multi-dropdown>

            </div>
            <label>Add Abailable Reservation Times</label>
            <div style="float: right; margin:-5px">
                <span class="applyAllBtn" @click="applyToAll()">Apply on all days</span>
            </div>
            <div v-for="(day, index) in workdays" :key="index" class="custom-label-class">
                <reservation-time-slot v-model="localFormSetting.timeSlots[day.name]" :title="day.name"
                    @input="emitFormSetting" />
            </div>
        </b-form>
    </b-container>
</template>

<script>
import ReservationTimeSlot from './reservation-time-slot.vue';
import MultiDropdown from '../shared/multi-dropdown.vue';

export default {
    components: { MultiDropdown, ReservationTimeSlot },
    props: {
        tables: Array,
        formSetting: Object,
    },
    data() {
        return {
            workdays: [
                { name: 'Saturday' },
                { name: 'Sunday' },
                { name: 'Monday' },
                { name: 'Tuesday' },
                { name: 'Wednesday' },
                { name: 'Thursday' },
                { name: 'Friday' }
            ],

            newTimeSlot: {
                start: null,
                end: null,
            },
            localFormSetting: { ...this.formSetting },

        };
    },

    methods: {
        handleTableSelection(selectedTables) {
            this.localFormSetting.tables = selectedTables;
            this.emitFormSetting();
        },
        emitFormSetting() {
            this.$emit('update-form-setting', this.localFormSetting);
        },
        applyToAll() {
            const saturdayTimeSlots = this.localFormSetting.timeSlots['Saturday'];
            this.workdays.forEach(day => {
                this.$set(this.localFormSetting.timeSlots, day.name, [...saturdayTimeSlots]);
            });
        }
    },
};
</script>
<style scoped>
.custom-label-class {
    font-weight: 300;
}

.remove-option {
    cursor: pointer;
    font-size: 14px;
    color: #d32f2f;
    padding-left: 5px;
}

.menu {
    max-height: 400px !important;
    overflow-y: auto !important;
}

.dropDown {
    margin-top: 15px;
    margin-bottom: 15px;
}

.applyAllBtn {
    cursor: pointer;
    color: #440099
}
</style>