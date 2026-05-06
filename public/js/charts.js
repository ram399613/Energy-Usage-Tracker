/**
 * Charting System - Premium Figma Theme
 */

const chartInstances = {};

const figmaTheme = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
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
                    borderColor: figmaTheme.cyan,
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
                        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                        return gradient;
                    },
                    tension: 0.45,
                    pointRadius: 0,
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
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
