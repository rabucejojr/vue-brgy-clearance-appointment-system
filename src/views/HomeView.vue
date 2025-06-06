<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Barangay Clearance <br>
            <span class="text-gradient">Appointment System</span>
          </h1>
          <p class="hero-description">
            Schedule your barangay clearance appointment online. Fast, convenient, and secure.
            Skip the long lines and book your appointment from the comfort of your home.
          </p>
          <div class="hero-actions">
            <button @click="navigateToBooking" class="btn btn-primary">
              📅 Book Appointment
            </button>
            <button @click="navigateToTracking" class="btn btn-secondary">
              🔍 Track Status
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="appointment-card-mockup">
            <div class="mockup-header">
              <div class="mockup-icon">🏛️</div>
              <div class="mockup-title">Appointment Confirmed</div>
            </div>
            <div class="mockup-content">
              <div class="mockup-field">
                <span class="mockup-label">Date:</span>
                <span class="mockup-value">Jan 15, 2024</span>
              </div>
              <div class="mockup-field">
                <span class="mockup-label">Time:</span>
                <span class="mockup-value">10:00 AM</span>
              </div>
              <div class="mockup-field">
                <span class="mockup-label">Reference:</span>
                <span class="mockup-value">BCA123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Choose Our System?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3 class="feature-title">24/7 Online Booking</h3>
            <p class="feature-description">
              Book your appointment anytime, anywhere. No need to visit during office hours.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">Fast Processing</h3>
            <p class="feature-description">
              Quick approval process with real-time updates on your appointment status.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Secure & Reliable</h3>
            <p class="feature-description">
              Your personal information is protected with industry-standard security measures.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Mobile Friendly</h3>
            <p class="feature-description">
              Optimized for all devices. Book and track appointments on your smartphone.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process">
      <div class="container">
        <h2 class="section-title">Simple 3-Step Process</h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Fill Application</h3>
              <p class="step-description">
                Complete the online form with your personal information and preferred appointment details.
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Wait for Confirmation</h3>
              <p class="step-description">
                Receive confirmation and appointment details within 24 hours via email or SMS.
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Visit & Collect</h3>
              <p class="step-description">
                Visit the barangay office on your scheduled date and time to collect your clearance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Get Started?</h2>
          <p class="cta-description">
            Book your barangay clearance appointment today and experience hassle-free service.
          </p>
          <button @click="navigateToBooking" class="btn btn-primary btn-large">
            📅 Book Your Appointment Now
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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
