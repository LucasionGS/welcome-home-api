import { SiteOptionController } from "./controllers/OptionController";
import { WebCardController } from "./controllers/WebCardController";
import { ImageController } from "./controllers/ImageController";
import { ConfigController } from "./controllers/ConfigController";
import { ServerController } from "./controllers/ServerController";
import { FileServerController } from "./controllers/FileServerController";
import SiteOption from "./models/SiteOption";
import { Express } from "express";

export function createApiRoutes(app: Express) {
  // Create favicon
  app.get("/favicon.ico", async (req, res) => {
    const opt = await SiteOption.getOption("favicon");
    if (!opt) return res.status(404).send("Not found");
    res.sendFile(opt.value);
  });
  app.post("/favicon.ico", ImageController.uploader.single("image"), async (req, res) => {
    const img = req.file;
    const [data, err] = await ImageController.upload(img);
    if (err) {
      return res.status(500).json(err);
    }
    const opt = await SiteOption.setOption("favicon", data.fullPath);
    res.json(opt.toPair());
  });
  
  // API routes
  app.use("/api/config", ConfigController.router);
  app.use("/api/option", SiteOptionController.router);
  app.use("/api/webcard", WebCardController.router);
  app.use("/api/image", ImageController.router);
  
  app.use("/api/file-server", FileServerController.router);
  app.use("/api/server", ServerController.router);
  app.use("/api/docker", ServerController.Docker.router);
}
