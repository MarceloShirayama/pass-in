import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

import { DB } from "@/_config/settings";
import { Connection } from "@infra/database";
import { InternalServerError, UnexpectedError } from "@shared/error";
import { logMessage } from "@shared/utils";

const initOptions: pgp.IInitOptions = {
  connect(e) {
    const cp = e.client.connectionParameters
    logMessage(`Connected to database: ${cp.database}`, "INFO")
  },
  disconnect(e) {
    const cp = e.client.connectionParameters;
    logMessage(`Disconnecting from database: ${cp.database}`, "INFO");
  },
  query(e) {
    if (process.env.NODE_ENV !== "test") return
    logMessage(`Query: ${e.query}`, "INFO");
  },
  schema: "public"
}

const client: pgp.IMain<{}, pg.IClient> = pgp(initOptions)

const db: pgp.IDatabase<{}, pg.IClient> = client({
  user: DB.USER,
  password: DB.PASS,
  host: DB.HOST,
  port: DB.PORT,
  database: DB.DB_NAME,
  query_timeout: 5000
}
)

export class PostgresAdapter implements Connection {
  async query(query: string, params?: any[]): Promise<any[]> {
    if (!params) params = []
    try {
      const result = await db.query(query, params)
      return result
    } catch (error: any) {
      if (error.code === "ECONNREFUSED") {
        logMessage("Database connection refused", "ERROR")
        throw new InternalServerError("Internal server error, contact support")
      }
      throw new UnexpectedError()
    }
  }
}
