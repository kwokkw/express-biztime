/** Database setup for BizTime. */

import pg from "pg";
const { Client } = pg;

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://postgres:17273185@localhost:5432/biztime";
} else {
  DB_URI = "postgresql://postgres:17273185@localhost:5432/biztime";
}

let db = new Client({
  connectionString: DB_URI,
});

db.connect();

export default db;
