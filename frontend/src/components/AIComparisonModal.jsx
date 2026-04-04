import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Wind, VolumeX, Star, Zap, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const AIComparisonModal = ({ isOpen, onClose, properties }) => {
  const { formatPrice } = useCurrency();
  if (!properties || properties.length < 2) return null;

  const prop1 = properties[0];
  const prop2 = properties[1];

  const ComparisonRow = ({ label, val1, val2, icon: Icon, isPositive = true }) => (
    <div className="grid grid-cols-3 py-6 border-b border-white/5 items-center group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5 text-champagne-gold group-hover:bg-champagne-gold/10 transition">
          <Icon size={18} />
        </div>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-center">
        <span className={`text-xl font-black ${isPositive ? 'text-white' : 'text-gray-300'}`}>{val1}</span>
      </div>
      <div className="text-center">
        <span className={`text-xl font-black ${isPositive ? 'text-white' : 'text-gray-300'}`}>{val2}</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-dark/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-slate-dark border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <Zap className="text-champagne-gold animate-pulse" />
                  AI Result Comparison
                </h2>
                <p className="text-gray-400 mt-1">Analyzing the top 2 curated investment opportunities.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Comparison Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {/* Image Header */}
              <div className="grid grid-cols-3 mb-10 items-end">
                <div className="text-champagne-gold font-black uppercase tracking-tighter text-sm italic">Asset Profiles</div>
                <div className="px-4 text-center">
                  <div className="rounded-3xl overflow-hidden h-40 mb-4 border border-white/10 shadow-xl">
                    <img src={prop1.image} alt={prop1.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white font-bold truncate">{prop1.name}</h3>
                </div>
                <div className="px-4 text-center">
                  <div className="rounded-3xl overflow-hidden h-40 mb-4 border border-white/10 shadow-xl">
                    <img src={prop2.image} alt={prop2.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white font-bold truncate">{prop2.name}</h3>
                </div>
              </div>

              {/* Data Rows */}
              <ComparisonRow label="List Price" val1={prop1.price} val2={prop2.price} icon={Star} />
              <ComparisonRow label="Growth Est." val1={`+${prop1.growthPercentage}%`} val2={`+${prop2.growthPercentage}%`} icon={TrendingUp} />
              <ComparisonRow label="Air Quality (AQI)" val1={prop1.aqi} val2={prop2.aqi} icon={Wind} isPositive={false} />
              <ComparisonRow label="Noise Level" val1={prop1.noise} val2={prop2.noise} icon={VolumeX} isPositive={false} />
              <ComparisonRow label="Investment Grade" val1={prop1.investmentGrade} val2={prop2.investmentGrade} icon={ShieldCheck} />

              <div className="grid grid-cols-3 py-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-champagne-gold">
                    <Zap size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Key Amenities</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center px-4">
                  {(Array.isArray(prop1?.amenities) ? prop1?.amenities : prop1?.amenities?.split(',') || []).map((a, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-champagne-gold/10 text-champagne-gold rounded-md border border-champagne-gold/20 leading-none">
                      {a?.trim?.() || a}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center px-4">
                  {(Array.isArray(prop2?.amenities) ? prop2?.amenities : prop2?.amenities?.split(',') || []).map((a, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-champagne-gold/10 text-champagne-gold rounded-md border border-champagne-gold/20 leading-none">
                      {a?.trim?.() || a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse"></div>
                <span className="text-xs text-gray-400">Values calculated in real-time by AI Orchestrator</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIComparisonModal;
