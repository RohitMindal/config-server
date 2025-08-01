// Global variables
let doctors = [];
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;
let currentStep = 1;

// API base URL
const API_BASE = window.location.origin;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();
    loadSpecialties();
    setupDateInput();
    updateStepNavigation();
});

// API Functions
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showError('Failed to fetch data. Please try again.');
        return null;
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load doctors data
async function loadDoctors() {
    showLoading(true);
    const doctorsData = await fetchData('/api/doctors');
    showLoading(false);
    
    if (doctorsData) {
        doctors = doctorsData;
        displayDoctors(doctors);
        displayBookingDoctors(doctors);
    }
}

// Load specialties for filter
async function loadSpecialties() {
    const specialties = await fetchData('/api/specialties');
    if (specialties) {
        const filterSelect = document.getElementById('specialty-filter');
        specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            filterSelect.appendChild(option);
        });
    }
}

// Display doctors in the main section
function displayDoctors(doctorsToShow) {
    const doctorsGrid = document.getElementById('doctors-grid');
    doctorsGrid.innerHTML = '';

    doctorsToShow.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsGrid.appendChild(doctorCard);
    });
}

// Display doctors in booking section
function displayBookingDoctors(doctorsToShow) {
    const bookingGrid = document.getElementById('booking-doctors-grid');
    bookingGrid.innerHTML = '';

    doctorsToShow.forEach(doctor => {
        const doctorCard = createBookingDoctorCard(doctor);
        bookingGrid.appendChild(doctorCard);
    });
}

// Create doctor card for main section
function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    
    card.innerHTML = `
        <div class="doctor-image">
            <i class="fas fa-user-md"></i>
        </div>
        <h3>${doctor.name}</h3>
        <div class="doctor-specialty">${doctor.specialty}</div>
        <div class="doctor-rating">
            ${generateStars(doctor.rating)} (${doctor.rating})
        </div>
        <div class="doctor-experience">${doctor.experience} experience</div>
        <button class="book-doctor-btn" onclick="selectDoctorAndNavigate(${doctor.id})">
            Book Appointment
        </button>
    `;
    
    return card;
}

// Create doctor card for booking section
function createBookingDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'booking-doctor-card';
    card.onclick = () => selectDoctor(doctor);
    
    card.innerHTML = `
        <div class="doctor-image" style="width: 80px; height: 80px; font-size: 2rem; margin: 0 auto 1rem;">
            <i class="fas fa-user-md"></i>
        </div>
        <h4>${doctor.name}</h4>
        <div class="doctor-specialty">${doctor.specialty}</div>
        <div class="doctor-rating">
            ${generateStars(doctor.rating)} (${doctor.rating})
        </div>
    `;
    
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Filter doctors by specialty
function filterDoctors() {
    const selectedSpecialty = document.getElementById('specialty-filter').value;
    let filteredDoctors = doctors;
    
    if (selectedSpecialty) {
        filteredDoctors = doctors.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    displayDoctors(filteredDoctors);
}

// Select doctor and navigate to booking
function selectDoctorAndNavigate(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        selectDoctor(doctor);
        scrollToSection('book');
        nextStep();
    }
}

// Select doctor in booking flow
function selectDoctor(doctor) {
    selectedDoctor = doctor;
    
    // Remove selection from all cards
    document.querySelectorAll('.booking-doctor-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.booking-doctor-card').classList.add('selected');
    
    // Show selected doctor info in step 2
    displaySelectedDoctorInfo();
    
    updateStepNavigation();
}

// Display selected doctor info
function displaySelectedDoctorInfo() {
    const selectedDoctorCard = document.getElementById('selected-doctor-card');
    if (selectedDoctor) {
        selectedDoctorCard.innerHTML = `
            <div class="doctor-card" style="margin: 0;">
                <div class="doctor-image" style="width: 80px; height: 80px; font-size: 2rem;">
                    <i class="fas fa-user-md"></i>
                </div>
                <h4>${selectedDoctor.name}</h4>
                <div class="doctor-specialty">${selectedDoctor.specialty}</div>
                <div class="doctor-rating">
                    ${generateStars(selectedDoctor.rating)} (${selectedDoctor.rating})
                </div>
                <div class="doctor-experience">${selectedDoctor.experience} experience</div>
            </div>
        `;
    }
}

// Setup date input constraints
function setupDateInput() {
    const dateInput = document.getElementById('appointment-date');
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30); // Allow booking up to 30 days ahead
    
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];
}

// Load time slots for selected doctor and date
async function loadTimeSlots() {
    const dateInput = document.getElementById('appointment-date');
    selectedDate = dateInput.value;
    
    if (!selectedDoctor || !selectedDate) return;
    
    showLoading(true);
    const slots = await fetchData(`/api/doctors/${selectedDoctor.id}/slots?date=${selectedDate}`);
    showLoading(false);
    
    if (slots) {
        displayTimeSlots(slots);
    }
}

