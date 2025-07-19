import { createAdapter, type CreateCustomAdapter } from "better-auth/adapters";
import type { Database } from "better-sqlite3";

type CustomAdapter = ReturnType<CreateCustomAdapter>;
type FindOneArgs = Parameters<CustomAdapter["findOne"]>[0];

/**
 * Better Auth test harness passes model names in lower-case (e.g., 'user'),
 * but the SQLite schema uses capitalized table names (e.g., 'User').
 * Model is normalized to match the schema for all SQL statements.
 */
export const sqliteAdapter = (db: Database) =>
  createAdapter({
    config: {
      adapterId: "sqlite-logger",
      adapterName: "SQLite Logger Adapter",
      supportsNumericIds: true,
      supportsDates: false,
      supportsBooleans: false,
      disableIdGeneration: true,
      debugLogs: true,
    },
    adapter: () => {
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const whereToSql = (where?: Array<{ field: string; value: any }>) => {
        if (!where || where.length === 0) return { clause: "", values: [] };
        const clause = where.map((w) => `${w.field} = ?`).join(" and ");
        const values = where.map((w) => w.value);
        return { clause, values };
      };
      const create: CustomAdapter["create"] = async ({
        model: rawModel,
        data,
      }) => {
        const model = capitalize(rawModel);
        const keys = Object.keys(data);
        const values = keys.map((k) => data[k]);
        const placeholders = keys.map(() => "?").join(",");
        const sql = `insert into ${model} (${keys.join(
          ","
        )}) values (${placeholders}) returning *`;
        console.log("create", { model, keys, values, placeholders, sql });
        const stmt = db.prepare(sql);
        return stmt.get(...values) as typeof data;
      };
      const findOne: CustomAdapter["findOne"] = async ({
        model: rawModel,
        where,
        select,
      }) => {
        const model = capitalize(rawModel);
        const { clause, values } = whereToSql(where);
        const fields = select && select.length ? select.join(",") : "*";
        const sql = `select ${fields} from ${model} ${
          clause ? `where ${clause}` : ""
        } limit 1`;
        const stmt = db.prepare(sql);
        const result = stmt.get(...values);
        console.log("findOne", {
          rawModel,
          model,
          where,
          select,
          clause,
          values,
          fields,
          sql,
          result,
        });
        return result as any;
      };
      return {
        create,
        findOne,
        async update<T = any>({
          model: rawModel,
          where,
          update,
        }: {
          model: string;
          where: Array<{ field: string; value: any }>;
          update: T;
        }): Promise<T | null> {
          const model = capitalize(rawModel);
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
          model: rawModel,
          where,
          update,
        }: {
          model: string;
          where: Array<{ field: string; value: any }>;
          update: T;
        }): Promise<number> {
          const model = capitalize(rawModel);
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
        async delete({ model: rawModel, where }) {
          const model = capitalize(rawModel);
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `delete from ${model}${clause ? ` where ${clause}` : ""}`
          );
          stmt.run(...values);
        },
        async deleteMany({ model: rawModel, where }) {
          const model = capitalize(rawModel);
          const { clause, values } = whereToSql(where);
          const stmt = db.prepare(
            `delete from ${model}${clause ? ` where ${clause}` : ""}`
          );
          const info = stmt.run(...values);
          return info.changes;
        },
        async findMany<T = any>({
          model: rawModel,
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
          const model = capitalize(rawModel);
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
          model: rawModel,
          where,
        }: {
          model: string;
          where?: Array<{ field: string; value: any }>;
        }): Promise<number> {
          const model = capitalize(rawModel);
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
