import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Building, 
  Search, 
  MapPin, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const MyProperties = () => {
  const { userInfo } = useAuth();
  const { formatPrice } = useCurrency();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProperties = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('/api/agent/my-properties', config);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async (formData) => {
    setFormLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      if (editingProperty) {
        await axios.put(`/api/agent/properties/${editingProperty._id}`, formData, config);
      } else {
        await axios.post('/api/agent/properties', formData, config);
      }
      
      fetchProperties();
      setIsFormOpen(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/agent/properties/${id}`, config);
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const openEdit = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on active filtering
  };

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentItems = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Active Listings</h1>
          <p className="text-gray-400 mt-1">Manage your global luxury assets</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group max-w-sm w-full md:w-64">
            <Search className="absolute left-4 top-3 text-gray-500 group-focus-within:text-champagne-gold transition" size={18} />
            <input 
              type="text" 
              placeholder="Filter listings..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-champagne-gold/50 transition font-medium"
            />
          </div>
          <button 
            onClick={() => {
              setEditingProperty(null);
              setIsFormOpen(true);
            }}
            className="bg-champagne-gold text-slate-dark font-black px-8 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Property
          </button>
        </div>
      </header>

      {/* Property List Table */}
      <div className="glass rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-[rgba(255,255,255,0.01)] backdrop-blur-xl mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-10 py-6">Property</th>
                <th className="px-10 py-6">Location</th>
                <th className="px-10 py-6">Price</th>
                <th className="px-10 py-6">Growth</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan="5" className="px-10 py-8 h-24 bg-white/5"></td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-24 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-4">
                      <Building size={64} className="opacity-10" />
                      <p className="text-lg font-medium">{searchQuery ? 'No listings match your filter.' : "You haven't listed any properties yet."}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="wait">
                  {currentItems.map((property) => (
                    <motion.tr 
                      key={property._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/5 transition group"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-6">
                          <img 
                            src={property.image} 
                            alt={property.name} 
                            className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/10 shadow-2xl"
                          />
                          <div>
                            <span className="font-black text-gray-200 text-lg block">{property.name}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{property.id || 'PID-ALPHA'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-gray-400">
                        <div className="flex items-center gap-2 font-medium">
                          <MapPin size={16} className="text-champagne-gold" />
                          {property.location}
                        </div>
                      </td>
                      <td className="px-10 py-7 font-black text-white text-lg tracking-tight">{formatPrice(property.price)}</td>
                      <td className="px-10 py-7">
                         <span className="bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-xs font-black border border-green-500/20">
                           +{property.growthPercentage}%
                         </span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
                          <button 
                            onClick={() => openEdit(property)}
                            className="p-3 hover:bg-champagne-gold/20 rounded-xl transition text-champagne-gold border border-white/5 hover:border-champagne-gold/30"
                            title="Edit Listing"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(property._id)}
                            className="p-3 hover:bg-red-500/20 rounded-xl transition text-red-400 border border-white/5 hover:border-red-500/30"
                            title="Remove Listing"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-10 py-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <ChevronLeft size={20} className="group-hover:translate-x-[-2px] transition" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition ${currentPage === i + 1 ? 'bg-champagne-gold text-slate-dark' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-[2px] transition" />
            </button>
          </div>
        </div>
      )}

      <PropertyForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProperty}
        initialData={editingProperty}
        loading={formLoading}
      />
    </>
  );
};

export default MyProperties;
