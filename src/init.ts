import express from "express";
import sql from "./sql";
import cors from "cors";
import fs from "fs";
import Path from "path";
import { createApiRoutes } from "./routes";

export const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.argv.includes("--dev") ? 3000 : (+process.env.PORT || 4321);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

createApiRoutes(app);

// Serve static images
const uploadsDir = Path.resolve(__dirname, "../uploads");
if (fs.existsSync(uploadsDir)) {
  app.use("/uploads", express.static(uploadsDir));
}

// Serve static files
const publicDir = fs.realpathSync(Path.resolve(__dirname, "../public"));
if (fs.existsSync(publicDir)) {
  app.use(
    express.static(publicDir),
    (req, res) => res.sendFile(Path.resolve(publicDir, "index.html"))
  );
}

// Sync database
sql.sync({
  alter: true,
});