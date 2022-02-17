import express from "express";
import { SiteOptionController } from "./controllers/OptionController";
import { WebCardController } from "./controllers/WebCardController";
import WebCard from "./models/WebCard";
import mysql from "./mysql";
import cors from "cors";
import fs from "fs";
import Path from "path";
import { ImageController } from "./controllers/ImageController";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Sync database
mysql.sync({
  alter: true,
});

// API routes
app.use("/api/option", SiteOptionController.router);
app.use("/api/webcard", WebCardController.router);
app.use("/api/image", ImageController.router);

// Serve static images
const uploadsDir = Path.resolve(__dirname, "../uploads");
if (fs.existsSync(uploadsDir)) {
  app.use("/uploads", express.static(uploadsDir));
}

// Serve static files
const publicDir = Path.resolve(__dirname, "../public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir), (req, res) => {
    res.sendFile(Path.resolve(publicDir, "index.html"));
  });
}
