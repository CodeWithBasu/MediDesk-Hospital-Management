import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/patients', formData);
      alert("Patient Registered Successfully!");
      navigate('/patients');
    } catch (error) {
      console.error(error);
      alert("Failed to register patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">New Patient Registration</h1>
           <p className="text-sm text-gray-500">Enter patient details to create a new record.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
        
        {/* Section 1: Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Last Name</label>
               <Input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Date of Birth</label>
               <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Blood Group</label>
               <select 
                 name="bloodGroup" 
                 value={formData.bloodGroup} 
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
               >
                 <option value="">Select Group</option>
                 <option value="A+">A+</option>
                 <option value="A-">A-</option>
                 <option value="B+">B+</option>
                 <option value="B-">B-</option>
                 <option value="O+">O+</option>
                 <option value="O-">O-</option>
                 <option value="AB+">AB+</option>
                 <option value="AB-">AB-</option>
               </select>
             </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Phone Number</label>
               <Input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Email Address (Optional)</label>
               <Input type="email" name="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
             </div>
             <div className="md:col-span-2 space-y-2">
               <label className="text-sm font-medium text-gray-700">Full Address</label>
               <Input name="address" placeholder="123 Main St, City, State" value={formData.address} onChange={handleChange} />
             </div>
          </div>
        </div>

        {/* Section 3: Medical History & Emergency */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Medical Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Known Allergies</label>
               <Input name="allergies" placeholder="Peanuts, Penicillin..." value={formData.allergies} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Existing Medical Conditions</label>
               <Input name="medicalHistory" placeholder="Diabetes, Hypertension..." value={formData.medicalHistory} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Emergency Contact Name</label>
               <Input name="emergencyContactName" placeholder="Jane Doe" value={formData.emergencyContactName} onChange={handleChange} required />
             </div>
              <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Emergency Contact Number</label>
               <Input type="tel" name="emergencyContactPhone" placeholder="+91 ..." value={formData.emergencyContactPhone} onChange={handleChange} required />
             </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
           <Button type="button" variant="outline" onClick={() => navigate('/patients')}>
             Cancel
           </Button>
           <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={loading}>
             <Save className="w-4 h-4 mr-2" />
             {loading ? 'Registering...' : 'Register Patient'}
           </Button>
        </div>

      </form>
    </div>
  );
};

export default PatientRegistration;
