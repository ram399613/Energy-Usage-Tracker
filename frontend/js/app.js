/**
 * NexGen AI Dashboard - Master Orchestrator
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast } from './utils.js';

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
    view: 'dashboard'
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initCharts();
    initChatbot(appState); // Passes state for context-aware chat
    initSettings(); 
    
    await fetchData();
    
    // Core Dynamic Loops
    setInterval(updateClock, 1000);
    setInterval(fetchData, 15000); // Poll every 15s for stability
});

async function fetchData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        appState.devices = data.devices;
        appState.metrics = data.metrics;
        
        renderUI();
    } catch (err) {
        showToast('Grid Telemetry Sync Failed', 'error');
    }
}

function renderUI() {
    renderDevices(appState.devices, handleDeviceToggle);
    updateAnalytics(appState);
    updateDistributionChart(appState.devices);
    
    // Sync AI Suggestions
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
}

// --- DEVICE TOGGLE ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    
    // 1. Optimistic UI
    const deviceIndex = appState.devices.findIndex(d => d._id === id);
    if (deviceIndex !== -1) {
        const dev = appState.devices[deviceIndex];
        updateDeviceUI(id, isON, isON ? (dev.watts / 1000) : 0);
    }
    
    try {
        await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        
        // 2. Full Sync
        fetchData();
        showToast(`${appState.devices[deviceIndex].name} grid status: ${status}`, 'success');
        
    } catch (e) {
        showToast('Neural Link Interrupted', 'error');
        fetchData();
    }
}

function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `
        <div class="suggestion-card">
            <i class="fas fa-microchip" style="color:var(--accent-cyan); margin-right:8px;"></i>
            ${t}
        </div>
    `).join('');
}

function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.querySelector('span').innerText = new Date().toLocaleTimeString();
}

// Socket Live Monitoring
socket.on('live-update', (data) => {
    updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
});

// View Navigation
window.showView = (viewId) => {
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    document.getElementById(`${viewId}-view`).style.display = 'block';
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
