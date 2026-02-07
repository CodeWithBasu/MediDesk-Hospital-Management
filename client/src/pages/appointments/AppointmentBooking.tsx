import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

const AppointmentBooking: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/patients'),
                    axios.get('http://localhost:5000/api/doctors')
                ]);
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const appointmentDateTime = `${formData.date} ${formData.time}:00`;

        try {
            await axios.post('http://localhost:5000/api/appointments', {
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                appointmentDate: appointmentDateTime,
                reason: formData.reason,
                status: formData.status
            });
            alert("Appointment Booked Successfully!");
            navigate('/appointments');
        } catch (error) {
            console.error(error);
            alert("Failed to book appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600" onClick={() => navigate('/appointments')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Calendar
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Book New Appointment</h1>
                <p className="text-sm text-gray-500 mt-1">Schedule a visit for a patient with a doctor</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Patient</label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Doctor</label>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Reason for Visit</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of symptoms or purpose of visit..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 space-x-3">
                        <Button type="button" variant="outline" onClick={() => navigate('/appointments')}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AppointmentBooking;
