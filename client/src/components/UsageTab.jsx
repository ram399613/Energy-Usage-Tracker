import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Download, Filter, TrendingDown } from 'lucide-react';

const UsageTab = ({ history }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Detailed Consumption</h2>
          <p className="text-slate-500">Analyze your energy usage patterns over time</p>
        </div>
        <div className="flex gap-3">
          <button className="glass px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-eco-50 transition-colors">
            <Calendar size={18} />
            May 2024
          </button>
          <button className="bg-eco-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-eco-700 transition-colors">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">Usage History</h3>
            <div className="flex gap-2">
              {['Day', 'Week', 'Month', 'Year'].map(t => (
                <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold ${t === 'Week' ? 'bg-eco-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="units" stroke="#16a34a" strokeWidth={3} fill="url(#usageGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Peak Demand</h3>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 bg-eco-100 rounded-full flex items-center justify-center text-eco-600 mb-4">
              <TrendingDown size={40} />
            </div>
            <h4 className="text-3xl font-bold text-slate-800 mb-1">14.2 kWh</h4>
            <p className="text-slate-500 text-sm mb-6">Peak recorded yesterday at 8:45 PM</p>
            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Off-peak usage</span>
                <span className="text-eco-600 font-bold">65%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-eco-600 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Logs</h3>
          <button className="text-eco-600 font-bold text-sm flex items-center gap-1">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm font-medium border-b border-slate-50">
                <th className="pb-4">Date & Time</th>
                <th className="pb-4">Device</th>
                <th className="pb-4">Consumption</th>
                <th className="pb-4">Cost</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 text-slate-600 font-medium">May 06, 2024 · 10:3{i} AM</td>
                  <td className="py-4 text-slate-800 font-bold">Smart Meter #042</td>
                  <td className="py-4 text-slate-800 font-bold">0.82 kWh</td>
                  <td className="py-4 text-eco-600 font-bold">$0.12</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-eco-50 text-eco-600 rounded-lg text-[10px] font-bold uppercase">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsageTab;
