import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => {
  if (command === "serve") {
    const app = express();
    app.use(express.json());

    // ✅ Updated Path to Match Your Folder Structure
    const apiPath = path.join(__dirname, "frontend/src/pages/backend/api");
    if (fs.existsSync(apiPath)) {
      fs.readdirSync(apiPath).forEach((file) => {
        if (file.endsWith(".js")) {
          import(`./frontend/src/pages/backend/api/${file}`).then((module) => {
            const route = `/${file.replace(".js", "")}`;
            app.use(`/api${route}`, module.default);
          });
        }
      });
    } else {
      console.warn("⚠️ API folder not found! Skipping API routes.");
    }

    const server = app.listen(3001, () => {
      console.log("✅ API running on http://localhost:3001");
    });

    process.on("SIGINT", () => server.close());
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
  };
});
