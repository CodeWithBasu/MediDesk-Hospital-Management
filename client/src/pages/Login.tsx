import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use configured proxy or full URL. Electron might need full URL if proxy isn't set up perfectly.
      // We'll use full URL for certainty in this phase.
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('Cannot connect to server. Ensure backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to MediDesk Portal</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                        className="pl-10" 
                        placeholder="Enter username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                        type="password" 
                        className="pl-10" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
                Default Admin Credentials: admin / admin123
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
