<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Barangay Clearance Dashboard</h1>
        <p class="welcome-message">{{ welcomeMessage }}</p>
      </div>
      <div class="quick-actions">
        <button @click="handleNewAppointment" class="btn btn-primary">
          📅 New Appointment
        </button>
        <button @click="refreshData" class="btn btn-secondary" :disabled="isRefreshing">
          {{ isRefreshing ? '⟳' : '🔄' }} Refresh
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card pending">
        <div class="metric-icon">⏳</div>
        <div class="metric-content">
          <h3>{{ metrics.pending }}</h3>
          <p>Pending Appointments</p>
          <small>{{ metrics.pendingToday }} today</small>
        </div>
      </div>

      <div class="metric-card confirmed">
        <div class="metric-icon">✅</div>
        <div class="metric-content">
          <h3>{{ metrics.confirmed }}</h3>
          <p>Confirmed Appointments</p>
          <small>{{ metrics.confirmedToday }} today</small>
        </div>
      </div>

      <div class="metric-card completed">
        <div class="metric-icon">✔️</div>
        <div class="metric-content">
          <h3>{{ metrics.completed }}</h3>
          <p>Completed This Month</p>
          <small>{{ metrics.completedThisWeek }} this week</small>
        </div>
      </div>

      <div class="metric-card total">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <h3>{{ metrics.total }}</h3>
          <p>Total Appointments</p>
          <small>{{ metrics.thisMonth }} this month</small>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="today-schedule">
      <div class="section-header">
        <h2>Today's Schedule</h2>
        <span class="date-display">{{ currentDate }}</span>
      </div>
      
      <div v-if="todayAppointments.length === 0" class="empty-today">
        <div class="empty-icon">📅</div>
        <p>No appointments scheduled for today</p>
      </div>

      <div v-else class="today-appointments">
        <div 
          v-for="appointment in todayAppointments" 
          :key="appointment.id || appointment.referenceNumber"
          class="today-appointment-item"
          :class="appointment.status?.toLowerCase()"
        >
          <div class="appointment-time">
            <strong>{{ formatTime(appointment.preferredTime) }}</strong>
          </div>
          <div class="appointment-details">
            <h4>{{ getFullName(appointment) }}</h4>
            <p>{{ appointment.purpose }}</p>
            <span class="phone">{{ appointment.phoneNumber }}</span>
          </div>
          <div class="appointment-status">
            <span class="status-badge" :class="appointment.status?.toLowerCase()">
              {{ appointment.status || 'Pending' }}
            </span>
          </div>
          <div class="appointment-actions">
            <button 
              v-if="appointment.status?.toLowerCase() === 'pending'"
              @click="confirmAppointment(appointment)"
              class="btn-mini btn-success"
              title="Confirm"
            >
              ✓
            </button>
            <button 
              v-if="appointment.status?.toLowerCase() === 'confirmed'"
              @click="completeAppointment(appointment)"
              class="btn-mini btn-primary"
              title="Mark Complete"
            >
              ✔
            </button>
            <button 
              @click="viewAppointmentDetails(appointment)"
              class="btn-mini btn-info"
              title="View Details"
            >
              👁
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <div class="section-header">
        <h2>Recent Activity</h2>
        <button @click="viewAllAppointments" class="btn btn-outline">
          View All
        </button>
      </div>

      <div class="activity-list">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.description }}</p>
            <small class="activity-time">{{ formatActivityTime(activity.timestamp) }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Charts (simplified) -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Appointments This Week</h3>
        <div class="simple-chart">
          <div 
            v-for="(day, index) in weeklyData" 
            :key="index"
            class="chart-bar"
          >
            <div 
              class="bar" 
              :style="{ height: `${(day.count / maxWeeklyCount) * 100}%` }"
              :title="`${day.name}: ${day.count} appointments`"
            ></div>
            <span class="bar-label">{{ day.name }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Purpose Distribution</h3>
        <div class="purpose-stats">
          <div 
            v-for="purpose in purposeStats" 
            :key="purpose.name"
            class="purpose-item"
          >
            <div class="purpose-bar">
              <div 
                class="purpose-fill" 
                :style="{ width: `${purpose.percentage}%` }"
              ></div>
            </div>
            <div class="purpose-info">
              <span class="purpose-name">{{ purpose.name }}</span>
              <span class="purpose-count">{{ purpose.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Summary -->
    <div class="status-summary">
      <h2>System Status</h2>
      <div class="status-items">
        <div class="status-item">
          <div class="status-indicator online"></div>
          <span>System Online</span>
        </div>
        <div class="status-item">
          <div class="status-indicator" :class="{ online: !hasOverdueAppointments }"></div>
          <span>{{ hasOverdueAppointments ? 'Overdue Appointments' : 'All Up to Date' }}</span>
        </div>
        <div class="status-item">
          <div class="status-indicator" :class="{ online: availableSlots > 0 }"></div>
          <span>{{ availableSlots }} Slots Available Today</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  userRole: {
    type: String,
    default: 'user' // user, admin, staff
  }
})

// Emits
const emit = defineEmits([
  'new-appointment',
  'view-all-appointments',
  'confirm-appointment',
  'complete-appointment',
  'view-appointment-details',
  'refresh-data'
])

// Reactive data
const isRefreshing = ref(false)

// Computed properties
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  let greeting = 'Good day'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 18) greeting = 'Good afternoon'
  else greeting = 'Good evening'
  
  const roleText = props.userRole === 'admin' ? 'Administrator' :
                   props.userRole === 'staff' ? 'Staff' : ''
  
  return `${greeting}${roleText ? ', ' + roleText : ''}! Here's your appointment overview.`
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const metrics = computed(() => {
  const today = new Date()
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - today.getDay())
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const pending = props.appointments.filter(apt => apt.status?.toLowerCase() === 'pending')
  const confirmed = props.appointments.filter(apt => apt.status?.toLowerCase() === 'confirmed')
  const completed = props.appointments.filter(apt => apt.status?.toLowerCase() === 'completed')
  
  return {
    pending: pending.length,
    confirmed: confirmed.length,
    completed: completed.length,
    total: props.appointments.length,
    pendingToday: pending.filter(apt => isToday(apt.preferredDate)).length,
    confirmedToday: confirmed.filter(apt => isToday(apt.preferredDate)).length,
    completedThisWeek: completed.filter(apt => 
      new Date(apt.preferredDate) >= thisWeekStart
    ).length,
    thisMonth: props.appointments.filter(apt => 
      new Date(apt.preferredDate) >= thisMonthStart
    ).length
  }
})

