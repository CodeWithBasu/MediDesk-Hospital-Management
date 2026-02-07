import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  Pill, 
  CreditCard, 
  Settings, 
  LogOut,
  Bed,
  Siren,
  Banknote,
  Wrench,
  Shirt
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

export const Sidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '#/login'; 
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex flex-col h-full w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl relative z-30 transition-all duration-300">
      <div className="flex items-center px-8 h-20 border-b border-gray-100/50 bg-gradient-to-r from-white/50 to-transparent">
        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg flex items-center justify-center mr-3 ring-2 ring-blue-100">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div>
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 block leading-none">MediDesk</span>
           <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Medical System</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        <div className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Overview
        </div>
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/appointments" icon={Calendar} label="Appointments" />
        <SidebarItem to="/patients" icon={Users} label="Patients" />
        
        <div className="px-4 mt-8 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Clinical
        </div>
        <SidebarItem to="/doctors" icon={Stethoscope} label="Doctors" />
        <SidebarItem to="/rooms" icon={Bed} label="Rooms" />
        <SidebarItem to="/pharmacy" icon={Pill} label="Pharmacy" />
        <SidebarItem to="/emergency" icon={Siren} label="Emergency" />

        <div className="px-4 mt-8 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Administration
        </div>
        <SidebarItem to="/staff" icon={Users} label="Staff" />
        <SidebarItem to="/billing" icon={CreditCard} label="Billing" />
        <SidebarItem to="/billing/payroll" icon={Banknote} label="Payroll" />
        <SidebarItem to="/machinery" icon={Wrench} label="Machinery" />
        <SidebarItem to="/laundry" icon={Shirt} label="Laundry" />
        <SidebarItem to="/admin/db" icon={LayoutDashboard} label="Database" />
        <SidebarItem to="/settings" icon={Settings} label="Settings" />
      </div>

      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || 'User')}&background=random`} 
                    alt="User" 
                />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{user.fullName || user.username || 'User'}</p>
               <p className="text-xs text-green-600 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>Online</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
               <LogOut className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center px-4 py-3.5 text-sm font-medium transition-all duration-200 rounded-xl mb-1 group relative overflow-hidden",
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 translate-x-1"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
      )
    }
  >
    <Icon className={cn("w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110", {
        'text-white': window.location.hash.includes(to), // Fallback logic if needed, but isActive handles it
    })} />
    <span className="relative z-10">{label}</span>
  </NavLink>
);
