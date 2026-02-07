import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Banknote } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Payroll {
    id: number;
    recipient_name: string;
    recipient_type: string;
    amount: string;
    payment_date: string;
    payment_method: string;
    status: string;
    notes?: string;
}

interface StaffMember {
    id: number;
    username: string;
    full_name: string;
    role: string;
    email?: string;
    phone?: string;
}

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    department: string;
    phone: string;
    email?: string;
}

const PayrollManager: React.FC = () => {
    const [payments, setPayments] = useState<Payroll[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // For selecting user
    const [recipientType, setRecipientType] = useState('Staff');
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [doctorList, setDoctorList] = useState<Doctor[]>([]);
    const [selectedRecipientId, setSelectedRecipientId] = useState('');

    const [newPayment, setNewPayment] = useState({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'Cash',
        notes: '',
        status: 'Paid'
    });

    const fetchPayments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get<Payroll[]>(`${API_BASE_URL}/payroll`);
            setPayments(res.data);
        } catch (error) {
            console.error("Error fetching payroll", error);
            setError('Failed to load payment records');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRecipients = useCallback(async () => {
        try {
            const [usersRes, doctorsRes] = await Promise.all([
                axios.get<StaffMember[]>(`${API_BASE_URL}/users`),
                axios.get<Doctor[]>(`${API_BASE_URL}/doctors`)
            ]);
            setStaffList(usersRes.data);
            setDoctorList(doctorsRes.data);
        } catch (error) {
            console.error('Error fetching recipients:', error);
            setError('Failed to load recipients');
        }
    }, []);

    useEffect(() => {
        fetchPayments();
        fetchRecipients();
    }, [fetchPayments, fetchRecipients]);

    const handleCreatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let recipientName = 'Unknown';
        if (recipientType === 'Staff' || recipientType === 'Nurse') {
            const staff = staffList.find(s => s.id.toString() === selectedRecipientId);
            if (staff) recipientName = staff.full_name || staff.username;
        } else if (recipientType === 'Doctor') {
            const doc = doctorList.find(d => d.id.toString() === selectedRecipientId);
            if (doc) recipientName = doc.name;
        } else {
            recipientName = selectedRecipientId; // For 'Other' manual entry
        }

        try {
            await axios.post(`${API_BASE_URL}/payroll`, {
                ...newPayment,
                recipientId: selectedRecipientId,
                recipientType,
                recipientName
            });
            alert('Payment Recorded');
            setShowForm(false);
            fetchPayments();
            setNewPayment({ amount: '', paymentDate: new Date().toISOString().split('T')[0], method: 'Cash', notes: '', status: 'Paid' });
        } catch (error) {
           console.error(error);
           alert('Failed to record payment');
        }
    };

    const getRecipientsForSelect = () => {
        if (recipientType === 'Staff' || recipientType === 'Nurse') return staffList;
        if (recipientType === 'Doctor') return doctorList;
        return [];
    };

    const columns = [
        { header: 'Recipient', accessorKey: 'recipient_name' as keyof Payroll },
        { 
            header: 'Type', 
            cell: (item: Payroll) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.recipient_type === 'Doctor' ? 'bg-blue-100 text-blue-800' : 
                    item.recipient_type === 'Staff' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                }`}>
                    {item.recipient_type}
                </span>
            )
        },
        { 
            header: 'Amount', 
            cell: (item: Payroll) => (
                <span className="font-mono font-medium text-green-700">₹{parseFloat(item.amount).toFixed(2)}</span>
            )
        },
        { header: 'Date', cell: (item: Payroll) => new Date(item.payment_date).toLocaleDateString() },
        { header: 'Method', accessorKey: 'payment_method' as keyof Payroll },
        { header: 'Status', accessorKey: 'status' as keyof Payroll },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Banknote className="w-8 h-8 text-green-600" />
                        Payroll & Payments
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage salaries and payments for staff and doctors</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Record New Payment'}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading payment records...</p>
                </div>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-4">Record Payment</h3>
                    <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Recipient Type</label>
                            <select 
                                className="w-full p-2 border rounded-md"
                                value={recipientType}
                                onChange={e => { setRecipientType(e.target.value); setSelectedRecipientId(''); }}
                            >
                                <option value="Staff">Staff</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Sweeper">Sweeper</option>
                                <option value="Ward Boy">Ward Boy</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Recipient</label>
                            {['Other', 'Sweeper', 'Ward Boy'].includes(recipientType) ? (
                                <Input 
                                    placeholder="Enter Name"
                                    value={selectedRecipientId}
                                    onChange={e => setSelectedRecipientId(e.target.value)}
                                />
                            ) : (
                                <select 
                                    className="w-full p-2 border rounded-md"
                                    value={selectedRecipientId}
                                    onChange={e => setSelectedRecipientId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Person --</option>
                                    {getRecipientsForSelect().map((r: StaffMember | Doctor) => (
                                        <option key={r.id} value={r.id}>
                                            {'full_name' in r ? r.full_name || r.username : r.name} ({('role' in r) ? r.role : r.specialization})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (₹)</label>
                            <Input 
                                type="number" 
                                required 
                                value={newPayment.amount} 
                                onChange={e => setNewPayment({...newPayment, amount: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Date</label>
                            <Input 
                                type="date" 
                                required 
                                value={newPayment.paymentDate} 
                                onChange={e => setNewPayment({...newPayment, paymentDate: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Method</label>
                            <select 
                                className="w-full p-2 border rounded-md"
                                value={newPayment.method}
                                onChange={e => setNewPayment({...newPayment, method: e.target.value})}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Check">Check</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Input 
                                value={newPayment.notes}
                                onChange={e => setNewPayment({...newPayment, notes: e.target.value})}
                                placeholder="e.g. Salary for Oct 2023"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-4">
                            <Button type="submit" variant="primary">Record Payment</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                 <h2 className="text-lg font-bold text-gray-800 mb-4">Payment History</h2>
                 <Table data={payments} columns={columns} />
            </div>
        </div>
    );
};

export default PayrollManager;
