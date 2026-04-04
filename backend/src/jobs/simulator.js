function startSimulator(pool) {
  console.log("🔥 Simulator started with DB connection");

  async function simulate() {
    try {
      const gymsRes = await pool.query(`
        SELECT g.id, g.capacity,
        COUNT(c.id) FILTER (WHERE c.checked_out IS NULL) AS occupancy
        FROM gyms g
        LEFT JOIN checkins c ON g.id = c.gym_id
        GROUP BY g.id
      `);

      const gyms = gymsRes.rows;
      if (!gyms.length) return;

      const gym = gyms[Math.floor(Math.random() * gyms.length)];
      const action = Math.random();

      // 🟢 CHECK-IN
      if (action < 0.7) {
        if (gym.occupancy >= gym.capacity) return;

        const membersRes = await pool.query(
          "SELECT id FROM members WHERE gym_id = $1 ORDER BY RANDOM() LIMIT 1",
          [gym.id]
        );

        if (!membersRes.rows.length) return;

        const member = membersRes.rows[0];

        await pool.query(`
          INSERT INTO checkins (member_id, gym_id, checked_in, checked_out)
          VALUES ($1, $2, NOW(), NULL)
        `, [member.id, gym.id]);

        console.log(`🟢 Check-in: Member ${member.id} → Gym ${gym.id}`);
      }

      // 🔴 CHECK-OUT
      else {
        const activeRes = await pool.query(`
          SELECT id FROM checkins
          WHERE gym_id = $1 AND checked_out IS NULL
          ORDER BY RANDOM()
          LIMIT 1
        `, [gym.id]);

        if (!activeRes.rows.length) return;

        const checkin = activeRes.rows[0];

        await pool.query(`
          UPDATE checkins
          SET checked_out = NOW()
          WHERE id = $1
        `, [checkin.id]);

        console.log(`🔴 Check-out at Gym ${gym.id}`);
      }

    } catch (err) {
      console.error("❌ Simulator error:", err.message);
    }
  }

  setInterval(simulate, 2000);
}

module.exports = startSimulator;