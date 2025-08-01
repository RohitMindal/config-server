// Hospital Appointment Booking System - API Demo
// This script demonstrates how to interact with the appointment booking API

const API_BASE = 'http://localhost:5000/api';

// Function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Demo functions
async function demo() {
    console.log('🏥 Hospital Appointment Booking System Demo\n');
    
    // 1. Get all doctors
    console.log('1. Fetching all doctors...');
    const doctorsResult = await apiRequest('/doctors');
    if (doctorsResult.success) {
        console.log(`✅ Found ${doctorsResult.data.length} doctors:`);
        doctorsResult.data.forEach(doctor => {
            console.log(`   - ${doctor.name} (${doctor.specialty}) - Rating: ${doctor.rating}`);
        });
    }
    console.log('');
    
    // 2. Get specialties
    console.log('2. Fetching specialties...');
    const specialtiesResult = await apiRequest('/specialties');
    if (specialtiesResult.success) {
        console.log(`✅ Available specialties: ${specialtiesResult.data.join(', ')}`);
    }
    console.log('');
    
    // 3. Get available slots for a specific doctor
    console.log('3. Fetching available slots for Dr. Sarah Johnson (Cardiology)...');
    const slotsResult = await apiRequest('/doctors/1/slots?date=2024-01-15');
    if (slotsResult.success) {
        console.log(`✅ Available slots for January 15, 2024:`);
        slotsResult.data.forEach(slot => {
            console.log(`   - ${slot.time} (${slot.available ? 'Available' : 'Booked'})`);
        });
    }
    console.log('');
    
    // 4. Book an appointment
    console.log('4. Booking an appointment...');
    const appointmentData = {
        doctorId: 1,
        date: '2024-01-15',
        time: '09:00',
        patientName: 'John Doe',
        patientEmail: 'john.doe@email.com',
        patientPhone: '+1-555-1234',
        reason: 'Regular checkup'
    };
    
    const bookingResult = await apiRequest('/appointments', 'POST', appointmentData);
    if (bookingResult.success) {
        console.log('✅ Appointment booked successfully!');
        console.log(`   Appointment ID: ${bookingResult.data.appointment.id}`);
        console.log(`   Doctor: ${bookingResult.data.appointment.doctorName}`);
        console.log(`   Date: ${bookingResult.data.appointment.date}`);
        console.log(`   Time: ${bookingResult.data.appointment.time}`);
        console.log(`   Patient: ${bookingResult.data.appointment.patientName}`);
    } else {
        console.log('❌ Booking failed:', bookingResult.data.message);
    }
    console.log('');
    
    // 5. Get all appointments
    console.log('5. Fetching all appointments...');
    const appointmentsResult = await apiRequest('/appointments');
    if (appointmentsResult.success) {
        console.log(`✅ Total appointments: ${appointmentsResult.data.length}`);
        appointmentsResult.data.forEach(appointment => {
            console.log(`   - #${appointment.id}: ${appointment.patientName} with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}`);
        });
    }
    console.log('');
    
    console.log('🎉 Demo completed! Visit http://localhost:5000 to see the web interface.');
}

// Run the demo
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    demo().catch(console.error);
} else {
    // Browser environment
    demo().catch(console.error);
}