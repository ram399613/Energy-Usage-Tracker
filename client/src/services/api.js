import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const energyService = {
  getUsage: (filter = 'monthly') => api.get(`/energy?filter=${filter}`),
  addUsage: (data) => api.post('/energy', data),
  getAiInsights: () => api.get('/energy/ai-insights'),
  resetData: () => api.delete('/energy/reset'),
};

export const iotService = {
  fetchThingSpeak: async () => {
    try {
      const channelId = '3368295';
      const apiKey = 'BEIX0HGMPH1L6R04';
      const response = await axios.get(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`);
      const latestFeed = response.data.feeds[0];
      if (!latestFeed) return null;
      return {
        units: parseFloat(latestFeed.field1) || 0,
        voltage: parseFloat(latestFeed.field2) || 0,
        current: parseFloat(latestFeed.field3) || 0,
      };
    } catch (error) {
      console.error('IoT Error:', error);
      return null;
    }
  },
  fetchWeather: async (city = 'London') => {
    try {
      const apiKey = 'bbb507027f73e67134692e100bb6fe81';
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      return {
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
      };
    } catch (error) {
      console.error('Weather Error:', error);
      return null;
    }
  }
};

export default api;
