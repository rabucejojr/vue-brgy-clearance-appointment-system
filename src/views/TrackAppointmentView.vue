<template>
  <div class="min-h-screen bg-app">
    <div class="container-full py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Track Your Appointment</h1>
        <p class="text-lg text-secondary-600 max-w-2xl mx-auto">
          Enter your reference number to check the status of your barangay clearance appointment
        </p>
      </div>

      <!-- Search Form -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="card p-8">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-primary-600 text-2xl">🔍</span>
            </div>
            <h2 class="text-xl font-semibold text-secondary-900 mb-2">Search by Reference Number</h2>
            <p class="text-sm text-secondary-600">
              Your reference number was provided when you submitted your appointment
            </p>
          </div>

          <form @submit.prevent="searchAppointment" class="space-y-6">
            <div>
              <label for="reference" class="block text-sm font-medium text-secondary-700 mb-2">
                Reference Number
              </label>
              <div class="relative">
                <input
                  id="reference"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Enter your reference number (e.g., BCA123456001)"
                  class="input-field pr-12"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': searchError }"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-secondary-400">🔍</span>
                </div>
              </div>
              <p v-if="searchError" class="mt-2 text-sm text-red-600">{{ searchError }}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="isSearching || !searchQuery.trim()"
                class="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSearching" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSearching ? 'Searching...' : 'Track Appointment' }}</span>
              </button>
              
              <button
                type="button"
                @click="resetSearch"
                class="btn-secondary flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="max-w-4xl mx-auto space-y-8">
        <div
          v-for="appointment in searchResults"
          :key="appointment.id"
          class="card p-6 md:p-8"
        >
          <!-- Status Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 class="text-2xl font-bold text-secondary-900 mb-2">{{ getFullName(appointment) }}</h3>
              <p class="text-secondary-600 font-mono">Reference: {{ appointment.referenceNumber }}</p>
            </div>
            
            <div :class="statusConfig[appointment.status]?.bgClass" 
                 class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border self-start">
              <span :class="statusConfig[appointment.status]?.dotClass" class="w-3 h-3 rounded-full mr-3"></span>
              {{ statusConfig[appointment.status]?.label }}
            </div>
          </div>

          <!-- Status Description -->
          <div class="bg-secondary-50 rounded-lg p-4 mb-8">
            <div class="flex items-start space-x-3">
              <div class="text-2xl">{{ statusConfig[appointment.status]?.icon }}</div>
              <div>
                <h4 class="font-semibold text-secondary-900 mb-1">Current Status</h4>
                <p class="text-secondary-700">{{ statusConfig[appointment.status]?.description }}</p>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <div>
                <h4 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <span class="mr-2">📅</span>
                  Appointment Details
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Date:</span>
                    <span class="font-medium text-secondary-900">{{ formatDate(appointment.preferredDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Time:</span>
                    <span class="font-medium text-secondary-900">{{ formatTime(appointment.preferredTime) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Purpose:</span>
                    <span class="font-medium text-secondary-900">
                      {{ appointment.purpose === 'Other' ? appointment.otherPurpose : appointment.purpose }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <span class="mr-2">👤</span>
                  Personal Information
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Gender:</span>
                    <span class="font-medium text-secondary-900">{{ appointment.gender }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Civil Status:</span>
                    <span class="font-medium text-secondary-900">{{ appointment.civilStatus }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Nationality:</span>
                    <span class="font-medium text-secondary-900">{{ appointment.nationality }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <h4 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <span class="mr-2">📱</span>
                  Contact Information
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Phone:</span>
                    <span class="font-medium text-secondary-900">{{ appointment.phoneNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-secondary-600">Email:</span>
                    <span class="font-medium text-secondary-900 break-all">{{ appointment.email }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <span class="mr-2">📍</span>
                  Address
                </h4>
                <p class="text-secondary-700 leading-relaxed">{{ appointment.address }}</p>
              </div>
            </div>
          </div>

          <!-- Special Notes -->
          <div v-if="appointment.specialNotes" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h4 class="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <span class="mr-2">📝</span>
              Special Notes
            </h4>
            <p class="text-sm text-blue-800">{{ appointment.specialNotes }}</p>
          </div>

          <!-- Timeline -->
          <div class="border-t border-secondary-200 pt-6">
            <h4 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <span class="mr-2">📋</span>
              Timeline
            </h4>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <span class="text-sm font-medium text-secondary-900">Application Submitted</span>
                  <span class="text-xs text-secondary-500 ml-2">{{ formatDate(appointment.createdAt) }}</span>
                </div>
              </div>
              
              <div v-if="appointment.status !== 'pending'" class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div>
                  <span class="text-sm font-medium text-secondary-900">Status Updated</span>
                  <span class="text-xs text-secondary-500 ml-2">
                    {{ appointment.updatedAt ? formatDate(appointment.updatedAt) : 'Recently' }}
                  </span>
                </div>
              </div>
              
              <div v-if="appointment.status === 'completed'" class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-600 rounded-full"></div>
                <div>
                  <span class="text-sm font-medium text-secondary-900">Clearance Issued</span>
                  <span class="text-xs text-secondary-500 ml-2">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="max-w-3xl mx-auto mt-16">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-xl">💡</span>
            </div>
            <h3 class="text-xl font-semibold text-secondary-900 mb-4">Need Help?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 class="font-semibold text-secondary-900 mb-2">📞 Contact Us</h4>
                <p class="text-secondary-600">Call (02) 123-4567 for assistance</p>
              </div>
              <div>
                <h4 class="font-semibold text-secondary-900 mb-2">🕒 Office Hours</h4>
                <p class="text-secondary-600">Mon-Fri: 8AM-5PM<br>Sat: 8AM-12PM</p>
              </div>
              <div>
                <h4 class="font-semibold text-secondary-900 mb-2">📧 Email Support</h4>
                <p class="text-secondary-600">support@barangay.gov.ph</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Props
const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  }
})

// Reactive data
const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const searchError = ref('')

// Methods
const searchAppointment = async () => {
  if (!searchQuery.value.trim()) {
    searchError.value = 'Please enter a reference number'
    return
  }
  
  searchError.value = ''
  isSearching.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Search in provided appointments array
    const results = props.appointments.filter(appointment => 
      appointment.referenceNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    
    searchResults.value = results
    
    if (results.length === 0) {
      searchError.value = 'No appointment found with this reference number'
    }
    
  } catch (error) {
    searchError.value = 'An error occurred while searching. Please try again.'
  } finally {
    isSearching.value = false
  }
}

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  searchError.value = ''
}

// Computed
const statusConfig = computed(() => {
  return {
    pending: {
      label: 'Pending Review',
      bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotClass: 'bg-yellow-400',
      icon: '⏳',
      description: 'Your appointment is being reviewed by the barangay office.'
    },
    confirmed: {
      label: 'Confirmed',
      bgClass: 'bg-blue-100 text-blue-800 border-blue-200',
      dotClass: 'bg-blue-400',
      icon: '✅',
      description: 'Your appointment has been confirmed. Please visit on the scheduled date.'
    },
    completed: {
      label: 'Completed',
      bgClass: 'bg-green-100 text-green-800 border-green-200',
      dotClass: 'bg-green-400',
      icon: '✓',
      description: 'Your barangay clearance has been successfully processed.'
    },
    cancelled: {
      label: 'Cancelled',
      bgClass: 'bg-red-100 text-red-800 border-red-200',
      dotClass: 'bg-red-400',
      icon: '✕',
      description: 'This appointment has been cancelled.'
    },
    rescheduled: {
      label: 'Rescheduled',
      bgClass: 'bg-purple-100 text-purple-800 border-purple-200',
      dotClass: 'bg-purple-400',
      icon: '🔄',
      description: 'Your appointment has been rescheduled. Check the new date and time.'
    }
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (timeString) => {
  if (!timeString.includes('-')) return timeString
  
  const [start, end] = timeString.split('-')
  const formatTimeString = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  
  return `${formatTimeString(start)} - ${formatTimeString(end)}`
}

const getFullName = (appointment) => {
  const parts = [
    appointment.firstName,
    appointment.middleName,
    appointment.lastName,
    appointment.suffix
  ].filter(Boolean)
  
  return parts.join(' ')
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