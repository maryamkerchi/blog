import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_kXKeQR31ruAM@ep-aged-dawn-a2jbxhxo-pooler.eu-central-1.aws.neon.tech/blog?sslmode=require&channel_binding=require",
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to database!");
    const res = await client.query("SELECT NOW()");
    console.log(res.rows[0]);
  } catch (err) {
    console.error("❌ Connection error:", err);
  } finally {
    await client.end();
  }
}

testConnection();
