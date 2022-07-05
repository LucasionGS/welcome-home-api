import { Router, Request, Response } from "express";
import { User } from "../models/User";

export namespace UserController {
  export const router = Router();

  export const login = async (req: Request, res: Response) => {
    try {
      const user = User.login(req.body.username, req.body.password);
      res.json(user);
    } catch (error: any) {
      res.status(401).json({
        error: error.message,
      });
    }
  }
}