<template>
  <div v-if="show" class="alert" :class="alertType" @click="hideAlert">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: 'An error occurred!',
      alertType: 'error-alert',
    };
  },
  methods: {
    showAlert(message = 'An error occurred!', type = 'error') {
      this.message = message;
      this.alertType = type === 'success' ? 'success-alert' : 'error-alert';
      this.show = true;
      setTimeout(() => {
        this.hideAlert();
      }, 5000);
    },
    hideAlert() {
      this.show = false;
    },
  },
};
</script>

<style scoped>
.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  opacity: 1;
  transition: opacity 0.5s ease-out;
  z-index: 1500;
}

.error-alert {
  background-color: #f44336;
}

.success-alert {
  background-color: #4caf50;
}

.alert.fade-out {
  opacity: 0;
}

.alert+.alert {
  margin-top: 10px;
}
</style>
