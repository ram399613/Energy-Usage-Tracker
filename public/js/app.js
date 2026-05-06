/**
 * Home Energy Monitor - Master Orchestrator (Figma Redesign)
 */
import { initCharts, updateLiveChart, updateDistributionChart } from './charts.js';
import { renderDevices, updateDeviceUI } from './devices.js';
import { updateAnalytics } from './analytics.js';
import { analyzeSystem } from './ai-engine.js';
import { initChatbot } from './chatbot.js';
import { showToast } from './utils.js';
import { initSettings } from './settings.js';

const socket = typeof io !== 'undefined' ? io() : { on: () => {} };

const appState = {
    devices: [],
    metrics: { totalConsumed: 0, bill: 0, ecoScore: 75.6 },
    isInitialized: false
};

// --- GLOBAL NAVIGATION ---
window.showView = (viewId) => {
    console.log(`Grid Sync: Switching to view [${viewId}]`);
    const views = document.querySelectorAll('.view-content');
    const tabs = document.querySelectorAll('.tab-btn');
    
    views.forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });
    
    const target = document.getElementById(`${viewId}-view`);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        if (window.gsap) {
            gsap.from(target, { duration: 0.4, opacity: 0, y: 15 });
        }
    }
    
    tabs.forEach(b => {
        b.classList.remove('active');
        if (b.innerText.toLowerCase() === viewId) b.classList.add('active');
    });
};

// --- INITIALIZATION ---
const initApp = async () => {
    console.log("AI System: Initializing Neural Grid...");
    document.body.classList.add('ready');
    
    try {
        initSettings();
        initCharts();
        initChatbot(appState);
        
        await fetchData();
        appState.isInitialized = true;
        
        // --- Premium Entry Animations ---
        if (window.gsap) {
            const tl = gsap.timeline();
            tl.from(".header", { duration: 1, y: -50, opacity: 0, ease: "power4.out" })
              .from(".metric-card", { duration: 0.8, y: 30, opacity: 0, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.5")
              .from(".chart-card", { duration: 0.8, scale: 0.95, opacity: 0, stagger: 0.2, ease: "power2.out" }, "-=0.4")
              .from(".ai-fab", { duration: 0.6, scale: 0, rotation: -45, ease: "back.out(2)" }, "-=0.2");
        }
        
        setInterval(updateClock, 1000);
        setInterval(fetchData, 5000);
        
    } catch (err) {
        console.error("Initialization Sync Error:", err);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function fetchData() {
    try {
        const [dashRes, anaRes] = await Promise.all([
            fetch('/api/dashboard'),
            fetch('/api/analytics')
        ]);
        
        const dashData = await dashRes.json();
        const anaData = await anaRes.json();
        
        appState.devices = dashData.devices || [];
        appState.metrics = dashData.metrics || appState.metrics;
        
        renderUI(anaData);
    } catch (err) {
        console.warn("Telemetry Polling Error:", err);
    }
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
        showToast(`${appState.devices[deviceIndex]?.name || 'Node'} Updated`, 'success');
    } catch (e) {
        fetchData();
    }
}

function renderSuggestions(tips) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    container.innerHTML = tips.map(t => `<div class="suggestion-card" style="font-size:12px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); margin-bottom:8px;">${t}</div>`).join('');
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
