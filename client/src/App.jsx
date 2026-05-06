import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import OverviewCards from './components/OverviewCards';
import AiAnalytics from './components/AiAnalytics';
import DeviceMonitoring from './components/DeviceMonitoring';
import AlertsList from './components/AlertsList';
import UsageTab from './components/UsageTab';
import DevicesTab from './components/DevicesTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import Auth from './components/Auth';
import { energyService, iotService } from './services/api';
import { Sparkles, Cloud, Sun, Search, Bell, SunDim, Moon } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [energyData, setEnergyData] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [weather, setWeather] = useState(null);
  const [stats, setStats] = useState({ totalUnits: 0, totalCost: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchAiInsights();
      fetchWeather();
      setupSocket();
      
      const iotInterval = setInterval(syncIotData, 15000);
      return () => clearInterval(iotInterval);
    }
  }, [user]);

  const setupSocket = () => {
    const socket = io();
    socket.on('connect', () => {
      socket.emit('join', user._id);
    });
    socket.on('newEnergyData', () => {
      fetchData();
    });
    return () => socket.disconnect();
  };

  const fetchData = async () => {
    try {
      const { data } = await energyService.getUsage();
      setEnergyData(data.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        units: item.units,
        cost: item.cost
      })));
      
      const totalUnits = data.reduce((acc, curr) => acc + curr.units, 0);
      const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
      setStats({ totalUnits, totalCost });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsights = async () => {
    try {
      const { data } = await energyService.getAiInsights();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async () => {
    const data = await iotService.fetchWeather();
    setWeather(data);
  };

  const syncIotData = async () => {
    const iotData = await iotService.fetchThingSpeak();
    if (iotData && iotData.units > 0) {
      await energyService.addUsage(iotData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <OverviewCards stats={stats} />
            <AiAnalytics 
              history={energyData} 
              aiInsights={aiInsights} 
              onRefresh={fetchAiInsights}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DeviceMonitoring />
              <AlertsList />
            </div>
          </>
        );
      case 'usage':
        return <UsageTab history={energyData} />;
      case 'devices':
        return <DevicesTab />;
      case 'reports':
        return <ReportsTab />;
      case 'alerts':
        return (
          <div className="max-w-3xl mx-auto">
            <AlertsList />
          </div>
        );
      case 'settings':
        return <SettingsTab isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} />;
      default:
        return <OverviewCards stats={stats} />;
    }
  };

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'} flex transition-colors duration-300`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
      />

      <main className="flex-1 ml-64 p-10 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold tracking-tight"
            >
              Good morning, {user.name.split(' ')[0]} 👋
            </motion.h2>
            <p className="text-slate-500 font-medium mt-1">Here's what's happening with your home energy.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl w-64 focus:outline-none focus:ring-2 focus:ring-eco-500 transition-all shadow-sm"
              />
            </div>

            {/* Weather Widget */}
            {weather && (
              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 text-sm font-bold border-white">
                <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
                  {weather.temp > 20 ? <Sun size={18} /> : <Cloud size={18} />}
                </div>
                <span>{weather.temp}°C</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-eco-600 transition-all shadow-sm"
            >
              {isDarkMode ? <SunDim size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 relative hover:text-eco-600 transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm font-medium">
          <p>© 2026 Energy Usage Tracker AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-eco-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-eco-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-eco-600 transition-colors">Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
