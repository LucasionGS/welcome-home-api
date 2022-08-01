import { Router, Request, Response } from "express";
import Action from "../models/Action";

export namespace ActionController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const actions = await Action.findAll();
    res.json(actions);
  };
  router.get("/", getAll);

  export const getById = async (req: Request, res: Response) => {
    const action = await Action.findByPk(req.params.id);
    res.json(action);
  }
  router.get("/:id", getById);

  export const create = async (req: Request, res: Response) => {
    const action = await Action.create(req.body);
    res.json(action);
  }
  router.post("/", create);

  export const update = async (req: Request, res: Response) => {
    const action = await Action.findByPk(req.params.id);
    if (action) {
      await action.update(req.body);
      res.json(action);
    }
    else {
      res.json(null);
    }
  }
  router.put("/:id", update);

  export const deleteById = async (req: Request, res: Response) => {
    const action = await Action.findByPk(req.params.id);
    if (action) {
      await action.destroy();
      res.json(action);
    }
    else {
      res.json(null);
    }
  }
  router.delete("/:id", deleteById);

  // Trigger action
  export const trigger = async (req: Request, res: Response) => {
    const action = await Action.findByPk(req.params.id);
    try {
      const output = await action.trigger();
      res.send(output);
    } catch (error: any) {
      res.status(500).json({
        error: error.message ? error.message : error,
      }); 
    }
  }
  router.post("/:id/trigger", trigger);
}