import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import axios from 'axios';

interface Machinery {
  id: number;
  name: string;
  type: string;
  model_number: string;
  serial_number: string;
  purchase_date: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  technician_details: string;
  description: string;
  status: 'Operational' | 'Under Maintenance' | 'Broken' | 'Retired';
}

const MachineryList: React.FC = () => {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Machinery | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    modelNumber: '',
    serialNumber: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    technicianDetails: '',
    description: '',
    status: 'Operational'
  });

  const fetchMachinery = useCallback(async () => {
    try {
      const response = await axios.get<Machinery[]>('http://localhost:5000/api/machinery');
      setMachinery(response.data);
    } catch (error) {
      console.error("Error fetching machinery:", error);
    }
  }, []);

  useEffect(() => {
    fetchMachinery();
  }, [fetchMachinery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item: Machinery) => {
      setEditingItem(item);
      setFormData({
        name: item.name,
        type: item.type,
        modelNumber: item.model_number,
        serialNumber: item.serial_number,
        purchaseDate: item.purchase_date ? item.purchase_date.split('T')[0] : '',
        lastMaintenanceDate: item.last_maintenance_date ? item.last_maintenance_date.split('T')[0] : '',
        nextMaintenanceDate: item.next_maintenance_date ? item.next_maintenance_date.split('T')[0] : '',
        technicianDetails: item.technician_details,
        description: item.description,
        status: item.status
      });
      setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/machinery/${id}`);
        fetchMachinery();
      } catch (error) {
        console.error("Error deleting machinery:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingItem) {
            await axios.put(`http://localhost:5000/api/machinery/${editingItem.id}`, formData);
        } else {
            await axios.post('http://localhost:5000/api/machinery', formData);
        }
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            name: '', type: '', modelNumber: '', serialNumber: '', purchaseDate: '',
            lastMaintenanceDate: '', nextMaintenanceDate: '', technicianDetails: '',
            description: '', status: 'Operational'
        });
        fetchMachinery();
    } catch (error) {
        console.error("Error saving machinery:", error);
    }
  };

  const filteredMachinery = machinery.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machinery & Maintenance</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital equipment and maintenance schedules</p>
        </div>
        <Button onClick={() => { setShowModal(true); setEditingItem(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
                className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="All">All Status</option>
                <option value="Operational">Operational</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Broken">Broken</option>
                <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

        <Table
          data={filteredMachinery}
          columns={[
            { 
                header: 'Equipment Name', 
                accessorKey: 'name',
                cell: (item) => (
                    <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.model_number}</div>
                    </div>
                )
            },
            { header: 'Type', accessorKey: 'type' },
            { 
                header: 'Status', 
                cell: (item) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Operational' ? 'bg-green-100 text-green-800' :
                        item.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {item.status}
                    </span>
                )
            },
            { 
                header: 'Next Maintenance', 
                cell: (item) => (
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.next_maintenance_date ? new Date(item.next_maintenance_date).toLocaleDateString() : 'N/A'}
                    </div>
                )
            },
            { 
                header: 'Technician', 
                accessorKey: 'technician_details',
                cell: (item) => <span className="text-sm text-gray-600 truncate max-w-[150px] inline-block">{item.technician_details || '-'}</span>
            },
            {
                header: 'Actions',
                cell: (item) => (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>Delete</Button>
                    </div>
                )
            }
          ]}
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Equipment Name" name="name" value={formData.name} onChange={handleInputChange} required />
                        <Input label="Type (e.g. Imaging, Lab)" name="type" value={formData.type} onChange={handleInputChange} required />
                        <Input label="Model Number" name="modelNumber" value={formData.modelNumber} onChange={handleInputChange} />
                        <Input label="Serial Number" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} />
                        
                        <Input label="Purchase Date" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} />
                        <div className="space-y-1">
                             <label className="text-sm font-medium text-gray-700">Status</label>
                             <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="Operational">Operational</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Broken">Broken</option>
                                <option value="Retired">Retired</option>
                             </select>
                        </div>

                        <Input label="Last Maintenance" name="lastMaintenanceDate" type="date" value={formData.lastMaintenanceDate} onChange={handleInputChange} />
                        <Input label="Next Maintenance Due" name="nextMaintenanceDate" type="date" value={formData.nextMaintenanceDate} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Technician Details (Name / Phone / Company)</label>
                        <textarea 
                            name="technicianDetails" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={2}
                            value={formData.technicianDetails}
                            onChange={handleInputChange}
                            placeholder="Contact details for maintenance..."
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                        <textarea 
                            name="description" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{editingItem ? 'Update Equipment' : 'Add Equipment'}</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default MachineryList;
