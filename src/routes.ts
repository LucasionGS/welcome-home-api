import { SiteOptionController } from "./controllers/OptionController";
import { WebCardController } from "./controllers/WebCardController";
import { ImageController } from "./controllers/ImageController";
import { Express } from "express";
import { ConfigController } from "./controllers/ConfigController";

export function createApiRoutes(app: Express) {
  // API routes
  app.use("/api/config", ConfigController.router); // For creating the initial config file
  app.use("/api/option", SiteOptionController.router);
  app.use("/api/webcard", WebCardController.router);
  app.use("/api/image", ImageController.router);
}
