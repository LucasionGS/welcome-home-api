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
if (!fs.existsSync(configPath)) {
  // fs.writeFileSync(configPath, JSON.stringify({
  //   "host": "localhost",
  //   "username": "root",
  //   "password": "",
  //   "database": "welcome-home"
  // }, null , 2));

  // const lines = [
  //   "",
  //   "",
  //   "",
  //   `No config file found.`,
  //   `Created one at ${configPath}`,
  //   `Please fill in the config file with your MySQL credentials and run the command again.`,
  //   "",
  //   `Remember that the database name you choose to use MUST EXIST before running the server.`,
  //   "",
  // ];
  // let spaces: number;
  // for (let i = 0; i < lines.length; i++) {
  //   spaces = Math.floor((process.stdout.columns - lines[i].length) / 2);
  //   console.log(`${" ".repeat(spaces)}${lines[i]}${" ".repeat(spaces)}`);
  // }
  // console.log();
  // process.exit(1);

  
}

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