import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Save, User, Building, Lock, Bell } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));

  // Profile State
  const [profile, setProfile] = useState({
    name: user.fullName || '',
    email: user.email || '',
    role: user.role || '',
    phone: user.phone || ''
  });

  // Security State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Clinic State (Local Only for now as there's no backend table)
  const [clinic, setClinic] = useState(() => {
    const saved = localStorage.getItem('settings_clinic');
    return saved ? JSON.parse(saved) : {
      name: 'Santi Shradha Medicare',
      address: '123 Health Street, Medical District',
      phone: '+91 98765 43210',
      email: 'contact@medicare.com'
    };
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
          const res = await axios.get(`${API_BASE_URL}/users`);
          const currentUser = res.data.find((u: any) => u.id === user.id);
          if (currentUser) {
              setProfile({
                  name: currentUser.full_name || '',
                  email: currentUser.email || '',
                  role: currentUser.role || '',
                  phone: currentUser.phone || ''
              });
          }
      } catch (err) {
          console.error("Failed to fetch user details", err);
      }
    };

    if (user.id) {
        fetchUserDetails();
    }
  }, [user.id]);

  const handleProfileSave = async () => {
      try {
          await axios.put(`${API_BASE_URL}/users/${user.id}`, {
              full_name: profile.name,
              email: profile.email,
              phone: profile.phone
          });
          
          // Update local storage user object
          const updatedUser = { ...user, fullName: profile.name, email: profile.email };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          alert("Profile updated successfully!");
      } catch (err) {
          console.error(err);
          alert("Failed to update profile.");
      }
  };

  const handleClinicSave = () => {
      localStorage.setItem('settings_clinic', JSON.stringify(clinic));
      alert("Clinic details saved locally!");
  };

  const handlePasswordChange = async () => {
      if (passwords.new !== passwords.confirm) {
          alert("New passwords do not match!");
          return;
      }
      
      try {
          await axios.put(`${API_BASE_URL}/users/${user.id}`, {
              password: passwords.new
          });
          alert("Password changed successfully!");
          setPasswords({ current: '', new: '', confirm: '' });
      } catch (err) {
          console.error(err);
          alert("Failed to change password.");
      }
  };

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
         <p className="text-sm text-gray-500 mt-1">Manage account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation for Settings */}
          <div className="w-full lg:w-64 space-y-1">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
              </button>
              <button 
                onClick={() => setActiveTab('clinic')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'clinic' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                  <Building className="w-4 h-4 mr-3" />
                  Clinic Details
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                  <Lock className="w-4 h-4 mr-3" />
                  Security
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'notifications' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
              </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
              {activeTab === 'profile' && (
                  <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-lg font-semibold border-b pb-2">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                          <Input label="Email Address" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                          <Input label="Phone Number" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                          <Input label="Role" value={profile.role} disabled className="bg-gray-50" />
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button onClick={handleProfileSave}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                      </div>
                  </div>
              )}

              {activeTab === 'clinic' && (
                  <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-lg font-semibold border-b pb-2">Clinic Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                          <Input label="Clinic Name" value={clinic.name} onChange={e => setClinic({...clinic, name: e.target.value})} />
                          <Input label="Address" value={clinic.address} onChange={e => setClinic({...clinic, address: e.target.value})} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Phone" value={clinic.phone} onChange={e => setClinic({...clinic, phone: e.target.value})} />
                            <Input label="Contact Email" value={clinic.email} onChange={e => setClinic({...clinic, email: e.target.value})} />
                          </div>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button onClick={handleClinicSave}><Save className="w-4 h-4 mr-2" /> Update Details</Button>
                      </div>
                  </div>
              )}

              {activeTab === 'security' && (
                  <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-lg font-semibold border-b pb-2">Security</h3>
                      <div className="space-y-4 max-w-md">
                          <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-200">
                              Change your password regularly to keep your account secure.
                          </div>
                          {/* Note: Current password check not implemented in this simple version */}
                          <Input 
                            type="password" 
                            label="New Password" 
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                          />
                          <Input 
                            type="password" 
                            label="Confirm New Password" 
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button variant="outline" onClick={handlePasswordChange}>Change Password</Button>
                      </div>
                  </div>
              )}

              {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-lg font-semibold border-b pb-2">Notifications</h3>
                      <div className="space-y-4">
                          {['Email alerts for new appointments', 'Daily summary reports', 'Low stock alerts (Pharmacy)'].map((setting, i) => (
                              <div key={i} className="flex items-center justify-between py-2">
                                  <span className="text-gray-700">{setting}</span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                  </label>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Settings;
