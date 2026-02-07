import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Pill, AlertTriangle, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Medicine {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiry_date: string;
}

const PharmacyList: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Medicine State
  const [newMed, setNewMed] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    expiryDate: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/medicines`);
        setMedicines(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
        await axios.delete(`${API_BASE_URL}/medicines/${id}`);
        fetchMedicines();
    } catch (err) {
        console.error(err);
        alert("Failed to delete");
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${API_BASE_URL}/medicines`, newMed);
        alert("Medicine added!");
        setShowAddForm(false);
        setNewMed({ name: '', category: '', stock: 0, price: 0, expiryDate: '' });
        fetchMedicines();
    } catch (err) {
        console.error(err);
        alert("Failed to add medicine");
    }
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage medicines and stock levels</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Medicine'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-semibold mb-4">Add New Medicine</h3>
            <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input required placeholder="Medicine Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        value={newMed.category} 
                        onChange={e => setNewMed({...newMed, category: e.target.value})}
                    >
                        <option value="">Select Category</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                        <option value="Equipment">Equipment</option>
                    </select>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Stock</label>
                    <Input type="number" required placeholder="Qty" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: Number(e.target.value)})} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₹)</label>
                    <Input type="number" step="0.01" required placeholder="Price" value={newMed.price} onChange={e => setNewMed({...newMed, price: Number(e.target.value)})} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input type="date" required value={newMed.expiryDate} onChange={e => setNewMed({...newMed, expiryDate: e.target.value})} />
                </div>
                <div className="md:col-span-2 lg:col-span-5 flex justify-end mt-2">
                     <Button type="submit">Save Medicine</Button>
                </div>
            </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search medicines..." 
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

        {loading ? (
             <div className="p-8 text-center text-gray-500">Loading inventory...</div>
        ) : (
            <Table
            data={filteredMedicines}
            columns={[
                { 
                    header: 'Name', 
                    cell: (m) => (
                        <div className="flex items-center font-medium text-gray-900">
                            <Pill className="w-4 h-4 mr-2 text-blue-500" />
                            {m.name}
                        </div>
                    )
                },
                { header: 'Category', accessorKey: 'category' },
                { 
                    header: 'Stock', 
                    cell: (m) => (
                       <div className={`flex items-center ${m.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                           {m.stock}
                           {m.stock < 50 && <AlertTriangle className="w-3 h-3 ml-1" />}
                       </div>
                    )
                },
                { 
                    header: 'Price', 
                    cell: (m) => `₹${Number(m.price).toFixed(2)}`
                },
                { 
                    header: 'Expiry', 
                    cell: (m) => new Date(m.expiry_date).toLocaleDateString()
                },
                {
                    header: 'Actions',
                    cell: (m) => (
                        <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )
                }
            ]}
            />
        )}
      </div>
    </div>
  );
};

export default PharmacyList;
