const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/exams', require('./routes/exams'));

// Health check route
// Health check route
app.get('/health', (req, res) => {
    res.json({ message: 'Exam API Server is running' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/dist'));

    // Handle SPA
    app.get('*', (req, res) => {
        res.sendFile(require('path').resolve(__dirname, 'client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'Exam API Server is running (Development Mode)' });
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
