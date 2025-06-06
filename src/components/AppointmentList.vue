<template>
  <div class="appointment-list">
    <div class="list-header">
      <div class="header-content">
        <h2>{{ title }}</h2>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      
      <div class="header-stats" v-if="showStats">
        <div class="stat-item">
          <span class="stat-number">{{ totalAppointments }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ confirmedCount }}</span>
          <span class="stat-label">Confirmed</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completedCount }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>
    </div>

    <div class="list-controls" v-if="showControls">
      <div class="search-section">
        <div class="search-input-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, reference number, or phone..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
            ✕
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label for="statusFilter">Status:</label>
          <select id="statusFilter" v-model="selectedStatus" class="filter-select">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="dateFilter">Date:</label>
          <select id="dateFilter" v-model="selectedDateFilter" class="filter-select">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="next_week">Next Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sortBy">Sort By:</label>
          <select id="sortBy" v-model="selectedSort" class="filter-select">
            <option value="date_asc">Date (Earliest First)</option>
            <option value="date_desc">Date (Latest First)</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="created_desc">Recently Added</option>
            <option value="status">Status</option>
          </select>
        </div>

        <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
          Clear Filters
        </button>
      </div>
    </div>

    <div class="list-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAppointments.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>{{ emptyStateTitle }}</h3>
        <p>{{ emptyStateMessage }}</p>
        <button v-if="showNewAppointmentButton" @click="handleNewAppointment" class="btn btn-primary">
          Book New Appointment
        </button>
      </div>

      <!-- Appointment Cards -->
      <div v-else class="appointments-grid">
        <AppointmentCard
          v-for="appointment in paginatedAppointments"
          :key="appointment.id || appointment.referenceNumber"
          :appointment="appointment"
          :show-actions="showActions"
          :show-address="showAddress"
          :show-timestamp="showTimestamp"
          :clickable="clickableCards"
          @confirm="handleConfirm"
          @reschedule="handleReschedule"
          @cancel="handleCancel"
          @complete="handleComplete"
          @details="handleDetails"
          @card-clicked="handleCardClick"
          @action-clicked="handleActionClick"
        />
      </div>

      <!-- Pagination -->
      <div v-if="showPagination && totalPages > 1" class="pagination">
        <button 
          @click="goToPage(1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          First
        </button>
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        
        <div class="pagination-info">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <span class="results-count">({{ filteredAppointments.length }} results)</span>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
        <button 
          @click="goToPage(totalPages)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Last
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppointmentCard from './AppointmentCard.vue'

// Props
const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Appointments'
  },
  subtitle: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: true
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
  clickableCards: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  showNewAppointmentButton: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'confirm',
  'reschedule',
  'cancel',
  'complete',
  'details',
  'card-clicked',
  'action-clicked',
  'new-appointment'
])

// Reactive data
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedDateFilter = ref('')
const selectedSort = ref('date_asc')
const currentPage = ref(1)

// Computed properties
const totalAppointments = computed(() => props.appointments.length)

const pendingCount = computed(() => 
  props.appointments.filter(apt => apt.status?.toLowerCase() === 'pending').length
)

const confirmedCount = computed(() => 
  props.appointments.filter(apt => apt.status?.toLowerCase() === 'confirmed').length
)

const completedCount = computed(() => 
  props.appointments.filter(apt => apt.status?.toLowerCase() === 'completed').length
)

const hasActiveFilters = computed(() => 
  searchQuery.value || selectedStatus.value || selectedDateFilter.value
)

const emptyStateTitle = computed(() => {
  if (hasActiveFilters.value) return 'No appointments found'
  return totalAppointments.value === 0 ? 'No appointments yet' : 'No appointments'
})

const emptyStateMessage = computed(() => {
  if (hasActiveFilters.value) return 'Try adjusting your search or filter criteria'
  return totalAppointments.value === 0 
    ? 'Start by booking your first appointment' 
    : 'No appointments match your criteria'
})

// Filtering and sorting
const filteredAppointments = computed(() => {
  let result = [...props.appointments]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(apt => {
      const fullName = `${apt.firstName} ${apt.lastName} ${apt.middleName || ''}`.toLowerCase()
      const phone = apt.phoneNumber?.toLowerCase() || ''
      const ref = apt.referenceNumber?.toLowerCase() || ''
      const email = apt.email?.toLowerCase() || ''
      
      return fullName.includes(query) || 
             phone.includes(query) || 
             ref.includes(query) ||
             email.includes(query)
    })
  }

  // Status filter
  if (selectedStatus.value) {
    result = result.filter(apt => 
      apt.status?.toLowerCase() === selectedStatus.value.toLowerCase()
    )
  }

  // Date filter
  if (selectedDateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    result = result.filter(apt => {
      if (!apt.preferredDate) return false
      
      const aptDate = new Date(apt.preferredDate)
      
      switch (selectedDateFilter.value) {
        case 'today':
          return aptDate.getTime() === today.getTime()
        case 'tomorrow':
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return aptDate.getTime() === tomorrow.getTime()
        case 'this_week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          return aptDate >= weekStart && aptDate <= weekEnd
        case 'next_week':
          const nextWeekStart = new Date(today)
          nextWeekStart.setDate(today.getDate() - today.getDay() + 7)
          const nextWeekEnd = new Date(nextWeekStart)
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
          return aptDate >= nextWeekStart && aptDate <= nextWeekEnd
        case 'this_month':
          return aptDate.getMonth() === today.getMonth() && 
                 aptDate.getFullYear() === today.getFullYear()
        default:
          return true
      }
    })
  }

  // Sorting
  result.sort((a, b) => {
    switch (selectedSort.value) {
      case 'date_asc':
        return new Date(a.preferredDate || 0) - new Date(b.preferredDate || 0)
      case 'date_desc':
        return new Date(b.preferredDate || 0) - new Date(a.preferredDate || 0)
      case 'name_asc':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      case 'name_desc':
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
      case 'created_desc':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      case 'status':
        return (a.status || '').localeCompare(b.status || '')
      default:
        return 0
    }
  })

  return result
})

const totalPages = computed(() => 
  Math.ceil(filteredAppointments.value.length / props.itemsPerPage)
)

const paginatedAppointments = computed(() => {
  if (!props.showPagination) return filteredAppointments.value
  
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredAppointments.value.slice(start, end)
})

// Methods
const clearSearch = () => {
  searchQuery.value = ''
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedDateFilter.value = ''
  selectedSort.value = 'date_asc'
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
}

// Event handlers
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

const handleDetails = (appointment) => {
  emit('details', appointment)
}

const handleCardClick = (appointment) => {
  emit('card-clicked', appointment)
}

const handleActionClick = (data) => {
  emit('action-clicked', data)
}

const handleNewAppointment = () => {
  emit('new-appointment')
}

// Watchers
watch(
  [searchQuery, selectedStatus, selectedDateFilter],
  () => {
    currentPage.value = 1 // Reset to first page when filters change
  }
)

onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.appointment-list {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.list-controls {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.search-section {
  margin-bottom: 1rem;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
}

.clear-search-btn:hover {
  color: #495057;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  height: fit-content;
}

.clear-filters-btn:hover {
  background-color: #545b62;
}

.list-content {
  padding: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.appointments-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.results-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .list-header {
    padding: 1.5rem;
  }

  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .list-controls {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: unset;
  }

  .list-content {
    padding: 1rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .pagination-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .header-stats {
    grid-template-columns: 1fr;
  }

  .search-input-group {
    max-width: none;
  }

  .pagination {
    justify-content: space-between;
  }

  .pagination-info {
    order: -1;
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style> 