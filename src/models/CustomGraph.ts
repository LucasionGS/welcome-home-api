import sql from "../sql";
import { Model, DataTypes } from "sequelize";

export interface CustomGraphTemplate {
  requestUrl: string;
  requestMethod: "POST" | "GET";

  interval?: number;
}

interface CustomGraphAttributes {
  id: number;
  title: string;
  template: string;
}

interface CustomGraphCreationAttributes extends Partial<CustomGraphAttributes> {
  title: string;
  template: string;
}

export default class CustomGraph extends Model<CustomGraphAttributes, CustomGraphCreationAttributes> {
  public id: number;
  public title: string;
  public template: string;

  public getTemplate(): CustomGraphTemplate {
    try {
      return JSON.parse(this.template);
    } catch (error) {
      return null;
    }
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      template: this.getTemplate(),
    };
  }
}

CustomGraph.init(
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
    template: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: sql,
    tableName: "customGraph"
  },
);
console.log("CustomGraph Model loaded");
