import sql from "../sql";
import { Model, DataTypes } from "sequelize";
import { Request, Response, NextFunction } from "express";

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  token: string;
}

interface UserCreationAttributes extends Partial<UserAttributes> {
  username: string;
  password: string;
  token: string;
}

export default class User extends Model<UserAttributes, UserCreationAttributes> {
  public id: number;
  public username: string;
  public password: string;
  public token: string;


  // Extra middleware for express
  public static authenticate(requireAdmin: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      // TODO: Implement this
      // TODO: Implement requireAdmin to only go through this middleware if the user is an admin/owner
      next();
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: sql,
    modelName: "users",
  },
);
console.log("User Model loaded");