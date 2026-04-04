// Mock gym data for LivePulse dashboard

export interface Gym {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  monthlyRevenue: number;
  prevMonthRevenue: number;
  memberCount: number;
  churnRate: number;
}

export interface CheckInEvent {
  id: string;
  memberId: string;
  memberName: string;
  gymId: string;
  gymName: string;
  type: 'check_in' | 'check_out';
  timestamp: Date;
}

export interface Anomaly {
  id: string;
  gymId: string;
  gymName: string;
  type: 'capacity_breach' | 'revenue_drop' | 'unusual_hours' | 'churn_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
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

export const GYMS: Gym[] = [
  { id: '1', name: 'Downtown Fitness', location: 'Manhattan, NY', capacity: 200, currentOccupancy: 147, monthlyRevenue: 89500, prevMonthRevenue: 85200, memberCount: 1250, churnRate: 3.2 },
  { id: '2', name: 'Westside Gym', location: 'Brooklyn, NY', capacity: 150, currentOccupancy: 98, monthlyRevenue: 62300, prevMonthRevenue: 64100, memberCount: 890, churnRate: 4.8 },
  { id: '3', name: 'Iron Temple', location: 'Queens, NY', capacity: 180, currentOccupancy: 112, monthlyRevenue: 71200, prevMonthRevenue: 69800, memberCount: 1050, churnRate: 2.9 },
  { id: '4', name: 'FitZone Elite', location: 'Bronx, NY', capacity: 120, currentOccupancy: 89, monthlyRevenue: 45600, prevMonthRevenue: 47200, memberCount: 620, churnRate: 5.1 },
  { id: '5', name: 'Harbor Health', location: 'Staten Island, NY', capacity: 100, currentOccupancy: 34, monthlyRevenue: 28900, prevMonthRevenue: 29100, memberCount: 410, churnRate: 3.7 },
  { id: '6', name: 'Peak Performance', location: 'Jersey City, NJ', capacity: 160, currentOccupancy: 131, monthlyRevenue: 78400, prevMonthRevenue: 72300, memberCount: 980, churnRate: 2.4 },
  { id: '7', name: 'Sunset Fitness', location: 'Hoboken, NJ', capacity: 90, currentOccupancy: 67, monthlyRevenue: 38200, prevMonthRevenue: 37800, memberCount: 520, churnRate: 3.9 },
  { id: '8', name: 'Atlas Strength', location: 'Newark, NJ', capacity: 140, currentOccupancy: 45, monthlyRevenue: 34100, prevMonthRevenue: 41500, memberCount: 680, churnRate: 6.2 },
  { id: '9', name: 'Pulse Gym', location: 'Long Island, NY', capacity: 170, currentOccupancy: 156, monthlyRevenue: 82100, prevMonthRevenue: 79400, memberCount: 1120, churnRate: 2.1 },
  { id: '10', name: 'Core Fitness', location: 'Stamford, CT', capacity: 110, currentOccupancy: 78, monthlyRevenue: 51200, prevMonthRevenue: 50800, memberCount: 740, churnRate: 3.4 },
];

export const HEATMAP_DATA: HourlyOccupancy[] = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 5; // 5am to 10pm
  const base = hour >= 6 && hour <= 9 ? 70 : hour >= 17 && hour <= 20 ? 85 : hour >= 11 && hour <= 14 ? 50 : 25;
  const jitter = () => Math.max(0, Math.min(100, base + Math.floor((Math.random() - 0.5) * 20)));
  return {
    hour,
    mon: jitter(), tue: jitter(), wed: jitter(), thu: jitter(),
    fri: jitter(), sat: Math.max(0, base - 15 + Math.floor((Math.random() - 0.5) * 20)),
    sun: Math.max(0, base - 25 + Math.floor((Math.random() - 0.5) * 15)),
  };
});

export const ANOMALIES: Anomaly[] = [
  { id: 'a1', gymId: '9', gymName: 'Pulse Gym', type: 'capacity_breach', severity: 'critical', message: 'Occupancy at 92% of capacity — threshold breached', timestamp: new Date(Date.now() - 120000), acknowledged: false },
  { id: 'a2', gymId: '8', gymName: 'Atlas Strength', type: 'revenue_drop', severity: 'high', message: 'Revenue dropped 17.8% month-over-month', timestamp: new Date(Date.now() - 3600000), acknowledged: false },
  { id: 'a3', gymId: '4', gymName: 'FitZone Elite', type: 'churn_spike', severity: 'high', message: 'Churn rate 5.1% exceeds 4.5% threshold', timestamp: new Date(Date.now() - 7200000), acknowledged: false },
  { id: 'a4', gymId: '1', gymName: 'Downtown Fitness', type: 'unusual_hours', severity: 'medium', message: '23 check-ins detected between 1-4 AM', timestamp: new Date(Date.now() - 14400000), acknowledged: true },
  { id: 'a5', gymId: '2', gymName: 'Westside Gym', type: 'revenue_drop', severity: 'medium', message: 'Revenue dropped 2.8% — trending downward for 3 months', timestamp: new Date(Date.now() - 28800000), acknowledged: true },
  { id: 'a6', gymId: '8', gymName: 'Atlas Strength', type: 'churn_spike', severity: 'critical', message: 'Churn rate 6.2% — highest across all locations', timestamp: new Date(Date.now() - 1800000), acknowledged: false },
];

const FIRST_NAMES = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Avery', 'Blake', 'Drew', 'Sam', 'Jamie', 'Pat', 'Chris', 'Dana'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

export function generateCheckInEvent(gyms: Gym[]): CheckInEvent {
  const gym = gyms[Math.floor(Math.random() * gyms.length)];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return {
    id: crypto.randomUUID(),
    memberId: `M${Math.floor(Math.random() * 5000)}`,
    memberName: `${firstName} ${lastName}`,
    gymId: gym.id,
    gymName: gym.name,
    type: Math.random() > 0.45 ? 'check_in' : 'check_out',
    timestamp: new Date(),
  };
}

export function getRevenueChartData() {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return months.map((month, i) => ({
    month,
    revenue: 450000 + Math.floor(Math.random() * 80000) + i * 12000,
    target: 520000 + i * 8000,
  }));
}

export function getOccupancyTrend() {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const base = hour >= 6 && hour <= 9 ? 65 : hour >= 17 && hour <= 20 ? 80 : hour >= 11 && hour <= 14 ? 45 : 15;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      occupancy: Math.max(0, base + Math.floor((Math.random() - 0.5) * 15)),
    };
  });
}
