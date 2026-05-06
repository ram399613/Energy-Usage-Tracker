/**
 * Chart Management System - Final Repair
 */

const chartInstances = {};

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { labels: { color: '#888', font: { family: 'Outfit' } } } 
    },
    scales: {
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
        x: { grid: { display: false }, ticks: { color: '#666' } }
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' }
};

export const initCharts = () => {
    // 1. Live Line Chart
    const liveCtx = document.getElementById('liveChart');
    if (liveCtx && !chartInstances.live) {
        chartInstances.live = new Chart(liveCtx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    label: 'Grid Load (kW)',
                    data: Array(20).fill(0),
                    borderColor: '#00f2ff',
                    backgroundColor: 'rgba(0, 242, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: { ...defaultOptions, animation: false } // No animation for live line
        });
    }

    // 2. Distribution Pie Chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx && !chartInstances.pie) {
        chartInstances.pie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['HVAC', 'Appliances', 'Lighting', 'Electronics'],
                datasets: [{
                    data: [1, 1, 1, 1],
                    backgroundColor: ['#7000ff', '#00f2ff', '#00ff95', '#ffdd00'],
                    borderWidth: 0
                }]
            },
            options: { ...defaultOptions, plugins: { legend: { position: 'bottom' } } }
        });
    }

    // 3. Prediction Bar Chart
    const predCtx = document.getElementById('predictChart');
    if (predCtx && !chartInstances.predict) {
        chartInstances.predict = new Chart(predCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    { label: 'History', data: [0,0,0,0,0,0,0], backgroundColor: 'rgba(112, 0, 255, 0.3)', borderRadius: 5 },
                    { label: 'Forecast', data: [0,0,0,0,0,0,0], backgroundColor: 'rgba(0, 242, 255, 0.6)', borderRadius: 5 }
                ]
            },
            options: defaultOptions
        });
    }
};

export const updateLiveChart = (val, time) => {
    const chart = chartInstances.live;
    if (!chart) return;
    chart.data.datasets[0].data.push(val);
    chart.data.datasets[0].data.shift();
    chart.data.labels.push(time);
    chart.data.labels.shift();
    chart.update('none'); // Update without full animation for performance
};

export const updateDistributionChart = (devices) => {
    const chart = chartInstances.pie;
    if (!chart) return;
    const cats = { HVAC: 0, Appliances: 0, Lighting: 0, Electronics: 0 };
    devices.forEach(d => {
        if (d.status === 'Active' || d.status === 'ON') {
            cats[d.category || 'General'] += (d.watts / 1000);
        }
    });
    chart.data.datasets[0].data = Object.values(cats);
    chart.update();
};

export const updatePredictChart = (historical, forecast) => {
    const chart = chartInstances.predict;
    if (!chart) return;
    chart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    chart.data.datasets[0].data = historical;
    chart.data.datasets[1].data = forecast;
    chart.update();
};
