/**
 * API Service for Energy Usage Tracker
 * Handles real-time IoT data from ThingSpeak and weather data from OpenWeatherMap
 */

const API_CONFIG = {
  // ThingSpeak Configuration (Replace with your actual values)
  THING_SPEAK_CHANNEL_ID: '3368295',
  THING_SPEAK_API_KEY: 'BEIX0HGMPH1L6R04',
  
  // OpenWeatherMap Configuration (Replace with your actual value)
  WEATHER_API_KEY: 'bbb507027f73e67134692e100bb6fe81',
  CITY_NAME: 'London' // Default city
};

const apiService = {
  /**
   * Fetches real-time energy data from ThingSpeak
   * @returns {Promise<Object|null>} Energy data or null if fails
   */
  async fetchIotData() {
    try {
      if (API_CONFIG.THING_SPEAK_CHANNEL_ID === 'YOUR_CHANNEL_ID') {
        console.warn('ThingSpeak Channel ID not configured. Using manual fallback.');
        return null;
      }

      const url = `https://api.thingspeak.com/channels/${API_CONFIG.THING_SPEAK_CHANNEL_ID}/feeds.json?api_key=${API_CONFIG.THING_SPEAK_API_KEY}&results=1`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('ThingSpeak API failed');
      
      const data = await response.json();
      const latestFeed = data.feeds[0];

      if (!latestFeed) return null;

      // Assuming Field 1 is Energy (kWh), Field 2 is Voltage, Field 3 is Current
      // You can adjust these based on your ThingSpeak channel configuration
      return {
        units: parseFloat(latestFeed.field1) || 0,
        voltage: parseFloat(latestFeed.field2) || 0,
        current: parseFloat(latestFeed.field3) || 0,
        timestamp: latestFeed.created_at
      };
    } catch (error) {
      console.error('IoT API Error:', error);
      return null;
    }
  },

  /**
   * Fetches real-time weather data
   * @returns {Promise<Object|null>} Weather data or null if fails
   */
  async fetchWeatherData() {
    try {
      if (API_CONFIG.WEATHER_API_KEY === 'YOUR_WEATHER_API_KEY') {
        return null;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${API_CONFIG.CITY_NAME}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      return {
        temp: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return null;
    }
  },

  /**
   * Generates usage suggestions based on temperature
   * @param {number} temp Temperature in Celsius
   * @returns {string} Suggestion message
   */
  getUsageSuggestion(temp) {
    if (temp > 30) {
      return "High temperature detected! Consider using AC efficiently and closing curtains to reduce cooling load.";
    } else if (temp < 15) {
      return "Cool weather! Optimize heating usage and ensure insulation is effective to save energy.";
    } else {
      return "Moderate weather. Natural ventilation is recommended to save on HVAC costs.";
    }
  }
};

// Export for use in other scripts
window.apiService = apiService;
