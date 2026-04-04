import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, TrendingUp, BarChart3, Wind, VolumeX } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import ComparisonView from '../components/ComparisonView';
import PropertyModal from '../components/PropertyModal';

const Favorites = () => {
  const navigate = useNavigate();
  const { userInfo, favorites, toggleFavorite } = useAuth();
  const { formatPrice } = useCurrency();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        // Fetch all properties and filter by favorites list
        const { data } = await axios.get('/api/properties', config);
        const filtered = data.filter(p => favorites.includes(p._id));
        setProperties(filtered);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, [favorites]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-dark p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-champagne-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Discovery</span>
            </button>
            <h1 className="text-4xl font-bold text-white tracking-tight">The <span className="text-champagne-gold">Collection</span></h1>
            <p className="text-gray-400 mt-1">Your shortlisted luxury assets</p>
          </div>

          {properties.length > 1 && (
            <button 
              onClick={() => setIsCompareOpen(true)}
              className="bg-champagne-gold text-slate-dark font-bold px-8 py-4 rounded-2xl shadow-[0_10px_30px_rgba(197,160,89,0.3)] transition transform hover:-translate-y-1 flex items-center gap-3 active:scale-95"
            >
              <BarChart3 size={20} />
              Compare Assets
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-champagne-gold/20 border-t-champagne-gold rounded-full animate-spin"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[40px] border border-white/5">
             <div className="bg-white/5 p-8 rounded-full mb-6">
                <Heart size={48} className="text-gray-600" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Your collection is empty</h2>
             <p className="text-gray-400 max-w-sm mb-8">Save properties you love to compare them side-by-side and monitor their market performance.</p>
             <button 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl border border-white/10 transition"
             >
                Start Exploring
             </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {properties.map((property) => (
              <motion.div 
                key={property._id}
                variants={itemVariants}
                className="glass rounded-[32px] overflow-hidden group border border-white/10 hover:border-champagne-gold/30 transition-all duration-500 relative flex flex-col"
              >
                <div 
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => openModal(property)}
                >
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-dark to-transparent opacity-60"></div>
                  
                  {/* Heart Toggle */}
                  <motion.button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property._id);
                    }}
                    whileTap={{ scale: 1.2 }}
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-red-500 hover:scale-110 active:scale-95 transition"
                  >
                    <Heart size={20} fill={favorites.some(id => id === property._id) ? "#ef4444" : "none"} />
                  </motion.button>
                  
                  <div className="absolute bottom-4 left-6">
                    <span className="text-2xl font-black text-white">{formatPrice(property.price)}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{property.name}</h3>
                    <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-500/20">
                      +{property.growthPercentage}%
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">{property.location}</p>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-2">
                      <Wind size={14} className="text-champagne-gold" />
                      <span className="text-xs text-white">AQI {property.aqi}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-2">
                      <VolumeX size={14} className="text-champagne-gold" />
                      <span className="text-xs text-white">{property.noise}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openModal(property)}
                    className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ComparisonView 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        properties={properties}
      />

      <PropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default Favorites;
