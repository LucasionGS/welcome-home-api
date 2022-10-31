import { Router, Request, Response } from "express";
import Uptime from "../models/Uptime";

export namespace UptimeController {
  export const router = Router();

  export const get = async (req: Request, res: Response) => {
    const uptimes = await Uptime.findAll();
    res.json(uptimes.map(u => u.toJSON()));
  }
  router.get("/", get);

  export const fetch = async (req: Request, res: Response) => {
    const uptime = await Uptime.findByPk(req.params.id);
    const result = await uptime.fetch();
    res.json(uptime.toJSON());
  }
}