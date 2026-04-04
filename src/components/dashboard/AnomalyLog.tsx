import { Anomaly } from '@/lib/mock-data';
import { AlertTriangle, ShieldAlert, TrendingDown, Clock, Check } from 'lucide-react';

interface AnomalyLogProps {
  anomalies: Anomaly[];
  onAcknowledge: (id: string) => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'border-destructive/50 bg-destructive/5',
  high: 'border-warning/50 bg-warning/5',
  medium: 'border-accent/30 bg-accent/5',
  low: 'border-border',
};

const TYPE_ICON: Record<string, typeof AlertTriangle> = {
  capacity_breach: ShieldAlert,
  revenue_drop: TrendingDown,
  unusual_hours: Clock,
  churn_spike: AlertTriangle,
};

export function AnomalyLog({ anomalies, onAcknowledge }: AnomalyLogProps) {
  const sorted = [...anomalies].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Anomaly Detection Log</h3>
      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {sorted.map((a) => {
          const Icon = TYPE_ICON[a.type] || AlertTriangle;
          return (
            <div
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${SEVERITY_STYLES[a.severity]} ${a.acknowledged ? 'opacity-50' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${a.severity === 'critical' ? 'text-destructive' : a.severity === 'high' ? 'text-warning' : 'text-accent'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-card-foreground">{a.gymName}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    a.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                    a.severity === 'high' ? 'bg-warning/20 text-warning' :
                    'bg-accent/20 text-accent'
                  }`}>{a.severity}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {a.timestamp.toLocaleTimeString()} — {a.type.replace(/_/g, ' ')}
                </p>
              </div>
              {!a.acknowledged && (
                <button
                  onClick={() => onAcknowledge(a.id)}
                  className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-card-foreground"
                  title="Acknowledge"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
