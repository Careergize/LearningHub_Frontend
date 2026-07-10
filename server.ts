import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Using smart simulation mode.");
}

// AI Career Mentor Route
app.post("/api/mentor", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // High-quality simulated responses when API key is missing
      const simulatedResponses: { [key: string]: string } = {
        "sql": "To improve SQL query performance, make sure to:\n\n1. **Use Indexes**: Index column filters used in `WHERE` and `JOIN` clauses.\n2. **Avoid SELECT ***: Retrieve only the columns you actually need.\n3. **Use EXPLAIN**: Run `EXPLAIN ANALYZE` on queries to see slow query execution plans.\n4. **Optimize Joins**: Keep foreign keys indexed and join on identical data types.\n\nWould you like a sample practice schema to try optimizing?",
        "react": "React Hooks require a solid understanding of execution context:\n\n1. **useState**: Best for local simple states.\n2. **useEffect**: Run side-effects, but always declare stable dependencies (like primitives) or clean up event listeners to avoid infinite loops.\n3. **useMemo & useCallback**: Only use when rendering complex lists or passing callback props to optimized child components to avoid premature complexity.\n\nWhat React concept are you practicing right now?",
        "resume": "For high-impact tech resumes, focus on the **STAR framework** (Situation, Task, Action, Result):\n\n* **Bad**: 'Wrote API endpoints in Node.js.'\n* **Good**: 'Architected 12 core REST API routes with Express, reducing request-latency by 40% and handling over 5,000 parallel requests.'\n\nSend me your resume bullet points and I will rewrite them to sound highly professional!",
        "portfolio": "Your developer portfolio should stand out with real-world utility:\n\n1. Include **3 high-quality live links** instead of 10 generic tutorial copies.\n2. Add a clear **1-sentence value proposition** at the top.\n3. Provide visible **GIFs/Videos** of the app in action so recruiters don't have to sign up.\n\nWhat kind of projects do you currently have in your portfolio?",
      };

      const lowerMsg = message.toLowerCase();
      let reply = "That is a great career query! To succeed in modern engineering, always focus on hands-on building, system design fundamentals, and responsive communication. Feel free to ask more about React, SQL, resumes, or portfolios!";
      
      for (const key of Object.keys(simulatedResponses)) {
        if (lowerMsg.includes(key)) {
          reply = simulatedResponses[key];
          break;
        }
      }

      // Short delay to mimic real network
      await new Promise(resolve => setTimeout(resolve, 600));
      return res.json({ 
        text: reply,
        isSimulated: true,
        message: "Showing expert-mode career answers. (Note: For real-time custom answers, connect your GEMINI_API_KEY under Settings > Secrets)."
      });
    }

    // Set up chat session with history
    const systemInstruction = 
      "You are Careergize AI, an exceptionally supportive, friendly, and expert 24/7 Career Mentor. " +
      "Your goal is to guide tech students and developers on upskilling, resume building, mock interviews, portfolios, and coding. " +
      "Keep responses highly encouraging, practical, clear, and well-structured with markdown list items. Focus on helping them land modern engineering roles.";

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));

    // Generate content using the recommended gemini-3.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to fetch response from Career Mentor.", 
      details: error.message 
    });
  }
});

// Vite server integration
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startViteServer();
