import { Users, DollarSign, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsBarProps {
  totalOccupancy: number;
  totalCapacity: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  totalRevenue: number;
  unacknowledgedAnomalies: number;
}

export function StatsBar({ totalOccupancy, totalCapacity, totalCheckIns, totalCheckOuts, totalRevenue, unacknowledgedAnomalies }: StatsBarProps) {
  const occupancyPct = Math.round((totalOccupancy / totalCapacity) * 100);
  
  const stats = [
    {
      label: 'Live Occupancy',
      value: `${totalOccupancy.toLocaleString()} / ${totalCapacity.toLocaleString()}`,
      sub: `${occupancyPct}% capacity`,
      icon: Users,
      color: occupancyPct > 85 ? 'text-destructive' : 'text-primary',
      trend: null,
    },
    {
      label: 'Check-ins Today',
      value: totalCheckIns.toLocaleString(),
      sub: `${totalCheckOuts.toLocaleString()} check-outs`,
      icon: TrendingUp,
      color: 'text-accent',
      trend: { up: true, value: '+12.3%' },
    },
    {
      label: 'Monthly Revenue',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      sub: 'Across all locations',
      icon: DollarSign,
      color: 'text-primary',
      trend: { up: true, value: '+4.2%' },
    },
    {
      label: 'Active Alerts',
      value: unacknowledgedAnomalies.toString(),
      sub: 'Unacknowledged',
      icon: AlertTriangle,
      color: unacknowledgedAnomalies > 0 ? 'text-warning' : 'text-muted-foreground',
      trend: null,
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
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
            {stat.trend && (
              <span className={`flex items-center text-xs font-medium ${stat.trend.up ? 'text-primary' : 'text-destructive'}`}>
                {stat.trend.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend.value}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
