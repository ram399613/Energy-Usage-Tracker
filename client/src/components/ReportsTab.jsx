import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Printer, CheckCircle2, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const ReportCard = ({ title, date, size, type }) => (
  <div className="glass p-6 rounded-3xl flex items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
    <div className="w-14 h-14 bg-eco-50 text-eco-600 rounded-2xl flex items-center justify-center group-hover:bg-eco-600 group-hover:text-white transition-all duration-300">
      <FileText size={28} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-slate-400 text-sm font-medium">{date} · {size}</p>
    </div>
    <div className="flex gap-2">
      <button className="p-2 text-slate-400 hover:text-eco-600 transition-colors">
        <Download size={20} />
      </button>
      <button className="p-2 text-slate-400 hover:text-eco-600 transition-colors">
        <Share2 size={20} />
      </button>
    </div>
  </div>
);

const ReportsTab = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Energy Reports</h2>
        <p className="text-slate-500">Comprehensive AI-generated analysis of your consumption</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ReportCard title="Monthly Energy Summary" date="May 1, 2024" size="2.4 MB" type="PDF" />
             <ReportCard title="Device Efficiency Audit" date="Apr 28, 2024" size="1.8 MB" type="XLS" />
             <ReportCard title="Carbon Footprint Analysis" date="Apr 15, 2024" size="3.1 MB" type="PDF" />
             <ReportCard title="Solar Generation Potential" date="Apr 02, 2024" size="4.2 MB" type="PDF" />
          </div>

          <div className="glass p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Sparkles size={24} className="text-eco-600" />
              AI Executive Summary
            </h3>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                 <div className="w-10 h-10 rounded-full bg-eco-100 flex items-center justify-center text-eco-600 shrink-0">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 mb-1">Consumption Efficiency</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                       You've reduced your vampire load by 12% compared to last month by optimizing standby devices. This saved approximately $14.20 on your bill.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 mb-1">Peak Usage Alert</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                       Kitchen usage was 40% higher between 6 PM and 8 PM this week. Shifting dishwashing to off-peak hours (after 10 PM) could save you $8/month.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 mb-1">Next Month Forecast</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                       Based on weather forecasts and historical trends, we expect your cooling demand to increase by 20% next month. We recommend cleaning AC filters now.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2rem] bg-eco-600 text-white shadow-xl shadow-eco-100">
            <h3 className="font-bold text-xl mb-4">Generate Custom Report</h3>
            <p className="text-eco-100 text-sm mb-6 leading-relaxed">
              Select a date range and data points to generate a custom analysis.
            </p>
            <div className="space-y-3 mb-8">
               <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-sm font-medium">Last 30 Days</div>
               <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-sm font-medium">Detailed Device Log</div>
            </div>
            <button className="w-full bg-white text-eco-600 font-bold py-3 rounded-2xl hover:bg-eco-50 transition-colors shadow-lg">
              Generate Report
            </button>
          </div>

          <div className="glass p-6 rounded-3xl">
             <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Scheduled Exports</h4>
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Weekly Email</span>
                <span className="text-eco-600 font-bold">Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
