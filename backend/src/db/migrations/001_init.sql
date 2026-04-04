-- =========================
-- CLEAN (SAFE RESET)
-- =========================
DROP TABLE IF EXISTS anomalies CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS gyms CASCADE;

-- =========================
-- GYMS
-- =========================
CREATE TABLE gyms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INT NOT NULL,
  opens_at TIME,
  closes_at TIME
);

-- =========================
-- MEMBERS
-- =========================
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  gym_id INT REFERENCES gyms(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  plan_type TEXT,
  member_type TEXT,
  status TEXT,
  joined_at TIMESTAMP,
  plan_expires_at TIMESTAMP
);

-- =========================
-- CHECKINS
-- =========================
CREATE TABLE checkins (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  gym_id INT REFERENCES gyms(id) ON DELETE CASCADE,
  checked_in TIMESTAMP DEFAULT NOW(),
  checked_out TIMESTAMP
);

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  gym_id INT REFERENCES gyms(id) ON DELETE CASCADE,
  amount INT,
  plan_type TEXT,
  payment_type TEXT,
  paid_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- ANOMALIES
-- =========================
CREATE TABLE anomalies (
  id SERIAL PRIMARY KEY,
  gym_id INT REFERENCES gyms(id),
  type TEXT,
  severity TEXT,
  message TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

INSERT INTO checkins (member_id, gym_id)
SELECT id, gym_id FROM members LIMIT 20;