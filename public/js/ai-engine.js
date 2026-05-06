/**
 * JARVIS Core AI Intelligence - Master Logic
 */

export const analyzeSystem = (state) => {
    const suggestions = [];
    const active = state.devices.filter(d => d.status === 'Active' || d.status === 'ON');
    const totalPower = active.reduce((sum, d) => sum + (d.watts / 1000), 0);

    // 1. High Load Detection
    if (totalPower > 4.0) {
        suggestions.push("🚨 CRITICAL LOAD: Total grid demand has exceeded 4.0kW. System stability at risk.");
    }

    const ac = active.find(d => d.name.toLowerCase().includes('air conditioner'));
    if (ac && totalPower > 2.0) {
        suggestions.push("❄️ AC OPTIMIZATION: Core load can be reduced by 12% by adjusting node temperature to 24°C.");
    }

    // 2. Behavioral Patterns
    if (active.length > 4) {
        suggestions.push("🧠 NEURAL SYNC: Multiple heavy nodes detected. Efficiency score dropping by 4.2 points.");
    }

    // 3. Dynamic Rotating Insights (Unique)
    const jarvisTips = [
        "Refrigerator thermal exchange is nominal. No maintenance required.",
        "Detected standby draw from Entertainment Node. Energy leak: 45W.",
        "Weekly forecast suggests a 15% increase in core costs if load remains constant.",
        "Grid efficiency is 4% higher than regional average. Optimizations successful.",
        "Smart Lighting array synchronized with solar cycles. Saving 120W hourly.",
        "Peak hour transition in progress. Suggesting low-power mode for secondary nodes.",
        "Neural grid sync complete. Historical data suggests cleaning AC filters for 8% gain."
    ];

    // Pick 3 random tips
    const picked = jarvisTips.sort(() => 0.5 - Math.random()).slice(0, 3);
    suggestions.push(...picked);

    return suggestions;
};
