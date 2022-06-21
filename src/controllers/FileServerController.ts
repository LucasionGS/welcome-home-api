import { Router, Request, Response } from "express";
import Path from "path";
import fs from "fs";
import Multer from "multer";
import os from "os";
import User from "../models/User";

export namespace FileServerController {
  export const router = Router();


  const tmpDirectory = os.tmpdir();
  const uploader = Multer({
    dest: tmpDirectory,
  });

  const rootDirectory = "/";

  /**
   * Converts client path into a server path.
   */
  const getFilePath = (path: string) => Path.resolve(rootDirectory, decodeURI(path).replace(/^\/?(file-server)?/, ""));
  /**
   * Converts server path into a client path.
   */
  const getFileClientPath = (path: string) => "/" + Path.relative(rootDirectory, path);

  function validatePath(path: string) {
    if (path.includes("..")) {
      throw new Error("Path cannot contain \"..\"");
    }
  }

  router.get("*", User.authenticate(true), async (req, res) => {
    console.log("GET", req.url);
    validatePath(req.path);
    const filePath = getFilePath(req.path);

    const stat: fs.Stats = await fs.promises.stat(filePath).then(stat => stat, () => null);

    if (!stat) {
      return res.status(404).send("Not found");
    }

    if (stat.isFile()) {
      return res.sendFile(filePath);
    }

    if (stat.isDirectory()) {
      const files: string[] = await fs.promises.readdir(filePath).then(a => a).catch(() => null);
      if (!files) {
        return res.status(500).send("Something went wrong reading the directory");
      }
      const filesWithPath = files.map(async (filename) => {
        let fullPlatformPath = Path.resolve(filePath, filename);
        let fullPath = getFileClientPath(fullPlatformPath);
        if (process.platform === "win32") fullPath = fullPath.replace(/\\/g, "/"); // Replace all backslashes with forward slashes on Windows
        const stat: fs.Stats = await fs.promises.stat(fullPlatformPath).then(stat => stat, () => null);
        if (!stat) {
          return null;
        }
        return {
          entryType: stat.isFile() ? "file" : "directory",
          fullPath: fullPath,
          createdTime: new Date(stat?.ctimeMs || 0),
          modifiedTime: new Date(stat?.mtimeMs || 0),
          size: stat.isFile() ? stat?.size | 0 : undefined,
        };
      });

      return res.json((await Promise.all(filesWithPath)).filter(a => a));
    }
  });

  interface ActionBody {
    action: string;
    [key: string]: any;
  }

  // PUT is used for actions that modify the filesystem.
  router.put("*", User.authenticate(true), async (req, res) => {
    console.log("PUT", req.url, req.body);
    validatePath(req.path);
    const filePath = getFilePath(req.path);

    const body: ActionBody = req.body;

    /**
     * @action Rename
     * Rename action is used to rename a file or directory.\
     * Rename is also used when moving a file or directory.
     */
    if (body.action === "rename") {
      const stat: fs.Stats = await fs.promises.stat(filePath).then(stat => stat, () => null);
      if (!stat) {
        return res.status(404).send("Not found");
      }

      const newName: string = body.newName;
      if (!newName) {
        return res.status(400).send("Missing newName");
      }

      validatePath(newName);

      await fs.promises.rename(filePath, getFilePath(newName));
      return res.send("OK");
    }

    /**
     * @action Create folder
     * Create folder action is used to create a new folder.
     */
    if (body.action === "create-folder") {
      await fs.promises.mkdir(filePath, { recursive: true });
      return res.send("OK");
    }
  });

  // POST is used for uploading files.
  router.post("*", User.authenticate(true), uploader.single("file"), async (req, res) => {
    console.log("POST", req.url, req.file);
    validatePath(req.path);
    const filePath = getFilePath(req.path);

    if (req.file) {
      await fs.promises.rename(req.file.path, filePath);
      return res.send("OK");
    }

    return res.status(400).send("Missing file");
  });

  // DELETE is used for deleting files.
  router.delete("*", User.authenticate(true), async (req, res) => {
    console.log("DELETE", req.url);
    validatePath(req.path);
    const filePath = getFilePath(req.path);

    const stat: fs.Stats = await fs.promises.stat(filePath).then(stat => stat, () => null);
    if (!stat) {
      console.error("Not Found");
      return res.status(404).send("Not found");
    }

    if (stat.isFile()) {
      try {
        await fs.promises.unlink(filePath);
      } catch (error: any) {
        console.error(error);
        return res.status(500).send("Something went wrong deleting the file: " + error.message);
      }
      return res.send("OK");
    }

    if (stat.isDirectory()) {
      try {
        await fs.promises.rmdir(filePath, { recursive: true });
      } catch (error: any) {
        console.error(error);
        return res.status(500).send("Something went wrong deleting the directory: " + error.message);
      }
      return res.send("OK");
    }
  });
}