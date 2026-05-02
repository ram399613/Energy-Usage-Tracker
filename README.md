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
