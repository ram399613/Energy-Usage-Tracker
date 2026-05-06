// NexGen AI - Smart Energy Management Logic
const socket = io();
let devices = [];
let liveChart, pieChart, predictChart;
let liveData = Array(20).fill(0);
let liveLabels = Array(20).fill('');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchDashboardData();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
});

// --- API FETCHING ---
async function fetchDashboardData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        devices = data.devices;
        updateMetrics(data.metrics);
        renderDevices(devices);
        updateCharts(data);
        loadSuggestions();
    } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        showToast('Connection to Neural Grid failed', 'error');
    }
}

function updateMetrics(metrics) {
    document.getElementById('total-consumed').innerText = `${metrics.totalConsumed} kWh`;
    document.getElementById('active-devices-count').innerText = metrics.activeDevices;
    document.getElementById('est-bill').innerText = `₹${metrics.bill}`;
    document.getElementById('eco-score').innerText = `${metrics.ecoScore}%`;
}

function renderDevices(deviceList) {
    const container = document.getElementById('device-container');
    container.innerHTML = '';

    deviceList.forEach(device => {
        const isActive = device.status === 'Active' || device.status === 'ON';
        const card = document.createElement('div');
        card.className = `device-card ${isActive ? 'active' : ''} animate-fadeIn`;
        card.innerHTML = `
            <div class="device-toggle">
                <label class="switch">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleDevice('${device._id}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="device-icon"><i class="fas ${device.icon}"></i></div>
            <h4>${device.name}</h4>
            <div class="power">${isActive ? `Consuming ${device.usage} kW` : 'Status: Standby'}</div>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${isActive ? (device.usage / 2 * 100) : 0}%"></div>
            </div>
            <div style="font-size: 10px; color: var(--text-dim); margin-top: 5px;">Efficiency: ${device.efficiency}</div>
        `;
        container.appendChild(card);
    });
}

// --- ACTIONS ---
async function toggleDevice(id, isON) {
    const status = isON ? 'Active' : 'Idle';
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status })
        });
        const updatedDevice = await res.json();
        
        // Update local state
        devices = devices.map(d => d._id === id ? updatedDevice : d);
        fetchDashboardData(); // Refresh metrics

        showToast(`${updatedDevice.name} is now ${status}`, isON ? 'success' : 'info');
        
        // AI Reaction
        if (isON && updatedDevice.name.includes('AC')) {
            addAIMessage(`I've detected the ${updatedDevice.name} is now active. This will increase current consumption by approx ${updatedDevice.usage} kW. Would you like me to optimize other devices?`);
        }
    } catch (err) {
        showToast('Neural link failed', 'error');
    }
}

// --- MANUAL DATA ENTRY ---
const manualModal = document.getElementById('manual-modal');
document.getElementById('manual-data-btn').onclick = () => manualModal.style.display = 'flex';
document.getElementById('close-modal-btn').onclick = () => manualModal.style.display = 'none';

document.getElementById('save-data-btn').onclick = async () => {
    const deviceName = document.getElementById('m-device').value;
    const watts = document.getElementById('m-watts').value;
    const hours = document.getElementById('m-hours').value;
    const category = document.getElementById('m-cat').value;

    if (!watts || !hours) {
        showToast('Please fill all fields', 'warning');
        return;
    }

    const units = (watts * hours) / 1000;

    try {
        const res = await fetch('/api/energy/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceName, units, hoursUsed: hours, category })
        });
        
        if (res.ok) {
            showToast('Data synced to Cloud Grid', 'success');
            manualModal.style.display = 'none';
            fetchDashboardData();
            addAIMessage(`Manual data entry processed. I've updated the weekly trend and recalculated your bill estimate.`);
        }
    } catch (err) {
        showToast('Cloud Sync Error', 'error');
    }
};

