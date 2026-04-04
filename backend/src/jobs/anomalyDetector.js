const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgres://wtf:wtf_secret@db:5432/wtf_livepulse"
});

async function detect() {
  try {
    const res = await pool.query(`
      SELECT g.id, g.name, g.capacity,
      COUNT(c.id) FILTER (WHERE c.checked_out IS NULL) AS occupancy
      FROM gyms g
      LEFT JOIN checkins c ON g.id = c.gym_id
      GROUP BY g.id
    `);

    res.rows.forEach(g => {
      if (g.occupancy > g.capacity * 0.9) {
        console.log(`🚨 ${g.name} almost full`);
      }
    });

  } catch (err) {
    console.error(err.message);
  }
}

setInterval(detect, 20000);

console.log("🚨 Anomaly detector running...");