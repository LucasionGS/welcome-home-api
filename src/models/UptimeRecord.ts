import sql from "../sql";
import { Model, DataTypes } from "sequelize";

interface UptimeRecordAttributes {
  id: number;
  uptimeId: number;
  status: number;
  data: string;

  createdAt: Date;
}

interface UptimeRecordCreationAttributes extends Partial<UptimeRecordAttributes> {
  uptimeId: number;
  status: number;
  host: string;
  data: string;
}

export default class UptimeRecord extends Model<UptimeRecordAttributes, UptimeRecordCreationAttributes> {
  public id: number;
  public uptimeId: number;
  public status: number;
  public data: string;

  public parseData<T = any>() {
    return JSON.parse(this.data) as T;
  }
}

UptimeRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uptimeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sql,
    tableName: "uptimeRecords"
  },
);
console.log("UptimeRecord Model loaded");
