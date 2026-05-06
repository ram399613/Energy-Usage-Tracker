/**
 * Smart Device Rendering - Neural Logic
 */

export const renderDevices = (devices, onToggle) => {
    const container = document.getElementById('device-container');
    if (!container) return;
    
    container.innerHTML = devices.map(device => {
        const isActive = device.status === 'Active' || device.status === 'ON';
        const usagePercent = Math.min((device.usage / 2.5) * 100, 100); // Scale 2.5kW as 100%
        
        return `
            <div class="device-card ${isActive ? 'active' : ''}" data-id="${device._id}">
                <div class="device-header">
                    <div class="device-icon">
                        <i class="fas ${device.icon}"></i>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${isActive ? 'checked' : ''} onchange="window.handleToggle('${device._id}', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="device-info">
                    <h4>${device.name}</h4>
                    <p class="usage-text">${isActive ? device.usage.toFixed(2) : '0.00'} kW | ${device.efficiency}</p>
                </div>
                <div class="usage-progress">
                    <div class="progress-fill" style="width: ${isActive ? usagePercent : 0}%"></div>
                </div>
                <div style="font-size: 10px; color: var(--text-dim); display: flex; justify-content: space-between;">
                    <span>Rating: ${device.watts}W</span>
                    <span>Health: ${device.health}%</span>
                </div>
            </div>
        `;
    }).join('');

    // Attach global handler
    window.handleToggle = onToggle;
};

export const updateDeviceUI = (id, isON, usage) => {
    const card = document.querySelector(`.device-card[data-id="${id}"]`);
    if (!card) return;
    
    if (isON) card.classList.add('active');
    else card.classList.remove('active');
    
    const usageText = card.querySelector('.usage-text');
    if (usageText) usageText.innerText = `${isON ? usage.toFixed(2) : '0.00'} kW | ${isON ? 'Optimal' : 'Idle'}`;
    
    const progress = card.querySelector('.progress-fill');
    if (progress) {
        const usagePercent = Math.min((usage / 2.5) * 100, 100);
        progress.style.width = `${isON ? usagePercent : 0}%`;
    }
};
