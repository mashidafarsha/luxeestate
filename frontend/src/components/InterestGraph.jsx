import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const InterestGraph = () => {
  // Realistic 7-day combined property views trend
  const data = [
    { day: 'Mon', views: 420 },
    { day: 'Tue', views: 580 },
    { day: 'Wed', views: 490 },
    { day: 'Thu', views: 720 },
    { day: 'Fri', views: 940 },
    { day: 'Sat', views: 1100 },
    { day: 'Sun', views: 890 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md bg-slate-dark/80">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{label} Acquisition</p>
          <p className="text-xl font-bold text-champagne-gold">{payload[0].value} <span className="text-xs text-gray-400 font-normal ml-1">Views</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="glass rounded-[40px] border border-white/10 p-8 shadow-2xl bg-[rgba(255,255,255,0.01)] backdrop-blur-3xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
         <div className="w-64 h-64 bg-champagne-gold rounded-full blur-[100px]"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio Interest Pulse</h2>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse"></span>
             Aggregate weekly engagement across 7 assets
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Weekly Peak</p>
              <p className="text-lg font-bold text-white">1,100 <span className="text-xs text-green-400 font-normal">+12%</span></p>
           </div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Avg Daily</p>
              <p className="text-lg font-bold text-white">734</p>
           </div>
        </div>
      </div>

      <div className="h-72 w-full relative z-10 rtl:text-right">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#C5A059" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InterestGraph;
