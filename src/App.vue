<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navigation from './components/Navigation.vue'

const router = useRouter()

// Application state
const isAuthenticated = ref(false)
const userRole = ref('user') // user, staff, admin
const userName = ref('John Doe')
const notification = ref(null)

// Sample appointments data (in a real app, this would come from an API)
const appointments = reactive([
  {
    id: 1,
    referenceNumber: 'BCA123456001',
    firstName: 'Maria',
    lastName: 'Santos',
    middleName: 'Cruz',
    suffix: '',
    birthDate: '1985-03-15',
    gender: 'Female',
    civilStatus: 'Married',
    nationality: 'Filipino',
    phoneNumber: '09123456789',
    email: 'maria.santos@email.com',
    address: '123 Main St, Barangay Central, Quezon City, Metro Manila',
    preferredDate: '2024-01-15',
    preferredTime: '09:00-10:00',
    purpose: 'Employment',
    otherPurpose: '',
    specialNotes: 'Need clearance for new job application',
    status: 'pending',
    createdAt: '2024-01-10T08:30:00Z'
  },
  {
    id: 2,
    referenceNumber: 'BCA123456002',
    firstName: 'Juan',
    lastName: 'dela Cruz',
    middleName: 'Garcia',
    suffix: 'Jr.',
    birthDate: '1990-07-22',
    gender: 'Male',
    civilStatus: 'Single',
    nationality: 'Filipino',
    phoneNumber: '09987654321',
    email: 'juan.delacruz@email.com',
    address: '456 Oak Ave, Barangay East, Makati City, Metro Manila',
    preferredDate: '2024-01-16',
    preferredTime: '14:00-15:00',
    purpose: 'Business Permit',
    otherPurpose: '',
    specialNotes: '',
    status: 'confirmed',
    createdAt: '2024-01-11T10:15:00Z'
  },
  {
    id: 3,
    referenceNumber: 'BCA123456003',
    firstName: 'Ana',
    lastName: 'Rodriguez',
    middleName: 'Lopez',
    suffix: '',
    birthDate: '1988-12-03',
    gender: 'Female',
    civilStatus: 'Single',
    nationality: 'Filipino',
    phoneNumber: '09555123456',
    email: 'ana.rodriguez@email.com',
    address: '789 Pine St, Barangay West, Pasig City, Metro Manila',
    preferredDate: '2024-01-14',
    preferredTime: '11:00-12:00',
    purpose: 'Loan Application',
    otherPurpose: '',
    specialNotes: 'Urgent processing needed',
    status: 'completed',
    createdAt: '2024-01-09T14:20:00Z'
  }
])

// Computed properties
const userAppointmentCount = computed(() => {
  if (userRole.value === 'user') {
    // In a real app, filter by current user's appointments
    return appointments.filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled').length
  }
  return 0
})

const pendingAppointmentCount = computed(() => {
  return appointments.filter(apt => apt.status === 'pending').length
})

// Methods
const showNotification = (message, type = 'success', icon = '✓') => {
  notification.value = { message, type, icon }
  setTimeout(() => {
    clearNotification()
  }, 5000)
}

const clearNotification = () => {
  notification.value = null
}

const handleLogout = () => {
  isAuthenticated.value = false
  userRole.value = 'user'
  userName.value = 'Guest'
  showNotification('You have been logged out', 'info', 'ℹ️')
  router.push('/')
}