// Display time slots
function displayTimeSlots(slots) {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';
    
    if (slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p style="text-align: center; color: #666;">No available slots for this date.</p>';
        return;
    }
    
    slots.forEach(slot => {
        const timeSlot = document.createElement('div');
        timeSlot.className = `time-slot ${slot.available ? '' : 'unavailable'}`;
        timeSlot.textContent = formatTime(slot.time);
        
        if (slot.available) {
            timeSlot.onclick = () => selectTimeSlot(slot.time, timeSlot);
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

// Select time slot
function selectTimeSlot(time, element) {
    selectedTime = time;
    
    // Remove selection from all time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked slot
    element.classList.add('selected');
    
    updateStepNavigation();
}

// Format time for display
function formatTime(time) {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Step navigation functions
function nextStep() {
    if (currentStep < 4 && canProceedToNextStep()) {
        // Mark current step as completed
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        updateStepDisplay();
        updateStepNavigation();
        
        if (currentStep === 4) {
            displayAppointmentSummary();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Remove completed status from current step
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('completed');
        
        currentStep--;
        updateStepDisplay();
        updateStepNavigation();
    }
}

function canProceedToNextStep() {
    switch (currentStep) {
        case 1:
            return selectedDoctor !== null;
        case 2:
            return selectedDate !== null && selectedTime !== null;
        case 3:
            return validatePatientForm();
        default:
            return false;
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

function updateStepNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const bookBtn = document.getElementById('book-btn');
    
    // Previous button
    prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    // Next button
    nextBtn.style.display = currentStep < 4 ? 'inline-flex' : 'none';
    nextBtn.disabled = !canProceedToNextStep();
    
    // Book button
    bookBtn.style.display = currentStep === 4 ? 'inline-flex' : 'none';
}

// Validate patient form
function validatePatientForm() {
    const name = document.getElementById('patient-name').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    
    return name && email && phone;
}

// Display appointment summary
function displayAppointmentSummary() {
    const summaryContainer = document.getElementById('appointment-summary');
    const patientName = document.getElementById('patient-name').value;
    const patientEmail = document.getElementById('patient-email').value;
    const patientPhone = document.getElementById('patient-phone').value;
    const reason = document.getElementById('appointment-reason').value;
    
    summaryContainer.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Doctor:</span>
            <span class="summary-value">${selectedDoctor.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Specialty:</span>
            <span class="summary-value">${selectedDoctor.specialty}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${formatDate(selectedDate)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${formatTime(selectedTime)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Patient Name:</span>
            <span class="summary-value">${patientName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Email:</span>
            <span class="summary-value">${patientEmail}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Phone:</span>
            <span class="summary-value">${patientPhone}</span>
        </div>
        ${reason ? `
        <div class="summary-item">
            <span class="summary-label">Reason:</span>
            <span class="summary-value">${reason}</span>
        </div>
        ` : ''}
    `;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Book appointment
async function bookAppointment() {
    const patientName = document.getElementById('patient-name').value.trim();
    const patientEmail = document.getElementById('patient-email').value.trim();
    const patientPhone = document.getElementById('patient-phone').value.trim();
    const reason = document.getElementById('appointment-reason').value.trim();
    
    const appointmentData = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        patientName,
        patientEmail,
        patientPhone,
        reason
    };
    
    showLoading(true);
    
    try {
        const result = await postData('/api/appointments', appointmentData);
        showLoading(false);
        
        if (result) {
            showSuccessModal(result.appointment);
        }
    } catch (error) {
        showLoading(false);
        showError(error.message || 'Failed to book appointment. Please try again.');
    }
}

// Show success modal
function showSuccessModal(appointment) {
    const modal = document.getElementById('success-modal');
    const bookingDetails = document.getElementById('booking-details');
    
    bookingDetails.innerHTML = `
        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <h4 style="margin-bottom: 1rem; color: #2c3e50;">Appointment Details:</h4>
            <p><strong>Appointment ID:</strong> #${appointment.id}</p>
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${formatTime(appointment.time)}</p>
            <p><strong>Patient:</strong> ${appointment.patientName}</p>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('success-modal').classList.remove('show');
}

// Book another appointment
function bookAnother() {
    closeModal();
    resetBookingForm();
    currentStep = 1;
    updateStepDisplay();
    updateStepNavigation();
    scrollToSection('book');
}

// Reset booking form
function resetBookingForm() {
    selectedDoctor = null;
    selectedDate = null;
    selectedTime = null;
    
    document.getElementById('patient-form').reset();
    document.getElementById('appointment-date').value = '';
    document.getElementById('time-slots').innerHTML = '';
    document.getElementById('selected-doctor-card').innerHTML = '';
    
    // Remove all selections
    document.querySelectorAll('.booking-doctor-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('completed', 'active');
    });
    
    document.querySelector('.step[data-step="1"]').classList.add('active');
}

// Utility functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loading');
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    alert(message); // In a real app, you'd use a more sophisticated notification system
}

// Smooth navigation for nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Form validation on input
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('#patient-form input, #patient-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateStepNavigation();
        });
    });
});

// Update date display when changed
document.getElementById('appointment-date').addEventListener('change', function() {
    selectedDate = this.value;
    selectedTime = null;
    
    // Clear selected time slot
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    updateStepNavigation();
});