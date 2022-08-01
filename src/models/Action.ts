import sql from "../sql";
import { Model, DataTypes } from "sequelize";
import cp from "child_process";

interface ActionAttributes {
  id: number;
  title: string;
  description: string;
  command: string;
  image: string;
}

interface ActionCreationAttributes extends Partial<ActionAttributes> {
  title: string;
  description: string;
  command: string;
  image: string;
}

export default class Action extends Model<ActionAttributes, ActionCreationAttributes> {
  public id: number;
  public title: string;
  public description: string;
  public command: string;
  public image: string;

  public trigger() {
    const p = cp.exec(this.command);
    return new Promise<string>((resolve, reject) => {
      p.stdout.on("data", (data) => {
        resolve(data);
      });
      let output = "";
      p.stdout.on("data", (data) => {
        output += data;
      }).on("error", (err) => {
        reject(err);
      }).on("close", () => {
        resolve(output);
      });
    });
  }
}

Action.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    command: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sql,
    tableName: "actions"
  },
);
console.log("Action Model loaded");
