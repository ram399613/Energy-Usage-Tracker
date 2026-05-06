/**
 * Smart Neural Node Management (Devices)
 */
import { showToast } from './utils.js';

export const renderDevices = (devices, onToggle) => {
    const container = document.getElementById('device-container');
    if (!container) return;

    const fragment = document.createDocumentFragment();
    
    devices.forEach(device => {
        const isActive = device.status === 'Active' || device.status === 'ON';
        const card = document.createElement('div');
        card.className = `device-card ${isActive ? 'active' : ''}`;
        card.id = `dev-${device._id}`;
        
        card.innerHTML = `
            <div style="position: absolute; top: 24px; right: 24px;">
                <label class="switch">
                    <input type="checkbox" ${isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="device-icon"><i class="fas ${getIcon(device.name)}"></i></div>
            <h4>${device.name}</h4>
            <div class="usage-text">${isActive ? `⚡ Active: ${device.usage} kW` : '💤 Node Idle'}</div>
            <div style="width: 100%; height: 2px; background: rgba(255,255,255,0.05); border-radius: 1px;">
                <div style="width: ${isActive ? Math.min((device.usage / 2 * 100), 100) : 0}%; height: 100%; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); transition: 1s ease;"></div>
            </div>
        `;
        
        card.querySelector('input').onchange = (e) => onToggle(device._id, e.target.checked);
        fragment.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
};

export const updateDeviceUI = (id, isON, usage) => {
    const card = document.getElementById(`dev-${id}`);
    if (!card) return;
    
    card.classList.toggle('active', isON);
    const usageText = card.querySelector('.usage-text');
    const bar = card.querySelector('div[style*="height: 100%"]');
    
    if (isON) {
        usageText.innerText = `⚡ Active: ${usage} kW`;
        if (bar) bar.style.width = `${Math.min((usage / 2 * 100), 100)}%`;
    } else {
        usageText.innerText = '💤 Node Idle';
        if (bar) bar.style.width = '0%';
    }
};

function getIcon(name) {
    const n = name.toLowerCase();
    if (n.includes('ac') || n.includes('conditioner')) return 'fa-snowflake';
    if (n.includes('fan')) return 'fa-fan';
    if (n.includes('tv') || n.includes('television')) return 'fa-tv';
    if (n.includes('refrigerator') || n.includes('fridge')) return 'fa-refrigerator';
    if (n.includes('washing')) return 'fa-soap';
    if (n.includes('light')) return 'fa-lightbulb';
    if (n.includes('laptop') || n.includes('computer')) return 'fa-laptop';
    if (n.includes('heater')) return 'fa-fire';
    if (n.includes('solar')) return 'fa-solar-panel';
    return 'fa-microchip';
}
