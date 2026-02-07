import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: '',
    phone: '',
    email: '',
    status: 'Active',
    address: '',
    qualification: '',
    experienceYears: '',
    joiningDate: '',
    aadhaarNumber: '',
    panNumber: '',
    consultationFee: '',
    bankName: '',
    bankAccountNo: '',
    bankIfsc: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/doctors', formData);
      alert("Doctor Registered Successfully!");
      navigate('/doctors');
    } catch (error) {
      console.error(error);
      alert("Failed to register doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary-600" onClick={() => navigate('/doctors')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors List
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
        <p className="text-sm text-gray-500 mt-1">Enter doctor details to create a new profile</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div className="md:col-span-2">
                   <Input
                    label="Residential Address"
                    name="address"
                    placeholder="Full residential address"
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Specialization"
                  name="specialization"
                  placeholder="e.g. Cardiologist"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Department"
                  name="department"
                  placeholder="e.g. Cardiology"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />

                 <Input
                  label="Qualification"
                  name="qualification"
                  placeholder="e.g. MBBS, MD"
                  value={formData.qualification || ''}
                  onChange={handleChange}
                />

                <Input
                  label="Experience (Years)"
                  name="experienceYears"
                  type="number"
                  placeholder="5"
                  value={formData.experienceYears || ''}
                  onChange={handleChange}
                />

                 <Input
                  label="Date of Joining"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate || ''}
                  onChange={handleChange}
                />

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verification & Finance */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Verification & Finance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Input
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  placeholder="12-digit Aadhaar"
                  value={formData.aadhaarNumber || ''}
                  onChange={handleChange}
                />
                 <Input
                  label="PAN Number"
                  name="panNumber"
                  placeholder="PAN Card No"
                  value={formData.panNumber || ''}
                  onChange={handleChange}
                />
                 <Input
                  label="Consultation Fee (₹)"
                  name="consultationFee"
                  type="number"
                  placeholder="500"
                  value={formData.consultationFee || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 bg-gray-50 p-4 rounded-lg">
                 <Input
                  label="Bank Name"
                  name="bankName"
                  placeholder="e.g. HDFC Bank"
                  value={formData.bankName || ''}
                  onChange={handleChange}
                />
                 <Input
                  label="Account Number"
                  name="bankAccountNo"
                  placeholder="Account No"
                  value={formData.bankAccountNo || ''}
                  onChange={handleChange}
                />
                 <Input
                  label="IFSC Code"
                  name="bankIfsc"
                  placeholder="IFSC Code"
                  value={formData.bankIfsc || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate('/doctors')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Doctor Profile'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
