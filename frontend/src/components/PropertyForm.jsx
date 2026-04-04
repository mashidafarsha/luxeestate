import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIcon, MapPin, DollarSign, Activity, Wind, Volume2, TrendingUp } from 'lucide-react';

const PropertyForm = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    image: '',
    description: '',
    aqi: 50,
    noise: '40dB',
    growthPercentage: 5,
    amenities: '',
    featured: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amenities: Array.isArray(initialData.amenities) ? initialData.amenities.join(', ') : initialData.amenities || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        location: '',
        image: '',
        description: '',
        aqi: 50,
        noise: '40dB',
        growthPercentage: 5,
        amenities: '',
        featured: false
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item !== '')
    };
    onSubmit(processedData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Slide-over */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-dark border-l border-white/10 z-[70] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-dark/80 backdrop-blur-md z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {initialData ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-champagne-gold font-semibold uppercase tracking-wider text-xs">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Property Title</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-champagne-gold transition"
                      placeholder="e.g. Modern Glass Penthouse"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                          placeholder="$1,200,000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="text-champagne-gold font-semibold uppercase tracking-wider text-xs">Media & Visuals</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* AI & Vibe Metrics */}
              <div className="space-y-4">
                <h3 className="text-champagne-gold font-semibold uppercase tracking-wider text-xs">AI & Lifestyle Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">AQI Score</label>
                    <div className="relative">
                      <Wind className="absolute left-3 top-3.5 text-gray-500" size={18} />
                      <input
                        type="number"
                        name="aqi"
                        value={formData.aqi}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Noise (dB)</label>
                    <div className="relative">
                      <Volume2 className="absolute left-3 top-3.5 text-gray-500" size={18} />
                      <input
                        type="text"
                        name="noise"
                        value={formData.noise}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">ROI Growth (%)</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-3.5 text-gray-500" size={18} />
                      <input
                        type="number"
                        name="growthPercentage"
                        value={formData.growthPercentage}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-champagne-gold transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-champagne-gold font-semibold uppercase tracking-wider text-xs">Additional Details</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-champagne-gold transition"
                    placeholder="Pool, Gym, Smart Home..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-champagne-gold transition resize-none"
                    placeholder="Describe the luxury lifestyle..."
                  />
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 accent-champagne-gold"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer select-none">
                    Feature this property on the discovery grid
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 sticky bottom-0 bg-slate-dark pb-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-champagne-gold text-slate-dark font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)] transition transform hover:-translate-y-1 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  <Save size={20} className="group-hover:rotate-12 transition-transform" />
                  {loading ? 'Processing...' : (initialData ? 'Update Collection' : 'Add to Collection')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyForm;
