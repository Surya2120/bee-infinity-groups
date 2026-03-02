import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
 
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are Bee Infinity AI. Speak professionally and briefly about film, events, and dance services."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
  });

  res.json({ reply: response.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});