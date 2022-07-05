import sql from "../sql";
import { Model, DataTypes } from "sequelize";
import { Request, Response, NextFunction } from "express";
import authKit from "@ionkit/authkit";

// interface UserAttributes {
//   id: number;
//   username: string;
//   password: string;
//   token: string;
// }

// interface UserCreationAttributes extends Partial<UserAttributes> {
//   username: string;
//   password: string;
//   token: string;
// }

// export default class User extends Model<UserAttributes, UserCreationAttributes> {
//   public id: number;
//   public username: string;
//   public password: string;
//   public token: string;
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     token: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }
//   },
//   {
//     sequelize: sql,
//     tableName: "users",
//     indexes: [
//       {
//         fields: ["username"]
//       }
//     ]
//   },
// );

const { User, Group } = authKit({ sequelize: sql });
console.log("User Model loaded");

// const authenticate = User.$authenticate; // Actual implementation
const authenticate = (...rest: any[]) => { // Temporary implementation
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  }
};

export {
  User,
  Group,
  authenticate
};