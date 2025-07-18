import { createAdapter } from "better-auth/adapters";
import type { Database as DatabaseType } from "better-sqlite3";

export const sqliteAdapter = (db: DatabaseType) =>
  createAdapter({
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
          const keys = Object.keys(data);
          const values = keys.map((k) => data[k]);
          const placeholders = keys.map(() => "?").join(",");
          const stmt = db.prepare(
            `insert into ${model} (${keys.join(",")}) values (${placeholders})`
          );
          stmt.run(...values);
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
          const set = Object.keys(update as object)
            .map((k) => `${k} = ?`)
            .join(",");
          const setValues = Object.values(update as object);
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `update ${model} set ${set}${clause ? ` where ${clause}` : ""}`
          );
          const info = stmt.run(...setValues, ...values);
          return info.changes;
        },
        async delete({ model, where }) {
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `delete from ${model}${clause ? ` where ${clause}` : ""}`
          );
          stmt.run(...values);
        },
        async deleteMany({ model, where }) {
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `delete from ${model}${clause ? ` where ${clause}` : ""}`
          );
          const info = stmt.run(...values);
          return info.changes;
        },
        async findOne<T = any>({
          model,
          where,
        }: {
          model: string;
          where: Array<{ field: string; value: any }>;
        }): Promise<T | null> {
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `select * from ${model}${clause ? ` where ${clause}` : ""} limit 1`
          );
          const result = stmt.get(...values);
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
          return result;
        },
        async count({
          model,
          where,
        }: {
          model: string;
          where?: Array<{ field: string; value: any }>;
        }): Promise<number> {
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
          return result;
        },
      };
    },
  });
