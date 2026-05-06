/**
 * NexGen AI Dashboard - Final Production Repair
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast } from './utils.js';

const socket = io();

// MASTER APP STATE
const appState = {
    devices: [],
    metrics: {
        totalConsumed: 0,
        activeDevices: 0,
        bill: 0,
        ecoScore: 94
    },
    view: 'dashboard',
    isInitialized: false
};

// --- SAFE INITIALIZATION SEQUENCE ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Initializing Neural Grid...");
        
        // 1. Core Systems
        initSettings();
        initCharts();
        initChatbot(appState);
        
        // 2. Initial Data Sync
        await fetchData();
        
        // 3. Post-render logic
        appState.isInitialized = true;
        document.body.classList.add('ready');
        
        // 4. Dynamic Loops
        setInterval(updateClock, 1000);
        setInterval(fetchData, 5000); // 5s Real-time polling as requested
        
        console.log("Neural Grid Stable.");
    } catch (err) {
        console.error("Initialization Failed:", err);
        showToast("Grid Sync Critical Error", "error");
    }
});

async function fetchData() {
    try {
        // Fetch all endpoints to ensure full state sync
        const [dashRes, anaRes, billRes] = await Promise.all([
            fetch('/api/dashboard'),
            fetch('/api/analytics'),
            fetch('/api/bill')
        ]);
        
        const dashData = await dashRes.json();
        const anaData = await anaRes.json();
        const billData = await billRes.json();
        
        // Update State
        appState.devices = dashData.devices;
        appState.metrics = dashData.metrics;
        appState.metrics.bill = billData.bill;
        
        renderUI(anaData);
    } catch (err) {
        console.error("Data Fetch Failed:", err);
    }
}

function renderUI(anaData) {
    // 1. Devices & Controls
    renderDevices(appState.devices, handleDeviceToggle);
    
    // 2. Analytics & Counters
    updateAnalytics(appState, anaData);
    
    // 3. Chart Updates (Using .update() - No Recreate)
    updateDistributionChart(appState.devices);
    
    // 4. AI Engine
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
}

// --- ROBUST DEVICE TOGGLE ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    
    // Optimistic UI Update
    updateDeviceUI(id, isON, isON ? 1.0 : 0);
    
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        
        if (res.ok) {
            await fetchData(); // Full state refresh
            showToast(`${isON ? 'Activated' : 'Deactivated'} Node`, 'success');
        } else {
            throw new Error("Toggle failed on server");
        }
    } catch (e) {
        showToast('Node Link Failure', 'error');
        fetchData(); // Revert UI
    }
}

function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `
        <div class="suggestion-card">
            <i class="fas fa-brain" style="color:var(--accent-cyan); margin-right:8px;"></i>
            ${t}
        </div>
    `).join('');
}

function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.querySelector('span').innerText = new Date().toLocaleTimeString();
}

// SOCKET.IO LIVE UPDATES
socket.on('live-update', (data) => {
    if (appState.isInitialized) {
        updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
});

// GLOBAL NAVIGATION
window.showView = (viewId) => {
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    const target = document.getElementById(`${viewId}-view`);
    if (target) target.style.display = 'block';
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
