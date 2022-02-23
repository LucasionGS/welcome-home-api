import { Router, Request, Response, NextFunction } from "express";
import fsp from "fs/promises";
import Path from "path";
import cp from "child_process";
import User from "../models/User";
// Systeminformation
import Systeminformation from "systeminformation";
import { Stats } from "fs";
import multer from "multer";
import { tmpdir } from "os";
const tmpFolder = multer({
  dest: tmpdir(),
});

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

  export const getDirectory = async (req: Request, res: Response) => {
    const dir = Path.resolve((req.query.path as string) || "/");
    const files = await fsp.readdir(dir).catch(() => <string[]>[]);

    const result = files.map(async filename => {
      const stat: Stats = await fsp.stat(Path.resolve(dir, filename)).catch(() => null);

      if (!stat) {
        return null;
      }

      return {
        name: filename,
        isDirectory: stat.isDirectory(),
        isFile: stat.isFile(),
        metadata: {
          ...stat,
          name: undefined
        }
      };
    });

    const data = await Promise.all(result);
    res.json(
      data.filter(a => a !== null)
    );
  }
  router.get("/directory", User.authenticate(true), getDirectory);

  export const getFile = async (req: Request, res: Response) => {
    const path = Path.resolve((req.query.path as string));
    const data: Buffer = await fsp.readFile(path).catch((err) => {
      console.error(`Failed to read file ${path}`);
      console.error(err);
      return null;
    });

    if (data === null) {
      res.status(404).json({
        error: "File not found"
      });
      return;
    }

    // Send blob
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(data);
  }
  router.get("/file", User.authenticate(true), getFile);

  export const setFile = async (req: Request, res: Response) => {
    const _path: string = req.body ? req.body.path : null;
    if (!_path) {
      return res.status(400).json({
        error: "Missing path"
      });
    }

    // _path = _path.split("/").pop();
    
    const path = Path.resolve((_path as string));
    const data = req.file;

    if (!data) {
      return res.status(400).json({
        error: "Missing file"
      });
    }
  
    await fsp.rename(data.path, path).catch((err) => {
      console.error(`Failed to write file ${path}`);
      console.error(err);
      res.status(500).json({
        error: "Failed to write file"
      });
      return;
    });

    if (!res.headersSent) {
      res.json({
        success: true
      });
    }
  }
  router.post("/file", User.authenticate(true), tmpFolder.single("file"), setFile);

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