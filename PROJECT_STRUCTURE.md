# Project Structure Documentation

## MediDesk - Hospital Management System

### Overview

MediDesk is a comprehensive hospital management system built with React (Frontend) and Express.js (Backend), using MySQL for data storage.

---

## Directory Structure

```
MediDesk-App/
├── client/                    # Frontend Application (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── layout/        # Layout components (Sidebar, Header)
│   │   │   └── ui/            # Base UI components (Button, Input, Table)
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Database viewer
│   │   │   ├── appointments/  # Appointment management
│   │   │   ├── billing/       # Invoices & Payroll
│   │   │   ├── doctors/       # Doctor registration & list
│   │   │   ├── emergency/     # Emergency contacts & ambulances
│   │   │   ├── inventory/     # Machinery & Laundry management
│   │   │   ├── patients/      # Patient registration & list
│   │   │   ├── pharmacy/      # Medicine inventory
│   │   │   ├── rooms/         # Room management
│   │   │   ├── settings/      # User settings & profile
│   │   │   ├── staff/         # Staff management
│   │   │   ├── Dashboard.tsx  # Main dashboard
│   │   │   └── Login.tsx      # Login page
│   │   │
│   │   ├── layouts/           # Page layouts
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app component with routing
│   │   └── main.tsx           # Application entry point
│   │
│   └── package.json           # Frontend dependencies
│
├── server/                    # Backend Application (Express + TypeScript)
│   ├── src/
│   │   ├── migrations/        # Database migration scripts
│   │   │   ├── migrate-doctor-details.ts
│   │   │   ├── migrate-emergency.ts
│   │   │   ├── migrate-laundry.ts
│   │   │   ├── migrate-machinery.ts
│   │   │   ├── migrate-payroll.ts
│   │   │   ├── migrate-pharmacy.ts
│   │   │   ├── migrate-rooms.ts
│   │   │   ├── migrate-user-details.ts
│   │   │   └── migrate-users.ts
│   │   │
│   │   ├── config/            # Configuration files
│   │   ├── scripts/           # Utility scripts
│   │   ├── index.ts           # Main API server with all routes
│   │   └── init-db.ts         # Database initialization
│   │
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
├── DEPLOYMENT.md              # Deployment instructions
└── README.md                  # Project documentation
```

---

## Core Modules

### 1. **Patient Management**

- Patient registration with comprehensive details
- Medical history tracking
- Emergency contact information
- Search and filter functionality

### 2. **Doctor Management**

- Doctor registration with professional credentials
- Specialization and department assignment
- Consultation fee management
- Banking details for payroll
- Aadhaar/PAN verification

### 3. **Appointment System**

- Appointment booking and scheduling
- Doctor-patient assignment
- Status tracking (Scheduled, Completed, Cancelled)

### 4. **Billing & Payroll**

- Invoice generation
- Payment tracking
- Payroll management for staff and doctors
- Multiple payment methods support

### 5. **Pharmacy**

- Medicine inventory management
- Stock tracking
- Expiry date monitoring
- Category-based organization

### 6. **Room Management**

- Room availability tracking
- Patient assignment
- Room type categorization (General, ICU, Private)
- Pricing management

### 7. **Staff Management**

- Staff registration with complete details
- Role-based access (Admin, Receptionist, Nurse, etc.)
- Banking information for payroll
- Verification status

### 8. **Emergency Services**

- Emergency contact directory
- Ambulance fleet management
- Real-time availability tracking

### 9. **Inventory Management**

- **Machinery**: Equipment tracking, maintenance scheduling
- **Laundry**: Bed linen and cleaning item management

### 10. **Administration**

- Database viewer
- User settings
- System configuration

---

## API Endpoints

### Authentication

- `POST /api/auth/login` - User authentication

### Patients

- `GET /api/patients` - Fetch all patients
- `POST /api/patients` - Create new patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors

- `GET /api/doctors` - Fetch all doctors
- `POST /api/doctors` - Create new doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments

- `GET /api/appointments` - Fetch all appointments
- `POST /api/appointments` - Book new appointment

### Billing

- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice

### Pharmacy

- `GET /api/medicines` - Fetch all medicines
- `POST /api/medicines` - Add new medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Rooms

- `GET /api/rooms` - Fetch all rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Staff (Users)

- `GET /api/users` - Fetch all staff
- `POST /api/users` - Register new staff
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Emergency

- `GET /api/ambulances` - Fetch ambulances
- `POST /api/ambulances` - Add ambulance
- `DELETE /api/ambulances/:id` - Delete ambulance
- `GET /api/emergency-contacts` - Fetch contacts
- `POST /api/emergency-contacts` - Add contact
- `DELETE /api/emergency-contacts/:id` - Delete contact

### Payroll

- `GET /api/payroll` - Fetch all payments
- `POST /api/payroll` - Record payment

### Machinery

- `GET /api/machinery` - Fetch all equipment
- `POST /api/machinery` - Add equipment
- `PUT /api/machinery/:id` - Update equipment
- `DELETE /api/machinery/:id` - Delete equipment

### Laundry

- `GET /api/laundry` - Fetch all laundry items
- `POST /api/laundry` - Add laundry item
- `PUT /api/laundry/:id` - Update item
- `DELETE /api/laundry/:id` - Delete item

### Admin

- `GET /api/admin/tables` - List all database tables
- `GET /api/admin/tables/:name` - View table data
- `GET /api/search?q=<query>` - Global search

---

## Database Schema

### Main Tables

1. **patients** - Patient records
2. **doctors** - Doctor profiles
3. **appointments** - Appointment bookings
4. **invoices** - Billing records
5. **medicines** - Pharmacy inventory
6. **rooms** - Room information
7. **users** - Staff accounts
8. **ambulances** - Ambulance fleet
9. **emergency_contacts** - Emergency directory
10. **payroll** - Payment records
11. **machinery** - Equipment inventory
12. **laundry** - Linen management

---

## Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Dotenv** - Environment configuration

---

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- SQL injection prevention
- CORS configuration
- Helmet for security headers

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Configure environment variables in `server/.env`
4. Run migrations:
   ```bash
   cd server
   npx ts-node src/init-db.ts
   npx ts-node src/migrations/migrate-users.ts
   # Run other migrations as needed
   ```
5. Start development servers:

   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

---

## Build Status

✅ **All Core Modules Implemented**
✅ **Frontend Build: Successful**
✅ **Backend Server: Running**
✅ **Database: Connected**

---

## Recent Enhancements

- ✅ Doctor registration with banking details
- ✅ Staff management with payroll integration
- ✅ Machinery & maintenance tracking
- ✅ Laundry management system
- ✅ Emergency services module
- ✅ Comprehensive payroll system

---

## Future Considerations

- Unit tests for critical functions
- Integration tests for API endpoints
- E2E tests for user workflows
- Performance optimization
- Mobile responsive improvements
- PWA capabilities
