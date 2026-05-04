# ⚡ Energy Usage Tracker

A complete full-stack real-time Energy Usage Tracker web application. 

## 🔹 Features
- User authentication (Signup/Login using JWT)
- Dashboard to track energy consumption (kWh)
- Real-time updates via WebSockets
- Show monthly energy usage data and calculate estimated electricity cost
- Real-time chart visualization with Chart.js
- High usage alerts
- Fully responsive modern UI
- **Advanced AI Working Model (Anti-Gravity Core)** with predictive intelligence, contextual analysis, and anomaly detection

## 🚀 Advanced AI Working Model (Anti-Gravity Core)
This project features a self-learning, intelligent energy management system that monitors, predicts, and optimizes energy usage.

### 🧠 Core Capabilities
- **Multi-Source Data & Context-Aware API**: Integrates real-time contextual variables, such as simulated weather conditions (`Sunny`, `Heatwave`) and dynamic time-of-day electricity pricing to build intelligent surrounding data.
- **AI Analytics Engine**: Applies statistical modeling and pattern recognition to identify hidden high-energy anomalies (`usage > mean + 1.5 * standard deviation`) and peak consumption behavioral trends.
- **Predictive Intelligence Layer**: Utilizes time-series logic based on recent user inputs, augmented by dynamic weather modifiers, to precisely forecast future monthly energy consumption and expected costs.
- **Optimization & Recommendation Engine**: Generates personalized, prioritized recommendations (`High`, `Medium`, `Low`). Actionable insights shift dynamically based on anomalies detected, active peak grid hours, and real-time environment metrics.
- **Lightweight Integration**: Built over existing historical MongoDB data as a seamless plug-and-play enhancement, meaning absolutely zero changes were required to database collections or deployment structures.

### ⚙️ How It Works
1. **Trigger Engine:** Clicking **"Generate AI Insights"** on the dashboard awakens the AI controller to fetch the user's historical `Energy` logs.
2. **Context Mapping:** The AI calculates a statistical baseline and maps the current real-world conditions (hour of day, grid demand, pricing, weather factors) onto the user's baseline.
3. **Forecasting:** Using time-series averages and intelligent modifiers, it projects the upcoming usage trajectory.
4. **Adaptive Feedback:** The engine identifies inefficiencies, ranks actionable optimization tips, and delivers the aggregated intelligence back to the UI.
5. **Anti-Gravity UI:** Insights are rendered using a futuristic, glowing "floating" visualization system to deliver a premium user experience.

## 🔹 Tech Stack
**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Chart.js for data visualization

**Backend:**
- Node.js & Express.js
- Socket.io for WebSockets
- MVC architecture

**Database:**
- MongoDB & Mongoose

## 🔹 Installation Steps
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables (see below)
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open your browser and go to `http://localhost:5000`

## 🔹 Environment Variables Setup
Create a `.env` file in the root directory and add the following:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🔹 Deployment (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use the following settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add the Environment Variables (`MONGO_URI`, `JWT_SECRET`) in Render's dashboard.
Alternatively, use the provided `render.yaml` file to deploy using Render's Blueprint.

## 🔹 Author
- **Name:** Ramu Reddy
- **GitHub:** [ram399613](https://github.com/ram399613)
- **Email:** ramureddy399@gmail.com
