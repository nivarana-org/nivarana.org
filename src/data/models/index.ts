import knex from "knex";
import { Model } from "objection";

const db = knex({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE,
        charset: "utf8mb4",
    },
    pool: { min: 0, max: 7 },
});


Model.knex(db);

export {default as Blog } from "./Blog";
export {default as Author} from "./Author";
