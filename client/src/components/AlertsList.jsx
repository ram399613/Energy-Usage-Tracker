import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../services/utils';

const AlertItem = ({ type, title, message, time, delay }) => {
  const icons = {
    warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    success: { icon: CheckCircle2, color: 'text-eco-600', bg: 'bg-eco-50' },
  };

  const { icon: Icon, color, bg } = icons[type] || icons.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-eco-200 transition-all group cursor-pointer"
    >
      <div className="flex gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            <span className="text-[10px] font-medium text-slate-400">{time}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const AlertsList = () => {
  const alerts = [
    {
      type: 'warning',
      title: 'High usage detected!',
      message: 'Your energy usage is 20% higher than usual this hour.',
      time: '2h ago',
      delay: 0.1
    },
    {
      type: 'info',
      title: 'New device connected',
      message: 'A new smart device has been detected on your network.',
      time: '5h ago',
      delay: 0.2
    },
    {
      type: 'success',
      title: 'Weekly report available',
      message: 'Your energy efficiency report for last week is ready.',
      time: '1d ago',
      delay: 0.3
    }
  ];

  return (
    <div className="glass p-8 rounded-[2rem] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recent Alerts</h3>
          <p className="text-slate-500 text-sm">AI-driven notifications</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Bell size={16} />
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {alerts.map((alert, i) => (
          <AlertItem key={i} {...alert} />
        ))}
      </div>

      <button className="mt-6 w-full py-3 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 hover:text-eco-600 transition-all flex items-center justify-center gap-2">
        View all alerts
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AlertsList;
