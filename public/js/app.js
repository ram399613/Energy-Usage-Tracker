/**
 * Home Energy Monitor - Master Orchestrator (Figma Redesign)
 */
import { initCharts, updateLiveChart, updateDistributionChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { initSettings, showToast } from './utils.js';

const socket = io();

const appState = {
    devices: [],
    metrics: { totalConsumed: 0, bill: 0, ecoScore: 75.6 },
    isInitialized: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initCharts();
        initChatbot(appState);
        initSettings();
        
        await fetchData();
        
        appState.isInitialized = true;
        document.body.classList.add('ready');
        
        // --- GSAP Entrance ---
        gsap.from(".animate-float", {
            duration: 1.2,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Floating loop for metric cards
        gsap.to(".animate-float", {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        setInterval(updateClock, 1000);
        setInterval(fetchData, 3000); // Poll every 3s as per Figma design note
        
    } catch (err) {
        console.error("Master Sync Failure:", err);
    }
});

async function fetchData() {
    try {
        const [dashRes, anaRes] = await Promise.all([
            fetch('/api/dashboard'),
            fetch('/api/analytics')
        ]);
        
        const dashData = await dashRes.json();
        const anaData = await anaRes.json();
        
        appState.devices = dashData.devices;
        appState.metrics = dashData.metrics;
        
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

// --- DEVICE TOGGLE ---
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
        showToast(`${appState.devices[deviceIndex].name} Grid Updated`, 'success');
    } catch (e) {
        fetchData();
    }
}

// --- UTILS & NAVIGATION ---
window.showView = (viewId) => {
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    document.getElementById(`${viewId}-view`).style.display = 'block';
    
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        if (b.innerText.toLowerCase() === viewId) b.classList.add('active');
    });

    // GSAP Transition
    gsap.from(`#${viewId}-view`, { duration: 0.5, opacity: 0, x: 20 });
};

function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `<div class="suggestion-card" style="font-size:12px; padding:10px; border-radius:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);">${t}</div>`).join('');
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
