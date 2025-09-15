import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  try {
    const { gpa, question } = req.body;
    if (!gpa || !question) {
      return res.status(400).json({ error: "Missing GPA or question" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a GPA assistant that gives helpful, realistic advice to improve GPA." },
          { role: "user", content: `My GPA is ${gpa}. ${question}` },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default app;
