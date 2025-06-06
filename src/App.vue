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
  <div id="app">
    <Navigation
      :user-role="userRole"
      :is-authenticated="isAuthenticated"
      :user-name="userName"
      :user-appointment-count="userAppointmentCount"
      :pending-appointment-count="pendingAppointmentCount"
      @logout="handleLogout"
    />
    
    <main class="main-content">
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
    <div v-if="notification" class="notification" :class="notification.type">
      <div class="notification-content">
        <span class="notification-icon">{{ notification.icon }}</span>
        <span class="notification-message">{{ notification.message }}</span>
        <button @click="clearNotification" class="notification-close">×</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Global Reset & Fullscreen Setup */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 80px); /* Account for navigation height */
  padding: 0;
  background: transparent;
  overflow-x: hidden;
}

/* Responsive Container */
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Notification System - Enhanced Responsive */
.notification {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease-out;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.notification.success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.notification.warning {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: #212529;
}

.notification.info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  padding: 2px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

h1 { font-size: clamp(1.75rem, 4vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
h4 { font-size: clamp(1.1rem, 2.5vw, 1.5rem); }
h5 { font-size: clamp(1rem, 2vw, 1.25rem); }
h6 { font-size: clamp(0.9rem, 1.5vw, 1.1rem); }

p {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  line-height: 1.6;
  margin: 0;
}

/* Responsive Breakpoints */
/* Mobile First - Base styles for mobile (320px+) */
@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
  
  .container {
    padding: 0 0.75rem;
  }
  
  .main-content {
    min-height: calc(100vh - 60px);
  }
  
  .notification {
    top: 70px;
    right: 10px;
    left: 10px;
    max-width: none;
    border-radius: 8px;
  }
  
  .notification-content {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
  
  .notification-icon {
    font-size: 1rem;
  }
  
  .notification-message {
    font-size: 0.9rem;
  }
}

/* Small Mobile (375px+) */
@media (min-width: 375px) and (max-width: 600px) {
  .container {
    padding: 0 1rem;
  }
}

/* Tablet Portrait (601px+) */
@media (min-width: 601px) and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }
  
  .notification {
    max-width: 350px;
  }
}

/* Tablet Landscape (769px+) */
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  .notification {
    max-width: 400px;
    top: 100px;
  }
}

/* Desktop Small (1025px+) */
@media (min-width: 1025px) and (max-width: 1200px) {
  .container {
    max-width: 1000px;
  }
}

/* Desktop Medium (1201px+) */
@media (min-width: 1201px) and (max-width: 1400px) {
  .container {
    max-width: 1200px;
  }
}

/* Desktop Large (1401px+) */
@media (min-width: 1401px) {
  .container {
    max-width: 1400px;
    padding: 0 2rem;
  }
}

/* High DPI / Retina Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Landscape Orientation */
@media (orientation: landscape) and (max-height: 600px) {
  .main-content {
    min-height: calc(100vh - 60px);
  }
  
  .notification {
    top: 70px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  body {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* Global Utility Classes - Enhanced */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* Responsive Spacing */
.mb-1 { margin-bottom: clamp(0.25rem, 1vw, 0.5rem); }
.mb-2 { margin-bottom: clamp(0.5rem, 2vw, 1rem); }
.mb-3 { margin-bottom: clamp(1rem, 3vw, 1.5rem); }
.mb-4 { margin-bottom: clamp(1.5rem, 4vw, 2rem); }
.mb-5 { margin-bottom: clamp(2rem, 5vw, 3rem); }

.mt-1 { margin-top: clamp(0.25rem, 1vw, 0.5rem); }
.mt-2 { margin-top: clamp(0.5rem, 2vw, 1rem); }
.mt-3 { margin-top: clamp(1rem, 3vw, 1.5rem); }
.mt-4 { margin-top: clamp(1.5rem, 4vw, 2rem); }
.mt-5 { margin-top: clamp(2rem, 5vw, 3rem); }

.p-1 { padding: clamp(0.25rem, 1vw, 0.5rem); }
.p-2 { padding: clamp(0.5rem, 2vw, 1rem); }
.p-3 { padding: clamp(1rem, 3vw, 1.5rem); }
.p-4 { padding: clamp(1.5rem, 4vw, 2rem); }
.p-5 { padding: clamp(2rem, 5vw, 3rem); }

/* Layout Utilities */
.d-flex { display: flex; }
.d-block { display: block; }
.d-none { display: none; }
.d-grid { display: grid; }

.flex-column { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }
.align-stretch { align-items: stretch; }

.w-full { width: 100%; }
.w-auto { width: auto; }
.h-full { height: 100%; }
.h-auto { height: auto; }

/* Responsive Visibility */
.hidden-mobile { display: block; }
.hidden-tablet { display: block; }
.hidden-desktop { display: block; }

@media (max-width: 768px) {
  .hidden-mobile { display: none !important; }
  .visible-mobile { display: block !important; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hidden-tablet { display: none !important; }
  .visible-tablet { display: block !important; }
}

@media (min-width: 1025px) {
  .hidden-desktop { display: none !important; }
  .visible-desktop { display: block !important; }
}

/* Focus and Accessibility */
*:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Skip Link for Accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
}

.skip-link:focus {
  top: 6px;
}

/* Print Styles */
@media print {
  .notification,
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
  }
  
  * {
    box-shadow: none !important;
  }
}

/* Selection Styling */
::selection {
  background: rgba(0, 123, 255, 0.2);
  color: inherit;
}

::-moz-selection {
  background: rgba(0, 123, 255, 0.2);
  color: inherit;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
}
</style>
