import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Search State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{patients: any[], doctors: any[], medicines: any[]} | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        try {
           const response = await fetch(`http://localhost:5000/api/search?q=${query}`);
           const data = await response.json();
           setResults(data);
           setShowSearch(true);
        } catch (error) {
           console.error("Search failed", error);
        }
      } else {
        setResults(null);
        setShowSearch(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '#/login';
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setShowSearch(false);
    setQuery('');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm transition-all duration-300">
      <div className="flex items-center w-full max-w-lg">
        {/* ... Search ... */}
        <div className="relative w-full" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border-0 ring-1 ring-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white transition-all shadow-sm text-sm"
            placeholder="Search patients, doctors, records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(query.length >= 2) setShowSearch(true); }}
          />
          
          {/* Search Results Dropdown */}
          {showSearch && results && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                  {(!results.patients.length && !results.doctors.length && !results.medicines.length) ? (
                      <div className="p-4 text-sm text-gray-500 text-center">No results found</div>
                  ) : (
                      <>
                          {results.patients.length > 0 && (
                              <div className="border-b last:border-0">
                                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Patients</div>
                                  {results.patients.map((p: any) => (
                                      <div 
                                          key={p.id} 
                                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                          onClick={() => handleSearchResultClick('/patients')}
                                      >
                                          <div>
                                              <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                                              <p className="text-xs text-gray-500">{p.phone}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                          
                          {results.doctors.length > 0 && (
                              <div className="border-b last:border-0">
                                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Doctors</div>
                                  {results.doctors.map((d: any) => (
                                      <div 
                                          key={d.id} 
                                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                          onClick={() => handleSearchResultClick('/doctors')}
                                      >
                                          <p className="text-sm font-medium text-gray-900">{d.name}</p>
                                          <p className="text-xs text-gray-500">{d.specialization}</p>
                                      </div>
                                  ))}
                              </div>
                          )}

                          {results.medicines.length > 0 && (
                              <div className="border-b last:border-0">
                                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Pharmacy</div>
                                  {results.medicines.map((m: any) => (
                                      <div 
                                          key={m.id} 
                                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between"
                                          onClick={() => handleSearchResultClick('/pharmacy')}
                                      >
                                          <div>
                                              <p className="text-sm font-medium text-gray-900">{m.name}</p>
                                              <p className="text-xs text-gray-500">{m.category}</p>
                                          </div>
                                           <span className={`text-xs px-2 py-0.5 rounded-full ${m.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                              {m.stock} in stock
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </>
                  )}
              </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            className="p-2 text-gray-400 hover:text-gray-500 relative focus:outline-none"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
               <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
               </div>
               <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                    <p className="text-xs text-gray-500 mt-1">Paracetamol 500mg is running low.</p>
                    <p className="text-xs text-blue-600 mt-1">2 mins ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900">New Appointment</p>
                    <p className="text-xs text-gray-500 mt-1">Sarah Smith booked for tomorrow.</p>
                     <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
                  </div>
                   <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">System Update</p>
                    <p className="text-xs text-gray-500 mt-1">Maintenance scheduled for 2 AM.</p>
                     <p className="text-xs text-blue-600 mt-1">5 hours ago</p>
                  </div>
               </div>
               <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-xs font-medium text-primary-600 hover:text-primary-700">View all notifications</button>
               </div>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative ml-3" ref={profileRef}>
          <div 
             className="flex items-center cursor-pointer"
             onClick={() => setShowProfile(!showProfile)}
          >
            <div className="flex flex-col items-end mr-3 hidden sm:flex">
              <span className="text-sm font-medium text-gray-700">{user.fullName || user.username || 'User'}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role || 'Member'}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 hover:ring-2 hover:ring-primary-100 transition-all">
               <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          {showProfile && (
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
               <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                  <p className="text-sm font-medium text-gray-900">Dr. Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
               </div>
               
               <button 
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
               >
                  <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
                  My Profile
               </button>
               <button 
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
               >
                  <Settings className="w-4 h-4 mr-2 text-gray-400" />
                  Settings
               </button>
               <div className="border-t border-gray-100 my-1"></div>
               <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
               >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
               </button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};
