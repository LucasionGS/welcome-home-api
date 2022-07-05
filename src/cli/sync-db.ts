import "../models/Image";
import "../models/SiteOption";
import "../models/Todo";
import "../models/WebCard";
import "../models/User";
import sql from "../sql";

export default function syncDb(args: string[]) {
  // Sync database
  return sql.sync({
    alter: true
  });
}