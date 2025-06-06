<template>
  <div class="dashboard-view">
    <Dashboard 
      :appointments="appointments"
      :user-role="userRole"
      @new-appointment="handleNewAppointment"
      @view-all-appointments="handleViewAllAppointments"
      @refresh-data="handleRefreshData"
    />
  </div>
</template>

<script setup>
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

const emit = defineEmits(['new-appointment', 'view-all-appointments', 'refresh-data'])

import Dashboard from '../components/Dashboard.vue'

const handleNewAppointment = () => {
  emit('new-appointment')
}

const handleViewAllAppointments = () => {
  emit('view-all-appointments')
}

const handleRefreshData = () => {
  emit('refresh-data')
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style> 