/**
 * NexGen Energy AI - Client Logic
 * Handles real-time updates, AI engine, and page interactions.
 */

// --- Global State Management ---
const NexGenState = {
    currentUsage: 2.84,
    totalConsumed: 152.4,
    monthlyBill: 2450,
    ecoScore: 94,
    carbonFootprint: 12.4,
    charts: {
        main: null,
        prediction: null,
        sparklines: []
    },
    isLive: true
};

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    if (body.classList.contains('dashboard-page')) {
        initDashboard();
    } else if (body.classList.contains('devices-page')) {
        initDevicesPage();
    } else if (body.classList.contains('analytics-page')) {
        initAnalyticsPage();
    }
    
    initTheme();
    initNotifications();
});

// --- Dashboard Logic ---
async function initDashboard() {
    NexGenState.charts = initCharts();
    initCounters();
    initAIEngine();
    loadTips();
    
    // Initial data fetch
    await fetchDashboardData();
    startLivePolling();
    
    if (NexGenState.charts.main) {
        initManualEntry(NexGenState.charts.main);
    }

    // Live Toggle
    const liveBtn = document.querySelector('.btn-mini.active');
    if (liveBtn && liveBtn.innerText === "Live") {
        liveBtn.onclick = () => {
            NexGenState.isLive = !NexGenState.isLive;
            liveBtn.innerText = NexGenState.isLive ? "Live" : "Paused";
            liveBtn.style.background = NexGenState.isLive ? 'var(--blue)' : '#444';
            showToast("System State", `Simulation ${NexGenState.isLive ? 'Resumed' : 'Paused'}.`, "info");
        };
    }

    const upgradeBtn = document.getElementById('upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.onclick = () => {
            showToast("Subscription", "Redirecting to premium secure gateway...", "success");
        };
    }
}

// --- Analytics Page Logic ---
function initAnalyticsPage() {
    NexGenState.charts = initCharts();
    
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.onclick = () => {
            showToast("Exporting", "Preparing high-fidelity neural report (PDF)...", "info");
            setTimeout(() => {
                showToast("Success", "Report downloaded successfully.", "success");
            }, 2000);
        };
    }
}

// --- Devices Page Logic ---
function initDevicesPage() {
    renderDevices();
}

