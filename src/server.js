const express = require("express");
const connectDB = require("./database/connect");
const { apiRouter } = require("./api");
require("dotenv").config();

const app = express();

connectDB(); // Connect to MongoDB

// Middleware
app.use(express.json());
app.use("/api", apiRouter);

// Simple route
app.get("/health", async (req, res) => {
    res.status(200).json({ message: `Server is healthy running on port ${process.env.PORT || 5000}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
