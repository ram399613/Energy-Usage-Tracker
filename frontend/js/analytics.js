/**
 * Analytics Engine - Logic for calculations
 */
import { animateValue } from './utils.js';

export const updateAnalytics = (state) => {
    const totalCurrent = state.devices.reduce((sum, d) => sum + (d.status === 'Active' || d.status === 'ON' ? d.usage : 0), 0);
    
    // Derived values
    const dailyEst = totalCurrent * 24;
    const weeklyEst = dailyEst * 7;
    const monthlyBill = weeklyEst * 4 * 8.0; // 8 INR per unit
    const carbon = weeklyEst * 0.82; // 0.82 kg CO2 per kWh

    // Update DOM safely
    updateElement('ana-daily', dailyEst.toFixed(1));
    updateElement('ana-weekly', weeklyEst.toFixed(1));
    updateElement('ana-peak', (totalCurrent * 1.2).toFixed(1));
    updateElement('ana-carbon', carbon.toFixed(2));
    
    // Smooth counters for top metrics
    if (state.prevTotal !== totalCurrent) {
        animateValue('total-consumed', state.prevTotalConsumed || 0, state.metrics.totalConsumed, 1000, ' kWh');
        state.prevTotalConsumed = state.metrics.totalConsumed;
    }
};

const updateElement = (id, val) => {
    const el = document.getElementById(id);
    if (el && el.innerText !== val) el.innerText = val;
};
