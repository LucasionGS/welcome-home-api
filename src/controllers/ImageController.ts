import { Router, Request, Response } from "express";
import Image from "../models/Image";
import multer from "multer";
import imageSize from "image-size";
import fsp from "fs/promises";
import Path from "path";

const uploader = multer({
  dest: "uploads/",
});

export namespace ImageController {
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const images = await Image.findAll();
    res.json(images);
  };
  router.get("/", getAll);

  export const upload = async (req: Request, res: Response) => {
    const img = req.file;
    if (img) {
      const ext = img.originalname.split(".").pop();
      const dimensions = imageSize(img.path);
      const _dir = Path.dirname(img.path);
      await fsp.rename(img.path, Path.resolve(_dir, `${img.filename}.${ext}`));
      const image = await Image.create({
        name: img.originalname,
        path: img.filename + "." + ext,
        size: img.size,
        width: dimensions.width,
        height: dimensions.height,
      });
      res.json(image);
    } else {
      res.status(400).json({ error: "No file was uploaded" });
    }
  };
  router.post("/", uploader.single("image"), upload);
}