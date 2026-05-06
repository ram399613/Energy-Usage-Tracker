/**
 * NEXUS AI Dashboard - Final Master Orchestrator
 */
import { initCharts, updateLiveChart, updateDistributionChart, updatePredictChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast } from './utils.js';

const socket = io();

const appState = {
    devices: [],
    metrics: { totalConsumed: 0, activeDevices: 0, bill: 0, ecoScore: 94 },
    view: 'dashboard',
    isInitialized: false
};

// --- MASTER INIT ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initSettings();
        initCharts();
        initChatbot(appState);
        
        await fetchData();
        
        appState.isInitialized = true;
        document.body.classList.add('ready');
        
        setInterval(updateClock, 1000);
        setInterval(fetchData, 8000); // Poll every 8s for fresh AI insights
        
        setupManualEntry();
        
    } catch (err) {
        console.error("Master Sync Failure:", err);
    }
});

async function fetchData() {
    try {
        const [dashRes, anaRes, billRes] = await Promise.all([
            fetch('/api/dashboard'),
            fetch('/api/analytics'),
            fetch('/api/bill')
        ]);
        
        const dashData = await dashRes.json();
        const anaData = await anaRes.json();
        const billData = await billRes.json();
        
        appState.devices = dashData.devices;
        appState.metrics = dashData.metrics;
        appState.metrics.bill = billData.bill;
        
        renderUI(anaData);
    } catch (err) {}
}

function renderUI(anaData) {
    renderDevices(appState.devices, handleDeviceToggle);
    updateAnalytics(appState, anaData);
    updateDistributionChart(appState.devices);
    
    const suggestions = analyzeSystem(appState);
    renderSuggestions(suggestions);
}

// --- CORE ACTIONS ---
async function handleDeviceToggle(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    const deviceIndex = appState.devices.findIndex(d => d._id === id);
    if (deviceIndex !== -1) {
        updateDeviceUI(id, isON, isON ? (appState.devices[deviceIndex].watts / 1000) : 0);
    }
    
    try {
        await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        fetchData();
        showToast(`${appState.devices[deviceIndex].name} Grid Status: ${status}`, 'success');
    } catch (e) {
        fetchData();
    }
}

function setupManualEntry() {
    const saveBtn = document.getElementById('save-data-btn');
    if (!saveBtn) return;

    saveBtn.onclick = async () => {
        const deviceName = document.getElementById('m-device').value;
        const watts = document.getElementById('m-watts').value;
        const hours = document.getElementById('m-hours').value;
        
        if (!watts || !hours) return showToast('Please fill all parameters.', 'warning');

        try {
            await fetch('/api/energy/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    deviceName, 
                    units: (watts * hours) / 1000, 
                    hoursUsed: hours,
                    category: 'Manual' 
                })
            });
            showToast('Manual Grid Update Successful', 'success');
            fetchData();
            showView('dashboard'); // Redirect to dashboard to see changes
        } catch (e) {
            showToast('Grid Update Failed', 'error');
        }
    };
}

// --- UTILS ---
function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `<div class="suggestion-card"><i class="fas fa-microchip"></i> ${t}</div>`).join('');
}

function updateClock() {
    const el = document.getElementById('live-clock');
    if (el) el.innerText = new Date().toLocaleTimeString();
}

socket.on('live-update', (data) => {
    if (appState.isInitialized) {
        updateLiveChart(data.usage, new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
});

window.showView = (viewId) => {
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    const target = document.getElementById(`${viewId}-view`);
    if (target) target.style.display = 'block';
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick')?.includes(viewId)) a.classList.add('active');
    });
};
