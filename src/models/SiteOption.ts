import mysql from "../mysql";
import { Model, DataTypes } from "sequelize";

interface SiteOptionAttributes {
  id: number;
  key: string;
  value: string;
}

interface SiteOptionCreationAttributes extends Partial<SiteOptionAttributes> {
  title: string;
  url: string;
}

export default class SiteOption extends Model<SiteOptionAttributes, SiteOptionCreationAttributes> {
  public id: number;
  public key: string;
  public value?: string;
}

SiteOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: mysql,
    modelName: "siteOptions",
  },
);