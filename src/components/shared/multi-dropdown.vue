<template>
    <div>
        <b-dropdown class="mb-2 w-100 custom-dropdown" :text="text" required menu-class="w-100" variant="light">
            <div class="menu">
                <b-dropdown-item v-for="(option, index) in options" :key="index" @click="toggleSelection(option)">
                    <b-form-checkbox v-model="selectedOptions" :value="option">
                        {{ option.name }}
                    </b-form-checkbox>
                </b-dropdown-item>
            </div>
        </b-dropdown>

        <div v-if="selectedOptions.length && showSelected" class="selected-options-container">
            <div v-for="(option, index) in selectedOptions" :key="index" class="selected-option">
                <span class="option-text">{{ option.name }}</span>
                <span class="remove-option" @click="removeOption(option)">
                    &#10005;
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        },
        text: {
            type: String,
            default: 'Select options'
        },
        showSelected: {
            type: Boolean,
            default: true
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedOptions: [...this.value],
            selectedTables: [],
        };

    },
    watch: {
        selectedOptions(newValue) {
            this.$emit('input', newValue);
            this.$emit('tables-selected', newValue);
        },
    },
    methods: {
        toggleSelection(option) {
            const index = this.selectedOptions.findIndex(o => o.id === option.id);
            if (index === -1) {
                this.selectedOptions.push(option);
            } else {
                this.selectedOptions.splice(index, 1);
            }
        },
        removeOption(option) {
            const index = this.selectedOptions.findIndex(o => o.id === option.id);
            if (index !== -1) {
                this.selectedOptions.splice(index, 1);
            }
        }
    }
};
</script>

<style scoped>
.menu {
    max-height: 200px !important;
    overflow-y: auto !important;
}

.selected-options-container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
}

.selected-option {
    background-color: #ececec;
    border: 1px solid #fff;
    border-radius: 10px;
    padding: 5px 10px;
    margin: 5px;
    display: flex;
    align-items: center;
}

.option-text {
    margin-right: 5px;
}

.remove-option {
    cursor: pointer;
    font-size: 14px;
    color: #d32f2f;
    padding-left: 5px;
}

.remove-option:hover {
    color: #b71c1c;
}
</style>