<template>
  <nav class="navigation" :class="{ 'mobile-open': isMobileMenuOpen }">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link" @click="closeMobileMenu">
          <div class="brand-logo">🏛️</div>
          <div class="brand-text">
            <h1>Barangay Clearance</h1>
            <span>Appointment System</span>
          </div>
        </router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <button 
        class="mobile-menu-toggle"
        @click="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle navigation menu"
      >
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
      </button>

      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'mobile-open': isMobileMenuOpen }">
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/') }"
            >
              <i class="nav-icon">🏠</i>
              <span>Home</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              to="/book-appointment" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/book-appointment') }"
            >
              <i class="nav-icon">📅</i>
              <span>Book Appointment</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              to="/my-appointments" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/my-appointments') }"
            >
              <i class="nav-icon">📋</i>
              <span>My Appointments</span>
              <span v-if="userAppointmentCount > 0" class="nav-badge">{{ userAppointmentCount }}</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              to="/track-appointment" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/track-appointment') }"
            >
              <i class="nav-icon">🔍</i>
              <span>Track Status</span>
            </router-link>
          </li>

          <!-- Admin/Staff Links -->
          <li v-if="isAdminOrStaff" class="nav-item nav-divider">
            <router-link 
              to="/dashboard" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/dashboard') }"
            >
              <i class="nav-icon">📊</i>
              <span>Dashboard</span>
            </router-link>
          </li>

          <li v-if="isAdminOrStaff" class="nav-item">
            <router-link 
              to="/manage-appointments" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/manage-appointments') }"
            >
              <i class="nav-icon">⚙️</i>
              <span>Manage Appointments</span>
              <span v-if="pendingAppointmentCount > 0" class="nav-badge urgent">{{ pendingAppointmentCount }}</span>
            </router-link>
          </li>

          <li v-if="userRole === 'admin'" class="nav-item">
            <router-link 
              to="/reports" 
              class="nav-link" 
              @click="closeMobileMenu"
              :class="{ active: isActiveRoute('/reports') }"
            >
              <i class="nav-icon">📈</i>
              <span>Reports</span>
            </router-link>
          </li>
        </ul>

        <!-- User Actions -->
        <div class="nav-actions">
          <div v-if="isAuthenticated" class="user-menu">
            <button 
              class="user-menu-toggle"
              @click="toggleUserMenu"
              :aria-expanded="isUserMenuOpen"
            >
              <div class="user-avatar">
                <i class="avatar-icon">👤</i>
              </div>
              <div class="user-info">
                <span class="user-name">{{ userName }}</span>
                <span class="user-role">{{ roleDisplayName }}</span>
              </div>
              <i class="dropdown-arrow" :class="{ open: isUserMenuOpen }">▼</i>
            </button>

            <div class="user-dropdown" :class="{ open: isUserMenuOpen }">
              <ul>
                <li>
                  <router-link to="/profile" @click="closeUserMenu">
                    <i class="menu-icon">👤</i>
                    Profile
                  </router-link>
                </li>
                <li>
                  <router-link to="/settings" @click="closeUserMenu">
                    <i class="menu-icon">⚙️</i>
                    Settings
                  </router-link>
                </li>
                <li>
                  <button @click="handleLogout" class="logout-btn">
                    <i class="menu-icon">🚪</i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="auth-actions">
            <router-link to="/login" class="btn btn-outline" @click="closeMobileMenu">
              Login
            </router-link>
            <router-link to="/register" class="btn btn-primary" @click="closeMobileMenu">
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps({
  userRole: {
    type: String,
    default: 'user' // user, staff, admin
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: 'User'
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

// Reactive data
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const route = useRoute()

// Computed properties
const isAdminOrStaff = computed(() => {
  return ['admin', 'staff'].includes(props.userRole)
})

const roleDisplayName = computed(() => {
  const roleMap = {
    'admin': 'Administrator',
    'staff': 'Staff',
    'user': 'Resident'
  }
  return roleMap[props.userRole] || 'User'
})

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  closeUserMenu()
  closeMobileMenu()
  emit('logout')
}

// Handle clicks outside user menu
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    closeUserMenu()
  }
}

// Handle escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu()
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.navigation {
  background: #ffffff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e9ecef;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 70px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.brand-link:hover {
  transform: translateY(-1px);
}

.brand-logo {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.brand-text h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
}

.brand-text span {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.2;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;
}

.mobile-menu-toggle:hover {
  transform: scale(1.1);
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: #495057;
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-item.nav-divider::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 24px;
  background: #e9ecef;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #007bff;
  transform: translateY(-1px);
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #007bff;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

.nav-badge.urgent {
  background: #dc3545;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.nav-actions {
  flex-shrink: 0;
}

.user-menu {
  position: relative;
}

.user-menu-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu-toggle:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.2;
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
}

.user-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.user-dropdown li {
  margin: 0;
}

.user-dropdown a,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.user-dropdown a:hover,
.logout-btn:hover {
  background: #f8f9fa;
  color: #007bff;
}

.menu-icon {
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

.auth-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.mobile-overlay {
  display: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    gap: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .nav-links.mobile-open {
    transform: translateX(0);
  }

  .nav-menu {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .nav-item {
    width: 100%;
  }

  .nav-item.nav-divider::before {
    display: none;
  }

  .nav-item.nav-divider {
    border-top: 1px solid #e9ecef;
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .nav-link {
    width: 100%;
    padding: 1rem;
    justify-content: flex-start;
    font-size: 1rem;
  }

  .nav-actions {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e9ecef;
  }

  .user-menu-toggle {
    width: 100%;
    justify-content: flex-start;
    border-radius: 8px;
  }

  .user-dropdown {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    border: none;
    margin-top: 0.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    display: none;
  }

  .user-dropdown.open {
    display: block;
  }

  .auth-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .brand-text h1 {
    font-size: 1rem;
  }

  .brand-text span {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 60px;
  }

  .nav-links {
    top: 60px;
    padding: 1rem;
  }

  .mobile-overlay {
    top: 60px;
  }

  .brand-text {
    display: none;
  }
}
</style> 