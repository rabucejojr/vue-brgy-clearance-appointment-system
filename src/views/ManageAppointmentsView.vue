<template>
  <div class="manage-appointments-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">⚙️ Manage Appointments</h1>
        <p class="page-description">
          View, filter, and manage all barangay clearance appointments.
        </p>
      </div>
      
      <AppointmentList 
        :appointments="appointments"
        :user-role="userRole"
        :show-all-actions="true"
        @confirm="handleConfirm"
        @reschedule="handleReschedule"
        @cancel="handleCancel"
        @complete="handleComplete"
      />
    </div>
  </div>
</template>

<script setup>
import AppointmentList from '../components/AppointmentList.vue'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  userRole: {
    type: String,
    default: 'staff'
  }
})

const emit = defineEmits(['confirm', 'reschedule', 'cancel', 'complete'])

const handleConfirm = (appointment) => {
  emit('confirm', appointment)
}

const handleReschedule = (appointment) => {
  emit('reschedule', appointment)
}

const handleCancel = (appointment) => {
  emit('cancel', appointment)
}

const handleComplete = (appointment) => {
  emit('complete', appointment)
}
</script>

<style scoped>
.manage-appointments-view {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-description {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
}
</style> 