import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, Shield, Mail, Phone, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface User {
  id: number;
  username: string;
  role: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  address?: string;
  designation?: string;
  aadhaar_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  is_verified?: number;
}

const StaffList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // New User State
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'receptionist',
    username: '',
    password: '',
    address: '',
    designation: '',
    aadhaarNumber: '',
    bankName: '',
    bankAccountNo: '',
    bankIfsc: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/users`);
        setUsers(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        fetchUsers();
    } catch (err: unknown) {
        console.error(err);
        alert("Failed to delete user");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${API_BASE_URL}/users`, newUser);
        alert("User added successfully!");
        setShowAddForm(false);
        setNewUser({ 
            fullName: '', email: '', phone: '', role: 'receptionist', 
            username: '', password: '', address: '', designation: '', 
            aadhaarNumber: '', bankName: '', bankAccountNo: '', bankIfsc: '' 
        });
        fetchUsers();
    } catch (err: unknown) {
        console.error(err);
        const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to add user"
            : "Failed to add user";
        alert(errorMessage);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users and access roles</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Register New Staff'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Register New Staff Member</h3>
            <form onSubmit={handleAddUser} className="space-y-6">
                
                {/* Personal Information */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <Input required placeholder="e.g. Rahul Sharma" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input type="email" placeholder="rahul@example.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <Input required placeholder="+91 98765 43210" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Residential Address</label>
                            <Input placeholder="Full residential address" value={newUser.address || ''} onChange={e => setNewUser({...newUser, address: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Professional & Verification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newUser.role} 
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="receptionist">Receptionist</option>
                                <option value="nurse">Nurse</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Job Field / Designation</label>
                            <Input placeholder="e.g. Senior Surgeon, Head Nurse" value={newUser.designation || ''} onChange={e => setNewUser({...newUser, designation: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Aadhaar / ID Number</label>
                            <Input placeholder="12-digit Aadhaar" value={newUser.aadhaarNumber || ''} onChange={e => setNewUser({...newUser, aadhaarNumber: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Banking Information */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank & Payroll Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Bank Name</label>
                            <Input placeholder="e.g. HDFC Bank" value={newUser.bankName || ''} onChange={e => setNewUser({...newUser, bankName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Account Number</label>
                            <Input placeholder="Account No" value={newUser.bankAccountNo || ''} onChange={e => setNewUser({...newUser, bankAccountNo: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                            <Input placeholder="IFSC Code" value={newUser.bankIfsc || ''} onChange={e => setNewUser({...newUser, bankIfsc: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Account Credentials */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">System Access</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Username</label>
                            <Input required placeholder="username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input required type="password" placeholder="Min. 8 characters" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t gap-3">
                     <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                     <Button type="submit">Create Verified Account</Button>
                </div>
            </form>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                             {selectedUser.full_name?.charAt(0) || selectedUser.username?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
                            <p className="opacity-90 flex items-center gap-2">
                                <span className="capitalize">{selectedUser.role}</span>
                                {selectedUser.designation && <span className="bg-white/20 px-2 py-0.5 rounded text-sm text-white">{selectedUser.designation}</span>}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-white/80 hover:text-white">&times;</button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Contact Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{selectedUser.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{selectedUser.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="mt-1"><Shield className="w-4 h-4 text-gray-400" /></div>
                                <span>{selectedUser.address || 'Address not provided'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Official Details</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">ID / Aadhaar</span>
                                <span className="font-medium">{selectedUser.aadhaar_number || 'Not Verified'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Joined On</span>
                                <span className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Username</span>
                                <span className="font-medium">@{selectedUser.username}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Bank Details (Confidential)</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs">Bank Name</span>
                                <span className="font-medium">{selectedUser.bank_name || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">Account No</span>
                                <span className="font-medium">{selectedUser.bank_account_no || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">IFSC</span>
                                <span className="font-medium">{selectedUser.bank_ifsc || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search staff..." 
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
             <div className="p-8 text-center text-gray-500">Loading staff...</div>
        ) : (
            <Table
            data={filteredUsers}
            columns={[
                { 
                    header: 'Name', 
                    cell: (u) => (
                        <div className="flex items-center font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedUser(u)}>
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs font-bold">
                                {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div>{u.full_name || u.username}</div>
                                {u.designation && <div className="text-xs text-blue-600">{u.designation}</div>}
                                {!u.designation && <div className="text-xs text-gray-500">@{u.username}</div>}
                            </div>
                        </div>
                    )
                },
                { 
                    header: 'Role', 
                    cell: (u) => (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              u.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                              u.role === 'pharmacist' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {u.role}
                        </span>
                    )
                },
                { 
                    header: 'Contact', 
                    cell: (u) => (
                        <div className="text-sm text-gray-500 space-y-0.5">
                            {u.email && <div className="flex items-center"><Mail className="w-3 h-3 mr-1.5" />{u.email}</div>}
                            {u.phone && <div className="flex items-center"><Phone className="w-3 h-3 mr-1.5" />{u.phone}</div>}
                        </div>
                    )
                },
                { 
                    header: 'Joined', 
                    cell: (u) => new Date(u.created_at).toLocaleDateString()
                },
                {
                    header: 'Actions',
                    cell: (u) => (
                        <div className="flex items-center gap-2">
                             <Button size="sm" variant="ghost" onClick={() => setSelectedUser(u)}>View</Button>
                             <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" disabled={u.username === 'admin'}>
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

export default StaffList;
