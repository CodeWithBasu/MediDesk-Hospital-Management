import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name: string;
    appointment_date: string;
    reason: string;
    status: string;
}

const AppointmentCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
      fetchAppointments();
  }, [currentDate]); // Re-fetch might not be needed on date change if we fetch ALL, but good practice if we implement range filtering later. For now let's just fetch once or on mount.
  // Actually, let's just fetch once for now as we don't have server-side date filtering yet.
  
  const fetchAppointments = async () => {
      try {
          const response = await axios.get('http://localhost:5000/api/appointments');
          setAppointments(response.data);
      } catch (error) {
          console.error("Error fetching appointments:", error);
      }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCells = () => {
    const cells = [];
    
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border-r border-b border-gray-100" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        
        const appointmentsForDay = appointments.filter(app => {
            const appDate = new Date(app.appointment_date);
            return appDate.getDate() === d && 
                   appDate.getMonth() === currentDate.getMonth() && 
                   appDate.getFullYear() === currentDate.getFullYear();
        });

        const isToday = new Date().getDate() === d && 
                        new Date().getMonth() === currentDate.getMonth() &&
                        new Date().getFullYear() === currentDate.getFullYear();

        cells.push(
            <div key={d} className={cn("h-32 border-r border-b border-gray-100 p-2 transition-colors hover:bg-gray-50 relative group", isToday && "bg-blue-50")}>
                <span className={cn("text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full", isToday ? "bg-blue-600 text-white" : "text-gray-700")}>
                    {d}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                    {appointmentsForDay.map(app => (
                        <div key={app.id} className="text-xs p-1.5 bg-white border border-blue-100 rounded text-blue-700 shadow-sm truncate">
                            <div className="font-semibold">{new Date(app.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="truncate">{app.patient_name}</div>
                            <div className="truncate text-gray-500 text-[10px]">{app.doctor_name}</div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => navigate('/appointments/book')}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return cells;
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage doctor schedules and patient bookings</p>
        </div>
        <div className="flex items-center space-x-4">
             <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                 <Button variant="ghost" size="icon" onClick={prevMonth}>
                     <ChevronLeft className="w-5 h-5" />
                 </Button>
                 <span className="w-40 text-center font-semibold text-gray-700">
                     {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </span>
                 <Button variant="ghost" size="icon" onClick={nextMonth}>
                     <ChevronRight className="w-5 h-5" />
                 </Button>
             </div>
             <Button onClick={() => navigate('/appointments/book')}>
                 <Plus className="w-4 h-4 mr-2" />
                 New Appointment
             </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {DAYS.map(day => (
                  <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {day}
                  </div>
              ))}
          </div>
          <div className="grid grid-cols-7 flex-1 overflow-y-auto">
              {renderCells()}
          </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
