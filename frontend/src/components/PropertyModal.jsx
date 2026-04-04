import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, MapPin, Building, Activity, ShieldCheck, Mail, Wind, VolumeX, MessageSquare, Zap, Sparkles, TreePine } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import ChatWindow from './ChatWindow';

const PropertyModal = ({ isOpen, onClose, property }) => {
  const { formatPrice } = useCurrency();
  const [isChatOpen, setIsChatOpen] = useState(false);
  if (!property) return null;

  // Calculate 5-year ROI data
  const basePrice = parseFloat(property.price.replace(/[$,]/g, ''));
  const monthlyRent = (basePrice * 0.05) / 12;
  const annualYield = 5.0; // Estimated 5% net annual yield
  const breakEvenYears = Math.round(basePrice / (monthlyRent * 12));

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const value = basePrice * Math.pow(1 + property.growthPercentage / 100, i);
    return {
      year,
      value: Math.round(value),
      displayValue: `$${(value / 1000000).toFixed(1)}M`
    };
  });

  const ProgressMetric = ({ value, label, icon: Icon, color }) => (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2" style={{ color }}>
          <Icon size={14} />
          <span>{label}</span>
        </div>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-over Modal */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-dark border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Header Image Area */}
            <div className="relative h-64 shrink-0">
              <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-dark to-transparent" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur transition"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6">
                <span className="bg-champagne-gold/90 text-slate-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {property.investmentGrade} Investment Grade
                </span>
                <h2 className="text-3xl font-bold text-white">{property.name}</h2>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-8">
              {/* Top Stats */}
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <div>
                  <p className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                    <MapPin size={16} /> {property.location}
                  </p>
                  <p className="text-2xl font-bold text-champagne-gold">{formatPrice(property.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg">
                    +{property.growthPercentage}% YoY
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-white font-semibold mb-2">About this Property</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-white font-semibold mb-4">Premium Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities?.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                      <ShieldCheck size={16} className="text-champagne-gold" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Lifestyle Metrics */}
              <div>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Sparkles size={18} className="text-champagne-gold" />
                  AI Lifestyle Insights
                </h3>
                <div className="space-y-6 bg-white/5 p-6 rounded-[24px] border border-white/5">
                  <ProgressMetric 
                    value={property.aqi} 
                    label="Air Quality Index" 
                    icon={Wind} 
                    color="#60a5fa" 
                  />
                  <ProgressMetric 
                    value={parseInt(property.noise) || 45} 
                    label="Serenity Score" 
                    icon={VolumeX} 
                    color="#c084fc" 
                  />
                  <ProgressMetric 
                    value={82} 
                    label="Greenery Density" 
                    icon={TreePine} 
                    color="#4ade80" 
                  />
                </div>
              </div>

              {/* AI Investment Predictor Dashboard */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-champagne-gold" />
                  AI Investment Predictor
                </h3>

                {/* ROI Matrix Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-lg font-black text-white">{formatPrice(Math.round(monthlyRent).toString())}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Annual Yield</p>
                    <p className="text-lg font-black text-white">{annualYield}%</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Break-even</p>
                    <p className="text-lg font-black text-white">{breakEvenYears} Yrs</p>
                  </div>
                </div>

                {/* AI Verdict Box */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: [
                      "0 0 0px rgba(197, 160, 89, 0)", 
                      "0 0 20px rgba(197, 160, 89, 0.2)", 
                      "0 0 0px rgba(197, 160, 89, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-champagne-gold/30 mb-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <Zap size={40} className="text-champagne-gold" />
                  </div>
                  <h4 className="text-champagne-gold text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> AI Analysis Verdict
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "This asset in <span className="text-white font-bold">{property.location}</span> shows a <span className="text-white font-bold">{property.growthPercentage}%</span> projected growth due to upcoming infrastructure and scarcity metrics. <span className="text-champagne-gold font-bold">Recommendation: Strong Buy.</span>"
                  </p>
                </motion.div>

                {/* ROI Growth Chart */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 h-64 relative">
                  <div className="absolute top-4 left-6 z-10">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">5-Year Valuation Curve</p>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} 
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          border: '1px solid rgba(197, 160, 89, 0.3)',
                          borderRadius: '16px',
                          color: '#fff',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#C5A059', fontWeight: 'bold' }}
                        formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Value']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#C5A059" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorVal)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sticky Bottom CTA */}
            <div className="p-6 border-t border-white/10 bg-slate-dark shrink-0">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-full bg-champagne-gold hover:bg-yellow-600 text-slate-dark font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)] transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
                {isChatOpen ? 'Close Concierge' : 'Contact Concierge Agent'}
              </button>
            </div>
          </motion.div>

          <ChatWindow 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            property={property} 
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
