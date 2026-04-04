import { Gym } from '@/lib/mock-data';
import { AlertTriangle } from 'lucide-react';

interface ChurnPanelProps {
  gyms: Gym[];
}

export function ChurnPanel({ gyms }: ChurnPanelProps) {
  const sorted = [...gyms].sort((a, b) => b.churnRate - a.churnRate);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Churn Risk by Location</h3>
      <div className="space-y-2">
        {sorted.slice(0, 6).map((gym) => {
          const isHigh = gym.churnRate >= 5;
          const isMed = gym.churnRate >= 4;
          return (
            <div key={gym.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                {isHigh && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                <span className="text-xs font-medium text-card-foreground">{gym.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{gym.memberCount} members</span>
                <span className={`text-xs font-bold font-mono ${isHigh ? 'text-destructive' : isMed ? 'text-warning' : 'text-primary'}`}>
                  {gym.churnRate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
