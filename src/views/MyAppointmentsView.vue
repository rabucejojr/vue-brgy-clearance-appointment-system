<template>
  <div class="my-appointments-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">👤 My Appointments</h1>
        <p class="page-description">
          View and manage your barangay clearance appointments.
        </p>
      </div>
      
      <AppointmentList 
        :appointments="userAppointments"
        :user-role="userRole"
        :show-all-actions="false"
        @confirm="handleConfirm"
        @reschedule="handleReschedule"
        @cancel="handleCancel"
        @complete="handleComplete"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppointmentList from '../components/AppointmentList.vue'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  userRole: {
    type: String,
    default: 'user'
  }
})

const emit = defineEmits(['confirm', 'reschedule', 'cancel', 'complete'])

// In a real app, filter appointments by current user
const userAppointments = computed(() => {
  // For demo purposes, show all appointments
  // In production, filter by actual user ID
  return props.appointments
})

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
.my-appointments-view {
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