import React from 'react';
import { LayoutDashboard, Zap, Smartphone, FileText, Bell, Settings, LogOut, Leaf } from 'lucide-react';
import { cn } from '../services/utils';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
      active 
        ? "bg-eco-600 text-white shadow-lg shadow-eco-200" 
        : "text-slate-500 hover:bg-eco-50 hover:text-eco-600"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'usage', icon: Zap, label: 'Usage' },
    { id: 'devices', icon: Smartphone, label: 'Devices' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col p-6 z-50">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="bg-eco-600 p-2 rounded-lg text-white">
          <Leaf size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-slate-800">Energy Tracker</h1>
          <p className="text-xs text-eco-600 font-semibold uppercase tracking-wider">AI Powered</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            {...item}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="mt-8 relative h-32 w-full rounded-2xl overflow-hidden shadow-inner bg-eco-50 group">
        <img 
          src="/src/assets/eco-home.png" 
          alt="Eco Home" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <p className="text-[10px] font-bold text-eco-700 uppercase tracking-tighter">Your Smart Eco Home</p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-eco-100 flex items-center justify-center text-eco-700 font-bold border-2 border-white shadow-sm">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
