const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const farmlandRoutes = require('./routes/farmLandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const listingFarmlandRoutes = require('./routes/listingFarmlandRoutes');
const companyRoutes = require('./routes/companyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketplaceRoutes = require("./routes/marketPlaceRoute");
const dashboardRoutes = require("./routes/dashboardRoutes")
const walletRoutes = require("./routes/walletRoutes");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// database connection
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
app.use('/api/v1/farmer-marketplace-listing', listingFarmlandRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/wallet", walletRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(" Global Error Handler:", err);
    res.status(err.status || 500).json({
        msg: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port, () => {
    console.log(`${process.env.APP_NAME || "App"} is running on http://localhost:${port}`);
});
