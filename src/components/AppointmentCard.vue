<template>
  <div class="card hover:shadow-xl transition-all duration-300 border-l-4" 
       :class="`border-l-${statusConfig.dotClass.split('-')[1]}-400`">
    <div class="p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {{ appointment.firstName?.charAt(0) }}{{ appointment.lastName?.charAt(0) }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-secondary-900">{{ getFullName(appointment) }}</h3>
            <p class="text-sm text-secondary-600 font-mono">{{ appointment.referenceNumber }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <span :class="statusConfig.bgClass" 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border">
            <span :class="statusConfig.dotClass" class="w-2 h-2 rounded-full mr-2"></span>
            {{ statusConfig.label }}
          </span>
        </div>
      </div>

      <!-- Appointment Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Date & Time -->
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-600">📅</span>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Appointment Date</p>
              <p class="font-medium text-secondary-900">{{ formatDate(appointment.preferredDate) }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600">⏰</span>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Time Slot</p>
              <p class="font-medium text-secondary-900">{{ formatTime(appointment.preferredTime) }}</p>
            </div>
          </div>
        </div>

        <!-- Purpose & Personal Info -->
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-purple-600">🎯</span>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Purpose</p>
              <p class="font-medium text-secondary-900">
                {{ appointment.purpose === 'Other' ? appointment.otherPurpose : appointment.purpose }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span class="text-orange-600">👤</span>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Personal Details</p>
              <p class="font-medium text-secondary-900">{{ appointment.gender }}, {{ appointment.civilStatus }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-secondary-50 rounded-lg p-4 mb-6">
        <h4 class="text-sm font-semibold text-secondary-900 mb-3 flex items-center">
          <span class="mr-2">📱</span>
          Contact Information
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-secondary-600">Phone</p>
            <p class="font-medium text-secondary-900">{{ appointment.phoneNumber }}</p>
          </div>
          <div>
            <p class="text-secondary-600">Email</p>
            <p class="font-medium text-secondary-900 break-all">{{ appointment.email }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-secondary-600">Address</p>
            <p class="font-medium text-secondary-900">{{ appointment.address }}</p>
          </div>
        </div>
      </div>

      <!-- Special Notes -->
      <div v-if="appointment.specialNotes" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 class="text-sm font-semibold text-blue-900 mb-2 flex items-center">
          <span class="mr-2">📝</span>
          Special Notes
        </h4>
        <p class="text-sm text-blue-800">{{ appointment.specialNotes }}</p>
      </div>

      <!-- Timestamps -->
      <div class="flex flex-wrap items-center gap-4 text-xs text-secondary-500 mb-6">
        <div class="flex items-center space-x-1">
          <span>📅</span>
          <span>Submitted: {{ formatDate(appointment.createdAt) }}</span>
        </div>
        <div v-if="appointment.updatedAt" class="flex items-center space-x-1">
          <span>🔄</span>
          <span>Updated: {{ formatDate(appointment.updatedAt) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="showActions && availableActions.length > 0" 
           class="flex flex-wrap gap-2 pt-4 border-t border-secondary-200">
        <button
          v-for="action in availableActions"
          :key="action.action"
          @click="handleAction(action.action)"
          :class="action.class"
          class="flex items-center space-x-1 font-medium transition-all duration-200 hover:scale-105"
        >
          <span>{{ action.icon }}</span>
          <span>{{ action.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  userRole: {
    type: String,
    default: 'user'
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['confirm', 'reschedule', 'cancel', 'complete'])

// Computed
const statusConfig = computed(() => {
  const configs = {
    pending: {
      label: 'Pending',
      bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotClass: 'bg-yellow-400',
      icon: '⏳'
    },
    confirmed: {
      label: 'Confirmed',
      bgClass: 'bg-blue-100 text-blue-800 border-blue-200',
      dotClass: 'bg-blue-400',
      icon: '✅'
    },
    completed: {
      label: 'Completed',
      bgClass: 'bg-green-100 text-green-800 border-green-200',
      dotClass: 'bg-green-400',
      icon: '✓'
    },
    cancelled: {
      label: 'Cancelled',
      bgClass: 'bg-red-100 text-red-800 border-red-200',
      dotClass: 'bg-red-400',
      icon: '✕'
    },
    rescheduled: {
      label: 'Rescheduled',
      bgClass: 'bg-purple-100 text-purple-800 border-purple-200',
      dotClass: 'bg-purple-400',
      icon: '🔄'
    }
  }
  return configs[props.appointment.status] || configs.pending
})

const availableActions = computed(() => {
  const actions = []
  
  if (props.userRole === 'staff' || props.userRole === 'admin') {
    if (props.appointment.status === 'pending') {
      actions.push(
        { 
          name: 'Confirm', 
          action: 'confirm', 
          class: 'btn-primary text-sm py-1 px-3',
          icon: '✓' 
        },
        { 
          name: 'Reschedule', 
          action: 'reschedule', 
          class: 'btn-secondary text-sm py-1 px-3',
          icon: '📅' 
        },
        { 
          name: 'Cancel', 
          action: 'cancel', 
          class: 'bg-red-100 hover:bg-red-200 text-red-700 text-sm py-1 px-3 rounded-lg transition-colors',
          icon: '✕' 
        }
      )
    } else if (props.appointment.status === 'confirmed') {
      actions.push(
        { 
          name: 'Complete', 
          action: 'complete', 
          class: 'btn-primary text-sm py-1 px-3',
          icon: '✓' 
        },
        { 
          name: 'Reschedule', 
          action: 'reschedule', 
          class: 'btn-secondary text-sm py-1 px-3',
          icon: '📅' 
        }
      )
    }
  } else if (props.userRole === 'user') {
    if (props.appointment.status === 'pending' || props.appointment.status === 'confirmed') {
      actions.push(
        { 
          name: 'Reschedule', 
          action: 'reschedule', 
          class: 'btn-secondary text-sm py-1 px-3',
          icon: '📅' 
        },
        { 
          name: 'Cancel', 
          action: 'cancel', 
          class: 'bg-red-100 hover:bg-red-200 text-red-700 text-sm py-1 px-3 rounded-lg transition-colors',
          icon: '✕' 
        }
      )
    }
  }
  
  return actions
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

// Methods
const handleAction = (action) => {
  emit(action, props.appointment)
}
</script>

<style scoped>
.appointment-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.appointment-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.appointment-card.clickable {
  cursor: pointer;
}

.appointment-card.clickable:hover {
  border-color: #007bff;
}

/* Status-based styling */
.appointment-card.status-pending {
  border-left: 4px solid #ffc107;
}

.appointment-card.status-confirmed {
  border-left: 4px solid #28a745;
}

.appointment-card.status-completed {
  border-left: 4px solid #007bff;
}

.appointment-card.status-cancelled {
  border-left: 4px solid #dc3545;
}

.appointment-card.status-rescheduled {
  border-left: 4px solid #fd7e14;
}

.appointment-card.status-no_show {
  border-left: 4px solid #6c757d;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 0.75rem;
  border-bottom: 1px solid #f1f3f4;
}

.appointment-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.reference-number {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.appointment-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.status-confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.status-completed {
  background-color: #cce7ff;
  color: #004085;
}

.status-badge.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.status-rescheduled {
  background-color: #ffeaa7;
  color: #b86914;
}

.status-badge.status-no_show {
  background-color: #e2e6ea;
  color: #495057;
}

.card-body {
  padding: 1rem 1.5rem;
}

.appointment-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.detail-item i {
  width: 16px;
  height: 16px;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

/* Icon styles using CSS */
.icon-calendar::before { content: "📅"; }
.icon-purpose::before { content: "📄"; }
.icon-phone::before { content: "📞"; }
.icon-email::before { content: "📧"; }
.icon-location::before { content: "📍"; }
.icon-notes::before { content: "📝"; }

.detail-content {
  min-width: 0;
  flex: 1;
}

.detail-content label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.detail-content span {
  display: block;
  color: #2c3e50;
  font-weight: 400;
  word-break: break-word;
}

.address-section,
.notes-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f4;
}

.address-section .detail-item,
.notes-section .detail-item {
  grid-column: 1 / -1;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f3f4;
  background-color: #f8f9fa;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.card-footer {
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #f1f3f4;
}

.timestamp {
  color: #6c757d;
  font-size: 0.8rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .appointment-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-actions {
    justify-content: center;
  }

  .btn {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .appointment-card {
    margin: 0.5rem 0;
  }
  
  .card-header,
  .card-body,
  .card-actions,
  .card-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 