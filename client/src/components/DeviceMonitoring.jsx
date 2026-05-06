import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Box, Waves, Droplets, ChevronRight, Power } from 'lucide-react';
import { cn } from '../services/utils';

const DeviceCard = ({ icon: Icon, name, usage, status, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer"
  >
    <div className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
      status === 'on' ? "bg-eco-100 text-eco-600 shadow-sm" : "bg-slate-100 text-slate-400"
    )}>
      <Icon size={22} />
    </div>
    
    <div className="flex-1">
      <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
      <p className="text-xs text-slate-400 font-medium">{usage} kWh today</p>
    </div>

    <div className="flex items-center gap-3">
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
        status === 'on' ? "bg-eco-100 text-eco-600" : "bg-slate-100 text-slate-400"
      )}>
        {status}
      </span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-eco-600 transition-colors" />
    </div>
  </motion.div>
);

const DeviceMonitoring = () => {
  const devices = [
    { icon: Wind, name: 'Air Conditioner', usage: '48.6', status: 'on', delay: 0.1 },
    { icon: Box, name: 'Refrigerator', usage: '28.4', status: 'on', delay: 0.2 },
    { icon: Waves, name: 'Washing Machine', usage: '12.9', status: 'off', delay: 0.3 },
    { icon: Droplets, name: 'Water Heater', usage: '18.7', status: 'off', delay: 0.4 },
  ];

  return (
    <div className="glass p-8 rounded-[2rem] h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Top Devices</h3>
          <p className="text-slate-500 text-sm">Active appliance monitoring</p>
        </div>
        <button className="text-eco-600 font-bold text-sm hover:underline">View all</button>
      </div>
      
      <div className="space-y-2">
        {devices.map((device, i) => (
          <DeviceCard key={i} {...device} />
        ))}
      </div>

      <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-eco-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Smart Eco Mode</p>
          <h4 className="text-lg font-bold mb-4">Optimize your home energy consumption</h4>
          <button className="bg-eco-600 hover:bg-eco-500 transition-colors text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Power size={16} />
            Activate Now
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-eco-500/20 blur-3xl -mr-16 -mt-16" />
      </div>
    </div>
  );
};

export default DeviceMonitoring;
