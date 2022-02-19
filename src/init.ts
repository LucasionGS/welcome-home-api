import express from "express";
import sql from "./sql";
import cors from "cors";
import fs from "fs";
import Path from "path";
import { createApiRoutes } from "./routes";

export const app = express();
const args = process.argv.slice(2);

app.use(express.json());
app.use(cors());

const PORT = args.includes("--dev") ? 3000 : (+process.env.PORT || 4321);
if (args.includes("--docker")) {
  console.log("Running in docker mode");
  process.env.WELCOME_HOME_DOCKER = "true";
}

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
// const publicDir = fs.realpathSync(Path.resolve(__dirname, "../public"));
const publicDir = Path.resolve(__dirname, "../public");
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