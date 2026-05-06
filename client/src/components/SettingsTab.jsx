import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Database, Palette, Globe, HelpCircle, Save } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, action }) => (
  <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
    <div className="flex gap-6 items-center">
      <div className="w-12 h-12 bg-white border border-slate-100 text-slate-500 rounded-2xl flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

const SettingsTab = ({ isDarkMode, setIsDarkMode, user }) => {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
        <p className="text-slate-500">Configure your profile and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] overflow-hidden divide-y divide-slate-50">
          <SettingItem 
            icon={User}
            title="Profile Information"
            description="Update your name, email and contact details"
            action={<button className="text-eco-600 font-bold text-sm">Edit</button>}
          />
          <SettingItem 
            icon={Palette}
            title="Appearance"
            description="Customize your dashboard theme and colors"
            action={
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-eco-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            }
          />
          <SettingItem 
            icon={Bell}
            title="Notifications"
            description="Manage alert thresholds and email preferences"
            action={<button className="text-eco-600 font-bold text-sm">Configure</button>}
          />
          <SettingItem 
            icon={Database}
            title="Data & API"
            description="Connect ThingSpeak or other IoT data sources"
            action={<button className="text-eco-600 font-bold text-sm">Manage</button>}
          />
          <SettingItem 
            icon={Shield}
            title="Security"
            description="Change password and two-factor authentication"
            action={<button className="text-eco-600 font-bold text-sm">Update</button>}
          />
          <SettingItem 
            icon={Globe}
            title="Language & Region"
            description="Set your preferred language and time zone"
            action={<button className="text-eco-600 font-bold text-sm">English (US)</button>}
          />
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] text-center">
              <div className="w-24 h-24 bg-eco-100 text-eco-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-4 border-white shadow-xl">
                 {user?.name?.[0] || 'U'}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
              <p className="text-slate-500 text-sm mb-8">{user?.email}</p>
              <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all">
                Update Avatar
              </button>
           </div>

           <div className="glass p-8 rounded-[2.5rem]">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <HelpCircle size={18} className="text-eco-600" />
                 Need Help?
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                 Check our documentation or contact support for advanced configuration assistance.
              </p>
              <button className="w-full py-3 border border-slate-100 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                 Support Center
              </button>
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
         <button className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
            Cancel
         </button>
         <button className="bg-eco-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-eco-700 transition-all shadow-lg shadow-eco-100">
            <Save size={20} />
            Save Changes
         </button>
      </div>
    </div>
  );
};

export default SettingsTab;
