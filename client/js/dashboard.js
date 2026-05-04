document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Set welcome message
  document.getElementById('welcomeMessage').textContent = `Welcome, ${user.name}`;

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });

  // Initialize Chart
  const ctx = document.getElementById('energyChart').getContext('2d');
  let energyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Energy Usage (kWh)',
        data: [],
        borderColor: '#00d2ff',
        backgroundColor: 'rgba(0, 210, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: {
        legend: { labels: { color: '#f1f5f9' } }
      }
    }
  });

  // Fetch Initial Data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/energy?filter=monthly', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        updateDashboard(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateDashboard = (data) => {
    let totalUnits = 0;
    let totalCost = 0;
    let todayUnits = 0;

    const labels = [];
    const chartData = [];

    const today = new Date().toDateString();

    data.forEach(item => {
      totalUnits += item.units;
      totalCost += item.cost;

      const itemDate = new Date(item.timestamp);
      if (itemDate.toDateString() === today) {
        todayUnits += item.units;
      }

      labels.push(itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      chartData.push(item.units);
    });

    document.getElementById('totalUnits').textContent = totalUnits.toFixed(2);
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);

    // Keep only last 20 data points for better visibility
    energyChart.data.labels = labels.slice(-20);
    energyChart.data.datasets[0].data = chartData.slice(-20);
    energyChart.update();

    // Check threshold (e.g. > 10 kWh a day)
    const alertBox = document.getElementById('thresholdAlert');
    if (todayUnits > 10) {
      alertBox.style.display = 'block';
    } else {
      alertBox.style.display = 'none';
    }
  };

  fetchData();

  // AI Insights Fetching Function
  const fetchAiInsights = async (showLoading = true) => {
    const loading = document.getElementById('aiLoading');
    const results = document.getElementById('aiResults');
    
    if (showLoading) {
      loading.style.display = 'block';
      results.style.display = 'none';
    }

    try {
      const res = await fetch('/api/energy/ai-insights', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      loading.style.display = 'none';

      if (res.ok) {
        document.getElementById('aiWeather').textContent = data.context.weather;
        document.getElementById('aiGrid').textContent = data.context.gridStatus;
        document.getElementById('aiRate').textContent = data.context.currentRate;

        document.getElementById('aiPredictedCost').textContent = data.predictions.predictedCost;
        document.getElementById('aiPredictedUnits').textContent = data.predictions.predictedUnits;
        document.getElementById('aiPeakTime').textContent = data.predictions.peakTime;

        const anomalyAlert = document.getElementById('anomalyAlert');
        if (data.anomaliesFound > 0) {
          document.getElementById('anomalyCount').textContent = data.anomaliesFound;
          anomalyAlert.style.display = 'block';
        } else {
          anomalyAlert.style.display = 'none';
        }

        const tipsUl = document.getElementById('aiTips');
        tipsUl.innerHTML = '';
        data.recommendations.forEach(tip => {
          const li = document.createElement('li');
          li.textContent = tip.message;
          if (tip.priority === 'High') li.style.color = '#ef4444';
          else if (tip.priority === 'Medium') li.style.color = '#fbbf24';
          li.style.marginBottom = '0.5rem';
          tipsUl.appendChild(li);
        });

        results.style.display = 'block';
      }
    } catch (error) {
      if (showLoading) {
        loading.style.display = 'none';
        alert('Error generating AI insights');
      }
    }
  };

  document.getElementById('aiBtn').addEventListener('click', () => fetchAiInsights(true));

  // Socket.io Setup
  const socket = io();
  socket.on('connect', () => {
    socket.emit('join', user._id);
  });

  socket.on('newEnergyData', (newData) => {
    fetchData(); 
    // Real-time AI update: if results are already visible, refresh them silently
    if (document.getElementById('aiResults').style.display === 'block') {
      fetchAiInsights(false);
    }
  });

  // Simulate IoT Data
  document.getElementById('simulateBtn').addEventListener('click', async () => {
    const randomUnits = (Math.random() * (2.0 - 0.5) + 0.5).toFixed(2);
    try {
      await fetch('/api/energy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ units: Number(randomUnits) })
      });
    } catch (error) {
      console.error('Simulation error:', error);
    }
  });

  // Also simulate automatically every 30 seconds for demo purposes
  setInterval(async () => {
    const randomUnits = (Math.random() * (1.5 - 0.2) + 0.2).toFixed(2);
    try {
      await fetch('/api/energy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ units: Number(randomUnits) })
      });
    } catch (error) {}
  }, 30000);

  // Reset Graph Data
  document.getElementById('resetGraphBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all energy data? This cannot be undone.')) {
      try {
        const res = await fetch('/api/energy/reset', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          energyChart.data.labels = [];
          energyChart.data.datasets[0].data = [];
          energyChart.update();
          document.getElementById('totalUnits').textContent = '0.00';
          document.getElementById('totalCost').textContent = '0.00';
          document.getElementById('aiResults').style.display = 'none';
          alert('Energy data has been reset.');
        }
      } catch (error) {
        console.error('Reset error:', error);
      }
    }
  });
});
