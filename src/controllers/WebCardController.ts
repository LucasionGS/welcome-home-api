import { Router, Request, Response } from "express";
import WebCard from "../models/WebCard";

export namespace WebCardController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const webcards = await WebCard.findAll();
    res.json(webcards);
  };
  router.get("/", getAll);

  export const getById = async (req: Request, res: Response) => {
    const webcard = await WebCard.findByPk(req.params.id);
    res.json(webcard);
  }
  router.get("/:id", getById);

  export const create = async (req: Request, res: Response) => {
    const webcard = await WebCard.create(req.body);
    res.json(webcard);
  }
  router.post("/", create);

  export const update = async (req: Request, res: Response) => {
    const webcard = await WebCard.findByPk(req.params.id);
    if (webcard) {
      await webcard.update(req.body);
      res.json(webcard);
    }
    else {
      res.json(null);
    }
  }
  router.put("/:id", update);

  export const deleteById = async (req: Request, res: Response) => {
    const webcard = await WebCard.findByPk(req.params.id);
    if (webcard) {
      await webcard.destroy();
      res.json(webcard);
    }
    else {
      res.json(null);
    }
  }
  router.delete("/:id", deleteById);

  export const reorder = async (req: Request, res: Response) => {
    const ids = req.body.ids as number[];
    const promises: Promise<WebCard>[] = [];
    for (let i = 0; i < ids.length; i++) {
      const webcard = await WebCard.findByPk(ids[i]);
      if (webcard) {
        promises.push(webcard.update({
          position: i + 1,
        }));
      }
    }
    await Promise.all(promises);
    res.json({
      success: true,
    });
  }
  router.put("/reorder", reorder);
}