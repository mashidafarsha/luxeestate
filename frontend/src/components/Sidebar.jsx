import { motion } from 'framer-motion';
import { 
  Building, 
  Plus, 
  MessageSquare, 
  LayoutDashboard, 
  ExternalLink, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const Sidebar = ({ onAddProperty }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const { unreadCount } = useChat();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      label: 'Overview', 
      icon: LayoutDashboard, 
      path: '/agent/dashboard', 
      active: location.pathname === '/agent/dashboard' 
    },
    { 
      label: 'My Properties', 
      icon: Building, 
      path: '/agent/properties', 
      active: location.pathname === '/agent/properties' 
    },
    { 
      label: 'Agent Inbox', 
      icon: MessageSquare, 
      path: '/agent/messages', 
      active: location.pathname === '/agent/messages',
      badge: unreadCount
    },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-slate-dark/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col sticky top-0 z-[50]"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-champagne-gold rounded-xl flex items-center justify-center shadow-lg shadow-champagne-gold/20">
          <Building className="text-slate-dark" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Luxe<span className="text-champagne-gold">AI</span></span>
      </div>

      {/* Profile Section */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
             <UserIcon className="text-gray-400" size={24} />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-dark rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{userInfo?.name}</p>
          <div className="flex items-center gap-1.5">
             <span className="text-[10px] text-champagne-gold uppercase tracking-wider font-extrabold flex items-center gap-1">
               Premier Agent
             </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 px-2">Main Menu</p>
        
        {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                item.active ? 'text-slate-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.active && (
                <motion.div 
                  layoutId="activePill"
                  className="absolute inset-0 bg-champagne-gold rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <item.icon size={20} className={item.active ? 'text-slate-dark' : 'group-hover:text-champagne-gold transition-colors'} />
                <span className="tracking-wide text-sm">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={`relative z-10 ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black border-2 border-slate-dark ${
                  item.active ? 'bg-slate-dark text-champagne-gold' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

        <button
          onClick={onAddProperty}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <Plus size={20} />
          Add New Property
        </button>
      </nav>

      {/* Portfolio Summary */}
      <div className="mt-auto px-2 space-y-4 pt-6 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">Portfolio Summary</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Active Listings</span>
            <span className="text-xs font-bold text-white bg-green-500/10 px-2 py-0.5 rounded text-green-400 border border-green-500/20">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Pending Deals</span>
            <span className="text-xs font-bold text-white bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-400 border border-yellow-500/20">3</span>
          </div>
          
          <div className="bg-gradient-to-br from-champagne-gold/10 to-transparent p-4 rounded-2xl border border-champagne-gold/10 mt-4">
             <p className="text-[10px] text-champagne-gold font-bold uppercase tracking-wider mb-1">Market Pulse</p>
             <p className="text-xs text-white leading-relaxed">High engagement on <span className="text-champagne-gold font-bold">Horizon Villa</span> this week.</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 px-2 space-y-2 pt-6 border-t border-white/5">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={20} />
          Buyer View
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
