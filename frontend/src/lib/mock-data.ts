// Mock data matching WTF LivePulse Data Specification exactly

export interface Gym {
  id: string;
  name: string;
  city: string;
  capacity: number;
  opensAt: string;
  closesAt: string;
  status: string;
  currentOccupancy: number;
  memberCount: number;
  todayRevenue: number;
  monthlyRevenue: number;
  churnHighRisk: number;
  churnCriticalRisk: number;
}

export interface CheckInEvent {
  id: string;
  memberId: string;
  memberName: string;
  gymId: string;
  gymName: string;
  type: 'CHECKIN_EVENT' | 'CHECKOUT_EVENT' | 'PAYMENT_EVENT';
  timestamp: Date;
  amount?: number;
  planType?: string;
}

export interface Anomaly {
  id: string;
  gymId: string;
  gymName: string;
  type: 'zero_checkins' | 'capacity_breach' | 'revenue_drop';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  dismissed: boolean;
}

export interface HourlyOccupancy {
  hour: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

// ── Exact gym data from specification ──────────────────────────────
export const GYMS: Gym[] = [
  { id: '1', name: 'WTF Gyms — Lajpat Nagar', city: 'New Delhi', capacity: 220, opensAt: '05:30', closesAt: '22:30', status: 'active', currentOccupancy: 18, memberCount: 650, todayRevenue: 28470, monthlyRevenue: 325000, churnHighRisk: 19, churnCriticalRisk: 10 },
  { id: '2', name: 'WTF Gyms — Connaught Place', city: 'New Delhi', capacity: 180, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 21, memberCount: 550, todayRevenue: 22490, monthlyRevenue: 275000, churnHighRisk: 16, churnCriticalRisk: 8 },
  { id: '3', name: 'WTF Gyms — Bandra West', city: 'Mumbai', capacity: 300, opensAt: '05:00', closesAt: '23:00', status: 'active', currentOccupancy: 278, memberCount: 750, todayRevenue: 41985, monthlyRevenue: 480000, churnHighRisk: 22, churnCriticalRisk: 12 },
  { id: '4', name: 'WTF Gyms — Powai', city: 'Mumbai', capacity: 250, opensAt: '05:30', closesAt: '22:30', status: 'active', currentOccupancy: 28, memberCount: 600, todayRevenue: 35970, monthlyRevenue: 390000, churnHighRisk: 18, churnCriticalRisk: 9 },
  { id: '5', name: 'WTF Gyms — Indiranagar', city: 'Bengaluru', capacity: 200, opensAt: '05:30', closesAt: '22:00', status: 'active', currentOccupancy: 22, memberCount: 550, todayRevenue: 26970, monthlyRevenue: 300000, churnHighRisk: 16, churnCriticalRisk: 8 },
  { id: '6', name: 'WTF Gyms — Koramangala', city: 'Bengaluru', capacity: 180, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 19, memberCount: 500, todayRevenue: 20990, monthlyRevenue: 240000, churnHighRisk: 15, churnCriticalRisk: 7 },
  { id: '7', name: 'WTF Gyms — Banjara Hills', city: 'Hyderabad', capacity: 160, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 17, memberCount: 450, todayRevenue: 16490, monthlyRevenue: 200000, churnHighRisk: 13, churnCriticalRisk: 6 },
  { id: '8', name: 'WTF Gyms — Sector 18 Noida', city: 'Noida', capacity: 140, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 12, memberCount: 400, todayRevenue: 13490, monthlyRevenue: 160000, churnHighRisk: 12, churnCriticalRisk: 5 },
  { id: '9', name: 'WTF Gyms — Salt Lake', city: 'Kolkata', capacity: 120, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 10, memberCount: 300, todayRevenue: 2998, monthlyRevenue: 120000, churnHighRisk: 9, churnCriticalRisk: 4 },
  { id: '10', name: 'WTF Gyms — Velachery', city: 'Chennai', capacity: 110, opensAt: '06:00', closesAt: '22:00', status: 'active', currentOccupancy: 0, memberCount: 250, todayRevenue: 8990, monthlyRevenue: 95000, churnHighRisk: 10, churnCriticalRisk: 5 },
];

// ── Heatmap: hourly traffic multipliers from spec ──────────────────
// Dead 00-05:29 = 0.00, Early 05:30-06:59 = 0.60, Morning Rush 07-09:59 = 1.00,
// Mid 10-11:59 = 0.40, Lunch 12-13:59 = 0.30, Afternoon 14-16:59 = 0.20,
// Evening Rush 17-20:59 = 0.90, Late 21-22:30 = 0.35, After 22:31+ = 0.00
const HOURLY_MULTIPLIERS: Record<number, number> = {
  5: 0.60, 6: 0.60, 7: 1.00, 8: 1.00, 9: 1.00,
  10: 0.40, 11: 0.40, 12: 0.30, 13: 0.30,
  14: 0.20, 15: 0.20, 16: 0.20,
  17: 0.90, 18: 0.90, 19: 0.90, 20: 0.90,
  21: 0.35, 22: 0.35,
};

// Day-of-week multipliers from spec: Mon=1.00, Tue=0.95, Wed=0.90, Thu=0.95, Fri=0.85, Sat=0.70, Sun=0.45
const DAY_MULTIPLIERS = [0.45, 1.00, 0.95, 0.90, 0.95, 0.85, 0.70]; // Sunday=0, Mon=1...

export const HEATMAP_DATA: HourlyOccupancy[] = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 5;
  const hMult = HOURLY_MULTIPLIERS[hour] || 0;
  const baseCheckins = 100; // base peak checkins per hour
  const jitter = (dayMult: number) => {
    const base = Math.round(hMult * dayMult * baseCheckins);
    return Math.max(0, base + Math.floor((Math.random() - 0.5) * 8));
  };
  return {
    hour,
    mon: jitter(DAY_MULTIPLIERS[1]),
    tue: jitter(DAY_MULTIPLIERS[2]),
    wed: jitter(DAY_MULTIPLIERS[3]),
    thu: jitter(DAY_MULTIPLIERS[4]),
    fri: jitter(DAY_MULTIPLIERS[5]),
    sat: jitter(DAY_MULTIPLIERS[6]),
    sun: jitter(DAY_MULTIPLIERS[0]),
  };
});

