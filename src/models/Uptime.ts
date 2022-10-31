import sql from "../sql";
import { Model, DataTypes } from "sequelize";
import UptimeRecord from "./UptimeRecord";
import { Op } from "sequelize";
import fetch from "cross-fetch";

type UptimeType = "http" | "ping" | "dns";

interface UptimeAttributes {
  id: number;
  title: string;
  type: UptimeType;
  url: string;
  interval: number;
}

interface UptimeCreationAttributes extends Partial<UptimeAttributes> {
  title: string;
  type: UptimeType;
  url: string;
  interval: number;
}

export default class Uptime extends Model<UptimeAttributes, UptimeCreationAttributes> {
  public id: number;
  public title: string;
  public type: UptimeType;
  public url: string;
  public interval: number;

  public async fetch() {
    const result = await this.fetchData();
    
    await this.save();
    return result;
  }

  public async fetchData() {
    if (this.type === "http") {
      return await this.fetchHttp();
    }
  }

  public async fetchHttp() {
    const result = await fetch(this.url, {
      // Check status
      method: "HEAD",
      // Don't follow redirects
      redirect: "manual",
    });

    return {
      status: result.status === 200 ? 0 : 1,
      data : {
        statusCode: result.status,
        statusMessage: result.statusText,
      }
    }
  }

  public async getRecords(options?: {
    since?: Date;
  }) {
    options ??= {};
    // 30 days ago
    options.since ??= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const records = await UptimeRecord.findAll<UptimeRecord>({
      where: {
        uptimeId: this.id,
        createdAt: {
          [Op.gte]: options.since ?? new Date(0),
        }
      },
      order: [
        ["createdAt", "DESC"]
      ]
    });

    return records;
  }

  public async createRecord(status: number, data: any) {
    const record = await UptimeRecord.create<UptimeRecord>({
      uptimeId: this.id,
      status,
      data: JSON.stringify(data),
    });

    return record;
  }
}

Uptime.init(
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
    type: {
      type: DataTypes.ENUM("http", "ping"),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sql,
    tableName: "uptimes"
  },
);
console.log("Uptime Model loaded");
