import mysql from "../mysql";
import { Model, DataTypes } from "sequelize";

interface ImageAttributes {
  id: number;
  name: string; // Name the image was uploaded with
  path: string; // Relative to /uploads
  size: number; // Size in bytes
  width: number; // Width in pixels
  height: number; // Height in pixels
}

interface ImageCreationAttributes extends Partial<ImageAttributes> {
  name: string;
  path: string;
  size: number;
  width: number;
  height: number;
}

export default class Image extends Model<ImageAttributes, ImageCreationAttributes> {
  public id: number;
  public name: string;
  public path: string;
  public size: number;
  public width: number;
  public height: number;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize: mysql,
    modelName: "images",
  },
);