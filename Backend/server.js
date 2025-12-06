const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const farmlandRoutes = require('./routes/farmLandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'OK', timestamp: new Date() });
});

// Add more routes here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/farmland', farmlandRoutes);
app.use('/api/v1/admin', adminRoutes);





app.listen(port, () => {
    console.log(`${process.env.APP_NAME || "App"} is running on http://localhost:${port}`);
});