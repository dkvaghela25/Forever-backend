const express = require("express");
const connectDB = require("./database/connect");
const User = require("./database/model/User");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

connectDB(); // Connect to MongoDB

// Simple route
app.get("/health", async (req, res) => {
    res.status(200).json({ message: `Server is healthy running on port ${process.env.PORT || 5000}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