const handleAppointmentSubmitted = (data) => {
  // Add new appointment to the list
  const newAppointment = {
    id: Date.now(),
    ...data.appointmentData,
    referenceNumber: data.referenceNumber,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  appointments.push(newAppointment)
  showNotification(`Appointment submitted successfully! Reference: ${data.referenceNumber}`, 'success', '✓')
}

const handleConfirmAppointment = (appointment) => {
  const index = appointments.findIndex(apt => apt.id === appointment.id)
  if (index !== -1) {
    appointments[index].status = 'confirmed'
    showNotification(`Appointment confirmed for ${appointment.firstName} ${appointment.lastName}`, 'success', '✓')
  }
}

const handleRescheduleAppointment = (appointment) => {
  showNotification(`Reschedule request submitted for ${appointment.firstName} ${appointment.lastName}`, 'info', '📅')
  // In a real app, you'd open a reschedule modal or navigate to a reschedule page
}

const handleCancelAppointment = (appointment) => {
  const index = appointments.findIndex(apt => apt.id === appointment.id)
  if (index !== -1) {
    appointments[index].status = 'cancelled'
    showNotification(`Appointment cancelled for ${appointment.firstName} ${appointment.lastName}`, 'warning', '⚠️')
  }
}

const handleCompleteAppointment = (appointment) => {
  const index = appointments.findIndex(apt => apt.id === appointment.id)
  if (index !== -1) {
    appointments[index].status = 'completed'
    showNotification(`Appointment completed for ${appointment.firstName} ${appointment.lastName}`, 'success', '✓')
  }
}

const handleNewAppointment = () => {
  router.push('/book-appointment')
}

const handleViewAllAppointments = () => {
  if (userRole.value === 'user') {
    router.push('/my-appointments')
  } else {
    router.push('/manage-appointments')
  }
}

const handleRefreshData = () => {
  // In a real app, refresh data from API
  showNotification('Data refreshed successfully', 'success', '🔄')
}

// Simulate authentication (for demo purposes)
const simulateLogin = (role = 'user') => {
  isAuthenticated.value = true
  userRole.value = role
  
  const names = {
    user: 'Maria Santos',
    staff: 'Juan Staff',
    admin: 'Admin User'
  }
  
  userName.value = names[role] || 'User'
  showNotification(`Logged in as ${role}`, 'success', '✓')
}

onMounted(() => {
  // For demo purposes, simulate user login
  // In a real app, check authentication state
  simulateLogin('admin') // Change to 'user', 'staff', or 'admin' to test different roles
})

// Expose methods for external use (e.g., from components)
defineExpose({
  simulateLogin,
  handleLogout,
  showNotification
})
</script>

<template>
  <div id="app" class="w-full min-h-screen flex flex-col bg-app">
    <Navigation
      :user-role="userRole"
      :is-authenticated="isAuthenticated"
      :user-name="userName"
      :user-appointment-count="userAppointmentCount"
      :pending-appointment-count="pendingAppointmentCount"
      @logout="handleLogout"
    />
    
    <main class="flex-1 w-full min-h-[calc(100vh-80px)] overflow-x-hidden">
      <RouterView 
        :appointments="appointments"
        :user-role="userRole"
        :is-authenticated="isAuthenticated"
        @appointment-submitted="handleAppointmentSubmitted"
        @confirm="handleConfirmAppointment"
        @reschedule="handleRescheduleAppointment"
        @cancel="handleCancelAppointment"
        @complete="handleCompleteAppointment"
        @new-appointment="handleNewAppointment"
        @view-all-appointments="handleViewAllAppointments"
        @refresh-data="handleRefreshData"
      />
    </main>

    <!-- Toast Notifications -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div 
        v-if="notification" 
        :class="[
          'fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999]',
          'rounded-xl shadow-2xl backdrop-blur-sm',
          'notification-' + notification.type
        ]"
      >
        <div class="flex items-center gap-3 p-4">
          <span class="text-xl flex-shrink-0">{{ notification.icon }}</span>
          <span class="flex-1 font-medium leading-tight text-responsive">{{ notification.message }}</span>
          <button 
            @click="clearNotification" 
            class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors duration-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Only keep essential styles that can't be replicated with Tailwind */
@media (max-width: 640px) {
  .main-content {
    min-height: calc(100vh - 60px);
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .main-content {
    min-height: calc(100vh - 60px);
  }
}
</style>
