<template>
    <b-form-group :label="title" label-for="time-slots">

        <div v-if="localTimeSlots.length < 3" class="d-flex align-items-center mt-2">
            <b-form-timepicker v-model="newTimeSlot.start" required locale="en-GB"
                :show-seconds="false"></b-form-timepicker>
            <span class="mx-2">-</span>
            <b-form-timepicker v-model="newTimeSlot.end" required locale="en-GB"
                :show-seconds="false"></b-form-timepicker>

            <span class="add-time" @click="addTimeSlot">
                <b-icon icon="plus-square" scale="1.5" variant="secondary"></b-icon>
            </span>
        </div>
        <div class="d-flex flex-wrap">
            <div v-for="(slot, index) in localTimeSlots" :key="index" class="time-slot-box position-relative mr-3 mb-3">
                <span>{{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}</span>
                <span class="remove-option" @click="removeTimeSlot(index)">
                    &#10005;
                </span>
            </div>
        </div>
    </b-form-group>
</template>



<script>
export default {
    props: {
        value: Array,
        title: {
            type: String,
            default: ''
        },
    },

    data() {
        return {
            newTimeSlot: {
                start: null,
                end: null,
            },
        };
    },
    computed: {
        localTimeSlots: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit('input', newValue);
            },
        },
    },
    watch: {
        localTimeSlots: {
            handler(newVal) {
                this.$emit('input', newVal);
            },
            deep: true,
        },
        'newTimeSlot.start'(newVal) {
            if (newVal) {
                const formattedTime = this.formatTime(newVal);
                this.$emit('update:start', formattedTime);
            }
        },
    },
    methods: {
        formatTimeData(time) {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        addTimeSlot() {
            if (this.localTimeSlots.length < 3 && this.newTimeSlot.start && this.newTimeSlot.end) {
                this.localTimeSlots.push({
                    start: this.newTimeSlot.start,
                    end: this.newTimeSlot.end,
                });
                this.newTimeSlot.start = null;
                this.newTimeSlot.end = null;
            }
        },
        removeTimeSlot(index) {
            this.localTimeSlots.splice(index, 1);
        },
        formatTime(time) {
            return time ? time.slice(0, 5) : '--:--';
        },
    },
};
</script>


<style scoped>
.time-slot-box {
    display: inline-block;
    background-color: #f8f9fa;
    padding: 5px 5px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    position: relative;
    min-width: 120px;
    text-align: center;
    margin: 12px;
}

.close-button {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: none;
    color: red;
    font-size: 18px;
    cursor: pointer;
}

.remove-option {
    cursor: pointer;
    font-size: 14px;
    color: #d32f2f;
    padding-left: 5px;
}

.add-time {
    cursor: pointer;
    margin-left: 15px;
}
</style>