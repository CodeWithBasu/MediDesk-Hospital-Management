import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Shirt, Droplets } from 'lucide-react';
import axios from 'axios';

interface LaundryItem {
  id: number;
  item_type: string;
  quantity: number;
  room_number: string;
  ward: string;
  status: 'Clean' | 'Dirty' | 'In Laundry' | 'Lost/Damaged';
  last_washed_date: string;
  next_wash_due: string;
  assigned_to: string;
  notes: string;
}

const LaundryManager: React.FC = () => {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LaundryItem | null>(null);

  const [formData, setFormData] = useState({
    itemType: '',
    quantity: '',
    roomNumber: '',
    ward: '',
    status: 'Clean',
    lastWashedDate: '',
    nextWashDue: '',
    assignedTo: '',
    notes: ''
  });

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get<LaundryItem[]>('http://localhost:5000/api/laundry');
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching laundry items:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item: LaundryItem) => {
    setEditingItem(item);
    setFormData({
      itemType: item.item_type,
      quantity: item.quantity.toString(),
      roomNumber: item.room_number || '',
      ward: item.ward || '',
      status: item.status,
      lastWashedDate: item.last_washed_date ? item.last_washed_date.split('T')[0] : '',
      nextWashDue: item.next_wash_due ? item.next_wash_due.split('T')[0] : '',
      assignedTo: item.assigned_to || '',
      notes: item.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this laundry item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/laundry/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/laundry/${editingItem.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/laundry', formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        itemType: '', quantity: '', roomNumber: '', ward: '', status: 'Clean',
        lastWashedDate: '', nextWashDue: '', assignedTo: '', notes: ''
      });
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.ward || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laundry Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track bed linens, patient gowns, and cleaning items</p>
        </div>
        <Button onClick={() => { setShowModal(true); setEditingItem(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Laundry Item
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search items or wards..." 
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
              <option value="Clean">Clean</option>
              <option value="Dirty">Dirty</option>
              <option value="In Laundry">In Laundry</option>
              <option value="Lost/Damaged">Lost/Damaged</option>
            </select>
          </div>
        </div>

        <Table
          data={filteredItems}
          columns={[
            { 
              header: 'Item Type', 
              cell: (item) => (
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">{item.item_type}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
              )
            },
            { 
              header: 'Location', 
              cell: (item) => (
                <div className="text-sm">
                  {item.ward && <div className="text-gray-900">{item.ward}</div>}
                  {item.room_number && <div className="text-gray-500">Room {item.room_number}</div>}
                  {!item.ward && !item.room_number && <span className="text-gray-400">-</span>}
                </div>
              )
            },
            { 
              header: 'Status', 
              cell: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Clean' ? 'bg-green-100 text-green-800' :
                  item.status === 'Dirty' ? 'bg-red-100 text-red-800' :
                  item.status === 'In Laundry' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              )
            },
            { 
              header: 'Last Washed', 
              cell: (item) => (
                <div className="text-sm text-gray-600">
                  {item.last_washed_date ? new Date(item.last_washed_date).toLocaleDateString() : '-'}
                </div>
              )
            },
            { 
              header: 'Next Wash Due', 
              cell: (item) => (
                <div className="flex items-center text-sm">
                  <Droplets className="w-3 h-3 mr-1 text-blue-500" />
                  {item.next_wash_due ? new Date(item.next_wash_due).toLocaleDateString() : '-'}
                </div>
              )
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
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Laundry Item' : 'Add Laundry Item'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Item Type" name="itemType" value={formData.itemType} onChange={handleInputChange} placeholder="e.g., Bed Sheets, Towels" required />
                <Input label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} required />
                
                <Input label="Room Number (Optional)" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} placeholder="e.g., 101" />
                <Input label="Ward (Optional)" name="ward" value={formData.ward} onChange={handleInputChange} placeholder="e.g., ICU, General" />
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="Clean">Clean</option>
                    <option value="Dirty">Dirty</option>
                    <option value="In Laundry">In Laundry</option>
                    <option value="Lost/Damaged">Lost/Damaged</option>
                  </select>
                </div>
                
                <Input label="Assigned To (Optional)" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} placeholder="Staff member name" />
                
                <Input label="Last Washed Date" name="lastWashedDate" type="date" value={formData.lastWashedDate} onChange={handleInputChange} />
                <Input label="Next Wash Due" name="nextWashDue" type="date" value={formData.nextWashDue} onChange={handleInputChange} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  name="notes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryManager;
