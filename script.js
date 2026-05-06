document.addEventListener('DOMContentLoaded', () => {
    // Initialize All Charts
    initCharts();
    
    // Initialize Animated Counters
    initCounters();
    
    // Sidebar Interactions
    initSidebar();
    
    // Tab Switching
    initTabs();
    
    // Theme Toggle
    initThemeToggle();
    
    // Particles.js Initialization
    initParticles();
    
    // Simulate Real-time Updates
    startRealTimeSimulation();
});

// --- Particles Initialization ---
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00f2ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.4 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}

// --- Charts Initialization ---
let mainEnergyChart;

function initCharts() {
    // Chart.js Default Configuration
    Chart.defaults.color = '#718096';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 13, 20, 0.9)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleColor = '#00f2ff';
    
    // 1. Current Usage Mini Chart
    const ctxCurrent = document.getElementById('currentUsageChart').getContext('2d');
    new Chart(ctxCurrent, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', '', ''],
            datasets: [{
                data: [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.3, 2.45],
                borderColor: '#00f2ff',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
                backgroundColor: (context) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 60);
                    gradient.addColorStop(0, 'rgba(0, 242, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');
                    return gradient;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    // 2. Today's Usage Mini Chart
    const ctxToday = document.getElementById('todayUsageChart').getContext('2d');
    new Chart(ctxToday, {
        type: 'bar',
        data: {
            labels: ['', '', '', '', '', '', '', ''],
            datasets: [{
                data: [12, 15, 10, 18, 14, 16, 12, 18.2],
                backgroundColor: '#0072ff',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    // 3. Month Usage Mini Chart
    const ctxMonth = document.getElementById('monthUsageChart').getContext('2d');
    new Chart(ctxMonth, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', '', ''],
            datasets: [{
                data: [380, 390, 410, 400, 420, 415, 410, 412],
                borderColor: '#bc13fe',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    // 4. Bill Trend Mini Chart
    const ctxBill = document.getElementById('billTrendChart').getContext('2d');
    new Chart(ctxBill, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', '', ''],
            datasets: [{
                data: [110, 115, 112, 118, 120, 122, 123, 124.5],
                borderColor: '#00ff88',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(0, 255, 136, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    // 5. Main Energy Chart
    const ctxMain = document.getElementById('mainEnergyChart').getContext('2d');
    const mainGradient = ctxMain.createLinearGradient(0, 0, 0, 400);
    mainGradient.addColorStop(0, 'rgba(0, 114, 255, 0.3)');
    mainGradient.addColorStop(1, 'rgba(0, 114, 255, 0)');

    mainEnergyChart = new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59'],
            datasets: [{
                label: 'Energy Usage (kW)',
                data: [1.2, 0.8, 1.5, 3.2, 4.5, 3.8, 4.2, 2.8, 2.1],
                borderColor: '#0072ff',
                borderWidth: 3,
                pointBackgroundColor: '#00f2ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true,
                backgroundColor: mainGradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 6. Device Doughnut Chart
    const ctxDevice = document.getElementById('deviceDoughnutChart').getContext('2d');
    new Chart(ctxDevice, {
        type: 'doughnut',
        data: {
            labels: ['AC', 'Fridge', 'Laundry', 'Lights', 'Others'],
            datasets: [{
                data: [45, 20, 15, 10, 10],
                backgroundColor: ['#00f2ff', '#0072ff', '#bc13fe', '#00ff88', '#4a5568'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 7. Carbon Trend Chart
    const ctxCarbon = document.getElementById('carbonTrendChart').getContext('2d');
    new Chart(ctxCarbon, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                data: [0.55, 0.52, 0.48, 0.45, 0.42],
                borderColor: '#00ff88',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    // 8. Prediction Mini Chart
    const ctxPredict = document.getElementById('predictionMiniChart').getContext('2d');
    new Chart(ctxPredict, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: [412, 415, 418, 420, 422, 424, 425],
                borderColor: '#00f2ff',
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// --- Animated Counters ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const count = parseFloat(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = (count + increment).toFixed(target % 1 === 0 ? 0 : 2);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// --- Sidebar Navigation ---
function initSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // On mobile, close sidebar after clicking
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// --- Tabs Logic ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const period = btn.getAttribute('data-period');
            updateMainChartData(period);
        });
    });
}

function updateMainChartData(period) {
    const dataMap = {
        daily: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59'],
            data: [1.2, 0.8, 1.5, 3.2, 4.5, 3.8, 4.2, 2.8, 2.1]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [18, 22, 19, 25, 28, 15, 12]
        },
        monthly: {
            labels: ['W1', 'W2', 'W3', 'W4'],
            data: [85, 92, 78, 95]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [350, 320, 310, 380, 412, 450, 480, 510, 420, 380, 340, 390]
        }
    };

    const newData = dataMap[period];
    mainEnergyChart.data.labels = newData.labels;
    mainEnergyChart.data.datasets[0].data = newData.data;
    mainEnergyChart.update();
}

// --- Theme Toggle ---
function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    const icon = toggleBtn.querySelector('i');
    
    toggleBtn.addEventListener('click', () => {
        if (icon.classList.contains('fa-moon')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            // Logic for light theme if needed, but we keep it dark/futuristic
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// --- Real-time Data Simulation ---
function startRealTimeSimulation() {
    const liveValue = document.querySelector('.stat-card:first-child .counter');
    
    setInterval(() => {
        if (liveValue) {
            let currentVal = parseFloat(liveValue.innerText);
            let change = (Math.random() - 0.5) * 0.1;
            let newVal = Math.max(1.5, Math.min(5.0, currentVal + change));
            liveValue.innerText = newVal.toFixed(2);
        }
        
        // Randomly pulse AI status
        const aiStatus = document.querySelector('.ai-status');
        if (aiStatus) {
            const statuses = ['Analyzing data...', 'Thinking...', 'Monitoring grid...', 'Calculating savings...'];
            if (Math.random() > 0.8) {
                aiStatus.innerText = statuses[Math.floor(Math.random() * statuses.length)];
            }
        }
    }, 3000);
}
