import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckInEvent, Gym, GYMS, generateCheckInEvent, Anomaly, ANOMALIES } from '@/lib/mock-data';

export function useLiveEvents(speed: number = 1) {
  const [gyms, setGyms] = useState<Gym[]>(GYMS);
  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(ANOMALIES);
  const [isRunning, setIsRunning] = useState(true);
  const [totalCheckIns, setTotalCheckIns] = useState(1847);
  const [totalCheckOuts, setTotalCheckOuts] = useState(1203);
  const intervalRef = useRef<number | null>(null);

  const acknowledgeAnomaly = useCallback((id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const interval = Math.max(500, 2000 / speed);
    intervalRef.current = window.setInterval(() => {
      const event = generateCheckInEvent(gyms);
      
      setEvents(prev => [event, ...prev].slice(0, 50));
      
      if (event.type === 'check_in') {
        setTotalCheckIns(prev => prev + 1);
      } else {
        setTotalCheckOuts(prev => prev + 1);
      }

      setGyms(prev => prev.map(g => {
        if (g.id !== event.gymId) return g;
        const delta = event.type === 'check_in' ? 1 : -1;
        const newOccupancy = Math.max(0, Math.min(g.capacity, g.currentOccupancy + delta));
        return { ...g, currentOccupancy: newOccupancy };
      }));
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, speed, gyms]);

  const totalOccupancy = gyms.reduce((sum, g) => sum + g.currentOccupancy, 0);
  const totalCapacity = gyms.reduce((sum, g) => sum + g.capacity, 0);
  const totalRevenue = gyms.reduce((sum, g) => sum + g.monthlyRevenue, 0);
  const unacknowledgedAnomalies = anomalies.filter(a => !a.acknowledged).length;

  return {
    gyms, events, anomalies, isRunning, setIsRunning,
    totalCheckIns, totalCheckOuts, totalOccupancy, totalCapacity,
    totalRevenue, unacknowledgedAnomalies, acknowledgeAnomaly,
  };
}