// ── Anomaly test scenarios from spec Section 6 ─────────────────────
export const ANOMALIES: Anomaly[] = [
  {
    id: 'a1',
    gymId: '10',
    gymName: 'WTF Gyms — Velachery',
    type: 'zero_checkins',
    severity: 'warning',
    message: 'No check-ins recorded in the last 2 hours during operating hours',
    timestamp: new Date(Date.now() - 25000), // detected ~25s after startup
    resolved: false,
    dismissed: false,
  },
  {
    id: 'a2',
    gymId: '3',
    gymName: 'WTF Gyms — Bandra West',
    type: 'capacity_breach',
    severity: 'critical',
    message: 'Occupancy at 93% (278/300) — exceeds 90% capacity threshold',
    timestamp: new Date(Date.now() - 20000),
    resolved: false,
    dismissed: false,
  },
  {
    id: 'a3',
    gymId: '9',
    gymName: 'WTF Gyms — Salt Lake',
    type: 'revenue_drop',
    severity: 'warning',
    message: "Today's revenue ₹2,998 is 80% below same day last week (₹15,496)",
    timestamp: new Date(Date.now() - 15000),
    resolved: false,
    dismissed: false,
  },
];

// ── Indian names for realistic member simulation ───────────────────
const FIRST_NAMES = [
  'Rahul', 'Priya', 'Ankit', 'Neha', 'Arjun', 'Sneha', 'Vikram', 'Pooja',
  'Rohit', 'Divya', 'Amit', 'Kavita', 'Saurabh', 'Ritu', 'Deepak',
  'Shreya', 'Nikhil', 'Anjali', 'Karan', 'Meera', 'Aditya', 'Swati',
  'Varun', 'Sakshi', 'Gaurav', 'Nisha', 'Manish', 'Pallavi', 'Rajesh', 'Simran',
];
const LAST_NAMES = [
  'Sharma', 'Mehta', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar',
  'Reddy', 'Nair', 'Iyer', 'Joshi', 'Chauhan', 'Yadav', 'Mishra', 'Das',
];

// ── Plan pricing from spec (₹) ────────────────────────────────────
export const PLAN_PRICING = {
  monthly: 1499,
  quarterly: 3999,
  annual: 11999,
} as const;

export function generateCheckInEvent(gyms: Gym[]): CheckInEvent {
  const gym = gyms[Math.floor(Math.random() * gyms.length)];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const memberName = `${firstName} ${lastName}`;

  // 60% check-in, 30% check-out, 10% payment
  const roll = Math.random();
  if (roll < 0.10) {
    const plans = ['monthly', 'quarterly', 'annual'] as const;
    const planType = plans[Math.floor(Math.random() * plans.length)];
    return {
      id: crypto.randomUUID(),
      memberId: `M${Math.floor(Math.random() * 5000)}`,
      memberName,
      gymId: gym.id,
      gymName: gym.name,
      type: 'PAYMENT_EVENT',
      timestamp: new Date(),
      amount: PLAN_PRICING[planType],
      planType,
    };
  }

  return {
    id: crypto.randomUUID(),
    memberId: `M${Math.floor(Math.random() * 5000)}`,
    memberName,
    gymId: gym.id,
    gymName: gym.name,
    type: roll < 0.70 ? 'CHECKIN_EVENT' : 'CHECKOUT_EVENT',
    timestamp: new Date(),
  };
}

// ── Revenue chart data (INR, 8-month trend) ────────────────────────
export function getRevenueChartData() {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return months.map((month, i) => ({
    month,
    revenue: 1800000 + Math.floor(Math.random() * 300000) + i * 50000,
    target: 2100000 + i * 30000,
  }));
}

// ── Churn risk data per spec Section 3.3 ───────────────────────────
// High Risk: 45-60 days, min 150 members total
// Critical Risk: 60+ days, min 80 members total
export function getChurnSummary(gyms: Gym[]) {
  const totalHigh = gyms.reduce((s, g) => s + g.churnHighRisk, 0);
  const totalCritical = gyms.reduce((s, g) => s + g.churnCriticalRisk, 0);
  return { totalHigh, totalCritical };
}
