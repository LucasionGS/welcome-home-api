import { Router, Request, Response } from "express";
import fs from "fs";
import fsp from "fs/promises";
import Path from "path";
import sql, { sqlConfig as sqlConfig } from "../sql";

async function existsAsync(path: string): Promise<boolean> {
  return fsp.access(path).then(() => true).catch(() => false);
}

export namespace ConfigController {
  export const router = Router();
  const configPath = Path.resolve(__dirname, "../../config.json");

  export const createConfig = async (req: Request, res: Response) => {
    const newConfig = {
      ...req.body.config,
      dialect: req.body.dialect
    };

    if (await existsAsync(configPath)) {
      res.status(400).json({
        message: "Database config already exists",
        success: false,
      });
    }
    else {
      await fsp.writeFile(configPath, JSON.stringify(newConfig, null, 2));
      res.json({
        message: "Database config created",
        success: true,
      });
      process.exit(-1); // Restart the server
    }
  }
  router.post("/", createConfig);

  export const getConfig = async (req: Request, res: Response) => {
    res.json(sqlConfig)
  }
  router.get("/", getConfig);
}