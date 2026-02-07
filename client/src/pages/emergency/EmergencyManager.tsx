import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Siren, Phone, Trash2, Plus, Ambulance } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const EmergencyManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ambulance' | 'contacts'>('ambulance');
    const [ambulances, setAmbulances] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [newAmbulance, setNewAmbulance] = useState({
        vehicleNumber: '',
        driverName: '',
        contactNumber: '',
        status: 'Available'
    });

    const [newContact, setNewContact] = useState({
        name: '',
        role: '',
        contactNumber: '',
        isInternal: true
    });

    const fetchAmbulances = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/ambulances`);
            setAmbulances(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/emergency-contacts`);
            setContacts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAmbulances();
        fetchContacts();
    }, []);

    const handleAddAmbulance = async () => {
        try {
            await axios.post(`${API_BASE_URL}/ambulances`, newAmbulance);
            fetchAmbulances();
            setShowModal(false);
            setNewAmbulance({ vehicleNumber: '', driverName: '', contactNumber: '', status: 'Available' });
        } catch (error) {
            console.error(error);
            alert('Failed to add ambulance');
        }
    };

    const handleAddContact = async () => {
        try {
            await axios.post(`${API_BASE_URL}/emergency-contacts`, newContact);
            fetchContacts();
            setShowModal(false);
            setNewContact({ name: '', role: '', contactNumber: '', isInternal: true });
        } catch (error) {
            console.error(error);
            alert('Failed to add contact');
        }
    };

    const handleDelete = async (id: number, type: 'ambulance' | 'contact') => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            if (type === 'ambulance') {
                await axios.delete(`${API_BASE_URL}/ambulances/${id}`);
                fetchAmbulances();
            } else {
                await axios.delete(`${API_BASE_URL}/emergency-contacts/${id}`);
                fetchContacts();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete record');
        }
    };

    const ambulanceColumns = [
        { header: 'Vehicle No.', accessorKey: 'vehicle_number' as keyof any },
        { header: 'Driver Name', accessorKey: 'driver_name' as keyof any },
        { header: 'Contact', accessorKey: 'contact_number' as keyof any },
        { 
            header: 'Status', 
            accessorKey: 'status' as keyof any,
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Available' ? 'bg-green-100 text-green-700' :
                    item.status === 'On Call' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (item: any) => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, 'ambulance')}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    const contactColumns = [
        { header: 'Name', accessorKey: 'name' as keyof any },
        { header: 'Role/Type', accessorKey: 'role' as keyof any },
        { header: 'Contact', accessorKey: 'contact_number' as keyof any },
        { 
            header: 'Type', 
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.is_internal ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                    {item.is_internal ? 'Internal' : 'External'}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (item: any) => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, 'contact')}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Siren className="w-8 h-8 text-red-500" />
                        Emergency Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage ambulances and emergency contacts</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <Button 
                        variant={activeTab === 'ambulance' ? 'primary' : 'outline'} 
                        onClick={() => setActiveTab('ambulance')}
                    >
                        <Ambulance className="w-4 h-4 mr-2" />
                        Ambulance Fleet
                    </Button>
                    <Button 
                        variant={activeTab === 'contacts' ? 'primary' : 'outline'} 
                        onClick={() => setActiveTab('contacts')}
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Emergency Contacts
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        {activeTab === 'ambulance' ? 'Ambulance Fleet Status' : 'Emergency Contact List'}
                    </h2>
                    <Button onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add {activeTab === 'ambulance' ? 'Ambulance' : 'Contact'}
                    </Button>
                </div>

                {activeTab === 'ambulance' ? (
                    <Table data={ambulances} columns={ambulanceColumns} />
                ) : (
                    <Table data={contacts} columns={contactColumns} />
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">
                            Add New {activeTab === 'ambulance' ? 'Ambulance' : 'Contact'}
                        </h2>
                        
                        <div className="space-y-4">
                            {activeTab === 'ambulance' ? (
                                <>
                                    <Input 
                                        label="Vehicle Number" 
                                        value={newAmbulance.vehicleNumber} 
                                        onChange={e => setNewAmbulance({...newAmbulance, vehicleNumber: e.target.value})}
                                        placeholder="e.g. MH-12-AB-1234"
                                    />
                                    <Input 
                                        label="Driver Name" 
                                        value={newAmbulance.driverName} 
                                        onChange={e => setNewAmbulance({...newAmbulance, driverName: e.target.value})} 
                                    />
                                    <Input 
                                        label="Contact Number" 
                                        value={newAmbulance.contactNumber} 
                                        onChange={e => setNewAmbulance({...newAmbulance, contactNumber: e.target.value})} 
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select 
                                            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500"
                                            value={newAmbulance.status}
                                            onChange={e => setNewAmbulance({...newAmbulance, status: e.target.value})}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="On Call">On Call</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Input 
                                        label="Name / Organization" 
                                        value={newContact.name} 
                                        onChange={e => setNewContact({...newContact, name: e.target.value})} 
                                    />
                                    <Input 
                                        label="Role / Type" 
                                        value={newContact.role} 
                                        onChange={e => setNewContact({...newContact, role: e.target.value})} 
                                    />
                                    <Input 
                                        label="Contact Number" 
                                        value={newContact.contactNumber} 
                                        onChange={e => setNewContact({...newContact, contactNumber: e.target.value})} 
                                    />
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="isInternal"
                                            checked={newContact.isInternal}
                                            onChange={e => setNewContact({...newContact, isInternal: e.target.checked})}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <label htmlFor="isInternal" className="text-sm text-gray-700">Internal Hospital Contact</label>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button onClick={activeTab === 'ambulance' ? handleAddAmbulance : handleAddContact}>
                                Save Record
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyManager;
