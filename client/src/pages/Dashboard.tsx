import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, Activity, TrendingUp, Clock, AlertCircle, 
  FileText, UserPlus, Stethoscope 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { cn } from '../utils/cn';

// Mock Data for Chart
const data = [
  { name: 'Mon', patients: 24, revenue: 4000 },
  { name: 'Tue', patients: 18, revenue: 3000 },
  { name: 'Wed', patients: 32, revenue: 5500 },
  { name: 'Thu', patients: 28, revenue: 4800 },
  { name: 'Fri', patients: 40, revenue: 7000 },
  { name: 'Sat', patients: 35, revenue: 6200 },
  { name: 'Sun', patients: 20, revenue: 3500 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  delay: string;
}

const StatCard = ({ title, value, change, icon: Icon, color, delay }: StatCardProps) => (
  <div 
     className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl shadow-gray-200/50 group hover:-translate-y-1 transition-all duration-300"
     style={{ animationDelay: delay }}
  >
    <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150", color)}></div>
    
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={cn("p-4 rounded-2xl shadow-lg ring-4 ring-white/50", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    
    <div className="mt-6 flex items-center text-sm relative z-10">
      <span className="bg-green-100/80 text-green-700 px-2.5 py-1 rounded-full font-bold flex items-center shadow-sm">
        <TrendingUp className="w-3.5 h-3.5 mr-1" />
        {change}
      </span>
      <span className="text-gray-400 ml-3 font-medium">vs last month</span>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className={cn(
            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md bg-white",
            "border-gray-100"
        )}
    >
        <div className={cn("p-3 rounded-xl mb-3 text-white shadow-lg", color)}>
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
    </button>
);

const RecentActivityItem = ({ title, time, type }: any) => (
  <div className="flex items-start space-x-4 py-4 border-b border-gray-100/50 last:border-0 hover:bg-white/50 px-4 rounded-xl transition-colors cursor-default">
    <div className="relative mt-1.5">
       <div className={cn("w-3 h-3 rounded-full ring-4 ring-white shadow-sm", {
        'bg-blue-500': type === 'appointment',
        'bg-emerald-500': type === 'patient',
        'bg-purple-500': type === 'billing'
      })} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 flex items-center mt-1 font-medium">
        <Clock className="w-3 h-3 mr-1 text-gray-400" />
        {time}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className={cn("space-y-8 p-2 opacity-0 transition-opacity duration-700", animate && "opacity-100")}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1 font-medium">Welcome back, {user.fullName || user.username || 'Dr. Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={() => navigate('/appointments')} className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                View Schedule
             </button>
             <button onClick={() => navigate('/patients/register')} className="bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                + New Patient
             </button>
        </div>
      </div>

       {/* Quick Actions Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction 
                icon={UserPlus} 
                label="Register Patient" 
                onClick={() => navigate('/patients/register')}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <QuickAction 
                icon={Calendar} 
                label="Book Appointment" 
                onClick={() => navigate('/appointments/book')}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <QuickAction 
                icon={FileText} 
                label="Create Invoice" 
                onClick={() => navigate('/billing/new')}
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <QuickAction 
                icon={Stethoscope} 
                label="Add Doctor" 
                onClick={() => navigate('/doctors/register')}
                color="bg-gradient-to-br from-pink-500 to-pink-600"
            />
       </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value="1,284" 
          change="+12%" 
          icon={Users} 
          color="bg-gradient-to-br from-blue-500 to-blue-600" 
          delay="100ms"
        />
        <StatCard 
          title="Appointments" 
          value="42" 
          change="+5%" 
          icon={Calendar} 
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          delay="200ms"
        />
        <StatCard 
          title="Active Doctors" 
          value="24" 
          change="+2" 
          icon={Activity} 
          color="bg-gradient-to-br from-pink-500 to-pink-600"
          delay="300ms"
        />
        <StatCard 
          title="Total Revenue" 
          value="₹52,420" 
          change="+8.2%" 
          icon={DollarSign} 
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          delay="400ms"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Chart + Activity) */}
        <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/60 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Hospital Analytics</h2>
                    <select className="bg-gray-50 border-none text-sm font-semibold text-gray-600 rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Area type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Recent Activity
                </h2>
                <button 
                    onClick={() => navigate('/appointments')}
                    className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                    View All
                </button>
              </div>
              <div className="space-y-1">
                <RecentActivityItem title="New patient registration: Sarah Smith" time="2 mins ago" type="patient" />
                <RecentActivityItem title="Dr. Williams started registered appointment" time="15 mins ago" type="appointment" />
                <RecentActivityItem title="Invoice #4920 payment received" time="45 mins ago" type="billing" />
              </div>
            </div>
        </div>

        {/* Sidebar Widgets (Notifications / Support) */}
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/60 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <AlertCircle className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div 
                        onClick={() => navigate('/pharmacy')}
                        className="p-4 bg-amber-50 rounded-2xl border border-amber-100 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Low Stock Alert</h4>
                                <p className="text-xs font-medium text-gray-500 leading-relaxed">Paracetamol 500mg is running low (15 packs remaining).</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-0.5">System Update</h4>
                                <p className="text-xs font-medium text-gray-500 leading-relaxed">Maintenance scheduled for tonight at 2:00 AM.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl shadow-blue-500/30 p-6 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                 <div className="relative z-10">
                     <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                     <p className="text-blue-100 text-sm mb-4 leading-relaxed">Contact support for any technical issues or feature requests.</p>
                     <button 
                         onClick={() => window.location.href = 'mailto:support@medidesk.com'}
                         className="w-full bg-white text-blue-700 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg"
                     >
                         Contact Support
                     </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
