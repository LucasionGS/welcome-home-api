const fs = require("fs");
const cp = require("child_process");

const root = __dirname;
const args = process.argv.slice(2);

const flags = {
  branch: args[0] ?? cp.execSync("git branch --show-current", { cwd: process.cwd(), encoding: "utf8" }).trim(),
}

// console.log(flags);

/**
 * 
 * @param  {string[]} text 
 */
const print = (...text) => {
  const consoleWidth = process.stdout.columns / 2;
  const message = [
    "-".repeat(consoleWidth),
    ...text,
    // "-".repeat(consoleWidth),
  ];

  // Center each line
  message.forEach((line, i) => {
    const padding = Math.floor((consoleWidth - line.length) / 2);
    message[i] = " ".repeat(padding) + line;
  });

  console.log(message.join("\n"));
}

(async () => {
  // Install dependencies for backend
  print("Installing backend dependencies...");
  cp.execSync("npm install", { cwd: root });

  // Build backend
  print("Building backend...");
  cp.execSync("npm run build", { cwd: root });

  await new Promise(resolve => {
    if (fs.existsSync(root + "/__frontend")) {
      print("Pulling frontend");
      const _ = cp.exec("git pull", { cwd: root + "/__frontend" });
      _.on("close", (code) => {
        resolve(code);
      });
    }
    else {
      // Get the dev branch of the frontend repo
      print("Cloning frontend");
      const _ = cp.exec(`git clone --branch ${flags.branch} https://github.com/LucasionGS/welcome-home __frontend`, { cwd: root });
      _.on("close", (code) => {
        resolve(code);
      });
    }
  });

  // Install dependencies
  print("Installing frontend dependencies...");
  cp.execSync("yarn install", { cwd: root + "/__frontend" });

  // Build frontend
  print("Building frontend...");
  cp.execSync("yarn build", { cwd: root + "/__frontend" });

  // Remove old /public
  print("Removing old /public...");
  fs.rmSync(root + "/public", { recursive: true, force: true });

  // Copy build to ../public
  print("Copying frontend build...");
  cp.execSync(`cp -r "${root}/__frontend/build" "${root}/public"`);


  print("Deployment successful");
})();

