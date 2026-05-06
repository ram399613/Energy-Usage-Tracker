/**
 * NexGen AI Dashboard - Optimized Smart Grid Orchestrator
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast, animateValue } from './utils.js';

const socket = io();

// CENTRALIZED APP STATE
const appState = {
    devices: [],
    metrics: {
        totalConsumed: 0,
        activeDevices: 0,
        bill: 0,
        ecoScore: 94
    },
    view: 'dashboard',
    settings: {
        autoRefresh: true,
        threshold: 50,
        notifications: true
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initCharts();
    initChatbot(appState);
    initSettings(); 
    
    await fetchData();
    
    // Core Dynamic Loops
    setInterval(updateClock, 1000);
    setInterval(updateAIIntelligence, 5000); // More frequent analysis
    
    setupSettingsPanel();
});

async function fetchData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        appState.devices = data.devices;
        appState.metrics = data.metrics;
        
        renderUI();
        checkAlerts();
    } catch (err) {
        showToast('Grid Telemetry Offline', 'error');
    }
}

function renderUI() {
    renderDevices(appState.devices, handleDeviceToggle);
    updateAnalytics(appState);
    updateDistributionChart(appState.devices);
    
    // AI Analysis
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
}

// --- SMART DEVICE SYSTEM (Fixed Device Logic) ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    
    // 1. Instant Response UI
    const deviceIndex = appState.devices.findIndex(d => d._id === id);
    if (deviceIndex !== -1) {
        updateDeviceUI(id, isON, isON ? appState.devices[deviceIndex].usage : 0);
    }
    
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        
        if (res.ok) {
            fetchData(); // Sync everything
            showToast(`${isON ? 'Activated' : 'Deactivated'} Successfully`, 'success');
        }
    } catch (e) {
        showToast('Neural Node Error', 'error');
        fetchData(); // Revert
    }
}

// --- AI INTELLIGENCE & ALERTS ---
function updateAIIntelligence() {
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
    checkAlerts();
}

function checkAlerts() {
    const container = document.getElementById('ai-panel-alerts');
    if (!container) return;
    
    const totalPower = appState.devices.filter(d => d.status === 'Active').reduce((sum, d) => sum + d.usage, 0);
    const threshold = parseInt(localStorage.getItem('energy-threshold')) || 50;

    container.innerHTML = '';
    
    if (totalPower > threshold) {
        container.innerHTML = `
            <div class="alert-card">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="alert-content">
                    <h6>High Usage Alert</h6>
                    <p>Current load ${totalPower.toFixed(0)} units exceeds your ${threshold} unit threshold.</p>
                </div>
            </div>
        `;
    }
}

// --- SETTINGS (localStorage Persistence) ---
function setupSettingsPanel() {
    const thresholdSlider = document.getElementById('set-threshold');
    const autoRefreshToggle = document.getElementById('set-auto-refresh');
    
    if (thresholdSlider) {
        thresholdSlider.value = localStorage.getItem('energy-threshold') || 50;
        thresholdSlider.oninput = (e) => {
            localStorage.setItem('energy-threshold', e.target.value);
            checkAlerts();
        };
    }

    if (autoRefreshToggle) {
        autoRefreshToggle.checked = localStorage.getItem('auto-refresh') !== 'false';
        autoRefreshToggle.onchange = (e) => {
            localStorage.setItem('auto-refresh', e.target.checked);
        };
    }
}

function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `<div class="suggestion-card">${t}</div>`).join('');
}

function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.querySelector('span').innerText = new Date().toLocaleTimeString();
}

// Socket Live Monitoring
socket.on('live-update', (data) => {
    updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
});

window.showView = (viewId) => {
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    document.getElementById(`${viewId}-view`).style.display = 'block';
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
