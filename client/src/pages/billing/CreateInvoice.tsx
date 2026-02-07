import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Plus, Trash2, Save, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<{id: number, first_name: string, last_name: string}[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 }
  ]);
  
  React.useEffect(() => {
    // Fetch patients for dropdown
    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/patients');
            setPatients(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchPatients();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
           updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // 18% GST example
  const total = subtotal + tax;

  const handleCreateInvoice = async () => {
    if (!selectedPatientId) {
        alert('Please select a patient');
        return;
    }
    setLoading(true);
    try {
        await axios.post('http://localhost:5000/api/invoices', {
            patientId: selectedPatientId,
            amount: subtotal,
            tax: tax,
            total: total,
            status: 'Pending',
            method: paymentMethod,
            invoiceDate: invoiceDate
        });
        alert('Invoice created successfully!');
        navigate('/billing');
    } catch (error) {
        console.error(error);
        alert('Failed to create invoice');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/billing')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
           <p className="text-sm text-gray-500">Create a new bill for patient services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Patient</label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <Input 
                        label="Invoice Date" 
                        type="date" 
                        value={invoiceDate} 
                        onChange={(e) => setInvoiceDate(e.target.value)} 
                    />
                    <Input label="Doctor In-Charge" placeholder="Dr. Name" />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                         <select 
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Insurance">Insurance</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Billable Items</h3>
                    <Button size="sm" variant="outline" onClick={addItem}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                </div>
                
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                                <input 
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none text-sm py-1"
                                    value={item.description}
                                    placeholder="Service or Medicine name"
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Qty</label>
                                <input 
                                    type="number"
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none text-sm py-1"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Price</label>
                                <input 
                                    type="number"
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none text-sm py-1"
                                    value={item.unitPrice}
                                    min="0"
                                    onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                                />
                            </div>
                             <div className="w-24 text-right pb-1">
                                <span className="text-sm font-semibold">₹{item.total.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Summary</h3>
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex-1 justify-between flex">
                        <span>Tax (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹0.00</span>
                    </div>
                </div>
                <div className="flex justify-between items-center py-4 text-lg font-bold text-gray-900">
                    <span>Total Payable</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3 pt-2">
                    <Button 
                        className="w-full bg-primary-600 hover:bg-primary-700" 
                        onClick={handleCreateInvoice}
                        disabled={loading}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Creating...' : 'Generate Invoice'}
                    </Button>
                     <Button className="w-full" variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Preview
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
