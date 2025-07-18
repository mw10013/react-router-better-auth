import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { createAdapter } from "better-auth/adapters";

const db = new Database("./sqlite.db");

const sqliteAdapter = createAdapter({
  config: {
    adapterId: "sqlite-logger",
    adapterName: "SQLite Logger Adapter",
    supportsNumericIds: true,
    supportsDates: false,
    supportsBooleans: false,
    debugLogs: true,
  },
  adapter: () => {
    const whereToSql = (where?: Array<{ field: string; value: any }>) => {
      if (!where || where.length === 0) return { clause: "", values: [] };
      const clause = where.map((w) => `${w.field} = ?`).join(" and ");
      const values = where.map((w) => w.value);
      return { clause, values };
    };
    return {
      async create({ model, data }) {
        console.log("[adapter] create", { model, data });
        const keys = Object.keys(data);
        const values = keys.map((k) => data[k]);
        const placeholders = keys.map(() => "?").join(",");
        const stmt = db.prepare(
          `insert into ${model} (${keys.join(",")}) values (${placeholders})`
        );
        stmt.run(...values);
        console.log("[adapter] create result", data);
        return data;
      },
      async update<T = any>({
        model,
        where,
        update,
      }: {
        model: string;
        where: Array<{ field: string; value: any }>;
        update: T;
      }): Promise<T | null> {
        console.log("[adapter] update", { model, where, update });
        const set = Object.keys(update as object)
          .map((k) => `${k} = ?`)
          .join(",");
        const setValues = Object.values(update as object);
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `update ${model} set ${set}${clause ? ` where ${clause}` : ""}`
        );
        stmt.run(...setValues, ...values);
        const selectStmt = db.prepare(
          `select * from ${model}${clause ? ` where ${clause}` : ""} limit 1`
        );
        const result = (selectStmt.get(...values) as T) ?? null;
        console.log("[adapter] update result", result);
        return result;
      },
      async updateMany<T = any>({
        model,
        where,
        update,
      }: {
        model: string;
        where: Array<{ field: string; value: any }>;
        update: T;
      }): Promise<number> {
        console.log("[adapter] updateMany", { model, where, update });
        const set = Object.keys(update as object)
          .map((k) => `${k} = ?`)
          .join(",");
        const setValues = Object.values(update as object);
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `update ${model} set ${set}${clause ? ` where ${clause}` : ""}`
        );
        const info = stmt.run(...setValues, ...values);
        console.log("[adapter] updateMany result", info.changes);
        return info.changes;
      },
      async delete({ model, where }) {
        console.log("[adapter] delete", { model, where });
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `delete from ${model}${clause ? ` where ${clause}` : ""}`
        );
        const info = stmt.run(...values);
        console.log("[adapter] delete result", info.changes);
      },
      async deleteMany({ model, where }) {
        console.log("[adapter] deleteMany", { model, where });
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `delete from ${model}${clause ? ` where ${clause}` : ""}`
        );
        const info = stmt.run(...values);
        console.log("[adapter] deleteMany result", info.changes);
        return info.changes;
      },
      async findOne<T = any>({
        model,
        where,
      }: {
        model: string;
        where: Array<{ field: string; value: any }>;
      }): Promise<T | null> {
        console.log("[adapter] findOne", { model, where });
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `select * from ${model}${clause ? ` where ${clause}` : ""} limit 1`
        );
        const result = stmt.get(...values);
        console.log("[adapter] findOne result", result);
        return (result as T) ?? null;
      },
      async findMany<T = any>({
        model,
        where,
        limit,
        sortBy,
        offset,
      }: {
        model: string;
        where?: Array<{ field: string; value: any }>;
        limit: number;
        sortBy?: { field: string; direction: "asc" | "desc" };
        offset?: number;
      }): Promise<T[]> {
        console.log("[adapter] findMany", {
          model,
          where,
          limit,
          sortBy,
          offset,
        });
        let sql = `select * from ${model}`;
        const params = [];
        if (where && where.length) {
          const { clause, values } = whereToSql(where);
          sql += ` where ${clause}`;
          params.push(...values);
        }
        if (sortBy) sql += ` order by ${sortBy.field} ${sortBy.direction}`;
        if (limit) sql += ` limit ${limit}`;
        if (offset) sql += ` offset ${offset}`;
        const stmt = db.prepare(sql);
        const result = stmt.all(...params) as T[];
        console.log("[adapter] findMany result", result);
        return result;
      },
      async count({
        model,
        where,
      }: {
        model: string;
        where?: Array<{ field: string; value: any }>;
      }): Promise<number> {
        console.log("[adapter] count", { model, where });
        let sql = `select count(*) as count from ${model}`;
        const params = [];
        if (where && where.length) {
          const { clause, values } = whereToSql(where);
          sql += ` where ${clause}`;
          params.push(...values);
        }
        const stmt = db.prepare(sql);
        const row = stmt.get(...params) as
          | { count?: number | string }
          | undefined;
        const result = row && row.count !== undefined ? Number(row.count) : 0;
        console.log("[adapter] count result", result);
        return result;
      },
    };
  },
});

export const auth = betterAuth({
  database: sqliteAdapter,
  user: {
    modelName: "User",
    // fields: {
    // 	email: "emailAddress",
    // name: "fullName"
    // },
    // additionalFields: {
    // 	customField: {
    // 		type: "string",
    // 	}
    // },
    // changeEmail: {
    // 	enabled: true,
    // 	sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
    // 		// Send change email verification
    // 	}
    // },
    // deleteUser: {
    // 	enabled: true,
    // 	sendDeleteAccountVerification: async ({ user, url, token }) => {
    // 		// Send delete account verification
    // 	},
    // 	beforeDelete: async (user) => {
    // 		// Perform actions before user deletion
    // 	},
    // 	afterDelete: async (user) => {
    // 		// Perform cleanup after user deletion
    // 	}
    // }
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
});
