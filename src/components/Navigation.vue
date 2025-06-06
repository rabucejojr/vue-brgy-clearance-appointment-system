<template>
  <nav class="bg-white/95 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50 shadow-sm">
    <div class="container-full">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-3">
          <div class="bg-primary-600 text-white p-2 rounded-lg">
            <span class="text-xl font-bold">🏛️</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-secondary-900">Barangay Clearance</h1>
            <p class="text-xs text-secondary-600">Appointment System</p>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
              isActiveRoute(item.path)
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
            ]"
            @click="closeMenus"
          >
            <span class="mr-2">{{ item.icon }}</span>
            {{ item.name }}
            <span
              v-if="(item.name === 'My Appointments' && props.userRole === 'user') || 
                    (item.name === 'Manage Appointments' && (props.userRole === 'staff' || props.userRole === 'admin'))"
              v-show="badgeCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ badgeCount }}
            </span>
          </router-link>
        </div>

        <!-- User Menu & Mobile Toggle -->
        <div class="flex items-center space-x-3">
          <!-- User Menu (Desktop) -->
          <div v-if="isAuthenticated" class="hidden md:block relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
            >
              <div class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden lg:block">{{ userName }}</span>
              <svg class="w-4 h-4 transform transition-transform duration-200" :class="{ 'rotate-180': isUserMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- User Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-show="isUserMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-secondary-200 py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-secondary-100">
                  <p class="text-sm font-medium text-secondary-900">{{ userName }}</p>
                  <p class="text-xs text-secondary-500 capitalize">{{ userRole }} Account</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="isMenuOpen" class="md:hidden overflow-hidden">
          <div class="py-4 space-y-2 border-t border-secondary-200">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 relative',
                isActiveRoute(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
              ]"
              @click="closeMenus"
            >
              <div class="flex items-center space-x-3">
                <span class="text-lg">{{ item.icon }}</span>
                <span>{{ item.name }}</span>
              </div>
              <span
                v-if="(item.name === 'My Appointments' && props.userRole === 'user') || 
                      (item.name === 'Manage Appointments' && (props.userRole === 'staff' || props.userRole === 'admin'))"
                v-show="badgeCount > 0"
                class="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
              >
                {{ badgeCount }}
              </span>
            </router-link>

            <!-- Mobile User Section -->
            <div v-if="isAuthenticated" class="pt-4 mt-4 border-t border-secondary-200 mx-2">
              <div class="flex items-center space-x-3 px-4 py-3 bg-secondary-50 rounded-lg">
                <div class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {{ userName.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-secondary-900">{{ userName }}</p>
                  <p class="text-xs text-secondary-500 capitalize">{{ userRole }} Account</p>
                </div>
              </div>
              <button
                @click="handleLogout"
                class="w-full mt-2 flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <span>🚪</span>
                <span class="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Overlay for mobile menu -->
    <div
      v-if="isMenuOpen || isUserMenuOpen"
      @click="closeMenus"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
    ></div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  userRole: {
    type: String,
    default: 'user'
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: 'Guest'
  },
  userAppointmentCount: {
    type: Number,
    default: 0
  },
  pendingAppointmentCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['logout'])

// State
const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Computed
const menuItems = computed(() => {
  const items = [
    { name: 'Home', path: '/', icon: '🏠', roles: ['user', 'staff', 'admin'] },
    { name: 'Book Appointment', path: '/book-appointment', icon: '📅', roles: ['user', 'staff', 'admin'] },
    { name: 'Track Appointment', path: '/track-appointment', icon: '🔍', roles: ['user', 'staff', 'admin'] }
  ]

  if (props.isAuthenticated) {
    if (props.userRole === 'user') {
      items.push({ name: 'My Appointments', path: '/my-appointments', icon: '📋', roles: ['user'] })
    }
    
    if (props.userRole === 'staff' || props.userRole === 'admin') {
      items.push(
        { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['staff', 'admin'] },
        { name: 'Manage Appointments', path: '/manage-appointments', icon: '⚙️', roles: ['staff', 'admin'] }
      )
    }
  }

  return items.filter(item => item.roles.includes(props.userRole))
})

const badgeCount = computed(() => {
  if (props.userRole === 'user') {
    return props.userAppointmentCount
  }
  return props.pendingAppointmentCount
})

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isMenuOpen.value = false
  }
}

const closeMenus = () => {
  isMenuOpen.value = false
  isUserMenuOpen.value = false
}

const handleLogout = () => {
  emit('logout')
  closeMenus()
}

const isActiveRoute = (path) => {
  return router.currentRoute.value.path === path
}
</script> 