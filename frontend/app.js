// NexGen AI - Smart Energy Management Logic
const socket = io();
let devices = [];
let charts = {
    live: null,
    pie: null,
    predict: null,
    weekly: null
};

// State
let liveData = Array(20).fill(0);
let liveLabels = Array(20).fill('');
let currentView = 'dashboard';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchDashboardData();
    setupEventListeners();
    initSettings();
    updateClock();
    setInterval(updateClock, 1000);
    
    // AI Thinking Loop (Every 10s)
    setInterval(runAIEngine, 10000);
});

// --- NAVIGATION ---
function showView(viewId) {
    currentView = viewId;
    document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
    document.getElementById(`${viewId}-view`).style.display = 'block';
    
    // Update sidebar active state
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(viewId)) {
            a.classList.add('active');
        }
    });

    if (viewId === 'analytics') updateAnalyticsView();
}

// --- API FETCHING ---
async function fetchDashboardData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        devices = data.devices;
        updateMetrics(data.metrics);
        renderDevices(devices);
        updateCharts(data);
    } catch (err) {
        console.error('Neural grid connection failed:', err);
        showToast('Offline Mode: AI Grid Disconnected', 'error');
    }
}

function updateMetrics(metrics) {
    animateCounter('total-consumed', parseFloat(metrics.totalConsumed), ' kWh');
    document.getElementById('active-devices-count').innerText = metrics.activeDevices;
    animateCounter('est-bill', parseFloat(metrics.bill), '', '₹');
    document.getElementById('eco-score').innerText = `${metrics.ecoScore}%`;
}

