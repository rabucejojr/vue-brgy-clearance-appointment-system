<template>
  <div class="appointment-form">
    <div class="form-header">
      <h2>Book Barangay Clearance Appointment</h2>
      <p>Please fill in the required information to schedule your appointment</p>
    </div>

    <form @submit.prevent="submitForm" class="form-container">
      <!-- Personal Information Section -->
      <div class="form-section">
        <h3>Personal Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              :class="{ error: errors.firstName }"
            />
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              :class="{ error: errors.lastName }"
            />
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="middleName">Middle Name</label>
            <input
              id="middleName"
              v-model="formData.middleName"
              type="text"
            />
          </div>
          <div class="form-group">
            <label for="suffix">Suffix</label>
            <select id="suffix" v-model="formData.suffix">
              <option value="">Select Suffix</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="birthDate">Date of Birth *</label>
            <input
              id="birthDate"
              v-model="formData.birthDate"
              type="date"
              required
              :class="{ error: errors.birthDate }"
            />
            <span v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</span>
          </div>
          <div class="form-group">
            <label for="gender">Gender *</label>
            <select id="gender" v-model="formData.gender" required :class="{ error: errors.gender }">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="civilStatus">Civil Status *</label>
            <select id="civilStatus" v-model="formData.civilStatus" required :class="{ error: errors.civilStatus }">
              <option value="">Select Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Divorced">Divorced</option>
            </select>
            <span v-if="errors.civilStatus" class="error-message">{{ errors.civilStatus }}</span>
          </div>
          <div class="form-group">
            <label for="nationality">Nationality *</label>
            <input
              id="nationality"
              v-model="formData.nationality"
              type="text"
              required
              :class="{ error: errors.nationality }"
              placeholder="e.g., Filipino"
            />
            <span v-if="errors.nationality" class="error-message">{{ errors.nationality }}</span>
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="form-section">
        <h3>Contact Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="phoneNumber">Phone Number *</label>
            <input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              type="tel"
              required
              :class="{ error: errors.phoneNumber }"
              placeholder="09XXXXXXXXX"
            />
            <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Complete Address *</label>
          <textarea
            id="address"
            v-model="formData.address"
            required
            :class="{ error: errors.address }"
            placeholder="House No., Street, Subdivision/Village, City/Municipality, Province"
            rows="3"
          ></textarea>
          <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
        </div>
      </div>

      <!-- Appointment Details Section -->
      <div class="form-section">
        <h3>Appointment Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="preferredDate">Preferred Date *</label>
            <input
              id="preferredDate"
              v-model="formData.preferredDate"
              type="date"
              required
              :min="minDate"
              :class="{ error: errors.preferredDate }"
            />
            <span v-if="errors.preferredDate" class="error-message">{{ errors.preferredDate }}</span>
          </div>
          <div class="form-group">
            <label for="preferredTime">Preferred Time *</label>
            <select id="preferredTime" v-model="formData.preferredTime" required :class="{ error: errors.preferredTime }">
              <option value="">Select Time Slot</option>
              <option value="08:00-09:00">8:00 AM - 9:00 AM</option>
              <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
              <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
              <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
              <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
              <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
              <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
              <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
            </select>
            <span v-if="errors.preferredTime" class="error-message">{{ errors.preferredTime }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="purpose">Purpose of Clearance *</label>
          <select id="purpose" v-model="formData.purpose" required :class="{ error: errors.purpose }">
            <option value="">Select Purpose</option>
            <option value="Employment">Employment</option>
            <option value="Business Permit">Business Permit</option>
            <option value="Loan Application">Loan Application</option>
            <option value="School Requirement">School Requirement</option>
            <option value="Travel/Visa">Travel/Visa</option>
            <option value="Insurance">Insurance</option>
            <option value="Others">Others</option>
          </select>
          <span v-if="errors.purpose" class="error-message">{{ errors.purpose }}</span>
        </div>

        <div v-if="formData.purpose === 'Others'" class="form-group">
          <label for="otherPurpose">Please Specify *</label>
          <input
            id="otherPurpose"
            v-model="formData.otherPurpose"
            type="text"
            required
            :class="{ error: errors.otherPurpose }"
            placeholder="Please specify the purpose"
          />
          <span v-if="errors.otherPurpose" class="error-message">{{ errors.otherPurpose }}</span>
        </div>

        <div class="form-group">
          <label for="specialNotes">Special Notes/Requests</label>
          <textarea
            id="specialNotes"
            v-model="formData.specialNotes"
            placeholder="Any special requests or additional information"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="form-section">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.agreeToTerms"
              required
            />
            <span class="checkmark"></span>
            I agree to the <a href="#" @click.prevent="showTerms = true">terms and conditions</a> and acknowledge that the information provided is accurate *
          </label>
          <span v-if="errors.agreeToTerms" class="error-message">{{ errors.agreeToTerms }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          {{ isSubmitting ? 'Submitting...' : 'Submit Appointment' }}
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <h3>✓ Appointment Submitted Successfully!</h3>
      <p>Your appointment reference number is: <strong>{{ referenceNumber }}</strong></p>
      <p>Please save this reference number for your records. You will receive a confirmation message shortly.</p>
    </div>

    <!-- Terms Modal (simplified) -->
    <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Terms and Conditions</h3>
          <button @click="showTerms = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>By submitting this appointment request, you agree to:</p>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Arrive on time for your scheduled appointment</li>
            <li>Bring valid identification and required documents</li>
            <li>Follow barangay health and safety protocols</li>
            <li>Understand that false information may result in cancellation</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button @click="showTerms = false" class="btn btn-primary">I Understand</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  birthDate: '',
  gender: '',
  civilStatus: '',
  nationality: 'Filipino',
  phoneNumber: '',
  email: '',
  address: '',
  preferredDate: '',
  preferredTime: '',
  purpose: '',
  otherPurpose: '',
  specialNotes: '',
  agreeToTerms: false
})

