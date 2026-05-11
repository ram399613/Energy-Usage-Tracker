/**
 * Settings Management
 */

export const settings = {
    darkMode: true,
    notifications: true,
    aiLevel: 'Medium',
    animations: true,
    threshold: 5.0
};

export const initSettings = () => {
    const saved = JSON.parse(localStorage.getItem('nexgen_settings') || '{}');
    Object.assign(settings, saved);
    applySettings();
};

export const updateSetting = (key, value) => {
    settings[key] = value;
    localStorage.setItem('nexgen_settings', JSON.stringify(settings));
    applySettings();
};

const applySettings = () => {
    document.body.classList.toggle('light-mode', !settings.darkMode);
    document.body.classList.toggle('no-animations', !settings.animations);
};

export const resetSystem = () => {
    if (confirm('Are you sure you want to reset all local data?')) {
        localStorage.clear();
        location.reload();
    }
};
