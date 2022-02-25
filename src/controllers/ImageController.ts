import { Router, Request, Response } from "express";
import Image from "../models/Image";
import multer from "multer";
import imageSize from "image-size";
import fsp from "fs/promises";
import Path from "path";


export namespace ImageController {
  const uploadPath = Path.resolve(__dirname, "../../uploads");
  
  export const uploader = multer({
    dest: uploadPath,
  });
  
  export const router = Router();

  export const getAll = async (req: Request, res: Response) => {
    const images = await Image.findAll();
    res.json(images);
  };
  router.get("/", getAll);

  export const upload = async (file: Express.Multer.File): Promise<[{ image: Image, fullPath: string }, { error: string }]> => {
    const img = file;
    if (img) {
      try {
        const ext = img.originalname.split(".").pop();
        const dimensions = imageSize(img.path);
        const _dir = Path.dirname(img.path);
        const newPath = Path.resolve(_dir, `${img.filename}.${ext}`);
        await fsp.rename(img.path, newPath);
        const image = await Image.create({
          name: img.originalname,
          path: img.filename + "." + ext,
          size: img.size,
          width: dimensions.width,
          height: dimensions.height,
        });
        return [{
          image,
          fullPath: newPath,
        }, null];
      } catch (error: any) {
        return [null, { error: error.message }];
      }
    } else {
      return [null, { error: "No file was uploaded" }];
    }
  }

  export const uploadEndpoint = async (req: Request, res: Response) => {
    const img = req.file;
    if (img) {
      const [image, error] = await upload(img);
      if (image && image.image) {
        res.json(image.image);
      } else {
        res.status(400).json(error);
      }
    }
  };
  router.post("/", uploader.single("image"), uploadEndpoint);
}