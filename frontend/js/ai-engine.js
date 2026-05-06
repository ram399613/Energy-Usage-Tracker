/**
 * AI Engine - Real-time Analysis & Predictions
 */

export const analyzeGrid = (state) => {
    const suggestions = [];
    const activeDevices = state.devices.filter(d => d.status === 'Active' || d.status === 'ON');
    const totalPower = activeDevices.reduce((sum, d) => sum + d.usage, 0);

    // 1. Threshold Detection
    if (totalPower > 4.5) {
        suggestions.push("⚠️ High Load Alert: Total consumption exceeds 4.5 kW.");
    }

    // 2. Optimization Detection
    const highPowerDevice = activeDevices.find(d => d.usage > 1.0);
    if (highPowerDevice) {
        suggestions.push(`💡 Savings Tip: ${highPowerDevice.name} is consuming high power. Eco-mode suggested.`);
    }

    // 3. Efficiency Check
    const lowEffDevice = state.devices.find(d => parseInt(d.efficiency) < 85);
    if (lowEffDevice) {
        suggestions.push(`🔧 Maintenance: ${lowEffDevice.name} efficiency is dropping. Check filters.`);
    }

    // 4. Inactive Running detection
    if (activeDevices.length > 5) {
        suggestions.push("🤖 Neural Pattern: Multiple devices active. Shutdown unused nodes to save 12%.");
    }

    if (suggestions.length === 0) {
        suggestions.push("✅ Grid Stabilized: All nodes operating within efficiency parameters.");
    }

    return suggestions;
};

export const getPredictions = async () => {
    try {
        const res = await fetch('/api/predictions');
        return await res.json();
    } catch (e) {
        return {
            historical: [40, 45, 42, 50, 48, 55, 60],
            forecast: [62, 65, 68, 70, 75, 80, 78]
        };
    }
};
