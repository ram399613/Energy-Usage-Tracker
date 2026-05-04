# ⚡ Energy Usage Tracker

An AI-powered real-time energy monitoring web application that simulates IoT device data, analyzes consumption patterns, predicts future usage costs, and provides smart energy-saving recommendations — all in one interactive dashboard.

🌐 **Live Demo:** [energy-usage-tracker.onrender.com](https://energy-usage-tracker.onrender.com/index.html)

---

## 📸 Preview

> Dashboard with real-time energy graph, AI insights panel, and IoT data simulation.

---

## ✨ Features

### 📊 Real-Time Dashboard
- Displays **Total Energy Used** over the last 30 days (in kWh)
- Shows **Estimated Electricity Cost** in real time
- Visual **energy consumption graph** that updates live as IoT data is received
- ⚠️ **High Usage Alert** when daily consumption exceeds the set threshold (10 kWh)

### 🔌 IoT Data Simulation
- **Simulate IoT Device** button sends random energy readings (0.5 – 2 kWh) to the dashboard
- Mimics real-world smart meter or IoT sensor behavior
- Graph updates instantly on each simulated data point
- **Reset Graph** option to clear all session data

### 🤖 AI Energy Analysis & Predictions
- **AI Insights Generator** — Click to get live analysis of your energy patterns
- Powered by Claude AI for intelligent recommendations
- Features include:
  - 🌍 **Real-Time Context** — Weather, grid status, and current electricity rate
  - 🚀 **AI Predictions** — Next month cost, projected usage, and peak consumption time
  - ⚠️ **Anomaly Detection** — Flags unusually high energy spikes automatically
  - 🧠 **Adaptive AI Recommendations** — Personalized tips to reduce energy waste

### 🔐 User Authentication
- Login/Logout functionality to keep the experience personal and secure

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| AI Integration | Claude AI (Anthropic API) |
| Hosting | Render |
| Data Simulation | JavaScript-based IoT mock |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js (if running locally with a backend)
- Anthropic API Key (for AI features)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/ram399613/Energy-Usage-Tracker.git

# 2. Navigate into the project folder
cd Energy-Usage-Tracker

# 3. Open index.html in your browser
# (or use a local server for best results)
npx serve .
```

> **Note:** For AI features to work locally, make sure your Anthropic API key is configured in the project.

---

## 📂 Project Structure

```
Energy-Usage-Tracker/
│
├── index.html          # Main dashboard page
├── login.html          # User login page
├── style.css           # Stylesheet
├── script.js           # Core logic: IoT simulation, graph updates, AI calls
└── README.md           # Project documentation
```

---

## 🔮 How It Works

```
User Opens Dashboard
        │
        ▼
┌──────────────────┐      ┌───────────────────────┐
│  IoT Simulation  │─────▶│  Energy Graph Updates  │
│  (0.5 – 2 kWh)  │      │  + kWh / Cost Counter  │
└──────────────────┘      └───────────────────────┘
                                    │
                                    ▼
                        ┌────────────────────────┐
                        │   AI Analysis Trigger   │
                        │   (Claude Anthropic)    │
                        └────────────────────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    ▼               ▼                 ▼
             Predictions      Anomaly           Recommendations
           (Cost / Usage)    Detection          (Energy Tips)
```

---

## 💡 Use Cases

- 🏠 **Homeowners** — Understand and reduce electricity bills
- 🏢 **Office Managers** — Monitor workplace energy consumption
- 🎓 **Students & Developers** — Learn AI integration with IoT concepts
- 🌱 **Sustainability Enthusiasts** — Track carbon footprint and optimize usage

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Ram** — [@ram399613](https://github.com/ram399613)

---

## 🌟 Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

> _"The best energy is the energy you don't waste."_
