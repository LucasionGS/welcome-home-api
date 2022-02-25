import sql from "../sql";
import { Model, DataTypes } from "sequelize";

interface SiteOptionAttributes {
  id: number;
  key: string;
  value: string;
}

interface SiteOptionCreationAttributes extends Partial<SiteOptionAttributes> {
  key: string;
  value: string;
}

export default class SiteOption extends Model<SiteOptionAttributes, SiteOptionCreationAttributes> {
  public id: number;
  public key: string;
  public value?: string;

  public toPair() {
    return ({
      key: this.key,
      value: this.value,
    })
  }

  public static async getOption(key: string): Promise<SiteOption> {
    const siteOption = await SiteOption.findOne({
      where: {
        key: key,
      },
    });

    return siteOption ?? null;
  }

  public static async setOption(key: string, value: string) {
    const [siteOption, created] = await SiteOption.findOrCreate({
      where: {
        key: key,
      },
      defaults: {
        key: key,
        value: null,
      }
    });
    if (created) {
      console.log("Created " + key);
    }
    else {
      console.log("Updated " + key);
    }

    if (value) {
      await siteOption.update({
        value: value
      });
    }

    return siteOption;
  }
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
    sequelize: sql,
    tableName: "siteOptions",
    indexes: [
      {
        fields: ["key"]
      }
    ]
  },
);
console.log("SiteOption Model loaded");