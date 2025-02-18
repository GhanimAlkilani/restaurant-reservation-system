<template>
  <b-modal id="modal-lg" 
    :visible="modalShow"
    no-close-on-backdrop
    hide-header-close 
    :size="size" 
    :title="modalTitle" 
    :ok-title="okTitle"
    :ok-variant="okButtonVariant" 
    :cancel-title="cancelTitle" 
    :cancel-variant="cancelButtonVariant">
    
    <slot name="modalContent"></slot>

    <template #modal-footer>
      <b-button v-if="showCancelButton"
        :style="{ backgroundColor: cancelButtonColor, borderColor: cancelBorderColor, color: cancelButtonTextColor }"
        @click="onCancelClick">
        {{ cancelTitle }}
      </b-button>
      <b-button v-if="showSaveButton"
        :style="{ backgroundColor: saveButtonColor, borderColor: saveBorderColor, color: saveButtonTextColor }"
        @click="onSaveClick">
        {{ okTitle }}
      </b-button>

    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'FdcsModal',

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
        modalTitle: {
      type: String,
      default: 'Confirm Action'
    },
    okTitle: {
      type: String,
      default: 'Confirm'
    },
    cancelTitle: {
      type: String,
      default: 'Cancel'
    },
    okButtonVariant: {
      type: String,
      default: 'primary'
    },
    cancelButtonVariant: {
      type: String,
      default: 'secondary'
    },
    showSaveButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    saveButtonColor: {
      type: String,
      default: '#5830c5'
    },
    saveButtonTextColor: {
      type: String,
      default: 'white'
    },
    cancelButtonColor: {
      type: String,
      default: '#6c757d'
    },
    cancelButtonTextColor: {
      type: String,
      default: 'white'
    },
    cancelBorderColor: {
      type: String,
      default: 'white'
    },
    saveBorderColor: {
      type: String,
      default: 'white'
    },
    size: {
      type: String,
      default: 'lg'
    }
  },
  computed: {
    localModalVisible: {
      get() {
        return this.modalVisible
      },
      set(value) {
        this.$emit('update:modalVisible', value)
      }
    }
  },
  methods: {
    onSaveClick() {
      this.$emit('save');
    },
    onCancelClick() {
      this.$emit('cancel');
    }
  }
};
</script>
