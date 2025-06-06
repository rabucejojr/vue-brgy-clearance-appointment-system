<template>
  <div class="book-appointment-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">📅 Book an Appointment</h1>
        <p class="page-description">
          Fill out the form below to schedule your barangay clearance appointment.
          All fields marked with an asterisk (*) are required.
        </p>
      </div>
      
      <AppointmentForm 
        @appointment-submitted="handleAppointmentSubmitted"
      />
    </div>
  </div>
</template>

<script setup>
import AppointmentForm from '../components/AppointmentForm.vue'

const emit = defineEmits(['appointment-submitted'])

const handleAppointmentSubmitted = (data) => {
  emit('appointment-submitted', data)
}
</script>

<style scoped>
.book-appointment-view {
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