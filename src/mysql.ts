import { Sequelize } from "sequelize";
import fs from "fs";
import { resolve } from "path";

interface IMySQLConfig {
  host: string;
  username: string;
  password?: string;
  database: string;
}

const configPath = resolve(__dirname + "/../config.json");
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({
    "host": "localhost",
    "username": "root",
    "password": "",
    "database": "welcome-home"
  }, null , 2));

  const lines = [
    "",
    "",
    "",
    `No config file found.`,
    `Created one at ${configPath}`,
    `Please fill in the config file with your MySQL credentials and run the command again.`,
    "",
    `Remember that the database name you choose to use MUST EXIST before running the server.`,
    "",
  ];
  let spaces: number;
  for (let i = 0; i < lines.length; i++) {
    spaces = Math.floor((process.stdout.columns - lines[i].length) / 2);
    console.log(`${" ".repeat(spaces)}${lines[i]}${" ".repeat(spaces)}`);
  }
  console.log();
  process.exit(1);
}

const config: IMySQLConfig = require(configPath);

// Validate config file
if (!config.host) {
  throw new Error("Config file missing host");
}
if (!config.username) {
  throw new Error("Config file missing username");
}
if (!config.database) {
  throw new Error("Config file missing database");
}


const mysql = new Sequelize({
  dialect: "mysql",
  ...config,
  logging: false,
});

export default mysql;