async function renderDevices() {
    const container = document.querySelector('.device-grid');
    if (!container) return;

    try {
        const res = await fetch('/api/devices');
        const devices = await res.json();

        container.innerHTML = devices.map(d => `
            <div class="glass device-card ${d.status.toLowerCase()}" data-id="${d._id}">
                <div class="dc-top">
                    <i class="fas ${d.icon}"></i>
                    <div class="dc-status"><span>${d.status}</span><div class="dot ${d.status === 'Idle' ? 'gray' : ''}"></div></div>
                </div>
                <h3>${d.name}</h3>
                <div class="dc-info"><span>Usage: ${d.usage} kW</span><span>Efficiency: ${d.efficiency}</span></div>
                <button class="toggle-btn" onclick="toggleDevice('${d._id}', '${d.status}')">${d.status === 'Active' ? 'Turn Off' : 'Turn On'}</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Failed to load devices", err);
    }
}

async function toggleDevice(id, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Idle' : 'Active';
    try {
        const res = await fetch('/api/device/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: id, status: newStatus })
        });
        if (res.ok) {
            showToast("Device Updated", `System is now ${newStatus.toLowerCase()}.`, "success");
            renderDevices();
            // If we are on dashboard, sync immediately
            if (document.body.classList.contains('dashboard-page')) {
                await fetchDashboardData();
            }
        }
    } catch (err) {
        showToast("Error", "Could not sync with hardware.", "warning");
    }
}

// --- Charts Logic (ApexCharts) ---
function initCharts() {
    const isDashboard = document.getElementById('main-chart');
    const isAnalytics = document.getElementById('prediction-chart');
    let mainChart = null;
    let predChart = null;

    if (isDashboard) {
        const options = {
            series: [{ name: 'Power (kW)', data: [1.2, 1.8, 1.5, 2.4, 2.8, 2.2, 3.1, 2.9, 3.5, 3.2, 2.8, 2.4] }],
            chart: { type: 'area', height: 350, toolbar: { show: false }, animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 800 } } },
            stroke: { curve: 'smooth', width: 3, colors: ['#00f2ff'] },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
            xaxis: { categories: ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'], labels: { style: { colors: '#94a3b8' } } },
            yaxis: { labels: { style: { colors: '#94a3b8' } } },
            theme: { mode: 'dark' },
            grid: { borderColor: 'rgba(255,255,255,0.05)' }
        };
        mainChart = new ApexCharts(isDashboard, options);
        mainChart.render();
    }

    if (isAnalytics) {
        const predOptions = {
            series: [
                { name: 'Historical', data: [45, 52, 48, 60, 55, 65] },
                { name: 'AI Forecast', data: [null, null, null, null, null, 65, 70, 75, 72, 80] }
            ],
            chart: { type: 'line', height: 400, toolbar: { show: false } },
            stroke: { width: [3, 3], dashArray: [0, 8], curve: 'smooth' },
            colors: ['#0072ff', '#00f2ff'],
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
            theme: { mode: 'dark' }
        };
        predChart = new ApexCharts(isAnalytics, predOptions);
        predChart.render();
    }

    const isHeatmap = document.getElementById('heatmap-chart');
    const isTrends = document.getElementById('trends-chart');

    if (isHeatmap) {
        new ApexCharts(isHeatmap, {
            series: [{ name: 'Efficiency', data: [85, 88, 92, 90, 89, 94, 95] }],
            chart: { type: 'bar', height: 250, toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 10, columnWidth: '50%' } },
            colors: ['#00f2ff'],
            xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
            theme: { mode: 'dark' }
        }).render();
    }

    if (isTrends) {
        new ApexCharts(isTrends, {
            series: [{ name: 'Savings', data: [10, 15, 8, 12, 20, 25, 22] }],
            chart: { type: 'line', height: 250, toolbar: { show: false } },
            stroke: { curve: 'stepline', width: 3 },
            colors: ['#00ff88'],
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
            theme: { mode: 'dark' }
        }).render();
    }

    const spark = (id, data, color) => {
        const el = document.querySelector(id);
        if (el) {
            new ApexCharts(el, {
                chart: { type: 'line', height: 40, sparkline: { enabled: true } },
                series: [{ data }],
                stroke: { curve: 'smooth', width: 2, colors: [color] }
            }).render();
        }
    };
    spark("#spark1", [12, 15, 18, 14, 16], "#00f2ff");
    spark("#spark2", [45, 42, 48, 44, 40], "#00ff88");
    spark("#spark3", [10, 12, 11, 15, 14], "#bc13fe");
    spark("#spark4", [90, 92, 91, 94, 93], "#ffb800");

    return { main: mainChart, prediction: predChart };
}

// --- Data Synchronization ---
async function fetchDashboardData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        NexGenState.currentUsage = parseFloat(data.metrics.currentUsage);
        NexGenState.totalConsumed = parseFloat(data.metrics.totalConsumed);
        NexGenState.monthlyBill = parseFloat(data.metrics.bill);
        NexGenState.carbonFootprint = parseFloat(data.metrics.carbon);
        NexGenState.ecoScore = data.metrics.ecoScore;
        
        updateLiveUI();
        updateMainChart();
    } catch (err) {
        console.error("Dashboard sync failed", err);
    }
}

function startLivePolling() {
    setInterval(() => {
        if (NexGenState.isLive) {
            // Add a small jitter to the live usage for "aliveness"
            const jitter = (Math.random() - 0.5) * 0.1;
            NexGenState.currentUsage = Math.max(0, NexGenState.currentUsage + jitter);
            updateLiveUI();
            updateMainChart();
            
            // Poll full state every 15 seconds
            if (Math.random() > 0.8) fetchDashboardData();
        }
    }, 4000);
}

function updateLiveUI() {
    const usageEl = document.querySelector('[data-target="2.84"]');
    const totalEl = document.querySelector('[data-target="152.4"]');
    const billEl = document.querySelector('[data-target="2450"]');
    const carbonEl = document.querySelector('.carbon-card h1');
    const ecoCircle = document.querySelector('.eco-progress');
    
    if (usageEl) usageEl.innerText = NexGenState.currentUsage.toFixed(2);
    if (totalEl) totalEl.innerText = NexGenState.totalConsumed.toFixed(1);
    if (billEl) billEl.innerText = Math.floor(NexGenState.monthlyBill);
    if (carbonEl) carbonEl.innerText = NexGenState.carbonFootprint.toFixed(1);

    if (ecoCircle) {
        const offset = 220 - (220 * NexGenState.ecoScore / 100);
        ecoCircle.style.strokeDashoffset = offset;
    }
}

function updateMainChart() {
    const chart = NexGenState.charts.main;
    if (chart) {
        const oldData = chart.w.config.series[0].data;
        const newData = [...oldData.slice(1), parseFloat(NexGenState.currentUsage.toFixed(2))];
        chart.updateSeries([{ data: newData }]);
    }
}

// --- AI Engine Simulation ---
function initAIEngine() {
    const prog = document.getElementById('ai-prog');
    const msg = document.getElementById('ai-msg');
    
    setInterval(() => {
        if (prog) {
            let p = 0;
            const cycle = setInterval(() => {
                p += 2;
                prog.style.width = p + '%';
                if (p >= 100) {
                    clearInterval(cycle);
                    
                    let dynamicMsg = "Analyzing household usage patterns...";
                    if (NexGenState.currentUsage > 3.0) {
                        dynamicMsg = "High power surge detected! AC usage is peak. Switch to 24°C.";
                        showToast("High Usage", "Multiple devices active. Optimize loads.", "warning");
                    } else if (new Date().getHours() > 8 && new Date().getHours() < 17) {
                        dynamicMsg = "Natural daylight available. Consider switching off balcony lights.";
                    } else if (NexGenState.currentUsage < 0.5) {
                        dynamicMsg = "Excellent! Grid is in Eco-Zone. Vampire loads minimized.";
                    } else {
                        const tasks = ["Optimizing AC schedule...", "Scanning for power leaks...", "Forecasting energy velocity..."];
                        dynamicMsg = tasks[Math.floor(Math.random() * tasks.length)];
                    }

                    if (msg) {
                        msg.classList.add('animate__fadeOut');
                        setTimeout(() => {
                            msg.innerText = dynamicMsg;
                            msg.classList.remove('animate__fadeOut');
                            msg.classList.add('animate__fadeIn');
                        }, 500);
                    }
                }
            }, 50);
        }
    }, 12000);
}

// --- Smooth Counters ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = parseFloat(c.dataset.target);
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                c.innerText = target.toFixed(target % 1 === 0 ? 0 : 2);
                clearInterval(timer);
            } else {
                c.innerText = current.toFixed(target % 1 === 0 ? 0 : 2);
            }
        }, 30);
    });
}

function loadTips() {
    const container = document.getElementById('tips-carousel');
    if (!container) return;
    const tips = [
        { icon: 'fas fa-temperature-low', text: 'Set AC to 25°C to save ₹120 this month.' },
        { icon: 'fas fa-power-off', text: 'Unplug devices in Guest Room to stop vampire load.' },
        { icon: 'fas fa-lightbulb', text: 'Switch to LED bulbs for 15% efficiency gain.' },
        { icon: 'fas fa-clock', text: 'Shift washing machine use to non-peak hours.' }
    ];
    const shuffled = tips.sort(() => 0.5 - Math.random());
    container.innerHTML = shuffled.map(t => `<div class="tip-item animate__animated animate__fadeInUp"><i class="${t.icon}"></i><span>${t.text}</span></div>`).join('');
}

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') { document.body.classList.add('light-theme'); if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>'; }
    if (btn) {
        btn.onclick = () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            showToast("System Update", `${isLight ? 'Light' : 'Dark'} mode activated.`, "info");
        };
    }
}

function initManualEntry(chart) {
    const modal = document.getElementById('manual-modal');
    const openBtn = document.getElementById('open-manual-btn');
    const closeBtn = document.getElementById('close-modal');
    const saveBtn = document.getElementById('save-manual-btn');
    if (openBtn) openBtn.onclick = () => modal.classList.add('active');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    if (saveBtn) {
        saveBtn.onclick = () => {
            const val = parseFloat(document.getElementById('m-usage').value);
            if (!val || val <= 0) return;
            NexGenState.currentUsage = val;
            updateLiveUI();
            updateMainChart();
            showToast("Success", `Data point ${val} kW synced with AI engine.`, "success");
            modal.classList.remove('active');
            document.getElementById('m-usage').value = '';
        };
    }
}

function initNotifications() {
    const bell = document.querySelector('.icon-btn');
    if (bell) bell.onclick = () => showToast("Notifications", "You have 2 new AI recommendations.", "info");
    const mobToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (mobToggle && sidebar) {
        mobToggle.onclick = () => {
            sidebar.classList.toggle('active');
            mobToggle.innerHTML = sidebar.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        };
    }
    const searchInput = document.getElementById('sidebar-search');
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (searchInput) {
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            navLinks.forEach(link => {
                const text = link.innerText.toLowerCase();
                link.style.display = text.includes(term) ? 'flex' : 'none';
            });
        };
    }
}

function showToast(title, msg, type) {
    const area = document.body;
    const toast = document.createElement('div');
    toast.className = `toast glass ${type} animate__animated animate__fadeInRight`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 16px; min-width: 320px; display: flex; gap: 15px; box-shadow: 0 10px 50px rgba(0,0,0,0.4);`;
    const icon = type === 'warning' ? 'fa-exclamation-triangle' : (type === 'success' ? 'fa-check-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}" style="font-size: 24px;"></i><div style="flex: 1;"><strong style="display: block; margin-bottom: 4px;">${title}</strong><p style="font-size: 13px; opacity: 0.8; margin: 0;">${msg}</p></div><i class="fas fa-times" style="cursor: pointer; font-size: 14px; opacity: 0.5;" onclick="this.parentElement.remove()"></i>`;
    area.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) { toast.classList.replace('animate__fadeInRight', 'animate__fadeOutRight'); setTimeout(() => toast.remove(), 800); } }, 5000);
}
