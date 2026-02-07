import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientRegistration from './pages/patients/PatientRegistration';
import DoctorList from './pages/doctors/DoctorList';
import DoctorRegistration from './pages/doctors/DoctorRegistration';
import AppointmentCalendar from './pages/appointments/AppointmentCalendar';
import AppointmentBooking from './pages/appointments/AppointmentBooking';
import BillingList from './pages/billing/BillingList';
import CreateInvoice from './pages/billing/CreateInvoice';
import DatabaseViewer from './pages/admin/DatabaseViewer';
import RoomList from './pages/rooms/RoomList';
import StaffList from './pages/staff/StaffList';
import PharmacyList from './pages/pharmacy/PharmacyList';
import Settings from './pages/settings/Settings';
import EmergencyManager from './pages/emergency/EmergencyManager';
import PayrollManager from './pages/billing/PayrollManager';
import MachineryList from './pages/inventory/MachineryList';
import LaundryManager from './pages/inventory/LaundryManager';
import { DashboardLayout } from './layouts/DashboardLayout';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/register" element={<PatientRegistration />} /> {/* Changed path from "patients/new" to "patients/register" */}
            <Route path="doctors" element={<DoctorList />} />
            <Route path="doctors/register" element={<DoctorRegistration />} /> {/* Added Doctor Registration route */}
            <Route path="appointments" element={<AppointmentCalendar />} />
            <Route path="appointments/book" element={<AppointmentBooking />} />
            <Route path="billing" element={<BillingList />} />
            <Route path="billing/new" element={<CreateInvoice />} />
            <Route path="billing/payroll" element={<PayrollManager />} />
            <Route path="admin/db" element={<DatabaseViewer />} />
            <Route path="staff" element={<StaffList />} />
            
            <Route path="pharmacy" element={<PharmacyList />} />
            <Route path="rooms" element={<RoomList />} />
            <Route path="machinery" element={<MachineryList />} />
            <Route path="laundry" element={<LaundryManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="emergency" element={<EmergencyManager />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
