import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST endpoint for GPA Assistant
app.post("/ask", async (req, res) => {
  try {
    const { gpa, question } = req.body;
    if (!question || !gpa) {
      return res.status(400).json({ error: "Missing GPA or question" });
    }

    const prompt = `
You are a helpful GPA Advisor. The student's current GPA is ${gpa}.
They are asking: "${question}".
Give a clear, friendly, and encouraging response, suggesting realistic steps to improve GPA if possible.
    `;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a GPA guidance assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200
      })
    });

    const data = await aiResponse.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't generate an answer right now.";
    res.json({ answer });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
