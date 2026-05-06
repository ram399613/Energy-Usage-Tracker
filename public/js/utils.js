/**
 * Utility functions for the NexGen AI Dashboard
 */

export const formatPower = (val) => `${parseFloat(val).toFixed(2)} kW`;
export const formatCurrency = (val) => `₹${Math.floor(val).toLocaleString()}`;
export const formatEnergy = (val) => `${parseFloat(val).toFixed(1)} kWh`;

export const showToast = (msg, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${msg}</span>
        </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

export const animateValue = (id, start, end, duration, suffix = '', prefix = '') => {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        obj.innerHTML = prefix + current.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};
