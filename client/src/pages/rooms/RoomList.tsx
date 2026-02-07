import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Bed, User, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Room {
  id: number;
  room_number: string;
  type: string;
  price_per_day: number;
  status: string;
  patient_id: number | null;
  patient_name?: string;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Room State
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'General',
    pricePerDay: '',
    status: 'Available'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/rooms`);
        setRooms(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
        await axios.delete(`${API_BASE_URL}/rooms/${id}`);
        fetchRooms();
    } catch (err) {
        console.error(err);
        alert("Failed to delete room");
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${API_BASE_URL}/rooms`, newRoom);
        alert("Room added successfully!");
        setShowAddForm(false);
        setNewRoom({ roomNumber: '', type: 'General', pricePerDay: '', status: 'Available' });
        fetchRooms();
    } catch (err: unknown) {
        console.error(err);
        const errorMessage = axios.isAxiosError(err) 
            ? err.response?.data?.message || "Failed to add room"
            : "Failed to add room";
        alert(errorMessage);
    }
  };
  
 const filteredRooms = rooms.filter(room => 
    (room.room_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (room.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital rooms and occupancy</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Room'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
            <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Room Number</label>
                    <Input required placeholder="101" value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newRoom.type} 
                        onChange={e => setNewRoom({...newRoom, type: e.target.value})}
                    >
                        <option value="General">General</option>
                        <option value="Private">Private</option>
                        <option value="ICU">ICU</option>
                        <option value="Ward">Ward</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price Per Day (₹)</label>
                    <Input required type="number" placeholder="500" value={newRoom.pricePerDay} onChange={e => setNewRoom({...newRoom, pricePerDay: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newRoom.status} 
                        onChange={e => setNewRoom({...newRoom, status: e.target.value})}
                    >
                        <option value="Available">Available</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                     <Button type="submit">Save Room</Button>
                </div>
            </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search room number..." 
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
             <div className="p-8 text-center text-gray-500">Loading rooms...</div>
        ) : (
            <Table
            data={filteredRooms}
            columns={[
                { 
                    header: 'Room', 
                    cell: (r) => (
                        <div className="flex items-center font-medium text-gray-900">
                             <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                <Bed className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div>Room {r.room_number}</div>
                                <div className="text-xs text-gray-500">{r.type}</div>
                            </div>
                        </div>
                    )
                },
                { 
                    header: 'Status', 
                    cell: (r) => (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${r.status === 'Available' ? 'bg-green-100 text-green-800' : 
                              r.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {r.status}
                        </span>
                    )
                },
                { 
                    header: 'Occupant', 
                    cell: (r) => r.patient_name ? (
                        <div className="flex items-center text-sm text-gray-900">
                             <User className="w-3 h-3 mr-1.5 text-gray-400" />
                             {r.patient_name}
                        </div>
                    ) : (
                        <span className="text-sm text-gray-400 italic">Unoccupied</span>
                    )
                },
                { 
                    header: 'Price/Day', 
                    cell: (r) => `₹${Number(r.price_per_day).toLocaleString()}`
                },
                {
                    header: 'Actions',
                    cell: (r) => (
                        <div className="flex items-center gap-2">
                             <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" disabled={r.status === 'Occupied'}>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )
                }
            ]}
            />
        )}
      </div>
    </div>
  );
};

export default RoomList;
