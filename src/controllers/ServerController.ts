import { Router, Request, Response } from "express";
import fs from "fs";
import fsp from "fs/promises";
import Path from "path";
import sql, { sqlConfig as sqlConfig } from "../sql";

async function existsAsync(path: string): Promise<boolean> {
  return fsp.access(path).then(() => true).catch(() => false);
}

export namespace ServerController {
  export const router = Router();
  
  export const isDocker = () => process.env.WELCOME_HOME_DOCKER !== undefined;
  
  export const getIsDocker = (req: Request, res: Response) => {
    res.json({
      docker: isDocker(),
    });
  }
  router.get("/is-docker", getIsDocker);
}