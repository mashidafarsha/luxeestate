import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Wind, VolumeX, BarChart3, Star, Search, Heart, LayoutDashboard, Sparkles, Zap, ArrowUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import PropertyModal from '../components/PropertyModal';
import AIComparisonModal from '../components/AIComparisonModal';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo, logout, favorites, toggleFavorite } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAICompareOpen, setIsAICompareOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchInputRef = useRef(null);

  // Scroll event listeners
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const thinkingMessages = [
    "Analyzing global market trends...",
    "Calculating investment ROI...",
    "Shortlisting the finest penthouses...",
    "Verifying air quality and noise metrics...",
    "Scoping exclusive waterfront estates..."
  ];

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rotate thinking messages when loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setThinkingMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
      }, 2500);
    } else {
      setThinkingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchProperties = async (endpoint = '/api/properties', payload = null) => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      let res;
      if (payload) {
        res = await axios.post(endpoint, payload, config);
      } else {
        res = await axios.get(endpoint, config);
      }
      
      setProperties(res.data);
    } catch (error) {
      console.error(error);
      // Fallback if not authenticated or error
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e, directQuery = null) => {
    if (e) e.preventDefault();
    const query = directQuery || searchQuery;
    if (query.trim()) {
      fetchProperties('/api/properties/search', { query });
    } else {
      fetchProperties();
    }
    setShowSuggestions(false);
  };

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const SkeletonCard = ({ className }) => (
    <div className={`glass rounded-[24px] overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shine"></div>
    </div>
  );

  const featuredProperty = properties.find(p => p.featured);
  const standardProperties = properties.filter(p => !p.featured);

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-champagne-gold z-[100] origin-left"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* CSS for skeleton animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shine {
          animation: shine 2s infinite linear;
        }
      `}</style>
      
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-champagne-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Welcome back, <span className="text-champagne-gold">{userInfo?.name || 'Guest'}</span>
            </h1>
            <p className="text-gray-400">Here's your curated luxury property overview.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Multi-Currency Selector */}
            <div className="relative group mr-2">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-[20px] border border-white/10 text-white backdrop-blur-md cursor-pointer hover:bg-white/10 transition">
                <span className="text-xs font-black text-champagne-gold uppercase tracking-widest">{currency}</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </div>
              <div className="absolute top-full right-0 mt-2 w-32 bg-slate-dark/95 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-xl overflow-hidden text-center">
                {['USD', 'AED', 'INR'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`w-full px-4 py-3 text-xs font-bold transition hover:bg-white/5 ${currency === curr ? 'text-champagne-gold bg-white/5' : 'text-gray-400'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/favorites')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition px-5 py-2.5 rounded-[20px] border border-white/10 text-white backdrop-blur-md"
            >
              <Heart size={18} className="text-champagne-gold" />
              <span>My Collection</span>
            </button>
            {userInfo?.role === 'agent' && (
              <button 
                onClick={() => navigate('/agent/dashboard')}
                className="flex items-center gap-2 bg-champagne-gold/10 hover:bg-champagne-gold/20 transition px-5 py-2.5 rounded-[20px] border border-champagne-gold/20 text-champagne-gold backdrop-blur-md font-semibold"
              >
                <LayoutDashboard size={18} />
                <span>Agent Portal</span>
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition px-5 py-2.5 rounded-[20px] border border-white/10 text-white backdrop-blur-md"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* AI Search Bar */}
        <div className="mb-10 w-full relative group">
          <motion.div 
            animate={loading ? { 
              boxShadow: [
                "0 0 0px rgba(197, 160, 89, 0)", 
                "0 0 25px rgba(197, 160, 89, 0.4)", 
                "0 0 0px rgba(197, 160, 89, 0)"
              ] 
            } : { boxShadow: "0 0 0px rgba(0,0,0,0)" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`glass rounded-[24px] relative flex items-center p-2 px-6 shadow-2xl border border-white/20 transition-all duration-500 ${showSuggestions ? 'z-50' : 'z-30'}`}
          >
            <Search className={`transition-colors duration-300 ${loading ? 'text-champagne-gold animate-pulse' : 'text-gray-400 group-focus-within:text-white'}`} size={24} />
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Find a villa with a sunset view and private gym..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent border-none text-lg text-white placeholder-gray-500 focus:outline-none py-4 ml-3"
              />
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-500 font-bold">
                  <span>K</span>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-champagne-gold text-slate-dark font-black px-8 py-3 rounded-xl text-sm transition transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-champagne-gold/20"
                >
                  {loading ? (
                    <motion.div 
                      key={thinkingMessageIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-slate-dark rounded-full animate-bounce"></div>
                      <span>Thinking...</span>
                    </motion.div>
                  ) : (
                    "AI Search"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Dynamic Thinking Text Indicator */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key={thinkingMessageIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute -bottom-8 left-12 text-champagne-gold text-xs font-semibold italic flex items-center gap-2"
              >
                <Sparkles size={12} className="animate-pulse" />
                {thinkingMessages[thinkingMessageIndex]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && !searchQuery && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-slate-dark/20 backdrop-blur-sm"
                  onClick={() => setShowSuggestions(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-3 p-4 bg-slate-dark/95 border border-white/10 rounded-[32px] shadow-2xl z-50 backdrop-blur-2xl"
                >
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Premium Insights</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Beachfront villas with 15% ROI",
                      "Penthouses near the helipad",
                      "Quiet family mansions in London",
                      "Investment grade condos in New York"
                    ].map((suggestion, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(null, suggestion);
                        }}
                        className="text-left px-5 py-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-300 hover:text-white transition flex items-center gap-3 group"
                      >
                        <Sparkles size={16} className="text-champagne-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* AI Page Comparison Trigger */}
          {properties.length >= 2 && searchQuery && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <button 
                onClick={() => setIsAICompareOpen(true)}
                className="flex items-center gap-3 bg-champagne-gold/10 hover:bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/30 px-8 py-3 rounded-2xl transition-all duration-300 font-bold group shadow-lg shadow-champagne-gold/5"
              >
                <Zap size={18} className="animate-pulse" />
                <span>Compare Top 2 Investment Opportunities</span>
                <div className="w-6 h-6 rounded-full bg-champagne-gold text-slate-dark flex items-center justify-center text-[10px] group-hover:scale-110 transition">2</div>
              </button>
            </motion.div>
          )}
        </div>

        {loading ? (
          /* Skeleton Loading Layout */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[220px]">
             <SkeletonCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2" />
             <SkeletonCard className="col-span-1 row-span-1" />
             <SkeletonCard className="col-span-1 row-span-1" />
             <SkeletonCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1" />
             {/* Skeletons for additional properties */}
             <SkeletonCard className="col-span-1 lg:col-span-2 row-span-1" />
             <SkeletonCard className="col-span-1 lg:col-span-2 row-span-1" />
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-white/5 p-6 rounded-full border border-white/10 mb-6">
               <Search size={48} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No properties found</h2>
            <p className="text-gray-400 mb-8 max-w-sm">We couldn't find any results matching your AI query. Try adjusting your search or use more general terms.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                fetchProperties();
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl border border-white/10 transition"
            >
              Clear Search & Show All
            </button>
          </motion.div>
        ) : (
          /* Actual Bento Grid Data */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[220px]"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Featured Property (Mapped from array) */}
            {featuredProperty && (
              <motion.div 
                variants={itemVariants}
                onClick={() => openModal(featuredProperty)}
                whileHover={{ scale: 1.01 }}
                className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative rounded-[24px] overflow-hidden group cursor-pointer border border-white/10 hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-500 z-10"></div>
                
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(featuredProperty._id);
                  }}
                  whileTap={{ scale: 1.2 }}
                  className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition"
                >
                  <Heart 
                    size={20} 
                    fill={favorites.some(id => id === featuredProperty._id) ? "#ef4444" : "none"}
                    className={favorites.some(id => id === featuredProperty._id) ? "text-red-500" : "text-white"} 
                  />
                </motion.button>

                <img 
                  src={featuredProperty.image} 
                  alt={featuredProperty.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="inline-block px-3 py-1 bg-champagne-gold/90 text-slate-dark text-xs font-bold rounded-full mb-3 tracking-wider uppercase">
                    Featured Match
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{featuredProperty.name}</h2>
                  <p className="text-gray-300 flex items-center gap-2">
                    {featuredProperty.location} <span>•</span> <span className="text-champagne-gold font-semibold">{formatPrice(featuredProperty.price)}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Small Card: Investment Analytics */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-[24px] p-6 col-span-1 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <BarChart3 className="text-champagne-gold" size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-lg text-sm font-medium">
                  <TrendingUp size={16} />
                  <span>+14.2%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Investment Grade</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-4xl font-bold text-white">A+</h3>
                  <span className="text-sm font-medium text-champagne-gold mb-1">Premium ROI</span>
                </div>
              </div>
              <div className="w-full h-12 mt-4 flex items-end gap-1 opacity-70">
                {[40, 30, 50, 45, 60, 75, 65, 80, 95].map((height, i) => (
                  <div key={i} className="flex-1 bg-champagne-gold rounded-t-sm" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </motion.div>

            {/* Small Card: Market Trend */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-champagne-gold rounded-[24px] p-6 col-span-1 text-slate-dark flex flex-col justify-between border border-transparent hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">Market Trend</h3>
                <Star size={20} fill="#0F172A" className="opacity-80" />
              </div>
              <div>
                <p className="opacity-80 text-sm font-medium mb-1">Local Area Growth (1yr)</p>
                <h2 className="text-5xl font-black mb-2">+8.4%</h2>
                <p className="text-sm font-medium opacity-90">Demand is outpacing supply in your preferred zones.</p>
              </div>
            </motion.div>

            {/* Medium Card: Vibe Check */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-[24px] p-6 col-span-1 md:col-span-2 lg:col-span-2 row-span-1 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-6">Area Vibe Check</h3>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-blue-400/20 p-4 rounded-full">
                    <Wind className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Air Quality (AQI)</p>
                    <p className="text-2xl font-bold text-white">42 <span className="text-sm font-normal text-blue-400">Excellent</span></p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-purple-400/20 p-4 rounded-full">
                    <VolumeX className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Noise Level</p>
                    <p className="text-2xl font-bold text-white">35dB <span className="text-sm font-normal text-purple-400">Serene</span></p>
                  </div>
                </div>
              </div>
            </motion.div>            {/* Standard Properties (Mapped from array) */}
            {standardProperties.slice(0, visibleCount).map((property) => (
              <motion.div 
                key={property._id || property.id}
                onClick={() => openModal(property)}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 glass rounded-[24px] overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative"
              >
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property._id);
                  }}
                  whileTap={{ scale: 1.2 }}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition"
                >
                  <Heart 
                    size={16} 
                    fill={favorites.some(id => id === property._id) ? "#ef4444" : "none"}
                    className={favorites.some(id => id === property._id) ? "text-red-500" : "text-white"} 
                  />
                </motion.button>

                <div className="w-full md:w-2/5 h-40 md:h-full overflow-hidden relative">
                   <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{property.name}</h3>
                    <span className="text-champagne-gold font-bold whitespace-nowrap ml-2">{formatPrice(property.price)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{property.location}</p>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <Wind size={14} className="text-champagne-gold" /> AQI {property.aqi}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <VolumeX size={14} className="text-champagne-gold" /> {property.noise}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Section */}
        {!loading && properties.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            {visibleCount < standardProperties.length + (featuredProperty ? 1 : 0) ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="glass px-10 py-4 rounded-[20px] text-white font-bold border border-white/10 hover:bg-white/10 transition flex items-center gap-3 group"
              >
                <span>Discover More Assets</span>
                <TrendingUp size={18} className="text-champagne-gold group-hover:translate-y-[-2px] transition" />
              </motion.button>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-sm font-medium tracking-widest uppercase"
              >
                You've reached the peak of our current collection
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Property Details Slide-over Modal */}
      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        property={selectedProperty} 
      />

      <AIComparisonModal 
        isOpen={isAICompareOpen}
        onClose={() => setIsAICompareOpen(false)}
        properties={properties}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-10 right-10 z-[100] p-4 bg-champagne-gold text-slate-dark rounded-full shadow-2xl hover:bg-champagne-gold-light transition group"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
