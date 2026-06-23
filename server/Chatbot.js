// server/Chatbot.js
const express = require('express');
const router = express.Router();
const cohere = require('cohere-ai');
require('dotenv').config();

cohere.init(process.env.COHERE_API_KEY); // Make sure .env file has correct key

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await cohere.generate({
      model: 'command-r', // Or 'command-light', depending on your plan
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    res.json({ reply: response.body.generations[0].text.trim() });
  } catch (error) {
    console.error('Cohere error:', error.message);
    res.status(500).json({ reply: '❌ Error connecting to Cohere AI.' });
  }
});

module.exports = router;
