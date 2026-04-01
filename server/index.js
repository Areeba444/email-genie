const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

console.log("Loaded OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "Yes" : "No");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { tone, purpose } = req.body;

  const prompt = `
You are a professional email writer. Write a well-structured email based on the following:
- Tone: ${tone}
- Purpose: ${purpose}
The email should:
- Match the specified tone (e.g., ${tone.toLowerCase()})
- Be clear, concise, and properly formatted
- Have an appropriate subject line
- Include a greeting, body, and closing
- Avoid generic phrases — make it sound natural and human
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ result: message });
  } catch (error) {
    console.error("OpenRouter API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});