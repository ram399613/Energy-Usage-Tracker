/**
 * NexGen Energy AI - Client Logic
 * Handles real-time updates, AI engine, and page interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine current page
    const body = document.body;

    if (body.classList.contains('dashboard-page')) {
        initDashboard();
    } else if (body.classList.contains('devices-page')) {
        initDevicesPage();
    } else if (body.classList.contains('analytics-page')) {
        initAnalyticsPage();
    }
    
    // Always initialize theme regardless of page
    initTheme();
});

// --- Dashboard Logic ---
function initDashboard() {
    const charts = initCharts();
    initCounters();
    initAIEngine();
    loadTips();
    if (charts.main) {
        initManualEntry(charts.main);
    }
}

// --- Analytics Page Logic ---
function initAnalyticsPage() {
    initCharts();
}

// --- Devices Page Logic ---
function initDevicesPage() {
    initDeviceControls();
}

// --- Charts Logic (ApexCharts) ---
function initCharts() {
    const isDashboard = document.getElementById('main-chart');
    const isAnalytics = document.getElementById('prediction-chart');
    let mainChart = null;
    let predChart = null;

    if (isDashboard) {
        // Main Area Chart
        const options = {
            series: [{ name: 'Power (kW)', data: [1.2, 1.8, 1.5, 2.4, 2.8, 2.2, 3.1, 2.9, 3.5, 3.2, 2.8, 2.4] }],
            chart: { type: 'area', height: 350, toolbar: { show: false }, animations: { enabled: true } },
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
        // Prediction Line Chart
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

    // Common Sparklines
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

// --- AI Engine Simulation ---
function initAIEngine() {
    const prog = document.getElementById('ai-prog');
    const msg = document.getElementById('ai-msg');
    const tasks = [
        "Analyzing household usage patterns...",
        "Detecting energy spikes in Kitchen...",
        "Optimizing AC schedule for off-peak hours...",
        "Calculating carbon offset from solar grid..."
    ];

    let i = 0;
    setInterval(() => {
        if (prog) {
            let p = 0;
            const cycle = setInterval(() => {
                p += 5;
                prog.style.width = p + '%';
                if (p >= 100) {
                    clearInterval(cycle);
                    if (msg) msg.innerText = tasks[i];
                    i = (i + 1) % tasks.length;
                    
                    // Random Spike Detection
                    if (Math.random() > 0.8) {
                        showToast("AI Alert", "Unusual power spike detected in Living Room.", "warning");
                    }
                }
            }, 100);
        }
    }, 6000);
}

// --- Smooth Counters ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = parseFloat(c.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const val = progress * target;
            c.innerText = val.toFixed(target % 1 === 0 ? 0 : 1);
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    });
}

// --- Saving Tips Carousel ---
function loadTips() {
    const container = document.getElementById('tips-carousel');
    if (!container) return;

    const tips = [
        { icon: 'fas fa-temperature-low', text: 'Set AC to 25°C to save ₹120 this month.' },
        { icon: 'fas fa-power-off', text: 'Unplug devices in Guest Room to stop vampire load.' },
        { icon: 'fas fa-lightbulb', text: 'Switch to LED bulbs in Balcony for 15% efficiency gain.' }
    ];

    container.innerHTML = tips.map(t => `
        <div class="tip-item animate__animated animate__fadeIn">
            <i class="${t.icon}"></i>
            <span>${t.text}</span>
        </div>
    `).join('');
}

// --- Theme Toggle ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (btn) {
        btn.onclick = () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        };
    }
}

// --- Global UI Helpers ---
function initDeviceControls() {
    const btns = document.querySelectorAll('.toggle-btn');
    btns.forEach(btn => {
        btn.onclick = () => {
            const card = btn.closest('.device-card');
            const statusText = card.querySelector('.dc-status span');
            const dot = card.querySelector('.dot');
            
            if (btn.innerText === "Turn Off") {
                btn.innerText = "Turn On";
                statusText.innerText = "Idle";
                dot.classList.add('gray');
                showToast("Device Update", "System switched to idle mode.", "info");
            } else {
                btn.innerText = "Turn Off";
                statusText.innerText = "Active";
                dot.classList.remove('gray');
                showToast("Device Update", "System is now active.", "success");
            }
        };
    });
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
            if (!val) return;

            const newData = [...chart.w.config.series[0].data, val];
            if (newData.length > 12) newData.shift();
            chart.updateSeries([{ data: newData }]);

            showToast("Success", `Data point ${val} kW pushed to neural engine.`, "success");
            modal.classList.remove('active');
            document.getElementById('m-usage').value = '';
        };
    }
}

function showToast(title, msg, type) {
    // Simple notification implementation
    const area = document.body;
    const toast = document.createElement('div');
    toast.className = `toast glass ${type} animate__animated animate__fadeInRight`;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        padding: 16px; min-width: 300px; display: flex; gap: 12px;
    `;
    toast.innerHTML = `
        <i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <div><strong>${title}</strong><p style="font-size: 12px; opacity: 0.8;">${msg}</p></div>
    `;
    area.appendChild(toast);
    setTimeout(() => {
        toast.classList.replace('animate__fadeInRight', 'animate__fadeOutRight');
        setTimeout(() => toast.remove(), 1000);
    }, 4000);
}
