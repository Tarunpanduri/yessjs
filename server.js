import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware for parsing JSON
app.use(express.json());

// 1️⃣ Serve Static Frontend from `dist/`
app.use(express.static(path.join(__dirname, "frontend/dist")));

// 2️⃣ Auto-Register API Routes
const apiDir = path.join(__dirname, "backend/src/api");

fs.readdirSync(apiDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = `/api/${file.replace(".js", "")}`;
    import(path.join(apiDir, file)).then((module) => {
      app.use(route, module.default);
      console.log(`✅ API route loaded: ${route}`);
    });
  }
});

// 3️⃣ Handle Frontend Page Routing Dynamically
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Framework running on http://localhost:${PORT}/`);
});
