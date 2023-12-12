import express from "express";
import cors from "cors";
import { PORT, API_KEY } from "./config.js";

const app = express();
 
app.use(cors());
app.use(express.json());

app.post("/prompt", async (req, res) => {
    const { coded } = req.body;
  
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: coded }],
        max_tokens: 70,
      }),
    };
  
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        options
      );
      const data = await response.json();
      res.send(data);
    } catch (error) {
      console.error(error);
    }
  });

  app.listen(PORT || process.env.PORT, () => console.log("Listen on port 3000"));