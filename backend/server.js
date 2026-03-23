
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

/* Schema */
const chatSchema = new mongoose.Schema({
  prompt: String,
  response: String
});

const Chat = mongoose.model("Chat", chatSchema);

/* Root Route */
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/* AI Route */
app.post("/api/ask-ai", async (req, res) => {
  try {
    // ✅ Validate input
    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const { prompt } = req.body;

    // ✅ Call OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // ✅ stable model
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;

    // ✅ Save to MongoDB
    const newChat = new Chat({
      prompt: prompt,
      response: answer
    });

    await newChat.save();

    // ✅ Send response
    res.json({ answer });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Error fetching AI" });
  }
});

/* Save Route (optional separate save) */
app.post("/api/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    const newChat = new Chat({ prompt, response });
    await newChat.save();

    res.json({ message: "✅ Saved successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
});

/* Start Server */
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));