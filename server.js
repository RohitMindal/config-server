const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (replace with MongoDB in production)
let doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@hospital.com",
    phone: "+1-555-0101",
    image: "/images/doctor1.jpg",
    experience: "15 years",
    rating: 4.9,
    availableSlots: [
      { date: "2024-01-15", time: "09:00", available: true },
      { date: "2024-01-15", time: "10:00", available: true },
      { date: "2024-01-15", time: "11:00", available: false },
      { date: "2024-01-15", time: "14:00", available: true },
      { date: "2024-01-16", time: "09:00", available: true },
      { date: "2024-01-16", time: "10:00", available: true },
      { date: "2024-01-16", time: "11:00", available: true }
    ]
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    email: "michael.chen@hospital.com",
    phone: "+1-555-0102",
    image: "/images/doctor2.jpg",
    experience: "12 years",
    rating: 4.8,
    availableSlots: [
      { date: "2024-01-15", time: "08:00", available: true },
      { date: "2024-01-15", time: "09:00", available: true },
      { date: "2024-01-15", time: "10:00", available: false },
      { date: "2024-01-15", time: "15:00", available: true },
      { date: "2024-01-16", time: "08:00", available: true },
      { date: "2024-01-16", time: "09:00", available: true }
    ]
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    email: "emily.rodriguez@hospital.com",
    phone: "+1-555-0103",
    image: "/images/doctor3.jpg",
    experience: "10 years",
    rating: 4.9,
    availableSlots: [
      { date: "2024-01-15", time: "09:30", available: true },
      { date: "2024-01-15", time: "10:30", available: true },
      { date: "2024-01-15", time: "11:30", available: true },
      { date: "2024-01-15", time: "14:30", available: true },
      { date: "2024-01-16", time: "09:30", available: true },
      { date: "2024-01-16", time: "10:30", available: false }
    ]
  },
  {
    id: 4,
    name: "Dr. Robert Thompson",
    specialty: "Orthopedics",
    email: "robert.thompson@hospital.com",
    phone: "+1-555-0104",
    image: "/images/doctor4.jpg",
    experience: "18 years",
    rating: 4.7,
    availableSlots: [
      { date: "2024-01-15", time: "08:30", available: true },
      { date: "2024-01-15", time: "09:30", available: true },
      { date: "2024-01-15", time: "10:30", available: true },
      { date: "2024-01-15", time: "13:30", available: true },
      { date: "2024-01-16", time: "08:30", available: false },
      { date: "2024-01-16", time: "09:30", available: true }
    ]
  }
];

let appointments = [];
let appointmentId = 1;

// API Routes

// Get all doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Get doctor by ID
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

// Get available slots for a doctor
app.get('/api/doctors/:id/slots', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  
  const { date } = req.query;
  let slots = doctor.availableSlots;
  
  if (date) {
    slots = slots.filter(slot => slot.date === date);
  }
  
  res.json(slots);
});

// Book an appointment
app.post('/api/appointments', (req, res) => {
  const { doctorId, date, time, patientName, patientEmail, patientPhone, reason } = req.body;
  
  // Validation
  if (!doctorId || !date || !time || !patientName || !patientEmail || !patientPhone) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Find doctor
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  
  // Check slot availability
  const slotIndex = doctor.availableSlots.findIndex(
    slot => slot.date === date && slot.time === time && slot.available
  );
  
  if (slotIndex === -1) {
    return res.status(400).json({ message: 'Slot is not available' });
  }
  
  // Book the slot
  doctor.availableSlots[slotIndex].available = false;
  
  // Create appointment
  const appointment = {
    id: appointmentId++,
    doctorId: parseInt(doctorId),
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    time,
    patientName,
    patientEmail,
    patientPhone,
    reason: reason || '',
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  };
  
  appointments.push(appointment);
  
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment
  });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  res.json(appointment);
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const appointmentIndex = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  const appointment = appointments[appointmentIndex];
  
  // Free up the slot
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  if (doctor) {
    const slotIndex = doctor.availableSlots.findIndex(
      slot => slot.date === appointment.date && slot.time === appointment.time
    );
    if (slotIndex !== -1) {
      doctor.availableSlots[slotIndex].available = true;
    }
  }
  
  appointments.splice(appointmentIndex, 1);
  res.json({ message: 'Appointment cancelled successfully' });
});

// Get specialties
app.get('/api/specialties', (req, res) => {
  const specialties = [...new Set(doctors.map(d => d.specialty))];
  res.json(specialties);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});