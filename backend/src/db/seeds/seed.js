console.log("🔥 THIS IS THE REAL SEED FILE LOADED");

const pool = global.pool;

async function runSeed() {
  if (!pool) throw new Error("❌ Pool not initialized");

  console.log("🧹 Clearing old data...");

  await pool.query("DELETE FROM anomalies");
  await pool.query("DELETE FROM checkins");
  await pool.query("DELETE FROM payments");
  await pool.query("DELETE FROM members");
  await pool.query("DELETE FROM gyms");

  console.log("🌱 Seeding database...");

  const gyms = [
    { name: "WTF Gyms — Lajpat Nagar", city: "New Delhi", capacity: 220, opens: "05:30", closes: "22:30" },
    { name: "WTF Gyms — Connaught Place", city: "New Delhi", capacity: 180, opens: "06:00", closes: "22:00" },
    { name: "WTF Gyms — Bandra West", city: "Mumbai", capacity: 300, opens: "05:00", closes: "23:00" },
    { name: "WTF Gyms — Powai", city: "Mumbai", capacity: 250, opens: "05:30", closes: "22:30" },
    { name: "WTF Gyms — Indiranagar", city: "Bengaluru", capacity: 200, opens: "05:30", closes: "22:00" },
    { name: "WTF Gyms — Koramangala", city: "Bengaluru", capacity: 180, opens: "06:00", closes: "22:00" },
    { name: "WTF Gyms — Banjara Hills", city: "Hyderabad", capacity: 160, opens: "06:00", closes: "22:00" },
    { name: "WTF Gyms — Sector 18 Noida", city: "Noida", capacity: 140, opens: "06:00", closes: "21:30" },
    { name: "WTF Gyms — Salt Lake", city: "Kolkata", capacity: 120, opens: "06:00", closes: "21:00" },
    { name: "WTF Gyms — Velachery", city: "Chennai", capacity: 110, opens: "06:00", closes: "21:00" }
  ];

  for (let g of gyms) {
    await pool.query(
      `INSERT INTO gyms (name, city, capacity, opens_at, closes_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [g.name, g.city, g.capacity, g.opens, g.closes]
    );
  }

  console.log("🚀 SEED COMPLETE");
}

module.exports = runSeed;