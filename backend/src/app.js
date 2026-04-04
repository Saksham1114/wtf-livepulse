const cors = require("cors");
const http = require("http");
const express = require("express");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const { initWebSocket } = require("./websocket/server");

console.log("🔥 APP STARTING...");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB =================
const pool = new Pool({
  connectionString: "postgres://wtf:wtf_secret@db:5432/wtf_livepulse"
});

// Make pool globally usable
global.pool = pool;

// ================= DB RETRY =================
async function connectDB() {
  let retries = 10;

  while (retries) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ DB Connected");
      return;
    } catch (err) {
      console.log("⏳ Waiting for DB...");
      retries--;
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  throw new Error("❌ DB failed");
}

// ================= SERVER START =================
async function startServer() {
  try {
    await connectDB();

    // ================= 🔥 1. RUN MIGRATIONS =================
    console.log("📦 Running migrations...");

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "db", "migrations", "001_init.sql"),
      "utf-8"
    );

    await pool.query(migrationSQL);

    console.log("✅ Migrations completed");

    // ================= 🔥 2. RUN SEED =================
    const seed = require("./db/seeds/seed.js");
    console.log("👉 TYPE OF SEED:", typeof seed);

    await seed(); // 🚨 CRITICAL (you were missing this earlier)

    // ================= SERVER =================
    const server = http.createServer(app);

    // ================= WEBSOCKET =================
    initWebSocket(server);

    // ================= 🔥 3. START JOBS =================
    require("./jobs/simulator");
    require("./jobs/anomalyDetector");

    // ================= ROUTES =================

    app.get("/", (req, res) => {
      res.send("🚀 WTF LivePulse Backend Running");
    });

    // ================= GYMS =================
    app.get("/api/gyms", async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT 
            g.id,
            g.name,
            g.city,
            g.capacity,

            COUNT(c.id) FILTER (WHERE c.checked_out IS NULL) AS occupancy,

            COALESCE(SUM(p.amount) FILTER (
              WHERE DATE(p.paid_at) = CURRENT_DATE
            ), 0) AS today_revenue

          FROM gyms g
          LEFT JOIN checkins c ON g.id = c.gym_id
          LEFT JOIN payments p ON g.id = p.gym_id

          GROUP BY g.id
          ORDER BY g.id
        `);

        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching gyms");
      }
    });

    // ================= REVENUE =================
    app.get("/api/analytics/revenue", async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT 
            plan_type,
            SUM(amount) AS revenue
          FROM payments
          WHERE paid_at >= NOW() - INTERVAL '30 days'
          GROUP BY plan_type
        `);

        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching revenue");
      }
    });

    // ================= ANOMALIES =================
    app.get("/api/anomalies", async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT 
            a.id,
            g.name AS gym_name,
            a.type,
            a.severity,
            a.message,
            a.detected_at,
            a.resolved
          FROM anomalies a
          JOIN gyms g ON g.id = a.gym_id
          WHERE a.resolved = false
          ORDER BY a.detected_at DESC
        `);

        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching anomalies");
      }
    });

    // ================= START =================
    server.listen(3001, "0.0.0.0", () => {
      console.log("✅ Server running on port 3001");
      console.log("🚀 WTF LivePulse system ready with seeded data");
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// ================= BOOT =================
startServer();