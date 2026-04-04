import { Gym } from '@/lib/mock-data';
import { AlertTriangle } from 'lucide-react';

interface ChurnPanelProps {
  gyms: Gym[];
}

export function ChurnPanel({ gyms }: ChurnPanelProps) {
  const totalHigh = gyms.reduce((s, g) => s + g.churnHighRisk, 0);
  const totalCritical = gyms.reduce((s, g) => s + g.churnCriticalRisk, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-foreground">Churn Risk Panel</h3>
        <div className="flex gap-3 text-[10px]">
          <span className="text-warning font-bold">HIGH: {totalHigh}</span>
          <span className="text-destructive font-bold">CRITICAL: {totalCritical}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">Active members with no check-in for 45+ days</p>
      <div className="space-y-2">
        {gyms.filter(g => g.churnHighRisk > 0 || g.churnCriticalRisk > 0).map((gym) => (
          <div key={gym.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              {gym.churnCriticalRisk > 5 && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
              <span className="text-xs font-medium text-card-foreground">{gym.name.replace('WTF Gyms — ', '')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-warning font-mono">{gym.churnHighRisk} high</span>
              <span className="text-xs text-destructive font-mono">{gym.churnCriticalRisk} crit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
