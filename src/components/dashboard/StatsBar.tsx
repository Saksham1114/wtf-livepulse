import { Users, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  totalOccupancy: number;
  totalCapacity: number;
  totalTodayRevenue: number;
  activeAnomalies: number;
}

export function StatsBar({ totalOccupancy, totalCapacity, totalTodayRevenue, activeAnomalies }: StatsBarProps) {
  const occupancyPct = Math.round((totalOccupancy / totalCapacity) * 100);
  const occColor = occupancyPct > 85 ? 'text-destructive' : occupancyPct > 60 ? 'text-warning' : 'text-primary';

  const stats = [
    {
      label: 'Live Occupancy',
      value: `${totalOccupancy.toLocaleString('en-IN')}`,
      sub: `${occupancyPct}% of ${totalCapacity.toLocaleString('en-IN')} capacity`,
      icon: Users,
      color: occColor,
    },
    {
      label: "Today's Revenue",
      value: `₹${totalTodayRevenue.toLocaleString('en-IN')}`,
      sub: 'Across all locations',
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      label: 'Total Members',
      value: '5,000',
      sub: '10 gym locations',
      icon: TrendingUp,
      color: 'text-accent',
    },
    {
      label: 'Active Anomalies',
      value: activeAnomalies.toString(),
      sub: 'Unresolved alerts',
      icon: AlertTriangle,
      color: activeAnomalies > 0 ? 'text-warning' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
