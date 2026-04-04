import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/auth/register', { name, email, password, role }, config);
      login(data);
      if (data.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 rounded-2xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-champagne-gold mb-2">Join LuxeEstate AI</h1>
          <p className="text-gray-300 text-sm">Discover your perfect sanctuary</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-slate-dark/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-slate-dark/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-slate-dark/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-3 rounded-lg border transition font-semibold ${
                role === 'user' 
                ? 'bg-champagne-gold/20 border-champagne-gold text-champagne-gold' 
                : 'bg-white/5 border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('agent')}
              className={`flex-1 py-3 rounded-lg border transition font-semibold ${
                role === 'agent' 
                ? 'bg-champagne-gold/20 border-champagne-gold text-champagne-gold' 
                : 'bg-white/5 border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              Agent
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-champagne-gold text-slate-dark font-semibold py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          Already have an account? {' '}
          <Link to="/login" className="text-champagne-gold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
