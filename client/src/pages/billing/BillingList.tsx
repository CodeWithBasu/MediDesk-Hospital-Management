import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Plus, Search, Filter, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface Invoice {
  id: number;
  patient_name: string;
  invoice_date: string;
  total: number; // Mapping API 'total' to display amount
  status: 'Paid' | 'Pending' | 'Overdue';
  payment_method: string;
}

const BillingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(res.data);
    } catch (error) {
        console.error("Failed to fetch invoices", error);
    } finally {
        setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(inv.id).includes(searchTerm)
  );

  // Calculate stats dynamically
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + Number(i.total), 0);
    
  const pendingAmount = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + Number(i.total), 0);

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital revenue and payments</p>
        </div>
        <Button onClick={() => navigate('/billing/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{pendingAmount.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Overdue Invoices</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{overdueCount}</h3>
            </div>
             <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by invoice # or patient..." 
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
             <div className="p-8 text-center text-gray-500">Loading invoices...</div>
        ) : (
            <Table
            data={filteredInvoices}
            columns={[
                { 
                    header: 'Invoice ID', 
                    accessorKey: 'id', 
                    cell: (i) => <span className="font-medium text-gray-900">#INV-{i.id}</span>
                },
                { 
                    header: 'Patient', 
                    cell: (i) => (
                        <div className="font-medium text-gray-900">{i.patient_name || 'Unknown'}</div>
                    )
                },
                { 
                    header: 'Date', 
                    cell: (i) => new Date(i.invoice_date).toLocaleDateString()
                },
                { 
                    header: 'Amount', 
                    cell: (i) => <span className="font-semibold">₹{Number(i.total).toFixed(2)}</span>
                },
                { header: 'Method', accessorKey: 'payment_method' },
                { 
                header: 'Status', 
                cell: (i) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${i.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        i.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                    {i.status}
                    </span>
                )
                },
                {
                header: 'Actions',
                cell: () => (
                    <Button variant="ghost" size="sm">View</Button>
                )
                }
            ]}
            />
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;
