import { Router, Request, Response } from "express";
import SiteOption from "../models/SiteOption";

export namespace SiteOptionController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const keys = typeof req.query.keys === "string" ? req.query.keys.split(",") : [];

    if (keys.length === 0) {
      const siteOptions = await SiteOption.findAll();
      res.json(siteOptions.map(s => s.toPair()));
    }
    else {
      const siteOptions = await SiteOption.getOptions(keys);
      res.json(siteOptions.map(s => s.toPair()));
    }
  };
  router.get("/", getAll);

  export const getByKey = async (req: Request, res: Response) => {
    const siteOption = await SiteOption.getOption(req.params.key);

    if (siteOption) {
      res.json(siteOption.toPair());
    }
    else {
      return res.json(
        {
          key: req.params.key,
          value: null,
        }
      )
    }
  }
  router.get("/:key", getByKey);

  export const setByKey = async (req: Request, res: Response) => {
    const siteOption = await SiteOption.setOption(req.params.key, req.body.value);
    res.json(siteOption);
  }
  router.post("/:key", setByKey);
}