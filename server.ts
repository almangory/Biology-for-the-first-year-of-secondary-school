import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { searchCurriculum } from "./src/utils/searchEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// AI Tutor chat API endpoint (Uses the local curriculum search engine exclusively)
app.post("/api/tutor/chat", async (req, res) => {
  const { message } = req.body;
  const userQuery = message || "";

  try {
    const searchResult = searchCurriculum(userQuery);
    return res.json({ reply: searchResult.content, isLocalSearch: true });
  } catch (error: any) {
    console.error("Local search error:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء البحث المنهجي المحلي.",
      details: error.message,
    });
  }
});

// Setup Vite Dev Server / Static files for Production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupServer();
