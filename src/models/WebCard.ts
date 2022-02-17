import mysql from "../mysql";
import { Model, DataTypes } from "sequelize";

interface WebCardAttributes {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  target: string;
  checkAvailable: boolean;
}

interface WebCardCreationAttributes extends Partial<WebCardAttributes> {
  title: string;
  url: string;
}

export default class WebCard extends Model<WebCardAttributes, WebCardCreationAttributes> {
  public id: number;
  public title: string;
  public description: string;
  public url: string;
  public image: string;
  public target: string;
  public checkAvailable: boolean;
}

WebCard.init(
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
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: mysql,
    modelName: "webcards",
  },
);