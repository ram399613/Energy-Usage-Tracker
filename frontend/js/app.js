/**
 * NexGen AI Dashboard - Main Application Orchestrator
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast, animateValue } from './utils.js';

const socket = io();

// CENTRALIZED APP STATE (Production Ready)
const appState = {
    devices: [],
    metrics: {
        totalConsumed: 0,
        activeDevices: 0,
        bill: 0,
        ecoScore: 94
    },
    prevTotal: 0,
    predictions: { historical: [], forecast: [] },
    view: 'dashboard',
    lastSync: Date.now()
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initCharts();
    initChatbot(appState);
    initSettings(); 
    
    await fetchData();
    
    // Core Dynamic Loops
    setInterval(updateClock, 1000);
    setInterval(periodicSync, 10000); // Analysis every 10s
    
    // Smooth scroll for dashboard
    document.querySelector('.dashboard-content').style.scrollBehavior = 'smooth';
});

async function fetchData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        appState.devices = data.devices;
        appState.metrics = data.metrics;
        
        renderUI();
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

// --- SMART DEVICE SYSTEM (Fixed & Robust) ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    
    // 1. Instant Optimistic UI
    const deviceIndex = appState.devices.findIndex(d => d._id === id);
    if (deviceIndex !== -1) {
        const device = appState.devices[deviceIndex];
        updateDeviceUI(id, isON, isON ? (device.baseUsage || 1.2) : 0);
    }
    
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        const updated = await res.json();
        
        // 2. State Sync
        appState.devices[deviceIndex] = updated;
        
        // 3. Re-render dependent components
        fetchData(); // Sync metrics and other charts
        
        showToast(`${updated.name} successfully ${status === 'Active' ? 'activated' : 'deactivated'}`, 'success');
        
        // Trigger AI Insight immediately
        const suggestions = analyzeSystem(appState);
        renderSuggestions(suggestions);

    } catch (e) {
        showToast('Neural Node Communication Error', 'error');
        renderDevices(appState.devices, handleDeviceToggle); // Revert UI
    }
}

function periodicSync() {
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
}

// --- UTILS ---
function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.querySelector('span').innerText = new Date().toLocaleTimeString();
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

// Socket Integration for Live Monitoring Feel
socket.on('live-update', (data) => {
    updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
});

// Production Ready Navigation
window.showView = (viewId) => {
    appState.view = viewId;
    document.querySelectorAll('.view-content').forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });
    
    const target = document.getElementById(`${viewId}-view`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 50);
    }
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
