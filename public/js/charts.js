/**
 * Charting System - Premium Figma Theme
 */

const chartInstances = {};

const figmaTheme = {
    blue: '#2563EB',
    green: '#10B981',
    red: '#F43F5E',
    cyan: '#00f2ff',
    purple: '#7000ff',
    text: '#94A3B8',
    grid: 'rgba(255, 255, 255, 0.05)'
};

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { grid: { color: figmaTheme.grid }, ticks: { color: figmaTheme.text, font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { color: figmaTheme.text, font: { size: 10 } } }
    },
    animation: { duration: 2000, easing: 'easeOutQuart' }
};

export const initCharts = () => {
    // 1. Live Telemetry
    const liveCtx = document.getElementById('liveChart');
    if (liveCtx && !chartInstances.live) {
        chartInstances.live = new Chart(liveCtx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0),
                    borderColor: figmaTheme.blue,
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: { ...baseOptions, animation: false }
        });
    }

    // 2. Distribution
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx && !chartInstances.pie) {
        chartInstances.pie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['HVAC', 'Appliances', 'Lighting', 'Generation'],
                datasets: [{
                    data: [1, 1, 1, 1],
                    backgroundColor: [figmaTheme.blue, figmaTheme.green, figmaTheme.cyan, figmaTheme.purple],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            },
            options: { ...baseOptions, cutout: '80%' }
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
    chart.update('none');
};

export const updateDistributionChart = (devices) => {
    const chart = chartInstances.pie;
    if (!chart) return;
    const cats = { HVAC: 0, Appliances: 0, Lighting: 0, Generation: 0 };
    devices.forEach(d => {
        if (d.status === 'Active' || d.status === 'ON') {
            cats[d.category || 'Appliances'] += (d.watts / 1000);
        }
    });
    chart.data.datasets[0].data = Object.values(cats);
    chart.update();
};
