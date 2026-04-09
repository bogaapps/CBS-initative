import { neon } from "@neondatabase/serverless";

export const handler = async () => {
    const sql = neon(process.env.DATABASE_URL);

    await sql`
    CREATE TABLE IF NOT EXISTS donors (
      id        SERIAL PRIMARY KEY,
      name      TEXT    NOT NULL,
      amount    INTEGER NOT NULL,
      year      TEXT,
      note      TEXT,
      receipt   TEXT,
      phone     TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "✅ تم إنشاء الجدول بنجاح" })
    };
};
