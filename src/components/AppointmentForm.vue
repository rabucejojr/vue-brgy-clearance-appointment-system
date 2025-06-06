<template>
  <div class="max-w-4xl mx-auto container-full py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">Book an Appointment</h1>
      <p class="text-responsive text-secondary-600">Complete the form below to schedule your barangay clearance appointment</p>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-secondary-700">Step {{ currentStep }} of 3</span>
        <span class="text-sm font-medium text-primary-600">{{ formProgress }}% Complete</span>
      </div>
      <div class="w-full bg-secondary-200 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
          :style="`width: ${formProgress}%`"
        ></div>
      </div>
      <div class="flex justify-between mt-4 text-sm">
        <span :class="currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-secondary-500'">Personal Info</span>
        <span :class="currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-secondary-500'">Contact Details</span>
        <span :class="currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-secondary-500'">Appointment</span>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Step 1: Personal Information -->
      <div v-show="currentStep === 1" class="card p-6 md:p-8">
        <h2 class="text-xl md:text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
          <span class="text-2xl mr-3">👤</span>
          Personal Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">First Name *</label>
            <input
              v-model="formData.firstName"
              type="text"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.firstName }"
              placeholder="Enter your first name"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Last Name *</label>
            <input
              v-model="formData.lastName"
              type="text"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.lastName }"
              placeholder="Enter your last name"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Middle Name</label>
            <input
              v-model="formData.middleName"
              type="text"
              class="input-field"
              placeholder="Enter your middle name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Suffix</label>
            <select v-model="formData.suffix" class="input-field">
              <option value="">Select suffix</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Birth Date *</label>
            <input
              v-model="formData.birthDate"
              type="date"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.birthDate }"
            />
            <p v-if="errors.birthDate" class="mt-1 text-sm text-red-600">{{ errors.birthDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Gender *</label>
            <select 
              v-model="formData.gender" 
              required 
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.gender }"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Civil Status *</label>
            <select 
              v-model="formData.civilStatus" 
              required 
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.civilStatus }"
            >
              <option value="">Select civil status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            <p v-if="errors.civilStatus" class="mt-1 text-sm text-red-600">{{ errors.civilStatus }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Nationality</label>
            <input
              v-model="formData.nationality"
              type="text"
              class="input-field"
              placeholder="Enter your nationality"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Contact Information -->
      <div v-show="currentStep === 2" class="card p-6 md:p-8">
        <h2 class="text-xl md:text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
          <span class="text-2xl mr-3">📱</span>
          Contact Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Phone Number *</label>
            <input
              v-model="formData.phoneNumber"
              type="tel"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.phoneNumber }"
              placeholder="09XXXXXXXXX"
            />
            <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">{{ errors.phoneNumber }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Email Address *</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.email }"
              placeholder="your.email@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Complete Address *</label>
            <textarea
              v-model="formData.address"
              required
              rows="3"
              class="input-field resize-none"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.address }"
              placeholder="Enter your complete address including house number, street, barangay, city, and province"
            ></textarea>
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Appointment Details -->
      <div v-show="currentStep === 3" class="card p-6 md:p-8">
        <h2 class="text-xl md:text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
          <span class="text-2xl mr-3">📅</span>
          Appointment Details
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Preferred Date *</label>
            <input
              v-model="formData.preferredDate"
              type="date"
              required
              :min="minDate"
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.preferredDate }"
            />
            <p v-if="errors.preferredDate" class="mt-1 text-sm text-red-600">{{ errors.preferredDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Preferred Time *</label>
            <select 
              v-model="formData.preferredTime" 
              required 
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.preferredTime }"
            >
              <option value="">Select time slot</option>
              <option value="08:00-09:00">8:00 AM - 9:00 AM</option>
              <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
              <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
              <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
              <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
              <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
              <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
              <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
            </select>
            <p v-if="errors.preferredTime" class="mt-1 text-sm text-red-600">{{ errors.preferredTime }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Purpose *</label>
            <select 
              v-model="formData.purpose" 
              required 
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.purpose }"
            >
              <option value="">Select purpose</option>
              <option value="Employment">Employment</option>
              <option value="Business Permit">Business Permit</option>
              <option value="Loan Application">Loan Application</option>
              <option value="School Requirement">School Requirement</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
            <p v-if="errors.purpose" class="mt-1 text-sm text-red-600">{{ errors.purpose }}</p>
          </div>

          <div v-if="formData.purpose === 'Other'">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Specify Purpose *</label>
            <input
              v-model="formData.otherPurpose"
              type="text"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.otherPurpose }"
              placeholder="Please specify the purpose"
            />
            <p v-if="errors.otherPurpose" class="mt-1 text-sm text-red-600">{{ errors.otherPurpose }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Special Notes/Requirements</label>
            <textarea
              v-model="formData.specialNotes"
              rows="3"
              class="input-field resize-none"
              placeholder="Any special requirements or notes for your appointment (optional)"
            ></textarea>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div class="flex items-start space-x-3">
            <input
              v-model="formData.agreeToTerms"
              type="checkbox"
              id="terms"
              required
              class="mt-1 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              :class="{ 'border-red-500': errors.agreeToTerms }"
            />
            <label for="terms" class="text-sm text-secondary-700 leading-relaxed">
              I agree to the 
              <button 
                type="button" 
                @click="showTermsModal = true"
                class="text-primary-600 hover:text-primary-700 underline font-medium"
              >
                terms and conditions
              </button>
              and confirm that all information provided is accurate and complete.
            </label>
          </div>
          <p v-if="errors.agreeToTerms" class="mt-2 text-sm text-red-600">{{ errors.agreeToTerms }}</p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          v-if="currentStep > 1"
          type="button"
          @click="prevStep"
          class="btn-secondary flex items-center justify-center space-x-2 order-2 sm:order-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Previous</span>
        </button>

        <div class="flex space-x-4 order-1 sm:order-2">
          <button
            v-if="currentStep < 3"
            type="button"
            @click="nextStep"
            :disabled="!isStepValid"
            class="btn-primary flex items-center justify-center space-x-2 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button
            v-if="currentStep === 3"
            type="submit"
            :disabled="!isStepValid || isSubmitting"
            class="btn-primary flex items-center justify-center space-x-2 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Submitting...' : 'Submit Application' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Terms Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showTermsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div class="p-6 border-b border-secondary-200">
            <h3 class="text-xl font-semibold text-secondary-900">Terms and Conditions</h3>
          </div>
          <div class="p-6 overflow-y-auto max-h-96 space-y-4 text-sm text-secondary-700 leading-relaxed">
            <p><strong>1. Appointment Scheduling:</strong> All appointments are subject to availability and confirmation by the barangay office.</p>
            <p><strong>2. Required Documents:</strong> Please bring valid ID and any supporting documents related to your clearance request.</p>
            <p><strong>3. Appointment Changes:</strong> Any changes to your appointment must be made at least 24 hours in advance.</p>
            <p><strong>4. Processing Time:</strong> Standard processing time is 1-3 business days depending on the purpose.</p>
            <p><strong>5. Privacy Policy:</strong> Your personal information will be used solely for processing your clearance and will not be shared with third parties.</p>
            <p><strong>6. Cancellation:</strong> No-show appointments may result in a temporary restriction on future bookings.</p>
          </div>
          <div class="p-6 border-t border-secondary-200 flex justify-end">
            <button
              @click="showTermsModal = false"
              class="btn-primary"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full">
          <div class="p-8 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-secondary-900 mb-2">Application Submitted Successfully!</h3>
            <p class="text-secondary-600 mb-6">Your appointment has been submitted and is being processed.</p>
            
            <div class="bg-secondary-50 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-secondary-900 mb-2">Reference Number</h4>
              <p class="text-lg font-mono text-primary-600 font-bold">{{ submittedData?.referenceNumber }}</p>
              <p class="text-sm text-secondary-600 mt-2">Please save this reference number for tracking your appointment.</p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button @click="closeSuccessModal" class="btn-secondary flex-1">
                Submit Another
              </button>
              <router-link to="/track-appointment" @click="closeSuccessModal" class="btn-primary flex-1 text-center">
                Track Status
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Emits
const emit = defineEmits(['appointment-submitted'])

// Form data
const formData = reactive({
  // Personal Information
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  birthDate: '',
  gender: '',
  civilStatus: '',
  nationality: 'Filipino',
  
  // Contact Information
  phoneNumber: '',
  email: '',
  address: '',
  
  // Appointment Details
  preferredDate: '',
  preferredTime: '',
  purpose: '',
  otherPurpose: '',
  specialNotes: '',
  
  // Terms and Conditions
  agreeToTerms: false
})

// Form state
const currentStep = ref(1)
const errors = reactive({})
const isSubmitting = ref(false)
const showTermsModal = ref(false)
const showSuccessModal = ref(false)
const submittedData = ref(null)

// Validation rules
const validateStep = (step) => {
  const stepErrors = {}
  
  if (step === 1) {
    if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required'
    if (!formData.birthDate) stepErrors.birthDate = 'Birth date is required'
    if (!formData.gender) stepErrors.gender = 'Gender is required'
    if (!formData.civilStatus) stepErrors.civilStatus = 'Civil status is required'
  }
  
  if (step === 2) {
    if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required'
    if (!formData.email.trim()) stepErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = 'Invalid email format'
    if (!formData.address.trim()) stepErrors.address = 'Address is required'
  }
  
  if (step === 3) {
    if (!formData.preferredDate) stepErrors.preferredDate = 'Preferred date is required'
    if (!formData.preferredTime) stepErrors.preferredTime = 'Preferred time is required'
    if (!formData.purpose) stepErrors.purpose = 'Purpose is required'
    if (formData.purpose === 'Other' && !formData.otherPurpose.trim()) {
      stepErrors.otherPurpose = 'Please specify the purpose'
    }
    if (!formData.agreeToTerms) stepErrors.agreeToTerms = 'You must agree to the terms and conditions'
  }
  
  return stepErrors
}

// Computed
const isStepValid = computed(() => {
  const stepErrors = validateStep(currentStep.value)
  return Object.keys(stepErrors).length === 0
})

const formProgress = computed(() => {
  return Math.round((currentStep.value / 3) * 100)
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Methods
const nextStep = () => {
  const stepErrors = validateStep(currentStep.value)
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, stepErrors)
  
  if (Object.keys(stepErrors).length === 0) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    Object.keys(errors).forEach(key => delete errors[key])
  }
}

const generateReferenceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BCA${year}${month}${day}${random}`
}

const submitForm = async () => {
  const stepErrors = validateStep(3)
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, stepErrors)
  
  if (Object.keys(stepErrors).length === 0) {
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const referenceNumber = generateReferenceNumber()
      const appointmentData = { ...formData }
      
      submittedData.value = {
        referenceNumber,
        appointmentData
      }
      
      emit('appointment-submitted', {
        referenceNumber,
        appointmentData
      })
      
      showSuccessModal.value = true
      
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      isSubmitting.value = false
    }
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'boolean') {
      formData[key] = false
    } else {
      formData[key] = ''
    }
  })
  formData.nationality = 'Filipino'
  currentStep.value = 1
  Object.keys(errors).forEach(key => delete errors[key])
  showSuccessModal.value = false
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
}
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