const todayAppointments = computed(() => {
  return props.appointments
    .filter(apt => isToday(apt.preferredDate))
    .sort((a, b) => {
      const timeA = a.preferredTime?.split('-')[0] || '00:00'
      const timeB = b.preferredTime?.split('-')[0] || '00:00'
      return timeA.localeCompare(timeB)
    })
})

const recentActivity = computed(() => {
  // Generate mock recent activity based on appointments
  const activities = []
  
  const recentAppts = [...props.appointments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
  
  recentAppts.forEach(apt => {
    activities.push({
      id: apt.id || apt.referenceNumber,
      type: 'appointment',
      description: `New appointment booked by ${getFullName(apt)}`,
      timestamp: apt.createdAt || new Date()
    })
    
    if (apt.status === 'confirmed') {
      activities.push({
        id: apt.id + '_confirmed',
        type: 'confirmed',
        description: `Appointment confirmed for ${getFullName(apt)}`,
        timestamp: new Date(apt.createdAt || new Date().getTime() + 3600000)
      })
    }
  })
  
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8)
})

const weeklyData = computed(() => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  
  return days.map((name, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    
    const count = props.appointments.filter(apt => {
      const aptDate = new Date(apt.preferredDate)
      return aptDate.toDateString() === date.toDateString()
    }).length
    
    return { name, count, date }
  })
})

const maxWeeklyCount = computed(() => {
  return Math.max(...weeklyData.value.map(day => day.count), 1)
})

