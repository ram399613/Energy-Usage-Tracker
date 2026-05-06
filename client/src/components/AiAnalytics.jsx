import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, Brain, Lightbulb, AlertTriangle } from 'lucide-react';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#64748b'];

const AiAnalytics = ({ history, aiInsights, onRefresh }) => {
  const pieData = [
    { name: 'HVAC', value: 42 },
    { name: 'Lighting', value: 24 },
    { name: 'Appliances', value: 20 },
    { name: 'Others', value: 14 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Energy Usage Chart */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 glass p-8 rounded-[2rem]"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Energy Usage (kWh)</h3>
            <p className="text-slate-500 text-sm">Real-time performance tracking</p>
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-eco-50 rounded-lg text-eco-600 transition-colors"
          >
            <Sparkles size={20} />
          </button>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="units" 
                stroke="#16a34a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUnits)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Usage by Category */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[2rem]"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-2">Usage by Category</h3>
        <p className="text-slate-500 text-sm mb-6">Distribution across devices</p>
        
        <div className="h-[200px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800">128.6</span>
            <span className="text-xs text-slate-400 font-medium uppercase">kWh</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {pieData.map((item, i) => (
            <div key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="text-slate-800 font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Smart Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3 glass p-8 rounded-[2rem] bg-gradient-to-r from-eco-600 to-eco-500 text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Smart Insights</h3>
            <p className="text-eco-50 text-sm">Personalized for your usage patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-eco-100 font-semibold uppercase tracking-wider text-xs">
              <Lightbulb size={16} />
              <span>Energy Saving Tip</span>
            </div>
            <p className="text-sm leading-relaxed">
              {aiInsights?.recommendations?.[0]?.message || "Set your AC to 24°C to save up to 15% on energy bills today."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-eco-100 font-semibold uppercase tracking-wider text-xs">
              <Sparkles size={16} />
              <span>Usage Prediction</span>
            </div>
            <p className="text-2xl font-bold mb-1">{aiInsights?.predictions?.predictedUnits || "12.5"} kWh</p>
            <p className="text-xs text-eco-100">Estimated usage for the next 24 hours</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-eco-100 font-semibold uppercase tracking-wider text-xs">
              <AlertTriangle size={16} />
              <span>Efficiency Score</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-4">
              <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: '85%' }} />
            </div>
            <p className="mt-2 text-right font-bold">85/100</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiAnalytics;
