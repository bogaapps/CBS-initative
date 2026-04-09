import { neon } from "@neondatabase/serverless";

export const handler = async () => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        const sql = neon(process.env.DATABASE_URL);
        const donors = await sql`
      SELECT id, name, amount, year, note, receipt, phone,
             TO_CHAR(created_at AT TIME ZONE 'Africa/Khartoum', 'DD Mon YYYY') AS date
      FROM donors
      ORDER BY amount DESC
    `;
        const total = donors.reduce((s, d) => s + d.amount, 0);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ donors, total })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message })
        };
    }
};
