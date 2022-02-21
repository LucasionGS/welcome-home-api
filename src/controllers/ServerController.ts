import { Router, Request, Response, NextFunction } from "express";
import fsp from "fs/promises";
import Path from "path";
import cp from "child_process";
import User from "../models/User";

// Systeminformation
import Systeminformation from "systeminformation";

async function existsAsync(path: string): Promise<boolean> {
  return fsp.access(path).then(() => true).catch(() => false);
}

export namespace ServerController {
  export const router = Router();
  
  export const uptime = async (req: Request, res: Response) => {
    const uptime = process.uptime();
    res.json({
      uptime,
    });
  }
  router.get("/uptime", uptime);

  export const getSystemStats = async (req: Request, res: Response) => {
    const [
      cpu,
      mem,
      os,
      fs,
      load
    ] = await Promise.all([
      Systeminformation.cpuTemperature(),
      Systeminformation.mem(),
      Systeminformation.osInfo(),
      Systeminformation.fsSize(),
      Systeminformation.currentLoad(),
    ]);

    const stats = {
      cpu,
      mem,
      os,
      fs,
      load
    };

    res.json(stats);
  }
  router.get("/system-stats", User.authenticate(true), getSystemStats);
  
  // Docker stuff
  export const isDocker = () => process.env.WELCOME_HOME_DOCKER !== undefined;
  
  export const getIsDocker = (req: Request, res: Response) => {
    res.json({
      docker: isDocker(),
    });
  }
  router.get("/is-docker", getIsDocker);

  /**
   * Routes specifically made to work when running in a Docker instance.
   */
  export namespace Docker {
    export const router = Router();
    export const directory = "/usr/local/welcome-home";
    
    const isDockerMiddleware = (req: Request, res: Response, next: NextFunction) => {
      if (!isDocker()) {
        return res.status(400).json({
          message: "Not running in docker",
          success: false,
        });
      }
      next();
    }
    
    export const update = async (req: Request, res: Response) => {
      const updator = cp.spawn(directory + "/update.sh"); // Start the update script
      updator.stdout.on("data", (data) => {
        console.log(`Updator: ${data}`);
      });

      updator.stderr.on("data", (data) => {
        console.error(`Updator ERROR: ${data}`);
      });

      updator.on("close", (code) => {
        console.log(`Updator exited with code ${code}`);

        process.exit(-1); // Restart the server
      });

      res.json({
        message: "Updated",
        success: true,
      });
    }
    router.post("/update", isDockerMiddleware, User.authenticate(true), update);
  }
}