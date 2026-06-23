// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatbotRoute = require("./Chatbot");

dotenv.config();
const app = express();
app.use(require("./Chatbot"));
app.use(express.json());
app.use(cors());

// ✅ Route to access chatbot API
app.use("/api", chatbotRoute);

// Start server
// const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});