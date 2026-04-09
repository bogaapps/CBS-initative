import { neon } from "@neondatabase/serverless";

export const handler = async (event) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
    if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

    try {
        const { name, amount, year, note, receipt, phone } = JSON.parse(event.body);
        if (!name || !amount) return { statusCode: 400, headers, body: JSON.stringify({ error: "الاسم والمبلغ مطلوبان" }) };

        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`
      INSERT INTO donors (name, amount, year, note, receipt, phone)
      VALUES (${name}, ${parseInt(amount)}, ${year || null}, ${note || null}, ${receipt || null}, ${phone || null})
      RETURNING id
    `;
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ success: true, id: result[0].id })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message })
        };
    }
};
