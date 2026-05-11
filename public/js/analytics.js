import { formatCurrency, formatPower, formatEnergy } from './utils.js';

export const updateAnalytics = (state, anaData) => {
    // 1. Core Summary Metrics
    const loadEl = document.getElementById('current-load');
    const energyEl = document.getElementById('total-energy');
    const carbonEl = document.getElementById('ana-carbon');
    const billEl = document.getElementById('est-bill');
    const ecoEl = document.getElementById('eco-score');

    if (loadEl) loadEl.innerText = formatPower(state.metrics.currentLoad || 0.00);
    if (energyEl) energyEl.innerText = formatEnergy(state.metrics.totalConsumed || 0.00);
    if (carbonEl) carbonEl.innerText = `${(state.metrics.totalConsumed * 0.82).toFixed(2)} kg`;
    if (billEl) billEl.innerText = formatCurrency(state.metrics.bill || 0);
    if (ecoEl) ecoEl.innerText = `${state.metrics.ecoScore}%`;

    // 2. Intelligence View Metrics
    const weeklyBillEl = document.getElementById('ana-bill');
    if (weeklyBillEl) weeklyBillEl.innerText = formatCurrency(state.metrics.bill || 0);
};