// Form state
const errors = reactive({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showTerms = ref(false)
const referenceNumber = ref('')

// Computed properties
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Validation functions
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Required field validation
  const requiredFields = {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    birthDate: 'Date of birth is required',
    gender: 'Gender is required',
    civilStatus: 'Civil status is required',
    nationality: 'Nationality is required',
    phoneNumber: 'Phone number is required',
    address: 'Address is required',
    preferredDate: 'Preferred date is required',
    preferredTime: 'Preferred time is required',
    purpose: 'Purpose is required'
  }

  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = message
      isValid = false
    }
  })

  // Special validations
  if (formData.purpose === 'Others' && (!formData.otherPurpose || formData.otherPurpose.trim() === '')) {
    errors.otherPurpose = 'Please specify the purpose'
    isValid = false
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions'
    isValid = false
  }

  // Phone number validation
  if (formData.phoneNumber && !/^09\d{9}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be in format 09XXXXXXXXX'
    isValid = false
  }

  // Date validation
  if (formData.preferredDate) {
    const selectedDate = new Date(formData.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate <= today) {
      errors.preferredDate = 'Please select a future date'
      isValid = false
    }
  }

  return isValid
}

// Generate reference number
const generateReferenceNumber = () => {
  const prefix = 'BCA'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Form submission
const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate reference number
    referenceNumber.value = generateReferenceNumber()
    
    // Show success message
    showSuccess.value = true
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  } catch (error) {
    console.error('Error submitting appointment:', error)
    alert('An error occurred while submitting your appointment. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'boolean') {
      formData[key] = false
    } else {
      formData[key] = ''
    }
  })
  formData.nationality = 'Filipino' // Reset to default
  Object.keys(errors).forEach(key => delete errors[key])
  showSuccess.value = false
}

// Emit events (for parent component communication)
const emit = defineEmits(['appointment-submitted'])

// Watch for successful submission to emit event
const onSubmissionSuccess = () => {
  emit('appointment-submitted', {
    referenceNumber: referenceNumber.value,
    appointmentData: { ...formData }
  })
}

onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.appointment-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.form-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-header p {
  color: #6c757d;
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.2rem;
}

.checkbox-label a {
  color: #007bff;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 2rem;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
  transform: translateY(-1px);
}

.success-message {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.success-message h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.success-message p {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover {
  color: #495057;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body ul {
  padding-left: 1.5rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: right;
}

/* Responsive Design */
@media (max-width: 768px) {
  .appointment-form {
    padding: 1rem;
    margin: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .form-section {
    padding: 1rem;
  }
}
</style> 