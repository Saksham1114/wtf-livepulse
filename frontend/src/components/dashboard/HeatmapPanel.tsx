import { HEATMAP_DATA } from '@/lib/mock-data';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function getCellColor(value: number): string {
  if (value >= 80) return 'bg-destructive/80';
  if (value >= 60) return 'bg-warning/70';
  if (value >= 40) return 'bg-primary/60';
  if (value >= 20) return 'bg-primary/30';
  return 'bg-muted';
}

export function HeatmapPanel() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">7-Day Peak Hours Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '48px repeat(18, 1fr)' }}>
            <div />
            {HEATMAP_DATA.map(d => (
              <div key={d.hour} className="text-center text-[10px] text-muted-foreground font-mono">
                {d.hour}
              </div>
            ))}
          </div>
          {/* Rows */}
          {DAYS.map((day, di) => (
            <div key={day} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '48px repeat(18, 1fr)' }}>
              <div className="text-xs text-muted-foreground flex items-center">{day}</div>
              {HEATMAP_DATA.map(d => {
                const value = d[DAY_KEYS[di]];
                return (
                  <div
                    key={d.hour}
                    className={`aspect-square rounded-sm ${getCellColor(value)} transition-colors cursor-default`}
                    title={`${day} ${d.hour}:00 — ${value}% occupancy`}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <div className="flex gap-0.5">
              {['bg-muted', 'bg-primary/30', 'bg-primary/60', 'bg-warning/70', 'bg-destructive/80'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