// --- CHARTS ---
function initCharts() {
    const ctxLive = document.getElementById('liveChart').getContext('2d');
    liveChart = new Chart(ctxLive, {
        type: 'line',
        data: {
            labels: liveLabels,
            datasets: [{
                label: 'kW Usage',
                data: liveData,
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['HVAC', 'Appliances', 'Lighting', 'Electronics'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#7000ff', '#00f2ff', '#00ff95', '#ffdd00'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#aaa', usePointStyle: true, font: { size: 10 } } } }
        }
    });

    const ctxPredict = document.getElementById('predictChart').getContext('2d');
    predictChart = new Chart(ctxPredict, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Historical', data: [45, 52, 48, 60, 55, 65, 70], backgroundColor: 'rgba(112, 0, 255, 0.4)', borderRadius: 5 },
                { label: 'Predicted', data: [72, 75, 78, 80, 85, 90, 88], backgroundColor: 'rgba(0, 242, 255, 0.6)', borderRadius: 5 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            },
            plugins: { legend: { position: 'top', labels: { color: '#aaa' } } }
        }
    });
}

function updateCharts(data) {
    // Pie chart update based on categories
    const categories = { HVAC: 0, Appliances: 0, Lighting: 0, Electronics: 0 };
    devices.forEach(d => {
        if (d.status === 'Active' || d.status === 'ON') {
            categories[d.category || 'General'] += d.usage;
        }
    });
    pieChart.data.datasets[0].data = Object.values(categories);
    pieChart.update();
}

// Socket Live Updates
socket.on('live-update', (data) => {
    liveData.push(data.usage);
    liveData.shift();
    liveLabels.push(new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    liveLabels.shift();
    liveChart.update();
    
    // AI Alert if spike
    if (data.usage > 4.5) {
        showToast('Energy spike detected in main grid!', 'warning');
        addAIMessage('Warning: I am detecting an unusual energy surge. Suggesting checking for heavy appliance load.');
    }
});

// --- AI CHATBOT ---
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

sendChat.onclick = () => {
    const msg = chatInput.value;
    if (!msg) return;
    askAI(msg);
    chatInput.value = '';
};

chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendChat.click(); };

function askAI(query) {
    // User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerText = query;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI Response (Simulated)
    const typing = document.createElement('div');
    typing.className = 'message ai message-typing';
    typing.innerText = 'Nexus is thinking...';
    chatMessages.appendChild(typing);
    
    setTimeout(() => {
        chatMessages.removeChild(typing);
        const response = generateAIResponse(query);
        addAIMessage(response);
    }, 1500);
}

function addAIMessage(text) {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    aiMsg.innerText = text;
    chatMessages.appendChild(aiMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('save')) return "To save energy, I recommend turning off the Living Room AC when you're not in the room. This could save you up to 15% on your monthly bill.";
    if (q.includes('most power') || q.includes('highest')) {
        const top = [...devices].sort((a,b) => b.usage - a.usage)[0];
        return `The ${top.name} is currently consuming the most power (${top.usage} kW).`;
    }
    if (q.includes('prediction')) return "I predict a 12% increase in usage over the next 48 hours due to forecasted temperature rises in your area.";
    if (q.includes('abnormal')) return "No critical abnormalities detected, but your Kitchen Fridge efficiency score is slightly lower than usual (88%).";
    return "I've analyzed your request. My neural engine suggests maintaining current settings for maximum efficiency.";
}

// --- UTILS ---
function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'check-circle' : (type === 'warning' || type === 'error' ? 'exclamation-triangle' : 'info-circle');
    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 500);
    }, 4000);
}

function loadSuggestions() {
    const list = document.getElementById('suggestions-list');
    const suggestions = [
        "AC is consuming 30% more than average.",
        "Turn OFF TV to save 1.2 kWh.",
        "Energy spike detected in Bed Room.",
        "Best saving time: 2 PM – 5 PM Today."
    ];
    list.innerHTML = suggestions.map(s => `<div class="suggestion-item"><i class="fas fa-magic" style="margin-right:10px; font-size:10px;"></i>${s}</div>`).join('');
}

function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').querySelector('span').innerText = now.toLocaleTimeString();
}
