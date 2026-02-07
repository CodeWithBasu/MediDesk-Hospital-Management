import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';

import axios from 'axios';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  status?: string;
}

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id: number) => {
    if(window.confirm('Are you sure you want to delete this patient record?')) {
        try {
            await axios.delete(`http://localhost:5000/api/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete patient");
        }
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient records and registrations</p>
        </div>
        <Button onClick={() => navigate('/patients/register')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name or ID..." 
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
          data={filteredPatients}
          columns={[
            { 
              header: 'ID', 
              accessorKey: 'id',
              cell: (p) => `#${p.id}`
            },
            { 
              header: 'Name', 
              cell: (p) => (
                <div>
                  <div className="font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                  <div className="text-xs text-gray-500">{new Date(p.dob).toLocaleDateString()}</div>
                </div>
              )
            },
            { 
              header: 'Gender', 
              accessorKey: 'gender' 
            },
            { 
              header: 'Contact', 
              cell: (p) => (
                <div>
                  <div className="text-sm text-gray-900">{p.phone}</div>
                  <div className="text-xs text-gray-500">{p.email || '-'}</div>
                </div>
              )
            },
            { 
              header: 'Status', 
              cell: () => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              )
            },
            {
              header: 'Actions',
              cell: (p) => (
                <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(p)}>View</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p.id)}>Delete</Button>
                </div>
              )
            }
          ]}
        />
      </div>

      {/* View Patient Modal */}
      {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-bold text-gray-900">Patient Details</h3>
                      <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold">
                              {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-gray-900">{selectedPatient.first_name} {selectedPatient.last_name}</h4>
                              <p className="text-gray-500 text-sm">Patient ID: #{selectedPatient.id}</p>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs uppercase font-medium">Contact Info</p>
                              <p className="font-medium text-gray-900 mt-1">{selectedPatient.phone}</p>
                              <p className="text-gray-600">{selectedPatient.email || 'No email'}</p>
                          </div>
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs uppercase font-medium">Personal Info</p>
                              <p className="font-medium text-gray-900 mt-1">{selectedPatient.gender}, {new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} yrs</p>
                              <p className="text-gray-600">{new Date(selectedPatient.dob).toLocaleDateString()}</p>
                          </div>
                      </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex justify-end">
                      <Button onClick={() => setSelectedPatient(null)}>Close</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PatientList;
