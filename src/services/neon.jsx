import { neon } from "@neondatabase/serverless";

const db = async () => {
    const sql = neon(process.env.DATABASE_URL);
    return sql;
}

export default db;