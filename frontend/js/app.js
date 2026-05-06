/**
 * NexGen AI - Main Application Orchestrator
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeGrid, getPredictions } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast, animateValue } from './utils.js'; // Wait, I put showToast in utils.js

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
    prevTotal: 0,
    predictions: { historical: [], forecast: [] },
    view: 'dashboard'
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initCharts();
    initChatbot(appState);
    initSettings(); // Should be from settings.js
    
    await fetchData();
    
    // Core Loops
    setInterval(updateClock, 1000);
    setInterval(syncPredictions, 30000); // AI Sync every 30s
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
    syncPredictions();
}

// --- CORE ACTIONS ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    
    // 1. Optimistic UI update
    updateDeviceUI(id, isON, isON ? 1.0 : 0); // Temporary usage value
    
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        const updated = await res.json();
        
        // 2. State Sync
        const idx = appState.devices.findIndex(d => d._id === id);
        appState.devices[idx] = updated;
        
        // 3. Trigger Analytics & AI
        const suggestions = analyzeGrid(appState);
        renderSuggestions(suggestions);
        fetchData(); // Refresh metrics
        
        showToast(`${updated.name} is now ${status}`, isON ? 'success' : 'info');
    } catch (e) {
        showToast('Neural Link Failed', 'error');
    }
}

async function syncPredictions() {
    const pred = await getPredictions();
    appState.predictions = pred;
    updatePredictChart(pred.historical, pred.forecast);
}

// --- UTILS ---
function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.querySelector('span').innerText = new Date().toLocaleTimeString();
}

function renderSuggestions(tips) {
    const list = document.getElementById('suggestions-list');
    if (!list) return;
    list.innerHTML = tips.map(t => `<div class="suggestion-item">${t}</div>`).join('');
}

// Socket Integration
socket.on('live-update', (data) => {
    updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
});

// View Switching (No reloads)
window.showView = (viewId) => {
    appState.view = viewId;
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    document.getElementById(`${viewId}-view`).style.display = 'block';
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
