import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import express from "express";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    const app = express();
    app.use(express.json());

    // ✅ Define API Routes Inside Vite (like Next.js)
    app.get("/api/message", (req, res) => {
      res.json({ message: "Hello from API!" });
    });

    // Start API Server inside Vite
    const server = app.listen(3001, () => {
      console.log("API running on http://localhost:3001");
    });

    // Close server when Vite stops
    process.on("SIGINT", () => server.close());
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": "http://localhost:3001", // Redirect API calls to Express
      },
    },
  };
});
