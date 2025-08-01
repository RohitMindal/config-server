# 🏥 Hospital Appointment Booking System

A modern, responsive web application for booking medical appointments with doctor slot management. Built with Node.js, Express, and vanilla JavaScript with a beautiful UI.

## ✨ Features

### 🩺 For Patients
- **Easy Doctor Search**: Browse doctors by specialty with filtering options
- **Real-time Slot Availability**: View available time slots for each doctor
- **4-Step Booking Process**: 
  1. Select Doctor
  2. Choose Date & Time
  3. Enter Patient Details
  4. Confirm Booking
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Appointment Confirmation**: Instant booking confirmation with appointment details

### 👨‍⚕️ For Healthcare Providers
- **Doctor Profiles**: Complete doctor information with specialties, experience, and ratings
- **Slot Management**: Flexible time slot configuration per doctor
- **Appointment Tracking**: View all appointments with patient details
- **Real-time Updates**: Automatic slot availability updates

### 🎨 Design Features
- **Modern UI**: Clean, professional design with smooth animations
- **Intuitive Navigation**: Step-by-step booking wizard
- **Visual Feedback**: Loading indicators, success modals, and error handling
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-appointment-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`
   - The application will be ready to use!

### Development Mode
For development with auto-reload:
```bash
npm run dev
```

## 📁 Project Structure

```
hospital-appointment-system/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # Frontend JavaScript
├── server.js               # Express server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get specific doctor
- `GET /api/doctors/:id/slots` - Get available slots for a doctor
- `GET /api/specialties` - Get all specialties

### Appointments
- `POST /api/appointments` - Book a new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🏥 Sample Doctors

The system comes pre-loaded with sample doctors:

1. **Dr. Sarah Johnson** - Cardiology (15 years experience)
2. **Dr. Michael Chen** - Neurology (12 years experience)
3. **Dr. Emily Rodriguez** - Pediatrics (10 years experience)
4. **Dr. Robert Thompson** - Orthopedics (18 years experience)

## 📅 Booking Process

### Step 1: Select Doctor
- Browse available doctors
- Filter by specialty
- View doctor profiles with ratings and experience

### Step 2: Choose Date & Time
- Select preferred date (up to 30 days in advance)
- View available time slots
- Real-time slot availability

### Step 3: Patient Information
- Enter patient name, email, and phone
- Optional reason for visit
- Form validation

### Step 4: Confirmation
- Review appointment details
- Confirm booking
- Receive appointment ID

## 🎨 Customization

### Adding New Doctors
Edit the `doctors` array in `server.js`:

```javascript
{
  id: 5,
  name: "Dr. Your Name",
  specialty: "Your Specialty",
  email: "email@hospital.com",
  phone: "+1-555-0105",
  experience: "X years",
  rating: 4.8,
  availableSlots: [
    // Add time slots
  ]
}
```

### Styling
Modify `public/styles.css` to customize:
- Colors and themes
- Typography
- Layout and spacing
- Responsive breakpoints

### Adding Features
The modular structure makes it easy to add:
- User authentication
- Payment processing
- Email notifications
- Calendar integration
- Medical history

## 🔐 Security Features

- Input validation on both frontend and backend
- SQL injection prevention (when using databases)
- XSS protection
- CORS configuration
- Rate limiting ready

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   PORT=5000
   NODE_ENV=production
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy to Platform**
   - Heroku
   - AWS
   - DigitalOcean
   - Vercel
   - Netlify

### Database Integration
For production, replace in-memory storage with:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- MySQL with Sequelize

Example MongoDB integration:
```javascript
// Replace in-memory arrays with MongoDB models
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
```

## 🔄 Future Enhancements

- [ ] User authentication and profiles
- [ ] Email/SMS notifications
- [ ] Payment gateway integration
- [ ] Telemedicine support
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Reporting and analytics
- [ ] Calendar sync (Google, Outlook)
- [ ] Medical records integration
- [ ] Insurance verification

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in server.js or set environment variable
PORT=3000 npm start
```

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Styling not loading:**
- Ensure `public/styles.css` exists
- Check browser console for errors
- Verify file paths in HTML

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Express.js community
- Healthcare professionals for feedback

---

**Made with ❤️ for better healthcare accessibility**