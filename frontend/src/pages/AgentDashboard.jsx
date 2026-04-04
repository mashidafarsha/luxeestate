import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  TrendingUp, 
  LayoutDashboard,
  Users
} from 'lucide-react';
import axios from 'axios';
import InterestGraph from '../components/InterestGraph';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const { userInfo } = useAuth();
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/agent/my-properties', config);
        setPropertiesCount(data.length);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-champagne-gold mb-2">
          <LayoutDashboard size={20} />
          <span className="text-sm font-bold uppercase tracking-widest text-ghost-white opacity-60">Agent Portal</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Luxury Pulse</h1>
        <p className="text-gray-400 mt-1">Real-time Portfolio Overview & Performance</p>
      </header>

      {/* Premium Interest Graph */}
      <div className="mb-12">
        <InterestGraph />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Assets', value: loading ? '...' : propertiesCount, icon: Building, color: 'text-blue-400', trend: '+2', trendColor: 'text-green-400' },
          { label: 'Active Inquiries', value: '14', icon: Users, color: 'text-champagne-gold', trend: '+5', trendColor: 'text-green-400' },
          { label: 'Market Pulse', value: '+12.4%', icon: TrendingUp, color: 'text-purple-400', trend: 'UP', trendColor: 'text-green-400' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-[32px] border border-white/10 group cursor-default hover:border-champagne-gold/20 transition duration-500 hover:bg-[rgba(255,255,255,0.03)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full bg-white/5 border border-white/10 ${stat.trendColor}`}>
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AgentDashboard;