const purposeStats = computed(() => {
  const purposes = {}
  props.appointments.forEach(apt => {
    const purpose = apt.purpose || 'Other'
    purposes[purpose] = (purposes[purpose] || 0) + 1
  })
  
  const total = props.appointments.length || 1
  
  return Object.entries(purposes)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const hasOverdueAppointments = computed(() => {
  const now = new Date()
  return props.appointments.some(apt => {
    const aptDate = new Date(apt.preferredDate)
    return aptDate < now && apt.status?.toLowerCase() === 'pending'
  })
})

const availableSlots = computed(() => {
  const totalSlots = 8 // 8 time slots per day
  const todayBooked = todayAppointments.value.length
  return Math.max(0, totalSlots - todayBooked)
})

// Methods
const isToday = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const getFullName = (appointment) => {
  let name = `${appointment.firstName} ${appointment.lastName}`
  if (appointment.middleName) {
    name = `${appointment.firstName} ${appointment.middleName} ${appointment.lastName}`
  }
  if (appointment.suffix) {
    name += ` ${appointment.suffix}`
  }
  return name
}

const formatTime = (timeRange) => {
  if (!timeRange) return 'Time not set'
  const [startTime] = timeRange.split('-')
  const [hours, minutes] = startTime.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const formatActivityTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

const getActivityIcon = (type) => {
  const icons = {
    appointment: '📅',
    confirmed: '✅',
    completed: '✔️',
    cancelled: '❌',
    rescheduled: '📄'
  }
  return icons[type] || '📋'
}

// Event handlers
const handleNewAppointment = () => {
  emit('new-appointment')
}

const viewAllAppointments = () => {
  emit('view-all-appointments')
}

const confirmAppointment = (appointment) => {
  emit('confirm-appointment', appointment)
}

const completeAppointment = (appointment) => {
  emit('complete-appointment', appointment)
}

const viewAppointmentDetails = (appointment) => {
  emit('view-appointment-details', appointment)
}

const refreshData = async () => {
  isRefreshing.value = true
  try {
    emit('refresh-data')
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.welcome-section h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-message {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.metric-card.pending { border-left-color: #ffc107; }
.metric-card.confirmed { border-left-color: #28a745; }
.metric-card.completed { border-left-color: #007bff; }
.metric-card.total { border-left-color: #6f42c1; }

.metric-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(0, 123, 255, 0.1);
}

.metric-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}

.metric-content p {
  margin: 0.25rem 0 0.5rem 0;
  color: #495057;
  font-weight: 500;
}

.metric-content small {
  color: #6c757d;
  font-size: 0.875rem;
}

.today-schedule,
.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.date-display {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}

.empty-today {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.today-appointments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.today-appointment-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
}

.today-appointment-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.today-appointment-item.pending { border-left-color: #ffc107; }
.today-appointment-item.confirmed { border-left-color: #28a745; }
.today-appointment-item.completed { border-left-color: #007bff; }

.appointment-time {
  font-size: 0.9rem;
  color: #495057;
}

.appointment-details h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.appointment-details p {
  margin: 0 0 0.25rem 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.phone {
  font-size: 0.8rem;
  color: #6c757d;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #cce7ff;
  color: #004085;
}

.appointment-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-mini {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mini:hover {
  transform: translateY(-1px);
}

.btn-success { background: #28a745; color: white; }
.btn-primary { background: #007bff; color: white; }
.btn-info { background: #17a2b8; color: white; }

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e9ecef;
  font-size: 1.2rem;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: #495057;
  font-size: 0.95rem;
}

.activity-time {
  color: #6c757d;
  font-size: 0.8rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.simple-chart {
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 120px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.1);
}

.bar-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.purpose-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.purpose-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.purpose-bar {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.purpose-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.purpose-info {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.purpose-name {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

.purpose-count {
  font-size: 0.8rem;
  color: #6c757d;
}

.status-summary {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-summary h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.status-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.status-item:hover {
  background: #f8f9fa;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc3545;
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: #28a745;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .quick-actions {
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .today-appointment-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }

  .appointment-actions {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .metric-card {
    padding: 1rem;
  }

  .metric-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .metric-content h3 {
    font-size: 1.5rem;
  }

  .today-schedule,
  .recent-activity,
  .chart-container,
  .status-summary {
    padding: 1.5rem;
  }

  .simple-chart {
    height: 80px;
  }
}
</style> 