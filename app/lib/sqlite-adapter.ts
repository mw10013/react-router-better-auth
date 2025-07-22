import { createAdapter, type CreateCustomAdapter } from "better-auth/adapters";
import type { Where } from "better-auth/types";
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
    adapter: ({ getFieldName, schema }) => {
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const whereToSql = (where?: Where[]) => {
        if (!where || where.length === 0) return { clause: "", values: [] };
        const clauses: string[] = [];
        const values: any[] = [];
        for (let i = 0; i < where.length; i++) {
          const w = where[i];
          const op = w.operator || "eq";
          let sql = "";
          switch (op) {
            case "eq":
              sql = `${w.field} = ?`;
              values.push(w.value);
              break;
            case "ne":
              sql = `${w.field} <> ?`;
              values.push(w.value);
              break;
            case "lt":
              sql = `${w.field} < ?`;
              values.push(w.value);
              break;
            case "lte":
              sql = `${w.field} <= ?`;
              values.push(w.value);
              break;
            case "gt":
              sql = `${w.field} > ?`;
              values.push(w.value);
              break;
            case "gte":
              sql = `${w.field} >= ?`;
              values.push(w.value);
              break;
            case "in":
              if (Array.isArray(w.value) && w.value.length > 0) {
                sql = `${w.field} in (${w.value.map(() => "?").join(",")})`;
                values.push(...w.value);
              } else {
                sql = "0"; // always false
              }
              break;
            case "contains":
              sql = `${w.field} like ?`;
              values.push(`%${w.value}%`);
              break;
            case "starts_with":
              sql = `${w.field} like ?`;
              values.push(`${w.value}%`);
              break;
            case "ends_with":
              sql = `${w.field} like ?`;
              values.push(`%${w.value}`);
              break;
            default:
              throw new Error(`Unsupported where operator: ${op}`);
          }
          clauses.push(sql);
        }
        // connectors: default to 'and', but support 'or' if specified
        let clause = "";
        if (clauses.length > 0) {
          clause = clauses[0];
          for (let i = 1; i < clauses.length; i++) {
            const connector = (where[i].connector || "AND").toLowerCase();
            clause = `${clause} ${connector} ${clauses[i]}`;
          }
        }
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

      const updateMany: CustomAdapter["updateMany"] = async ({
        model: rawModel,
        where,
        update,
      }) => {
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
      };

      const del: CustomAdapter["delete"] = async ({
        model: rawModel,
        where,
      }) => {
        const model = capitalize(rawModel);
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `delete from ${model}${clause ? ` where ${clause}` : ""}`
        );
        stmt.run(...values);
      };

      const deleteMany: CustomAdapter["deleteMany"] = async ({
        model: rawModel,
        where,
      }) => {
        const model = capitalize(rawModel);
        const { clause, values } = whereToSql(where);
        const stmt = db.prepare(
          `delete from ${model}${clause ? ` where ${clause}` : ""}`
        );
        const info = stmt.run(...values);
        return info.changes;
      };

      const count: CustomAdapter["count"] = async ({
        model: rawModel,
        where,
      }) => {
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
      };
      const findMany: CustomAdapter["findMany"] = async ({
        model: rawModel,
        where,
        limit,
        sortBy,
        offset,
      }) => {
        const model = capitalize(rawModel);
        let sql = `select * from ${model}`;
        const params: any[] = [];
        if (where && where.length) {
          const { clause, values } = whereToSql(where);
          sql += ` where ${clause}`;
          params.push(...values);
        }
        if (sortBy) sql += ` order by ${sortBy.field} ${sortBy.direction}`;
        if (limit) sql += ` limit ${limit}`;
        if (offset) sql += ` offset ${offset}`;
        console.log("findMany", {
          rawModel,
          model,
          where,
          // clause,
          // values,
          sortBy,
          limit,
          offset,
          sql,
          params,
          // schema: JSON.stringify(schema, null, 2),
        });
        const stmt = db.prepare(sql);
        const result = stmt.all(...params) as any[];
        return result;
      };
      const update: CustomAdapter["update"] = async ({
        model: rawModel,
        where,
        update,
      }) => {
        const model = capitalize(rawModel);
        const set = Object.keys(update as object)
          .map((k) => `${k} = ?`)
          .join(",");
        const setValues = Object.values(update as object);
        const { clause, values } = whereToSql(where);
        const sql = `update ${model} set ${set}${
          clause ? ` where ${clause}` : ""
        } returning *`;
        const stmt = db.prepare(sql);
        const result = (stmt.get(...setValues, ...values) as any) ?? null;
        console.log("update", {
          rawModel,
          model,
          where,
          update,
          set,
          setValues,
          clause,
          values,
          sql,
          result,
        });
        return result;
      };
      return {
        create,
        findOne,
        findMany,
        update,
        updateMany,
        delete: del,
        deleteMany,
        count,
      };
    },
  });
