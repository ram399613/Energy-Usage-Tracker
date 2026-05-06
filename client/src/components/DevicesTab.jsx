import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Box, Waves, Droplets, Plus, Power, Settings2, Info } from 'lucide-react';
import { cn } from '../services/utils';

const DeviceItem = ({ icon: Icon, name, room, usage, status, health }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-[2rem] flex flex-col gap-6"
  >
    <div className="flex justify-between items-start">
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center",
        status === 'on' ? "bg-eco-600 text-white shadow-lg shadow-eco-100" : "bg-slate-100 text-slate-400"
      )}>
        <Icon size={28} />
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
          <Settings2 size={18} />
        </button>
        <button className={cn(
          "p-2 rounded-xl transition-all",
          status === 'on' ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-eco-50 text-eco-600 hover:bg-eco-100"
        )}>
          <Power size={18} />
        </button>
      </div>
    </div>

    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-slate-800 text-lg">{name}</h4>
        <span className={cn(
          "w-2 h-2 rounded-full",
          status === 'on' ? "bg-eco-500 animate-pulse" : "bg-slate-300"
        )} />
      </div>
      <p className="text-slate-500 text-sm font-medium">{room}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Daily Usage</p>
        <p className="text-slate-800 font-bold">{usage} kWh</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Health Score</p>
        <p className="text-eco-600 font-bold">{health}%</p>
      </div>
    </div>
  </motion.div>
);

const DevicesTab = () => {
  const devices = [
    { icon: Wind, name: 'Main AC', room: 'Living Room', usage: '12.4', status: 'on', health: 98 },
    { icon: Box, name: 'Family Fridge', room: 'Kitchen', usage: '4.2', status: 'on', health: 95 },
    { icon: Waves, name: 'Front Load Washer', room: 'Laundry', usage: '2.8', status: 'off', health: 89 },
    { icon: Droplets, name: 'Smart Heater', room: 'Bathroom', usage: '8.1', status: 'off', health: 92 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smart Devices</h2>
          <p className="text-slate-500">Manage and monitor your connected appliances</p>
        </div>
        <button className="bg-eco-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-eco-700 transition-all shadow-lg shadow-eco-100">
          <Plus size={20} />
          Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devices.map((device, i) => (
          <DeviceItem key={i} {...device} />
        ))}
      </div>

      <div className="glass p-8 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-eco-500/20 text-eco-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              AI Diagnostics
            </div>
            <h3 className="text-3xl font-bold mb-4">Predictive maintenance is active</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Our AI is monitoring your appliance health patterns. We've detected that your Washing Machine's motor efficiency is slightly declining. Consider a maintenance check soon to prevent energy spikes.
            </p>
            <div className="flex gap-4">
              <button className="bg-eco-600 hover:bg-eco-500 text-white px-8 py-3 rounded-2xl font-bold transition-all">
                Schedule Service
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all backdrop-blur-md">
                View Report
              </button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
             <div className="w-64 h-64 rounded-full border-[16px] border-eco-500/20 flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full border-[16px] border-eco-500/40 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full bg-eco-600 flex items-center justify-center shadow-2xl shadow-eco-500/50">
                      <Info size={48} />
                   </div>
                </div>
                {/* Animated dots */}
                {[0, 72, 144, 216, 288].map(deg => (
                  <div key={deg} className="absolute w-4 h-4 bg-eco-400 rounded-full animate-pulse" style={{ transform: `rotate(${deg}deg) translate(130px)` }} />
                ))}
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-eco-500/10 blur-[100px] -mr-48 -mt-48" />
      </div>
    </div>
  );
};

export default DevicesTab;
