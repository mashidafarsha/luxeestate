import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Wind, VolumeX, DollarSign, BarChart3 } from 'lucide-react';

const ComparisonView = ({ isOpen, onClose, properties }) => {
  if (!properties || properties.length === 0) return null;

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
            className="fixed inset-0 bg-slate-dark/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-slate-dark border-t border-white/10 z-[110] rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col pt-4"
          >
            {/* Grab Handle UI */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>

            <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-dark/95 backdrop-blur-md z-10">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="text-champagne-gold" />
                  Asset Comparison
                </h2>
                <p className="text-gray-400 mt-1">Analyzing {properties.length} potential investments</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white border border-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto p-8">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="border-b border-white/5 pb-6">
                    <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-xs font-black">Metric</th>
                    {properties.map((prop) => (
                      <th key={prop._id} className="px-6 py-4 min-w-[250px]">
                        <div className="flex items-center gap-4">
                          <img 
                            src={prop.image} 
                            alt={prop.name} 
                            className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/10 shadow-lg" 
                          />
                          <div>
                            <p className="font-bold text-white truncate max-w-[180px]">{prop.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{prop.location}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                        <DollarSign size={16} /> Listing Price
                      </div>
                    </td>
                    {properties.map((prop) => (
                      <td key={prop._id} className="px-6 py-8">
                        <span className="text-2xl font-black text-white">{prop.price}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                        <TrendingUp size={16} /> Performance
                      </div>
                    </td>
                    {properties.map((prop) => (
                      <td key={prop._id} className="px-6 py-8">
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                          +{prop.growthPercentage}% Yearly Growth
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                        <Wind size={16} /> Air Quality
                      </div>
                    </td>
                    {properties.map((prop) => (
                      <td key={prop._id} className="px-6 py-8">
                        <p className="text-xl font-bold text-white">{prop.aqi} <span className="text-xs text-gray-500 font-normal">AQI</span></p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                        <VolumeX size={16} /> Noise Levels
                      </div>
                    </td>
                    {properties.map((prop) => (
                      <td key={prop._id} className="px-6 py-8">
                        <p className="text-lg font-bold text-white">{prop.noise}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                        Amenities
                      </div>
                    </td>
                    {properties.map((prop) => (
                      <td key={prop._id} className="px-6 py-8">
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(prop.amenities) ? prop.amenities : []).map((amenity, idx) => (
                            <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] text-gray-300">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-white/10 flex justify-end bg-slate-dark/80">
              <button 
                onClick={onClose}
                className="bg-white hover:bg-gray-100 text-slate-dark font-black px-12 py-4 rounded-2xl transition shadow-xl"
              >
                Close Comparison
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComparisonView;
