import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckInEvent, Gym, GYMS, generateCheckInEvent, Anomaly, ANOMALIES, PLAN_PRICING } from '@/lib/mock-data';

export function useLiveEvents(speed: number = 1) {
  const [gyms, setGyms] = useState<Gym[]>(GYMS);
  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(ANOMALIES);
  const [isRunning, setIsRunning] = useState(true);
  const [simulatorSpeed, setSimulatorSpeed] = useState(speed);
  const intervalRef = useRef<number | null>(null);

  const acknowledgeAnomaly = useCallback((id: string) => {
    setAnomalies(prev => prev.map(a => {
      if (a.id !== id) return a;
      // Critical anomalies cannot be dismissed per spec
      if (a.severity === 'critical') return a;
      return { ...a, dismissed: true };
    }));
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Spec: simulator generates events every 2 seconds at 1x
    const interval = Math.max(200, 2000 / simulatorSpeed);
    intervalRef.current = window.setInterval(() => {
      const event = generateCheckInEvent(gyms);

      setEvents(prev => [event, ...prev].slice(0, 20)); // last 20 per spec

      setGyms(prev => prev.map(g => {
        if (g.id !== event.gymId) return g;

        if (event.type === 'CHECKIN_EVENT') {
          const newOcc = Math.min(g.capacity, g.currentOccupancy + 1);
          return { ...g, currentOccupancy: newOcc };
        }
        if (event.type === 'CHECKOUT_EVENT') {
          const newOcc = Math.max(0, g.currentOccupancy - 1);
          return { ...g, currentOccupancy: newOcc };
        }
        if (event.type === 'PAYMENT_EVENT' && event.amount) {
          return { ...g, todayRevenue: g.todayRevenue + event.amount };
        }
        return g;
      }));

      // Check for auto-resolve: Bandra West capacity breach resolves if occupancy < 85%
      setAnomalies(prev => prev.map(a => {
        if (a.id === 'a2' && !a.resolved) {
          const bandra = gyms.find(g => g.id === '3');
          if (bandra && (bandra.currentOccupancy / bandra.capacity) < 0.85) {
            return { ...a, resolved: true };
          }
        }
        return a;
      }));
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, simulatorSpeed, gyms]);

  const totalOccupancy = gyms.reduce((sum, g) => sum + g.currentOccupancy, 0);
  const totalCapacity = gyms.reduce((sum, g) => sum + g.capacity, 0);
  const totalTodayRevenue = gyms.reduce((sum, g) => sum + g.todayRevenue, 0);
  const activeAnomalies = anomalies.filter(a => !a.resolved && !a.dismissed).length;

  return {
    gyms, events, anomalies, isRunning, setIsRunning,
    simulatorSpeed, setSimulatorSpeed,
    totalOccupancy, totalCapacity,
    totalTodayRevenue, activeAnomalies, acknowledgeAnomaly,
  };
}
