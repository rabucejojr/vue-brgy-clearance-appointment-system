<template>
  <div class="min-h-screen bg-app">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative container-full py-20 md:py-32">
        <div class="text-center text-white max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Barangay Clearance
            <span class="block text-3xl md:text-5xl text-blue-100 mt-2">Appointment System</span>
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Schedule your barangay clearance appointment online. Fast, convenient, and hassle-free service for all residents.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button
              @click="navigateToBooking"
              class="w-full sm:w-auto bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📅 Book Appointment
            </button>
            <button
              @click="navigateToTracking"
              class="w-full sm:w-auto bg-primary-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-800/70 transition-all duration-300 border border-white/20"
            >
              🔍 Track Status
            </button>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
          <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 70C1248 65 1344 55 1392 50L1440 45V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="container-full">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Why Choose Our System?</h2>
          <p class="text-lg text-secondary-600 max-w-2xl mx-auto">
            Experience the convenience of digital appointment booking with our comprehensive features designed for efficiency and ease of use.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-semibold text-secondary-900 mb-4">{{ feature.title }}</h3>
            <p class="text-secondary-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-20 bg-secondary-50">
      <div class="container-full">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">How It Works</h2>
          <p class="text-lg text-secondary-600 max-w-2xl mx-auto">
            Get your barangay clearance in three simple steps. Our streamlined process makes it quick and easy.
          </p>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(step, index) in processSteps"
              :key="step.step"
              class="relative"
            >
              <!-- Connector Line (hidden on mobile) -->
              <div
                v-if="index < processSteps.length - 1"
                class="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-400 z-0"
                style="width: calc(100% - 3rem); left: 3rem;"
              ></div>
              
              <div class="relative z-10 text-center">
                <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">
                  {{ step.icon }}
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div class="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {{ step.step }}
                  </div>
                  <h3 class="text-xl font-semibold text-secondary-900 mb-3">{{ step.title }}</h3>
                  <p class="text-secondary-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div class="container-full text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p class="text-xl text-blue-100 mb-8 leading-relaxed">
            Book your barangay clearance appointment today and experience the convenience of our digital system.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              @click="navigateToBooking"
              class="w-full sm:w-auto bg-white text-primary-700 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <span>📅</span>
              <span>Book Your Appointment</span>
            </button>
            
            <button
              @click="navigateToTracking"
              class="w-full sm:w-auto bg-transparent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center space-x-2"
            >
              <span>🔍</span>
              <span>Track Existing Application</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-secondary-900 text-secondary-300 py-12">
      <div class="container-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">🏛️</span>
              </div>
              <h3 class="text-xl font-bold text-white">Barangay Clearance</h3>
            </div>
            <p class="text-secondary-400 leading-relaxed">
              Efficient and convenient barangay clearance appointment system for all residents.
            </p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><router-link to="/book-appointment" class="hover:text-primary-400 transition-colors">Book Appointment</router-link></li>
              <li><router-link to="/track-appointment" class="hover:text-primary-400 transition-colors">Track Status</router-link></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Office Hours</h4>
            <div class="space-y-2 text-secondary-400">
              <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p>Saturday: 8:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div class="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p class="text-secondary-400">
            © 2024 Barangay Clearance Appointment System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const features = ref([
  {
    icon: '📅',
    title: 'Easy Scheduling',
    description: 'Book your barangay clearance appointment online in just a few clicks.'
  },
  {
    icon: '⏱️',
    title: 'Time Saving',
    description: 'Avoid long queues and waiting times with our efficient booking system.'
  },
  {
    icon: '📱',
    title: 'Track Status',
    description: 'Monitor your application status in real-time with our tracking feature.'
  },
  {
    icon: '🔒',
    title: 'Secure Process',
    description: 'Your personal information is protected with industry-standard security.'
  },
  {
    icon: '📋',
    title: 'Digital Records',
    description: 'All your appointments and documents are stored digitally for easy access.'
  },
  {
    icon: '💬',
    title: '24/7 Support',
    description: 'Get help whenever you need it with our comprehensive support system.'
  }
])

const processSteps = ref([
  {
    step: 1,
    title: 'Fill the Form',
    description: 'Complete the online appointment form with your personal information',
    icon: '📝'
  },
  {
    step: 2,
    title: 'Choose Date & Time',
    description: 'Select your preferred appointment date and time slot',
    icon: '📅'
  },
  {
    step: 3,
    title: 'Get Confirmation',
    description: 'Receive confirmation and visit the barangay office on your scheduled date',
    icon: '✅'
  }
])

// Navigation methods
const navigateToBooking = () => {
  router.push('/book-appointment')
}

const navigateToTracking = () => {
  router.push('/track-appointment')
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.text-gradient {
  background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.2rem;
}

/* Hero Mockup */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.appointment-card-mockup {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
  color: #2c3e50;
  transform: rotate(5deg);
  transition: transform 0.3s ease;
}

.appointment-card-mockup:hover {
  transform: rotate(0deg);
}

.mockup-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.mockup-icon {
  font-size: 2rem;
}

.mockup-title {
  font-weight: 600;
  color: #28a745;
}

.mockup-field {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.mockup-label {
  font-weight: 500;
  color: #6c757d;
}

.mockup-value {
  font-weight: 600;
  color: #2c3e50;
}

/* Features Section */
.features {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-description {
  color: #6c757d;
  line-height: 1.6;
}

/* Process Section */
.process {
  padding: 4rem 0;
  background: white;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.step-description {
  color: #6c757d;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .step {
    text-align: center;
    flex-direction: column;
    align-items: center;
  }

  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }

  .appointment-card-mockup {
    transform: none;
  }
}
</style>
