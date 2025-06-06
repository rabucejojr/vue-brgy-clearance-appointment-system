<template>
  <div class="appointment-card" :class="[statusClass, { 'clickable': clickable }]" @click="handleClick">
    <div class="card-header">
      <div class="appointment-info">
        <h3 class="appointment-title">{{ fullName }}</h3>
        <span class="reference-number">Ref: {{ appointment.referenceNumber }}</span>
      </div>
      <div class="appointment-status">
        <span class="status-badge" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>

    <div class="card-body">
      <div class="appointment-details">
        <div class="detail-item">
          <i class="icon-calendar"></i>
          <div class="detail-content">
            <label>Date & Time</label>
            <span>{{ formattedDateTime }}</span>
          </div>
        </div>

        <div class="detail-item">
          <i class="icon-purpose"></i>
          <div class="detail-content">
            <label>Purpose</label>
            <span>{{ appointment.purpose }}</span>
          </div>
        </div>

        <div class="detail-item">
          <i class="icon-phone"></i>
          <div class="detail-content">
            <label>Contact</label>
            <span>{{ appointment.phoneNumber }}</span>
          </div>
        </div>

        <div v-if="appointment.email" class="detail-item">
          <i class="icon-email"></i>
          <div class="detail-content">
            <label>Email</label>
            <span>{{ appointment.email }}</span>
          </div>
        </div>
      </div>

      <div v-if="showAddress" class="address-section">
        <div class="detail-item">
          <i class="icon-location"></i>
          <div class="detail-content">
            <label>Address</label>
            <span>{{ appointment.address }}</span>
          </div>
        </div>
      </div>

      <div v-if="appointment.specialNotes" class="notes-section">
        <div class="detail-item">
          <i class="icon-notes"></i>
          <div class="detail-content">
            <label>Special Notes</label>
            <span>{{ appointment.specialNotes }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showActions" class="card-actions">
      <button 
        v-if="canConfirm" 
        @click.stop="handleAction('confirm')" 
        class="btn btn-success"
      >
        Confirm
      </button>
      <button 
        v-if="canReschedule" 
        @click.stop="handleAction('reschedule')" 
        class="btn btn-warning"
      >
        Reschedule
      </button>
      <button 
        v-if="canCancel" 
        @click.stop="handleAction('cancel')" 
        class="btn btn-danger"
      >
        Cancel
      </button>
      <button 
        v-if="canComplete" 
        @click.stop="handleAction('complete')" 
        class="btn btn-primary"
      >
        Mark Complete
      </button>
      <button 
        v-if="showDetails" 
        @click.stop="handleAction('details')" 
        class="btn btn-info"
      >
        View Details
      </button>
    </div>

    <div v-if="showTimestamp" class="card-footer">
      <small class="timestamp">
        {{ appointment.createdAt ? `Submitted: ${formatTimestamp(appointment.createdAt)}` : '' }}
      </small>
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
  showActions: {
    type: Boolean,
    default: true
  },
  showAddress: {
    type: Boolean,
    default: false
  },
  showTimestamp: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'action-clicked',
  'card-clicked',
  'confirm',
  'reschedule', 
  'cancel',
  'complete',
  'details'
])

// Computed properties
const fullName = computed(() => {
  const { firstName, lastName, middleName, suffix } = props.appointment
  let name = `${firstName} ${lastName}`
  if (middleName) name = `${firstName} ${middleName} ${lastName}`
  if (suffix) name += ` ${suffix}`
  return name
})

const formattedDateTime = computed(() => {
  const { preferredDate, preferredTime } = props.appointment
  if (!preferredDate || !preferredTime) return 'Not specified'
  
  const date = new Date(preferredDate)
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  
  // Format time from 24-hour to 12-hour format
  const [startTime] = preferredTime.split('-')
  const [hours, minutes] = startTime.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  
  return `${dateStr}, ${displayHour}:${minutes} ${ampm}`
})

const statusClass = computed(() => {
  const status = props.appointment.status?.toLowerCase() || 'pending'
  return `status-${status}`
})

const statusText = computed(() => {
  const status = props.appointment.status || 'Pending'
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rescheduled': 'Rescheduled',
    'no_show': 'No Show'
  }
  return statusMap[status.toLowerCase()] || status
})

// Action permissions based on status
const canConfirm = computed(() => {
  const status = props.appointment.status?.toLowerCase()
  return status === 'pending'
})

const canReschedule = computed(() => {
  const status = props.appointment.status?.toLowerCase()
  return ['pending', 'confirmed'].includes(status)
})

const canCancel = computed(() => {
  const status = props.appointment.status?.toLowerCase()
  return ['pending', 'confirmed'].includes(status)
})

const canComplete = computed(() => {
  const status = props.appointment.status?.toLowerCase()
  return status === 'confirmed'
})

const showDetails = computed(() => {
  return true // Always show details button
})

// Methods
const handleClick = () => {
  if (props.clickable) {
    emit('card-clicked', props.appointment)
  }
}

const handleAction = (action) => {
  // Emit both generic and specific events
  emit('action-clicked', { action, appointment: props.appointment })
  emit(action, props.appointment)
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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