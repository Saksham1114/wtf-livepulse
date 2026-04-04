import { Gym } from '@/lib/mock-data';

interface OccupancyGridProps {
  gyms: Gym[];
}

export function OccupancyGrid({ gyms }: OccupancyGridProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Live Occupancy by Location</h3>
      <div className="space-y-2.5">
        {gyms.map((gym) => {
          const pct = Math.round((gym.currentOccupancy / gym.capacity) * 100);
          // Spec: <60% green, 60-85% yellow, >85% red
          const barColor = pct > 85 ? 'bg-destructive' : pct > 60 ? 'bg-warning' : 'bg-primary';
          return (
            <div key={gym.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-card-foreground truncate max-w-[160px]">
                  {gym.name.replace('WTF Gyms — ', '')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {gym.currentOccupancy}/{gym.capacity}{' '}
                  <span className={`ml-1 font-mono font-bold ${pct > 85 ? 'text-destructive' : pct > 60 ? 'text-warning' : 'text-primary'}`}>
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
