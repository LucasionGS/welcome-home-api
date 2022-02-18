import cp from "child_process";

const args = process.argv.slice(2);
let app: cp.ChildProcess;
startApp();
/**
 * Sets app to the child process
 */
function startApp() {
  console.log(__dirname + "/init.js");
  
  app = cp.fork(__dirname + "/init.js", args);
  app.on("spawn", () => {
    console.log("Spawned app");
  });
  app.on("exit", (code) => {
    console.log("Server stopped");
    // Restart server if code is -1 or 255
    if (code === -1 || code === 255) {
      console.log("Restarting server...");
      startApp();    
    }
  });
}

// Handle app exit
process.on("exit", () => {
  if (app) {
    app.kill();
  }
});