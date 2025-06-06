import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookAppointmentView from '../views/BookAppointmentView.vue'
import DashboardView from '../views/DashboardView.vue'
import MyAppointmentsView from '../views/MyAppointmentsView.vue'
import ManageAppointmentsView from '../views/ManageAppointmentsView.vue'
import TrackAppointmentView from '../views/TrackAppointmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/book-appointment',
      name: 'book-appointment',
      component: BookAppointmentView
    },
    {
      path: '/track-appointment',
      name: 'track-appointment',
      component: TrackAppointmentView
    },
    {
      path: '/my-appointments',
      name: 'my-appointments',
      component: MyAppointmentsView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/manage-appointments',
      name: 'manage-appointments',
      component: ManageAppointmentsView
    },
    // Redirect /about to home for now
    {
      path: '/about',
      redirect: '/'
    },
    // Catch all route - redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
