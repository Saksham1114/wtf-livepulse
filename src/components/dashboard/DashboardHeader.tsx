import { Activity, Pause, Play } from 'lucide-react';

interface DashboardHeaderProps {
  isRunning: boolean;
  onToggle: () => void;
}

export function DashboardHeader({ isRunning, onToggle }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            WTF <span className="text-primary">LivePulse</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 ml-4">
          <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-primary animate-pulse-glow' : 'bg-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground">{isRunning ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors"
      >
        {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </header>
  );
}