function renderDevices(deviceList) {
    const container = document.getElementById('device-container');
    if (!container) return;
    
    container.innerHTML = '';
    deviceList.forEach(device => {
        const isActive = device.status === 'Active' || device.status === 'ON';
        const card = document.createElement('div');
        card.className = `device-card ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="device-toggle">
                <label class="switch">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleDevice('${device._id}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="device-icon"><i class="fas ${device.icon}"></i></div>
            <h4>${device.name}</h4>
            <div class="power">${isActive ? `<span class="live-indicator"></span> ${device.usage} kW` : 'Status: Standby'}</div>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${isActive ? Math.min((device.usage / 2 * 100), 100) : 0}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- DEVICE TOGGLE (Optimised) ---
async function toggleDevice(id, isON) {
    // 1. Instant local update for responsive UI
    const status = isON ? 'Active' : 'Idle';
    const deviceIndex = devices.findIndex(d => d._id === id);
    if (deviceIndex !== -1) {
        devices[deviceIndex].status = status;
        if (!isON) devices[deviceIndex].usage = 0;
        renderDevices(devices); // Quick rerender of cards only
    }

    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        const updatedDevice = await res.json();
        
        // 2. Sync with server data
        devices[deviceIndex] = updatedDevice;
        fetchDashboardData(); // Full metrics update

        showToast(`${updatedDevice.name} is now ${status}`, isON ? 'success' : 'info');
        if (isON) runAIEngine(); // Immediate AI response
    } catch (err) {
        showToast('Toggle failed: Neural Link Error', 'error');
    }
}

// --- CHARTS (Fixed Re-initialization) ---
function initCharts() {
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#888', font: { family: 'Outfit' } } } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
            x: { grid: { display: false }, ticks: { color: '#666' } }
        }
    };

    // Live Chart
    charts.live = new Chart(document.getElementById('liveChart'), {
        type: 'line',
        data: {
            labels: liveLabels,
            datasets: [{
                label: 'Usage (kW)',
                data: liveData,
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: { ...chartDefaults, animation: false } // No animation for live line for performance
    });

    // Pie Chart
    charts.pie = new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
            labels: ['HVAC', 'Appliances', 'Lighting', 'Electronics'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#7000ff', '#00f2ff', '#00ff95', '#ffdd00'],
                borderWidth: 0
            }]
        },
        options: { ...chartDefaults, plugins: { legend: { position: 'bottom' } } }
    });

    // Predict Chart
    charts.predict = new Chart(document.getElementById('predictChart'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Hist', data: [45, 52, 48, 60, 55, 65, 70], backgroundColor: 'rgba(112, 0, 255, 0.4)', borderRadius: 5 },
                { label: 'Pred', data: [72, 75, 78, 80, 85, 90, 88], backgroundColor: 'rgba(0, 242, 255, 0.6)', borderRadius: 5 }
            ]
        },
        options: chartDefaults
    });
}

function updateCharts(data) {
    if (!charts.pie || !charts.predict) return;

    // Update Pie
    const categories = { HVAC: 0, Appliances: 0, Lighting: 0, Electronics: 0 };
    devices.forEach(d => {
        if (d.status === 'Active' || d.status === 'ON') {
            categories[d.category || 'General'] += d.usage;
        }
    });
    charts.pie.data.datasets[0].data = Object.values(categories);
    charts.pie.update();

    // Fetch dynamic predictions
    fetch('/api/predictions').then(r => r.json()).then(pred => {
        charts.predict.data.datasets[0].data = pred.historical;
        charts.predict.data.datasets[1].data = pred.forecast;
        charts.predict.update();
        loadSuggestions(pred.savingsTips);
    });
}

// --- AI ENGINE (Working Logic) ---
function runAIEngine() {
    const totalUsage = devices.reduce((sum, d) => sum + (d.status === 'Active' ? d.usage : 0), 0);
    const activeCount = devices.filter(d => d.status === 'Active').length;

    // Dynamic suggestions based on state
    let tips = [];
    if (totalUsage > 3.0) tips.push("⚠️ High load detected. Consider dimming lights.");
    if (activeCount > 5) tips.push("🤖 You have many devices active. Efficiency decreasing.");
    if (devices.some(d => d.name.includes('AC') && d.status === 'Active')) tips.push("❄️ AC is optimized. Keep doors closed for 15% more savings.");
    
    if (tips.length === 0) tips = ["System optimal.", "Energy usage is 5% below average today.", "Good job on eco-maintenance!"];
    
    loadSuggestions(tips);
    updateSystemHealth(totalUsage);
}

function updateSystemHealth(usage) {
    const health = Math.max(70, 100 - (usage * 5));
    document.getElementById('system-health').innerText = `System Health: ${Math.floor(health)}%`;
}

// --- CHATBOT FIX ---
function askAI(query) {
    const chatMessages = document.getElementById('chat-messages');
    appendMsg(query, 'user');

    const typing = document.createElement('div');
    typing.className = 'message ai message-typing';
    typing.innerText = 'Nexus is analysing grid...';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        chatMessages.removeChild(typing);
        let response = "I've processed your telemetry request. No immediate action required.";
        const q = query.toLowerCase();
        
        if (q.includes('power') || q.includes('usage')) {
            const usage = devices.reduce((sum, d) => sum + (d.status === 'Active' ? d.usage : 0), 0);
            response = `Current grid load is ${usage.toFixed(2)} kW with ${devices.filter(d => d.status === 'Active').length} active nodes.`;
        } else if (q.includes('save')) {
            response = "To optimize, I recommend scheduling your Washing Machine for off-peak hours (11 PM - 6 AM).";
        } else if (q.includes('top') || q.includes('highest')) {
            const top = [...devices].sort((a,b) => b.usage - a.usage)[0];
            response = `The ${top.name} is your highest consuming node at ${top.usage} kW.`;
        }
        
        appendMsg(response, 'ai');
    }, 1000);
}

function appendMsg(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerText = text;
    document.getElementById('chat-messages').appendChild(msg);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}

// --- ANALYTICS CALCULATIONS ---
function updateAnalyticsView() {
    const total = devices.reduce((sum, d) => sum + (d.status === 'Active' ? d.usage : 0), 0);
    document.getElementById('ana-daily').innerText = (total * 2.4).toFixed(1);
    document.getElementById('ana-weekly').innerText = (total * 16.8).toFixed(1);
    document.getElementById('ana-peak').innerText = (total * 1.2).toFixed(1);
    document.getElementById('ana-carbon').innerText = (total * 0.82).toFixed(2);

    // Weekly Chart for Analytics view
    if (!charts.weekly) {
        const ctx = document.getElementById('weeklyTrendChart').getContext('2d');
        charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ label: 'Consumption', data: [42, 45, 38, 50, 48, 55, 60], borderColor: '#7000ff', tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

// --- SETTINGS (LocalStorage) ---
function initSettings() {
    const darkMode = localStorage.getItem('dark-mode') !== 'false';
    const notify = localStorage.getItem('notify') !== 'false';
    const aiLevel = localStorage.getItem('ai-level') || 'Medium';

    document.getElementById('set-dark-mode').checked = darkMode;
    document.getElementById('set-notify').checked = notify;
    document.getElementById('set-ai-level').value = aiLevel;

    // Apply basic dark/light logic if needed
    document.body.style.filter = darkMode ? 'none' : 'invert(0.9) hue-rotate(180deg)';
}

function setupEventListeners() {
    document.getElementById('send-chat').onclick = () => {
        const input = document.getElementById('chat-input');
        if (input.value) { askAI(input.value); input.value = ''; }
    };

    document.getElementById('set-dark-mode').onchange = (e) => {
        localStorage.setItem('dark-mode', e.target.checked);
        document.body.style.filter = e.target.checked ? 'none' : 'invert(0.9) hue-rotate(180deg)';
    };

    document.getElementById('save-data-btn').onclick = async () => {
        const deviceName = document.getElementById('m-device').value;
        const watts = document.getElementById('m-watts').value;
        const hours = document.getElementById('m-hours').value;
        const category = document.getElementById('m-cat').value;

        if (!watts || !hours) return showToast('Fill all fields', 'warning');

        try {
            await fetch('/api/energy/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceName, units: (watts*hours)/1000, hoursUsed: hours, category })
            });
            showToast('Grid Telemetry Updated', 'success');
            document.getElementById('manual-modal').style.display = 'none';
            fetchDashboardData();
        } catch (e) { showToast('Sync Failed', 'error'); }
    };

    document.getElementById('manual-data-btn').onclick = () => document.getElementById('manual-modal').style.display = 'flex';
    document.getElementById('close-modal-btn').onclick = () => document.getElementById('manual-modal').style.display = 'none';
}

// --- UTILS ---
function animateCounter(id, target, suffix = '', prefix = '') {
    const el = document.getElementById(id);
    let start = parseFloat(el.innerText.replace(/[^\d.]/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (target - start) * progress;
        el.innerText = prefix + (current.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function loadSuggestions(tips) {
    const list = document.getElementById('suggestions-list');
    if (!list) return;
    list.innerHTML = tips.map(s => `<div class="suggestion-item">${s}</div>`).join('');
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function updateClock() {
    const clock = document.getElementById('live-clock');
    if (clock) clock.querySelector('span').innerText = new Date().toLocaleTimeString();
}

function resetSystem() {
    if (confirm('Clear all AI logs and local settings?')) {
        localStorage.clear();
        location.reload();
    }
}

// Socket Listener for Live Data
socket.on('live-update', (data) => {
    liveData.push(data.usage);
    liveData.shift();
    liveLabels.push(new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    liveLabels.shift();
    if (charts.live) charts.live.update('none'); // No animation for live update to prevent flash
});
