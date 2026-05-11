/**
 * Grid & Challenges - Real-time Dynamics
 * Implements premium background animations and live telemetry for grid/challenges
 */

// --- BACKGROUND ANIMATION (NEURAL NETWORK) ---
const initBackground = () => {
    const canvas = document.getElementById('bg-animation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    let mouse = { x: null, y: null };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        particles = Array.from({ length: 80 }, () => new Particle());
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Add a very subtle radial gradient to the background center
        const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    init();
    animate();
};

// --- GRID TELEMETRY DYNAMICS ---
export const updateGridTelemetry = (appState) => {
    // Select elements in Grid View
    const gridView = document.getElementById('grid-view');
    if (!gridView || !gridView.classList.contains('active')) return;

    // Simulate slight fluctuations in grid data
    const freqEl = gridView.querySelector('.metric-card:nth-child(1) h3');
    const voltEl = gridView.querySelector('.metric-card:nth-child(2) h3');
    const lossEl = gridView.querySelector('.metric-card:nth-child(3) h3');

    if (freqEl) freqEl.innerText = (50 + (Math.random() * 0.1 - 0.05)).toFixed(2) + ' Hz';
    if (voltEl) voltEl.innerText = (230 + (Math.random() * 5 - 2.5)).toFixed(1) + ' V';
    if (lossEl) lossEl.innerText = (0.5 + (Math.random() * 0.5)).toFixed(1) + '%';

    // Update Flow Labels
    const solarFlow = document.querySelector('.flow-node:nth-child(1) span');
    const loadFlow = document.querySelector('.flow-node:nth-child(5) span');

    if (solarFlow) {
        // Assume solar is constant 4.2kW for demo or pull from real data if available
        solarFlow.innerText = '4.2 kW';
    }
    if (loadFlow) {
        loadFlow.innerText = `Load: ${appState.metrics.totalConsumed || '0.00'} kW`;
    }
};

// --- CHALLENGES PROGRESSION ---
export const updateChallenges = (appState) => {
    const container = document.getElementById('challenges-container');
    if (!container) return;

    // Example logic: Solar Maximizer progress
    // If totalConsumed is low and solar is high, increase progress
    const solarMaxProgress = document.querySelector('#challenges-view .metric-card:nth-child(1) .progress-fill');
    const solarMaxText = document.querySelector('#challenges-view .metric-card:nth-child(1) span:first-child');
    
    if (solarMaxProgress) {
        // Simulate progress based on usage (just a demo fluctuation for "real-time" feel)
        let currentProgress = parseFloat(solarMaxProgress.style.width) || 65;
        if (appState.metrics.totalConsumed < 2) currentProgress += 0.05;
        else currentProgress -= 0.02;
        
        currentProgress = Math.min(100, Math.max(0, currentProgress));
        solarMaxProgress.style.width = currentProgress.toFixed(1) + '%';
        if (solarMaxText) solarMaxText.innerText = `Progress: ${currentProgress.toFixed(0)}%`;
    }
};

// Initialize background and telemetry loops on load
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    
    // Fast fluctuation loop for UI elements (purely visual "live" effect)
    setInterval(() => {
        const gridView = document.getElementById('grid-view');
        if (gridView && gridView.classList.contains('active')) {
            const freqEl = gridView.querySelector('.metric-card:nth-child(1) h3');
            const voltEl = gridView.querySelector('.metric-card:nth-child(2) h3');
            
            if (freqEl) freqEl.innerText = (50 + (Math.random() * 0.04 - 0.02)).toFixed(2) + ' Hz';
            if (voltEl) voltEl.innerText = (230 + (Math.random() * 2 - 1)).toFixed(1) + ' V';
        }
    }, 1500);
});

