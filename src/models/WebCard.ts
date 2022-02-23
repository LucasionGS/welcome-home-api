import sql from "../sql";
import { Model, DataTypes } from "sequelize";

interface WebCardAttributes {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  target: string;
  checkAvailable: boolean;
  position: number;
  category: string;
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
  public position: number;
  public category: string;
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
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sql,
    tableName: "webcards",
    indexes: [
      {
        fields: ["category"],
      },
    ],
  },
);
console.log("WebCard Model loaded");
