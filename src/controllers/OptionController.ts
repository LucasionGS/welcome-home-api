import { Router, Request, Response } from "express";
import SiteOption from "../models/SiteOption";

export namespace SiteOptionController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const siteOptions = await SiteOption.findAll();
    res.json(siteOptions);
  };
  router.get("/", getAll);

  export const getByKey = async (req: Request, res: Response) => {
    const siteOption = await SiteOption.getOption(req.params.key);

    if (siteOption) {
      res.json({
        key: siteOption.key,
        value: siteOption.value,
      });
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

  export const set = async (req: Request, res: Response) => {
    const siteOption = await SiteOption.setOption(req.params.key, req.body.value);
    res.json(siteOption);
  }
  router.post("/:key", set);
}