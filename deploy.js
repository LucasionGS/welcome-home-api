const fs = require("fs");
const cp = require("child_process");

const root = __dirname;
const args = process.argv.slice(2);

(async () => {
  const frontendAction = new Promise(resolve => {
    if (fs.existsSync(root + "/__frontend")) {
      console.log("Pulling frontend");
      const _ = cp.exec("git pull", { cwd: root + "/__frontend" });
      _.on("close", (code) => {
        resolve(code);
      });
    }
    else {
      // Get the dev branch of the frontend repo
      console.log("Cloning frontend");
      const _ = cp.exec("git clone --branch dev https://github.com/LucasionGS/welcome-home __frontend", { cwd: root });
      _.on("close", (code) => {
        resolve(code);
      });
    }
  });

  await frontendAction;

  // Install dependencies
  console.log("Installing dependencies...");
  cp.execSync("yarn install", { cwd: root + "/__frontend" });

  // Build frontend
  console.log("Building frontend...");
  cp.execSync("yarn build", { cwd: root + "/__frontend" });

  // Remove old /public
  console.log("Removing old /public...");
  fs.rmSync(root + "/public", { recursive: true, force: true });
  
  // Copy build to ../public
  console.log("Copying frontend build...");
  cp.execSync(`cp -r "${root}/__frontend/build" "${root}/public"`);


  const consoleWidth = process.stdout.columns / 2;
  const message = [
    "-".repeat(consoleWidth),
    "Deployment successful",
    "-".repeat(consoleWidth),
  ];
  
  // Center each line
  message.forEach((line, i) => {
    const padding = Math.floor((consoleWidth - line.length) / 2);
    message[i] = " ".repeat(padding) + line;
  });

  console.log(message.join("\n"));
})();

