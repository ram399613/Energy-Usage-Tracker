import React from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Leaf, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../services/utils';

const StatCard = ({ icon: Icon, label, value, unit, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full -mr-8 -mt-8", color)} />
    
    <div className="flex justify-between items-start">
      <div className={cn("p-3 rounded-2xl", color, "bg-opacity-10")}>
        <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend > 0 ? "bg-red-50 text-red-500" : "bg-eco-50 text-eco-600"
        )}>
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>

    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <span className="text-slate-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  </motion.div>
);

const OverviewCards = ({ stats }) => {
  const cards = [
    {
      icon: Zap,
      label: 'Total Energy Usage',
      value: stats.totalUnits.toFixed(1),
      unit: 'kWh',
      trend: -12.5,
      color: 'bg-eco-500',
      delay: 0.1
    },
    {
      icon: DollarSign,
      label: 'Total Cost',
      value: `$${stats.totalCost.toFixed(2)}`,
      unit: '',
      trend: +8.3,
      color: 'bg-blue-500',
      delay: 0.2
    },
    {
      icon: Leaf,
      label: 'Carbon Footprint',
      value: (stats.totalUnits * 0.85).toFixed(1),
      unit: 'kg CO2',
      trend: -10.7,
      color: 'bg-emerald-500',
      delay: 0.3
    },
    {
      icon: Activity,
      label: 'Avg. Daily Usage',
      value: (stats.totalUnits / 30).toFixed(1),
      unit: 'kWh',
      trend: -9.1,
      color: 'bg-orange-500',
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
};

export default OverviewCards;
