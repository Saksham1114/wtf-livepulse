import { CheckInEvent } from '@/lib/mock-data';
import { LogIn, LogOut, CreditCard } from 'lucide-react';

interface LiveFeedProps {
  events: CheckInEvent[];
}

export function LiveFeed({ events }: LiveFeedProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        <h3 className="text-sm font-semibold text-card-foreground">Live Activity Feed</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">Last 20 events</span>
      </div>
      <div className="space-y-1 max-h-[320px] overflow-y-auto">
        {events.length === 0 && (
          <p className="text-xs text-muted-foreground py-4 text-center">Waiting for events…</p>
        )}
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
            {event.type === 'CHECKIN_EVENT' && <LogIn className="h-3.5 w-3.5 text-primary shrink-0" />}
            {event.type === 'CHECKOUT_EVENT' && <LogOut className="h-3.5 w-3.5 text-accent shrink-0" />}
            {event.type === 'PAYMENT_EVENT' && <CreditCard className="h-3.5 w-3.5 text-warning shrink-0" />}
            <span className="text-xs text-card-foreground font-medium truncate">{event.memberName}</span>
            <span className="text-xs text-muted-foreground truncate">{event.gymName.replace('WTF Gyms — ', '')}</span>
            {event.type === 'PAYMENT_EVENT' && event.amount && (
              <span className="text-xs text-warning font-mono">₹{event.amount.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xs text-muted-foreground ml-auto font-mono shrink-0">
              {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
