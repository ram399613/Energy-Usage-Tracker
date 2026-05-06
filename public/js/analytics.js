/**
 * Analytics Engine - Master Logic
 */
export const updateAnalytics = (state, anaData) => {
    // 1. Core Summary Metrics
    const totalEl = document.getElementById('total-consumed');
    const carbonEl = document.getElementById('ana-carbon');
    const billEl = document.getElementById('est-bill');
    const ecoEl = document.getElementById('eco-score');

    if (totalEl) totalEl.innerText = `${state.metrics.totalConsumed} kW`;
    if (carbonEl) carbonEl.innerText = `${(state.metrics.totalConsumed * 0.82).toFixed(2)} kg`;
    if (billEl) billEl.innerText = `₹${state.metrics.bill}`;
    if (ecoEl) ecoEl.innerText = `${state.metrics.ecoScore}%`;

    // 2. Intelligence View Metrics
    const dailyEl = document.getElementById('ana-daily');
    const weeklyBillEl = document.getElementById('ana-bill');
    
    if (dailyEl) dailyEl.innerText = anaData.daily;
    if (weeklyBillEl) weeklyBillEl.innerText = `₹${state.metrics.bill}`;
};
