/**
 * Smart Device Grid Management
 */
import { showToast } from './utils.js';

export const renderDevices = (devices, onToggle) => {
    const container = document.getElementById('device-container');
    if (!container) return;

    // Use a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    devices.forEach(device => {
        const isActive = device.status === 'Active' || device.status === 'ON';
        const card = document.createElement('div');
        card.className = `device-card ${isActive ? 'active' : ''}`;
        card.id = `dev-${device._id}`;
        card.innerHTML = `
            <div class="device-toggle">
                <label class="switch">
                    <input type="checkbox" ${isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="device-icon"><i class="fas ${device.icon}"></i></div>
            <h4>${device.name}</h4>
            <div class="power">${isActive ? `<span class="live-indicator"></span> ${device.usage} kW` : 'Status: Idle'}</div>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${isActive ? Math.min((device.usage / 2 * 100), 100) : 0}%"></div>
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
    const powerEl = card.querySelector('.power');
    const barFill = card.querySelector('.usage-fill');
    
    if (isON) {
        powerEl.innerHTML = `<span class="live-indicator"></span> ${usage} kW`;
        barFill.style.width = `${Math.min((usage / 2 * 100), 100)}%`;
    } else {
        powerEl.innerText = 'Status: Idle';
        barFill.style.width = '0%';
    }
};
