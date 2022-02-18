import { Sequelize, Options } from "sequelize";
import fs from "fs";
import { resolve } from "path";

interface ISQLConfig extends Options {
  dialect: "mysql" | "sqlite";
  /**
   * Only `true` if no config file exists.
   */
  __defaultConfig?: boolean;
}

const configPath = resolve(__dirname + "/../config.json");

export const sqlConfig: ISQLConfig = {} as any;
try {
  Object.assign(sqlConfig, JSON.parse(fs.readFileSync(configPath, "utf8")));
} catch (e) {
  console.log("---------------------");
  console.log("No config file found.");
  console.log("Using memory");
  console.log("---------------------");
  sqlConfig.dialect = "sqlite";
  sqlConfig.storage = ":memory:";
  sqlConfig.__defaultConfig = true;
}

const sql = new Sequelize({
  logging: false,
  ...sqlConfig
});

export default sql;