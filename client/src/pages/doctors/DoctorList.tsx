import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  patients?: number;
  address?: string;
  qualification?: string;
  experience_years?: number;
  joining_date?: string;
  aadhaar_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  consultation_fee?: number;
  is_verified?: number;
}

const DoctorList: React.FC = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter] = useState('All'); 
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/doctors');
            const doctorsWithPatients = response.data.map((doc: Doctor) => ({
                ...doc,
                patients: doc.patients !== undefined ? doc.patients : Math.floor(Math.random() * 20)
            }));
            setDoctors(doctorsWithPatients);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);
    
    const handleDelete = async (id: number) => {
        if(window.confirm('Are you sure you want to delete this doctor record?')) {
            try {
                await axios.delete(`http://localhost:5000/api/doctors/${id}`);
                fetchDoctors();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete doctor");
            }
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = specializationFilter === 'All' || doctor.specialization === specializationFilter;
        return matchesSearch && matchesSpecialization;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage medical staff and specialists</p>
        </div>
        <Button onClick={() => navigate('/doctors/register')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Doctor
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name or specialization..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <Table
          data={filteredDoctors}
          columns={[
            { 
              header: 'ID',
              accessorKey: 'id',
              cell: (d) => `#${d.id}`
            },
            { 
              header: 'Name', 
              cell: (d) => (
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {d.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.department}</div>
                  </div>
                </div>
              )
            },
            { 
              header: 'Specialization', 
              cell: (d) => (
                <div className="flex items-center text-gray-700">
                  <Stethoscope className="w-4 h-4 mr-2 text-gray-400" />
                  {d.specialization}
                </div>
              )
            },
            { 
              header: 'Contact', 
              cell: (d) => (
                <div>
                  <div className="text-sm text-gray-900">{d.phone}</div>
                </div>
              )
            },
            { 
              header: 'Status', 
              cell: (d) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${d.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    d.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {d.status}
                </span>
              )
            },
            {
              header: 'Actions',
              cell: (d) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedDoctor(d)}>View Profile</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(d.id)}>Delete</Button>
                </div>
              )
            }
          ]}
        />
      </div>

       {/* View Doctor Modal */}
       {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                  <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                      <h3 className="text-lg font-bold">Doctor Profile</h3>
                      <button onClick={() => setSelectedDoctor(null)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
                      
                      {/* Header Info */}
                      <div className="md:col-span-2 flex items-center space-x-4 border-b pb-4 mb-2">
                           <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold border-2 border-blue-500">
                               {selectedDoctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                           </div>
                           <div>
                               <h4 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h4>
                               <p className="text-blue-600 font-medium">{selectedDoctor.specialization}</p>
                               <div className="flex gap-2 text-sm text-gray-500 mt-1">
                                   <span className="bg-gray-100 px-2 py-0.5 rounded">{selectedDoctor.department}</span>
                                   {selectedDoctor.qualification && <span className="bg-gray-100 px-2 py-0.5 rounded">{selectedDoctor.qualification}</span>}
                               </div>
                           </div>
                      </div>

                      {/* Professional Info */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Professional Details</h4>
                          <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Experience</span>
                                  <span className="font-medium">{selectedDoctor.experience_years ? `${selectedDoctor.experience_years} Years` : 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Joined</span>
                                  <span className="font-medium">{selectedDoctor.joining_date ? new Date(selectedDoctor.joining_date).toLocaleDateString() : 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Consultation Fee</span>
                                  <span className="font-medium text-green-700">₹{selectedDoctor.consultation_fee || '0'}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Status</span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedDoctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selectedDoctor.status}</span>
                              </div>
                          </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Contact Information</h4>
                          <div className="space-y-3 text-sm">
                              <div>
                                  <span className="block text-gray-500 text-xs">Phone</span>
                                  <span className="font-medium">{selectedDoctor.phone}</span>
                              </div>
                              <div>
                                  <span className="block text-gray-500 text-xs">Email</span>
                                  <span className="font-medium">{selectedDoctor.email || 'N/A'}</span>
                              </div>
                               <div>
                                  <span className="block text-gray-500 text-xs">Address</span>
                                  <span className="font-medium">{selectedDoctor.address || 'N/A'}</span>
                              </div>
                          </div>
                      </div>

                      {/* Banking & Legal (Confidential) */}
                      <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Confidential: Banking & Legal
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                  <span className="block text-gray-500 text-xs">Aadhaar</span>
                                  <span className="font-mono">{selectedDoctor.aadhaar_number || '-'}</span>
                              </div>
                              <div>
                                  <span className="block text-gray-500 text-xs">PAN</span>
                                  <span className="font-mono">{selectedDoctor.pan_number || '-'}</span>
                              </div>
                              <div>
                                  <span className="block text-gray-500 text-xs">Bank</span>
                                  <span className="font-medium">{selectedDoctor.bank_name || '-'}</span>
                              </div>
                               <div>
                                  <span className="block text-gray-500 text-xs">Account No</span>
                                  <span className="font-mono">{selectedDoctor.bank_account_no || '-'}</span>
                              </div>
                          </div>
                      </div>

                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex justify-end">
                      <Button onClick={() => setSelectedDoctor(null)}>Close Profile</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DoctorList;
