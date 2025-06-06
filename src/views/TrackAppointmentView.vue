<template>
  <div class="track-appointment-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">🔍 Track Your Appointment</h1>
        <p class="page-description">
          Enter your reference number to check the status of your appointment.
        </p>
      </div>
      
      <div class="tracking-form">
        <div class="form-group">
          <label for="referenceNumber" class="form-label">Reference Number</label>
          <input 
            id="referenceNumber"
            v-model="referenceNumber"
            type="text"
            class="form-input"
            placeholder="Enter your reference number (e.g., BCA123456001)"
            @keyup.enter="trackAppointment"
          />
        </div>
        <button @click="trackAppointment" class="btn btn-primary" :disabled="!referenceNumber.trim()">
          🔍 Track Appointment
        </button>
      </div>

      <!-- Results -->
      <div v-if="searchPerformed" class="tracking-results">
        <div v-if="foundAppointment" class="appointment-found">
          <h3 class="result-title">📋 Appointment Found</h3>
          <AppointmentCard 
            :appointment="foundAppointment"
            :user-role="userRole"
            :show-actions="false"
            :show-address="false"
          />
        </div>
        <div v-else class="appointment-not-found">
          <div class="not-found-icon">❌</div>
          <h3 class="not-found-title">Appointment Not Found</h3>
          <p class="not-found-description">
            No appointment found with reference number: <strong>{{ referenceNumber }}</strong>
          </p>
          <p class="not-found-help">
            Please check your reference number and try again. If you continue to have issues, 
            please contact the barangay office.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppointmentCard from '../components/AppointmentCard.vue'

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

const referenceNumber = ref('')
const searchPerformed = ref(false)

const foundAppointment = computed(() => {
  if (!searchPerformed.value || !referenceNumber.value.trim()) {
    return null
  }
  
  return props.appointments.find(apt => 
    apt.referenceNumber.toLowerCase() === referenceNumber.value.trim().toLowerCase()
  )
})

const trackAppointment = () => {
  if (referenceNumber.value.trim()) {
    searchPerformed.value = true
  }
}
</script>

<style scoped>
.track-appointment-view {
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

.tracking-form {
  max-width: 500px;
  margin: 0 auto 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tracking-results {
  max-width: 800px;
  margin: 0 auto;
}

.appointment-found {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 1.5rem;
  text-align: center;
}

.appointment-not-found {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc3545;
  margin-bottom: 1rem;
}

.not-found-description {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.not-found-help {
  color: #6c757d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }

  .tracking-form {
    margin: 0 1rem 3rem;
    padding: 1.5rem;
  }

  .appointment-not-found {
    margin: 0 1rem;
    padding: 2rem 1.5rem;
  }
}
</style>