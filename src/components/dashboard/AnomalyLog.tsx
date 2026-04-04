import { Anomaly } from '@/lib/mock-data';
import { AlertTriangle, ShieldAlert, TrendingDown, Check, X } from 'lucide-react';

interface AnomalyLogProps {
  anomalies: Anomaly[];
  onAcknowledge: (id: string) => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'border-destructive/50 bg-destructive/5',
  warning: 'border-warning/50 bg-warning/5',
};

const TYPE_ICON: Record<string, typeof AlertTriangle> = {
  capacity_breach: ShieldAlert,
  revenue_drop: TrendingDown,
  zero_checkins: AlertTriangle,
};

export function AnomalyLog({ anomalies, onAcknowledge }: AnomalyLogProps) {
  const sorted = [...anomalies].sort((a, b) => {
    const aActive = !a.resolved && !a.dismissed;
    const bActive = !b.resolved && !b.dismissed;
    if (aActive !== bActive) return aActive ? -1 : 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Anomaly Detection Log</h3>
      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {sorted.map((a) => {
          const Icon = TYPE_ICON[a.type] || AlertTriangle;
          const isInactive = a.resolved || a.dismissed;
          return (
            <div
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${SEVERITY_STYLES[a.severity]} ${isInactive ? 'opacity-40' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${a.severity === 'critical' ? 'text-destructive' : 'text-warning'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-card-foreground">{a.gymName.replace('WTF Gyms — ', '')}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    a.severity === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                  }`}>{a.severity}</span>
                  {a.resolved && <span className="text-[10px] text-primary font-medium">RESOLVED</span>}
                  {a.dismissed && <span className="text-[10px] text-muted-foreground font-medium">DISMISSED</span>}
                </div>
                <p className="text-xs text-muted-foreground">{a.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {a.timestamp.toLocaleTimeString()} — {a.type.replace(/_/g, ' ')}
                </p>
              </div>
              {!isInactive && a.severity === 'warning' && (
                <button
                  onClick={() => onAcknowledge(a.id)}
                  className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-card-foreground"
                  title="Dismiss warning"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
